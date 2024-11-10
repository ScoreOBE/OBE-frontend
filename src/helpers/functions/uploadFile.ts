import * as XLSX from "xlsx";
import { FileRejection, FileWithPath } from "@mantine/dropzone";
import { NOTI_TYPE } from "../constants/enum";
import { showNotifications } from "../notifications/showNotifications";
import { IModelCourse } from "@/models/ModelCourse";

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
  setErrorStudentId: React.Dispatch<React.SetStateAction<string[]>>,
  setErrorPoint?: React.Dispatch<React.SetStateAction<string[]>>
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
        setErrorStudentId
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
  setErrorStudentId: React.Dispatch<React.SetStateAction<string[]>>
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
        const row = index + 4;
        const column = getColumnAlphabet(1);
        errorStudentIdList.push(`${column}${row}`);
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

    if (errorStudentIdList.length) {
      files = [];
      setErrorStudentId(errorStudentIdList);
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
  setErrorStudentId: React.Dispatch<React.SetStateAction<string[]>>,
  setErrorPoint: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const result: any[] = [];

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

    const errorStudentIdList: string[] = [];
    const errorPointList: string[] = [];
    resultsData.forEach((data, i) => {
      // Validate the studentId
      if (
        data.studentId.length &&
        (!isNumeric(data.studentId) || data.studentId.toString().length !== 9)
      ) {
        const row = i + 4;
        const column = getColumnAlphabet(1);
        errorStudentIdList.push(`${column}${row}`);
      }
      // Validate the "point" field
      Object.keys(data)
        .filter(
          (key) =>
            !["section", "studentId", "firstName", "lastName"].includes(key)
        )
        .map((key, j) => {
          if (data[key] && !isNumeric(data[key])) {
            console.log(data[key]);
            const row = i + 4;
            const column = getColumnAlphabet(j + 5);
            errorPointList.push(`${column}${row}`);
          }
        });
      const sectionNo = parseInt(data.section);
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
    if (errorStudentIdList.length || errorPointList.length) {
      files = [];
      setErrorStudentId(errorStudentIdList);
      setErrorPoint(errorPointList);
      setOpenModalUploadError(true);
      return;
    }
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
  setErrorStudentId: React.Dispatch<React.SetStateAction<string[]>>,
  setErrorPoint: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const result = { sections: [] as any[], assignments: [] as any[] };
  for (const sheet of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheet];
    const resultsData: any[] = XLSX.utils.sheet_to_json(worksheet);
    const assignmentName = files[0].name.replace(/(.csv|.xlsx)$/g, "");

    const errorStudentIdList: string[] = [];
    const errorPointList: string[] = [];
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
        errorStudentIdList.push(`${column}${row}`);
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
            errorPointList.push(`${column}${row}`);
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
