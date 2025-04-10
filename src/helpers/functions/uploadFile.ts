import * as XLSX from "xlsx";
import { FileRejection, FileWithPath } from "@mantine/dropzone";
import { NOTI_TYPE } from "../constants/enum";
import { showNotifications } from "../notifications/showNotifications";
import { IModelCourse } from "@/models/ModelCourse";
import store from "@/store";
import { IModelUser } from "@/models/ModelUser";
import { getSectionNo } from "./function";
import { capitalize } from "lodash";
import { validateEngLanguage } from "./validation";
import { setLoadingOverlay } from "@/store/loading";

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
  type: "studentList" | "score" | "grade",
  setResult: React.Dispatch<React.SetStateAction<any>>,
  setOpenModalUploadError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorStudentId: React.Dispatch<React.SetStateAction<any[]>>,
  setErrorSection?: React.Dispatch<React.SetStateAction<string[]>>,
  setErrorSectionNoStudents?: React.Dispatch<React.SetStateAction<string[]>>,
  setErrorPoint?: React.Dispatch<React.SetStateAction<any[]>>,
  setErrorStudent?: React.Dispatch<React.SetStateAction<any[]>>
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
    } else if (type == "score") {
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      if (worksheet.C1?.v == "SID" || worksheet[0]?.SID) {
        await gradescopeFile(
          course,
          files,
          workbook,
          setResult,
          setOpenModalUploadError,
          setErrorStudentId,
          setErrorPoint!
        );
      } else {
        await scoreOBETemplete(
          course,
          files,
          workbook,
          setResult,
          setOpenModalUploadError,
          setErrorStudentId,
          setErrorSection!,
          setErrorSectionNoStudents!,
          setErrorPoint!,
          setErrorStudent!
        );
      }
    } else {
      await gradeTemplete(
        course,
        files,
        workbook,
        setResult,
        setOpenModalUploadError,
        setErrorStudentId,
        setErrorSection!,
        setErrorSectionNoStudents!,
        setErrorPoint!,
        setErrorStudent!
      );
    }
  }
};

const templateNotMatch = () => {
  showNotifications(
    NOTI_TYPE.ERROR,
    "Template Mismatch",
    "The template does not match the required format. Please check the file and try again."
  );
};

const studentList = async (
  course: Partial<IModelCourse>,
  files: FileWithPath[],
  workbook: XLSX.WorkBook,
  setResult: React.Dispatch<React.SetStateAction<any>>,
  setOpenModalUploadError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorStudentId: React.Dispatch<React.SetStateAction<string[]>>,
  setWaringSection: React.Dispatch<React.SetStateAction<string[]>>
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
    const warningSection: string[] = [];
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
      if (!canUpload) {
        if (!warningSection.includes(getSectionNo(sectionNo))) {
          warningSection.push(getSectionNo(sectionNo));
        }
        return;
      }

      const existSec = result.find((sec) => sec.sectionNo == sectionNo);
      const student = {
        studentId: row[studentId],
        firstNameTH: row.firstName?.endsWith(" ")
          ? row.firstName.slice(0, -1)
          : row.firstName,
        lastNameTH: row.lastName?.endsWith(" ")
          ? row.lastName.slice(0, -1)
          : row.lastName ?? "",
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
    if (warningSection.length) {
      setWaringSection(warningSection);
    }
    setResult({
      year: course.year,
      semester: course.semester,
      course: course.id,
      sections: result,
    });
  }
};

const scoreOBETemplete = async (
  course: Partial<IModelCourse>,
  files: FileWithPath[],
  workbook: XLSX.WorkBook,
  setResult: React.Dispatch<React.SetStateAction<any>>,
  setOpenModalUploadError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorStudentId: React.Dispatch<React.SetStateAction<any[]>>,
  setErrorSection: React.Dispatch<React.SetStateAction<string[]>>,
  setErrorSectionNoStudents: React.Dispatch<React.SetStateAction<string[]>>,
  setErrorPoint: React.Dispatch<React.SetStateAction<any[]>>,
  setErrorStudent: React.Dispatch<React.SetStateAction<any[]>>
) => {
  await new Promise((resolve) => {
    store.dispatch(setLoadingOverlay(true));
    setTimeout(resolve, 3);
  });
  const user = store.getState().user;
  const errorStudentIdList: { name: string; cell: string[] }[] = [];
  const errorSection: string[] = [];
  const errorSectionNoStudents: string[] = [];
  const errorPointList: { name: string; cell: string[] }[] = [];
  const errorStudent: {
    studentId: string;
    student: string;
    studentIdNotMatch: boolean;
    sectionNotMatch: boolean;
  }[] = [];
  const result: any[] = [];
  for (const sheet of workbook.SheetNames) {
    let worksheet = workbook.Sheets[sheet];
    if (
      worksheet.E1?.v != "Question" ||
      worksheet.E2?.v != "Full Score" ||
      worksheet.E3?.v != "Description (Optional)"
    ) {
      store.dispatch(setLoadingOverlay(false));
      files = [];
      templateNotMatch();
      return;
    }
    delete worksheet.E1;
    delete worksheet.E2;
    delete worksheet.E3;

    worksheet = removeEmptyRows(worksheet);

    let resultsData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const assignmentName = sheet;
    const fullScore = resultsData.shift();
    const description = resultsData[0].section ? {} : resultsData.shift();

    resultsData.forEach((data, i) => {
      // Validate the studentId
      if (
        !data.studentId ||
        (data.studentId &&
          (!isNumeric(data.studentId) ||
            data.studentId.toString().length !== 9))
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
        !canUpload?.students?.length &&
        !errorSectionNoStudents.includes(getSectionNo(sectionNo))
      ) {
        errorSectionNoStudents.push(getSectionNo(sectionNo));
      }
      if (
        (canUpload?.instructor as IModelUser)?.id !== user.id &&
        !canUpload?.coInstructors?.some((coIns) => coIns.id == user.id) &&
        !errorSection.includes(getSectionNo(sectionNo))
      ) {
        errorSection.push(getSectionNo(sectionNo));
      }
      const firstNameIsEng = validateEngLanguage(data.firstName);
      const lastNameIsEng = validateEngLanguage(data.lastName);
      const firstName = data.firstName?.endsWith(" ")
        ? data.firstName.slice(0, -1)
        : firstNameIsEng
        ? capitalize(data.firstName)
        : data.firstName;
      const lastName = data.lastName?.endsWith(" ")
        ? data.lastName.slice(0, -1)
        : lastNameIsEng
        ? capitalize(data.lastName)
        : data.lastName;

      const checkSection = canUpload?.students?.find(
        ({ student }) => student.studentId == data.studentId
      );
      const checkStudent = checkSection
        ? checkSection.student.studentId != data.studentId
        : !course.sections?.find(({ students }) =>
            students?.find(({ student }) => student.studentId == data.studentId)
          );
      if (
        course.sections?.find(({ students }) =>
          students?.find(
            ({ student }) =>
              student.studentId == data.studentId ||
              (student[firstNameIsEng ? "firstNameEN" : "firstNameTH"] ==
                firstName &&
                student[lastNameIsEng ? "lastNameEN" : "lastNameTH"] ==
                  lastName)
          )
        ) &&
        (!checkSection || checkStudent) &&
        !errorStudent.find(
          ({ student }) => student == `${firstName} ${lastName}`
        )
      ) {
        errorStudent.push({
          studentId: data.studentId,
          student: `${firstName} ${lastName}`,
          studentIdNotMatch: checkStudent,
          sectionNotMatch: !checkSection,
        });
      }
      const existSec = result.find((sec) => sec.sectionNo == sectionNo);
      const existAssignment = existSec?.assignments.find(
        (assign: any) => assign.name == assignmentName
      );
      delete data.section;
      const existStudent = existSec?.students.find(
        ({ studentId }: any) => studentId == data.studentId
      );
      const questions = Object.keys(fullScore).map((item) => ({
        name: item,
        desc: description[item],
        fullScore: fullScore[item],
      }));
      const score = {
        assignmentName,
        questions: questions.map(({ name }) => ({
          name: name,
          score: data[name] ?? null,
        })),
      };
      const student = {
        student: canUpload?.students?.find(
          ({ student }) => student.studentId == data.studentId
        )?.student.id,
        studentId: data.studentId,
        ...(firstNameIsEng
          ? { firstNameEN: firstName, lastNameEN: lastName }
          : { firstNameTH: firstName, lastNameTH: lastName }),
        scores: [score],
      };
      if (!existSec) {
        result.push({
          sectionNo,
          students: [student],
          assignments: [{ name: assignmentName, questions }],
        });
      } else {
        if (!existStudent) {
          existSec.students.push(student);
        } else {
          existStudent.scores.push(score);
        }
        if (!existAssignment) {
          existSec.assignments.push({ name: assignmentName, questions });
        }
      }
    });
  }
  store.dispatch(setLoadingOverlay(false));
  if (
    errorStudentIdList.length ||
    errorSection.length ||
    errorSectionNoStudents.length ||
    errorPointList.length ||
    errorStudent.length
  ) {
    files = [];
    setErrorStudentId(errorStudentIdList);
    setErrorSection(errorSection);
    setErrorSectionNoStudents(errorSectionNoStudents);
    setErrorPoint(errorPointList);
    setErrorStudent(errorStudent);
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

const gradescopeFile = async (
  course: Partial<IModelCourse>,
  files: FileWithPath[],
  workbook: XLSX.WorkBook,
  setResult: React.Dispatch<React.SetStateAction<any>>,
  setOpenModalUploadError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorStudentId: React.Dispatch<React.SetStateAction<any[]>>,
  setErrorPoint: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const result: any[] = [];
  const errorStudentIdList: { name: string; cell: string[] }[] = [];
  const errorPointList: { name: string; cell: string[] }[] = [];

  for (const sheet of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheet];
    const resultsData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const assignmentName =
      sheet == "Sheet1" ? files[0].name.replace(/(.csv|.xlsx)$/g, "") : sheet;
    const questions = Object.keys(resultsData[0])
      .slice(12)
      .map((key) => {
        const formatted = key.split(" ");
        formatted.pop();
        const fullScore = formatted.pop()?.slice(1);
        const questionName = formatted.join(" ").split(":")[0];
        return {
          name: questionName,
          fullScore: parseFloat(fullScore!),
        };
      });

    resultsData.forEach((data, i) => {
      // Validate the studentId
      if (
        !data.SID ||
        (data.SID && (!isNumeric(data.SID) || data.SID.toString().length !== 9))
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
        });

      const sectionNo = course.sections?.find((sec) =>
        sec.students?.find((std) => std.student.studentId == data.SID)
      )?.sectionNo;
      const score = {
        assignmentName,
        questions: Object.keys(data)
          .slice(12)
          .map((key, index) => ({
            name: questions[index].name,
            score: data[key],
          })),
      };
      const student = {
        student: course.sections
          ?.find((sec) => sec.sectionNo == sectionNo)
          ?.students?.find(({ student }) => student.studentId == data.SID)
          ?.student.id,
        studentId: data.SID,
        firstNameEN: capitalize(data["First Name"]),
        lastNameEN: capitalize(data["Last Name"]),
        email: data.Email,
        scores: [score],
      };
      const existSec = result.find((sec) => sec.sectionNo == sectionNo);
      const existAssignment = existSec?.assignments.find(
        (assign: any) => assign.name == assignmentName
      );
      const existStudent = existSec?.students.find(
        ({ studentId }: any) => studentId == data.studentId
      );
      if (!existSec) {
        result.push({
          sectionNo,
          students: [student],
          assignments: [{ name: assignmentName, questions }],
        });
      } else {
        if (!existStudent) {
          existSec.students.push(student);
        } else {
          existStudent.scores.push(score);
        }
        if (!existAssignment) {
          existSec.assignments.push({ name: assignmentName, questions });
        }
      }
    });
  }
  if (errorStudentIdList.length || errorPointList.length) {
    files = [];
    setErrorStudentId(errorStudentIdList);
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

const gradeTemplete = async (
  course: Partial<IModelCourse>,
  files: FileWithPath[],
  workbook: XLSX.WorkBook,
  setResult: React.Dispatch<React.SetStateAction<any>>,
  setOpenModalUploadError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorStudentId: React.Dispatch<React.SetStateAction<any[]>>,
  setErrorSection: React.Dispatch<React.SetStateAction<string[]>>,
  setErrorSectionNoStudents: React.Dispatch<React.SetStateAction<string[]>>,
  setErrorPoint: React.Dispatch<React.SetStateAction<any[]>>,
  setErrorStudent: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const user = store.getState().user;
  const result: any[] = [];
  const errorStudentIdList: { name: string; cell: string[] }[] = [];
  const errorSection: string[] = [];
  const errorSectionNoStudents: string[] = [];
  const errorPointList: { name: string; cell: string[] }[] = [];
  const errorStudent: {
    studentId: string;
    student: string;
    studentIdNotMatch: boolean;
    sectionNotMatch: boolean;
  }[] = [];
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  if (
    worksheet.A1?.v != "Course No." ||
    worksheet.A2?.v != "SECLEC" ||
    worksheet.B2?.v != "SECLAB" ||
    worksheet.C2?.v != "StudentID" ||
    worksheet.D2?.v != "Firstname" ||
    worksheet.E2?.v != "Lastname" ||
    worksheet.F2?.v != "Grade"
  ) {
    files = [];
    templateNotMatch();
    return;
  }
  const courseNo = worksheet.B1?.v;
  if (course.courseNo != courseNo) {
    showNotifications(NOTI_TYPE.ERROR, "Course No. not match", "");
    return;
  }
  delete worksheet.A1;
  delete worksheet.B1;
  delete worksheet.I3;

  const resultsData: any[] = XLSX.utils
    .sheet_to_json(worksheet, { header: 1 })
    .filter((arr: any) => arr.length);

  const headers = resultsData[0];
  const formattedData = resultsData.slice(2).map((row: any[]) => {
    const rowObject: { [key: string]: any } = {};
    headers.forEach((header: string, index: number) => {
      if (header == "Grade") {
        rowObject[header] = row[index].replace("+", "plus");
      } else if (!["SECLEC", "SECLAB"].includes(header)) {
        rowObject[header] = row[index];
      } else if (row[index] != "000" && row[index]) {
        rowObject.section =
          typeof row[index] == "number" ? row[index] : parseInt(row[index]);
      }
    });
    return rowObject;
  });

  formattedData.forEach((std) => {
    const existSec = result.find((sec) => sec.sectionNo == std.section);
    if (!existSec) {
      result.push({
        sectionNo: std.section,
        A: 0,
        Bplus: 0,
        B: 0,
        Cplus: 0,
        C: 0,
        Dplus: 0,
        D: 0,
        F: 0,
        W: 0,
        S: 0,
        U: 0,
        P: 0,
      });
      result[result.length - 1][std.Grade]++;
    } else {
      existSec[std.Grade]++;
    }
  });

  if (
    errorStudentIdList.length ||
    errorSection.length ||
    errorSectionNoStudents.length ||
    errorPointList.length ||
    errorStudent.length
  ) {
    files = [];
    setErrorStudentId(errorStudentIdList);
    setErrorSection(errorSection);
    setErrorSectionNoStudents(errorSectionNoStudents);
    setErrorPoint(errorPointList);
    setErrorStudent(errorStudent);
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

export const onRejectFile = (files: FileRejection[]) => {
  let title = "";
  let message = "";
  switch (files[0].errors[0].code) {
    case "file-invalid-type":
      title = "Invalid File Type";
      message = "The file type must be .csv, .xls, or .xlsx.";
      break;
    case "file-too-large":
      title = "File Too Large";
      message = "The file size exceeds 10MB. Please upload a smaller file.";
      break;
  }
  showNotifications(NOTI_TYPE.ERROR, title, message);
};

const removeEmptyRows = (worksheet: XLSX.WorkSheet): XLSX.WorkSheet => {
  if (!worksheet["!ref"]) return worksheet;
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  const newData: Record<string, XLSX.CellObject> = {};
  let newRow = 0;
  let lastRow = range.e.r;

  for (let row = range.e.r; row >= range.s.r; row--) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 }); // Column "A" = index 0
    if (worksheet[cellAddress]) {
      lastRow = row;
      break;
    }
  }

  const newRange = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: lastRow, c: range.e.c },
  });
  return { ...worksheet, ...newData, "!ref": newRange };
};
