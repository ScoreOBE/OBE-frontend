import * as XLSX from "xlsx";
import { FileRejection, FileWithPath } from "@mantine/dropzone";
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
  setOpenModalUploadError: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorStudentId: React.Dispatch<React.SetStateAction<string[]>>,
  setErrorPoint: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const file = files[0];
  if (file) {
    const dataExcel = await file.arrayBuffer();
    const workbook = XLSX.read(dataExcel);
    for (const sheet of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheet];
      const resultsData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        // defval: "",
        // header: 1,
        // raw: true
      });
      const fullScore = resultsData.shift();
      const description = resultsData.shift();

      // console.log(fullScore);
      // console.log(description);
      // console.log(resultsData);

      // Validate the studentId
      const errorStudentIdList: string[] = [];
      resultsData.forEach(({ studentId }, index) => {
        if (
          studentId &&
          (!isNumeric(studentId) || studentId.toString().length !== 9)
        ) {
          const row = index + 4;
          const column = getColumnAlphabet(1);
          errorStudentIdList.push(`${column}${row}`);
        }
      });
      // Validate the "point" field
      const errorPointList: string[] = [];
      resultsData.forEach((data, i) => {
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
    }
  }
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
