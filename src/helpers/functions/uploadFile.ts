import * as XLSX from "xlsx";
import { FileRejection, FileWithPath } from "@mantine/dropzone";
import { NOTI_TYPE } from "../constants/enum";
import { showNotifications } from "../notifications/showNotifications";
import { IModelCourse } from "@/models/ModelCourse";
import store from "@/store";
import { IModelUser } from "@/models/ModelUser";
import { getSectionNo } from "./function";

export const isNumeric = (value: any) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const getColumnAlphabet = (columnIndex: number) => {
  let alphabet = "";
  while (columnIndex >= 0) {
    alphabet = String.fromCharCode((columnIndex % 26) + 65) + alphabet;
    columnIndex = Math.floor(columnIndex / 26) - 1;
  }
  return alphabet;
};

export const onUploadFile = async (
  course: Partial<IModelCourse>,
  files: FileWithPath[],
  type: "studentList" | "score",
  setResult: React.Dispatch<React.SetStateAction<any>>,
  setOpenModalUploadError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorStudentId: React.Dispatch<React.SetStateAction<any[]>>,
  setErrorSection?: React.Dispatch<React.SetStateAction<string[]>>,
  setErrorPoint?: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const file = files[0];
  if (file) {
    let workbook: any;
    const dataExcel = await file.arrayBuffer();
    workbook = XLSX.read(dataExcel);
    if (type == "studentList") {
      await studentList(
        course,
        files,
        workbook,
        setResult,
        setOpenModalUploadError,
        setErrorStudentId,
        setErrorSection!
      );
    } else {
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      if (worksheet.C1?.v == "SID" || worksheet[0]?.SID) {
        gradescopeFile(
          course,
          files,
          workbook,
          setResult,
          setOpenModalUploadError,
          setErrorStudentId,
          setErrorPoint!
        );
      } else {
        scoreOBETemplete(
          course,
          files,
          workbook,
          setResult,
          setOpenModalUploadError,
          setErrorStudentId,
          setErrorSection!,
          setErrorPoint!
        );
      }
    }
  }
};

const templateNotMatch = () => {
  showNotifications(NOTI_TYPE.ERROR, "Failed to Upload", "template incorrect");
};

const studentList = async (
  course: Partial<IModelCourse>,
  files: FileWithPath[],
  workbook: XLSX.WorkBook,
  setResult: React.Dispatch<React.SetStateAction<any>>,
  setOpenModalUploadError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorStudentId: React.Dispatch<React.SetStateAction<string[]>>,
  setErrorSection: React.Dispatch<React.SetStateAction<string[]>>
) => {
  for (const sheet of workbook.SheetNames) {
    const result: any[] = [];
    const worksheet = workbook.Sheets[sheet];
    const range = XLSX.utils.decode_range(worksheet["!ref"]!);
    range.s.r = 3;
    worksheet["!ref"] = XLSX.utils.encode_range(range);
    if (worksheet["!merges"]) {
      delete worksheet["!merges"][4];
    } else {
      files = [];
      templateNotMatch();
      return;
    }
    worksheet.E4 = { t: "s", v: "firstName" };
    worksheet.F4 = { t: "s", v: "lastName" };
    const resultsData: any[] = XLSX.utils.sheet_to_json(worksheet);

    // Validate the studentId
    const studentId = "รหัสนักศึกษา";
    const errorStudentIdList: string[] = [];
    const errorSection: string[] = [];
    const keys = Object.keys(resultsData[0]);
    if (![studentId, "SECLAB", "SECLEC"].some((key) => keys.includes(key))) {
      files = [];
      templateNotMatch();
      return;
    }
    resultsData.forEach((row, index) => {
      const sectionNo =
        row.SECLAB == "000" ? parseInt(row.SECLEC) : parseInt(row.SECLAB);
      if (
        (!row[studentId] && sectionNo.toString().length) ||
        (row[studentId] &&
          (!isNumeric(row[studentId]) ||
            row[studentId].toString().length !== 9))
      ) {
        const row = index + 5;
        const column = getColumnAlphabet(3);
        errorStudentIdList.push(`${column}${row}`);
      }
      const canUpload = course.sections?.find(
        (sec) => sec.sectionNo == sectionNo
      );
      if (!canUpload && !errorSection.includes(getSectionNo(sectionNo))) {
        errorSection.push(getSectionNo(sectionNo));
      }
      const existSec = result.find((sec) => sec.sectionNo == sectionNo);
      const student = {
        studentId: row[studentId],
        firstNameTH: row.firstName.replace(/ /g, ""),
        lastNameTH: row.lastName.replace(/ /g, ""),
      };
      if (!existSec) {
        result.push({
          sectionNo,
          studentList: [student],
        });
      } else {
        existSec.studentList.push(student);
      }
    });

    if (errorStudentIdList.length || errorSection.length) {
      files = [];
      setErrorStudentId(errorStudentIdList);
      setErrorSection(errorSection);
      setOpenModalUploadError(true);
      return;
    }
    setResult({
      year: course.year,
      semester: course.semester,
      course: course.id,
      sections: result,
    });
  }
};

const scoreOBETemplete = (
  course: Partial<IModelCourse>,
  files: FileWithPath[],
  workbook: XLSX.WorkBook,
  setResult: React.Dispatch<React.SetStateAction<any>>,
  setOpenModalUploadError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorStudentId: React.Dispatch<React.SetStateAction<any[]>>,
  setErrorSection: React.Dispatch<React.SetStateAction<string[]>>,
  setErrorPoint: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const user = store.getState().user;
  const result: any[] = [];
  const errorStudentIdList: { name: string; cell: string[] }[] = [];
  const errorSection: string[] = [];
  const errorPointList: { name: string; cell: string[] }[] = [];
  for (const sheet of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheet];
    if (
      worksheet.E1?.v != "Question" ||
      worksheet.E2?.v != "Full Score" ||
      worksheet.E3?.v != "Description (Optional)"
    ) {
      files = [];
      templateNotMatch();
      return;
    }
    delete worksheet.E1;
    delete worksheet.E2;
    delete worksheet.E3;

    const resultsData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const assignmentName = sheet;
    const fullScore = resultsData.shift();
    const description = resultsData.shift();

    resultsData.forEach((data, i) => {
      // Validate the studentId
      if (
        data.studentId.length &&
        (!isNumeric(data.studentId) || data.studentId.toString().length !== 9)
      ) {
        const row = i + 4;
        const column = getColumnAlphabet(1);
        const cell = `${column}${row}`;
        const existSheet = errorStudentIdList.find(({ name }) => name == sheet);
        if (existSheet) {
          existSheet.cell.push(cell);
        } else {
          errorStudentIdList.push({ name: sheet, cell: [cell] });
        }
      }
      // Validate the "point" field
      Object.keys(data)
        .filter(
          (key) =>
            !["section", "studentId", "firstName", "lastName"].includes(key)
        )
        .map((key, j) => {
          if (data[key] && !isNumeric(data[key])) {
            const row = i + 4;
            const column = getColumnAlphabet(j + 5);
            const cell = `${column}${row}`;
            const existSheet = errorPointList.find(({ name }) => name == sheet);
            if (existSheet) {
              existSheet.cell.push(cell);
            } else {
              errorPointList.push({ name: sheet, cell: [cell] });
            }
          }
        });
      const sectionNo = parseInt(data.section);
      const canUpload = course.sections?.find(
        (sec) => sec.sectionNo == sectionNo
      );
      if (
        (canUpload?.instructor as IModelUser)?.id !== user.id &&
        !canUpload?.coInstructors?.some((coIns) => coIns.id == user.id) &&
        !errorSection.includes(getSectionNo(sectionNo))
      ) {
        errorSection.push(getSectionNo(sectionNo));
      }
      const existSec = result.find((sec) => sec.sectionNo == sectionNo);
      const existAssignment = existSec?.assignments.find(
        (assign: any) => assign.assignmentName == assignmentName
      );
      delete data.section;
      const student = {
        ...data,
        firstNameTH: data.firstName.replace(/ /g, ""),
        lastNameTH: data.lastName.replace(/ /g, ""),
      };
      if (!existSec) {
        result.push({
          sectionNo,
          assignments: [
            {
              assignmentName,
              fullScore: fullScore,
              description: description,
              studentList: [student],
            },
          ],
        });
      } else if (!existAssignment) {
        existSec.assignments.push({
          assignmentName,
          fullScore: fullScore,
          description: description,
          studentList: [student],
        });
      } else {
        existAssignment.studentList.push(student);
      }
    });
  }
  if (
    errorStudentIdList.length ||
    errorSection.length ||
    errorPointList.length
  ) {
    files = [];
    setErrorStudentId(errorStudentIdList);
    setErrorSection(errorSection);
    setErrorPoint(errorPointList);
    setOpenModalUploadError(true);
    return;
  }
  setResult({
    year: course.year,
    semester: course.semester,
    course: course.id,
    sections: result,
  });
};

const gradescopeFile = (
  course: Partial<IModelCourse>,
  files: FileWithPath[],
  workbook: XLSX.WorkBook,
  setResult: React.Dispatch<React.SetStateAction<any>>,
  setOpenModalUploadError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorStudentId: React.Dispatch<React.SetStateAction<any[]>>,
  setErrorPoint: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const result = { sections: [] as any[], assignments: [] as any[] };
  const errorStudentIdList: { name: string; cell: string[] }[] = [];
  const errorPointList: { name: string; cell: string[] }[] = [];
  for (const sheet of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheet];
    const resultsData: any[] = XLSX.utils.sheet_to_json(worksheet);
    const assignmentName =
      sheet == "Sheet1" ? files[0].name.replace(/(.csv|.xlsx)$/g, "") : sheet;
      
    const scoreDataArray: any[] = [];
    const fullScoreDataArray: (string | number | null)[] = [];
    const formattedResults: string[] = [];
    resultsData.forEach((data, i) => {
      // Validate the studentId
      if (
        data.SID &&
        (!isNumeric(data.SID) || data.SID.toString().length !== 9)
      ) {
        const row = i + 2;
        const column = getColumnAlphabet(2);
        const cell = `${column}${row}`;
        const existSheet = errorStudentIdList.find(
          ({ name }) => name == assignmentName
        );
        if (existSheet) {
          existSheet.cell.push(cell);
        } else {
          errorStudentIdList.push({ name: assignmentName, cell: [cell] });
        }
      }
      scoreDataArray.push({
        studentId: data.SID,
        firstNameEN: data["First Name"],
        lastNameEN: data["Last Name"],
        email: data.Email,
        scores: {},
      });
      const sectionNo = course.sections?.find((sec) =>
        sec.students?.find((std) => std.student.studentId == data.SID)
      )?.sectionNo;
      const existSec = result.sections.find(
        (sec) => sec.sectionNo == sectionNo
      );
      if (!existSec) {
        result.sections.push({
          sectionNo,
          assignments: [],
          students: [scoreDataArray],
        });
      } else {
        existSec.students.push(scoreDataArray);
      }

      Object.keys(data)
        .slice(12)
        .map((key, j) => {
          // Validate the "point" field
          if (data[key] && !isNumeric(data[key])) {
            const row = i + 2;
            const column = getColumnAlphabet(j + 12);
            const cell = `${column}${row}`;
            const existSheet = errorPointList.find(
              ({ name }) => name == assignmentName
            );
            if (existSheet) {
              existSheet.cell.push(cell);
            } else {
              errorPointList.push({ name: assignmentName, cell: [cell] });
            }
          }
          const formatted = key.split(" ");
          formatted.pop();
          const fullScore = formatted.pop()?.slice(1);
          const questionName = formatted.join(" ");
          fullScoreDataArray.push(parseFloat(fullScore!));
          formattedResults.push(questionName);
          scoreDataArray[i].scores[questionName] = data[key];
        });
    });

    if (errorStudentIdList.length || errorPointList.length) {
      files = [];
      setErrorStudentId(errorStudentIdList);
      setErrorPoint(errorPointList);
      setOpenModalUploadError(true);
      return;
    }

    const data = formattedResults.map((question, index) => {
      return {
        name: question,
        fullScore: fullScoreDataArray[index],
      };
    });

    result.assignments.push({
      name: assignmentName,
      questions: data,
      scores: scoreDataArray,
    });
  }
  setResult({
    year: course.year,
    semester: course.semester,
    course: course.id,
    ...result,
  });
};

export const onRejectFile = (files: FileRejection[]) => {
  let title = "";
  let message = "";
  switch (files[0].errors[0].code) {
    case "file-invalid-type":
      title = "Invalid file type";
      message = "File type must be .csv, xls or .xlsx";
      break;
    case "file-too-large":
      title = "";
      message = "";
      break;
  }
  showNotifications(NOTI_TYPE.ERROR, title, message);
};
