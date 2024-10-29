import * as XLSX from "xlsx";
import { FileRejection, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { NOTI_TYPE } from "../constants/enum";
import { showNotifications } from "../notifications/showNotifications";

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
  files: FileWithPath[],
  type: "studentList" | "score",
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
      studentList(files, workbook, setOpenModalUploadError, setErrorStudentId);
    } else {
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      if (worksheet.C1?.v == "SID" || worksheet[0]?.SID) {
        gradescopeFile(
          files,
          workbook,
          setOpenModalUploadError,
          setErrorStudentId,
          setErrorPoint!
        );
      } else {
        scoreOBETemplete(
          files,
          workbook,
          setOpenModalUploadError,
          setErrorStudentId,
          setErrorPoint!
        );
      }
    }
  }
};

const studentList = (
  files: FileWithPath[],
  workbook: XLSX.WorkBook,
  setOpenModalUploadError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorStudentId: React.Dispatch<React.SetStateAction<string[]>>
) => {
  for (const sheet of workbook.SheetNames) {
    const result: any[] = [];
    const worksheet = workbook.Sheets[sheet];
    const range = XLSX.utils.decode_range(worksheet["!ref"]!);
    range.s.r = 3;
    worksheet["!ref"] = XLSX.utils.encode_range(range);
    delete worksheet["!merges"]![4];
    worksheet.E4 = { t: "s", v: "firstName" };
    worksheet.F4 = { t: "s", v: "lastName" };
    const resultsData: any[] = XLSX.utils.sheet_to_json(worksheet);

    console.log(resultsData);

    // Validate the studentId
    const studentId = "รหัสนักศึกษา";
    const errorStudentIdList: string[] = [];
    resultsData.forEach((row, index) => {
      if (
        row[studentId] &&
        (!isNumeric(row[studentId]) || row[studentId].toString().length !== 9)
      ) {
        const row = index + 4;
        const column = getColumnAlphabet(1);
        errorStudentIdList.push(`${column}${row}`);
      }
      const sectionNo =
        row.SECLAB == "000" ? parseInt(row.SECLEC) : parseInt(row.SECLAB);
      const existSec = result.find((sec) => sec.sectionNo == sectionNo);
      const student = {
        studentId: row[studentId],
        firstName: row.firstName,
        lastName: row.lastName,
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
    }

    console.log(result);
    
    return result;
  }
};

const scoreOBETemplete = (
  files: FileWithPath[],
  workbook: XLSX.WorkBook,
  setOpenModalUploadError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorStudentId: React.Dispatch<React.SetStateAction<string[]>>,
  setErrorPoint: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const result: any[] = [];

  for (const sheet of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheet];
    const resultsData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const assignmentName = sheet;
    const fullScore = resultsData.shift();
    const description = resultsData.shift();

    // console.log(fullScore);
    // console.log(description);
    console.log(resultsData);

    const errorStudentIdList: string[] = [];
    const errorPointList: string[] = [];
    resultsData.forEach((data, i) => {
      // Validate the studentId
      if (
        data.studentId &&
        (!isNumeric(data.studentId) || data.studentId.toString().length !== 9)
      ) {
        const row = i + 4;
        const column = getColumnAlphabet(1);
        errorStudentIdList.push(`${column}${row}`);
      }
      // Validate the "point" field
      Object.keys(data)
        .slice(4)
        .map((key, j) => {
          if (data[key] && !isNumeric(data[key])) {
            const row = i + 4;
            const column = getColumnAlphabet(j + 5);
            errorPointList.push(`${column}${row}`);
          }
        });
    });
    if (errorStudentIdList.length || errorPointList.length) {
      files = [];
      setErrorStudentId(errorStudentIdList);
      setErrorPoint(errorPointList);
      setOpenModalUploadError(true);
    }

    result.push({
      name: assignmentName,
    });
  }
  return result;
};

const gradescopeFile = (
  files: FileWithPath[],
  workbook: XLSX.WorkBook,
  setOpenModalUploadError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorStudentId: React.Dispatch<React.SetStateAction<string[]>>,
  setErrorPoint: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const result: any[] = [];
  for (const sheet of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheet];
    const resultsData: any[] = XLSX.utils.sheet_to_json(worksheet);
    const assignmentName = sheet;

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
        firstName: data["First Name"],
        lastName: data["Last Name"],
        email: data.Email,
        assignments: {},
      });
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
          const assignmentNo = formatted.join(" ");
          fullScoreDataArray.push(parseFloat(fullScore!));
          formattedResults.push(assignmentNo);
          scoreDataArray[i].assignments[assignmentNo] = data[key];
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
        no: question,
        fullScore: fullScoreDataArray[index],
      };
    });

    console.log({
      name: assignmentName,
      assignments: data,
      scores: scoreDataArray,
    });

    result.push({
      name: assignmentName,
      assignments: data,
      scores: scoreDataArray,
    });
  }
  return result;
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
