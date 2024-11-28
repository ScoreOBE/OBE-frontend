import { useEffect, useState } from "react";
import {
  Dropzone,
  FileWithPath,
  MIME_TYPES,
  MS_EXCEL_MIME_TYPE,
} from "@mantine/dropzone";
import { Alert, Button, Modal } from "@mantine/core";
import Icon from "../../Icon";
import IconExcel from "@/assets/icons/excel.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconUpload from "@/assets/icons/upload.svg?react";
import IconX from "@/assets/icons/x.svg?react";
import { IModelCourse } from "@/models/ModelCourse";
import { onUploadFile, onRejectFile } from "@/helpers/functions/uploadFile";
import ModalErrorUploadFile from "./ModalErrorUploadFile";
import { setLoadingOverlay } from "@/store/loading";
import { useAppDispatch, useAppSelector } from "@/store";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import { showNotifications } from "@/helpers/notifications/showNotifications";

type Props = {
  opened: boolean;
  onClose: () => void;
  data: Partial<IModelCourse>;
};

export default function ModalUploadGrade({ opened, onClose, data }: Props) {
  const [openModalUploadError, setOpenModalUploadError] = useState(false);
  const [openModalWarningStudentList, setOpenModalWarningStudentList] =
    useState(false);
  const [file, setFile] = useState<FileWithPath>();
  const [result, setResult] = useState<any>();
  const [errorStudentId, setErrorStudentId] = useState<
    { name: string; cell: string[] }[]
  >([]);
  const [errorPoint, setErrorPoint] = useState<
    { name: string; cell: string[] }[]
  >([]);
  const [errorSection, setErrorSection] = useState<string[]>([]);
  const [errorSectionNoStudents, setErrorSectionNoStudents] = useState<
    string[]
  >([]);
  const [errorStudent, setErrorStudent] = useState<
    {
      studentId: string;
      student: string;
      studentIdNotMatch: boolean;
      sectionNotMatch: boolean;
    }[]
  >([]);
  const [warningStudentList, setWarningStudentList] = useState<
    {
      studentId: string;
      firstName: string;
      lastName: string;
    }[]
  >([]);
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const dispatch = useAppDispatch();

  const reset = () => {
    setFile(undefined);
    setResult(undefined);
  };

  useEffect(() => {
    if (opened) reset();
  }, [opened]);

  useEffect(() => {
    if (!openModalUploadError) {
      reset();
      setErrorStudentId([]);
      setErrorSection([]);
      setErrorPoint([]);
      setErrorStudent([]);
    }
  }, [openModalUploadError]);

  // useEffect(() => {
  //   if (result?.sections) {
  //     const notExistStudent: {
  //       studentId: string;
  //       firstName: string;
  //       lastName: string;
  //     }[] = [];
  //     data.sections?.forEach((sec) => {
  //       sec.students?.forEach(({ student }) => {
  //         const existStudent = result.sections
  //           .find((item: any) => item.sectionNo == sec.sectionNo)
  //           .students.find((item: any) => item.student == student.id);
  //         if (!existStudent) {
  //           notExistStudent.push({
  //             studentId: student.studentId!,
  //             firstName: student.firstNameTH || student.firstNameEN,
  //             lastName: student.lastNameTH || student.lastNameEN,
  //           });
  //         }
  //       });
  //     });
  //     if (notExistStudent.length) {
  //       setWarningStudentList(notExistStudent);
  //       setOpenModalWarningStudentList(true);
  //     }
  //   }
  // }, [result]);

  // const onClickUpload = async () => {
  //   if (result) {
  //     dispatch(setLoadingOverlay(true));

  //     dispatch(setLoadingOverlay(false));
  //   } else {
  //     showNotifications(NOTI_TYPE.ERROR, "Invalid File", "invalid grade");
  //   }
  // };

  return (
    <>
      <Modal
        title="Upload Grade"
        size="55vw"
        opened={opened}
        onClose={onClose}
        centered
        transitionProps={{ transition: "pop" }}
        closeOnClickOutside={false}
        classNames={{
          content: "flex flex-col overflow-hidden !pb-1 max-h-full h-fit",
          body: "flex flex-col overflow-hidden h-fit",
        }}
      >
        <div className="flex flex-col gap-2 overflow-hidden">
          <div className=" flex-col overflow-y-auto h-full gap-3">
            Upload Grade is coming soon.
            {/* <Dropzone
              onDrop={(files) => {
                onUploadFile(
                  data,
                  files,
                  "grade",
                  setResult,
                  setOpenModalUploadError,
                  setErrorStudentId,
                  setErrorSection,
                  setErrorSectionNoStudents,
                  setErrorPoint,
                  setErrorStudent
                );
                setFile(files[0]);
              }}
              onReject={(files) => onRejectFile(files)}
              maxFiles={1}
              maxSize={5 * 1024 ** 2}
              accept={[...MS_EXCEL_MIME_TYPE, MIME_TYPES.csv]}
              className="bg-white hover:bg-gray-50 border-[#8f9ae37f] border-dashed cursor-pointer border-[2px] rounded-md"
            >
              {result?.sections ? (
                <div className="flex justify-between p-5 px-8">
                  <div className="flex gap-2 items-center">
                    <Icon
                      IconComponent={IconExcel}
                      className="text-[#20884f]"
                    />
                    <p className="text-b2">{file?.name}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      color="#ffcdcd"
                      variant="outline"
                      className=" text-error pl-4 font-semibold  hover:text-[#f26c6c] text-b3 rounded-md"
                      leftSection={
                        <Icon IconComponent={IconTrash} className="size-4" />
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        setResult(undefined);
                        setFile(undefined);
                      }}
                      loading={loading}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="filled"
                      className=" text-white pl-4 font-semibold hover:text-[#ffffff] text-b3 rounded-md"
                      leftSection={
                        <Icon IconComponent={IconUpload} className="size-4" />
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      loading={loading}
                    >
                      Upload
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col py-12 gap-3 justify-center items-center pointer-events-none">
                  <Dropzone.Accept>
                    <Icon
                      IconComponent={IconUpload}
                      style={{ color: "var(--mantine-color-green-6)" }}
                      className="bg-green-100 stroke-[2px] size-16 p-3 rounded-full"
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <Icon
                      IconComponent={IconX}
                      style={{ color: "var(--mantine-color-red-6)" }}
                      className="bg-red-200 stroke-[2px] size-16 p-3 rounded-full"
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <Icon
                      IconComponent={IconUpload}
                      style={{ color: "var(--color-secondary)" }}
                      className="bg-[#DDE0FF] stroke-[2px] size-16 p-3 rounded-full"
                    />
                  </Dropzone.Idle>
                  <p className="font-semibold text-default">
                    <span className="text-secondary underline">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="-mt-2 font-medium items-center justify-center text-center text-secondary text-b2">
                    CSV or XLSX format only (up to 10MB)
                  </p>
                </div>
              )}
            </Dropzone> */}
          </div>
        </div>
      </Modal>

      {/* <ModalErrorUploadFile
        type='grade'
        opened={openModalUploadError}
        onClose={() => setOpenModalUploadError(false)}
        errorStudentId={errorStudentId}
        errorSection={errorSection}
        errorPoint={errorPoint}
        errorStudent={errorStudent}
        errorSectionNoStudents={errorSectionNoStudents}
      /> */}
    </>
  );
}
