import { useEffect, useState } from "react";
import {
  Dropzone,
  FileWithPath,
  MIME_TYPES,
  MS_EXCEL_MIME_TYPE,
} from "@mantine/dropzone";
import { Alert, Button, Modal } from "@mantine/core";
import Icon from "../Icon";
import IconExcel from "@/assets/icons/excel.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconUpload from "@/assets/icons/upload.svg?react";
import IconFileImport from "@/assets/icons/fileImport.svg?react";
import IconBulb from "@/assets/icons/bulb.svg?react";
import IconDownload from "@/assets/icons/download.svg?react";
import IconX from "@/assets/icons/x.svg?react";
import IconFile from "@/assets/icons/file.svg?react";
import { IModelCourse } from "@/models/ModelCourse";
import gradescope from "@/assets/image/gradescope.png";
import ModalStudentList from "./ModalStudentList";
import ModalTemplateGuide from "./ModalTemplateGuide";
import { onUploadFile, onRejectFile } from "@/helpers/functions/uploadFile";
import ModalErrorUploadFile from "./ModalErrorUploadFile";
import Template from "@/assets/Template.xlsx";
import { setLoadingOverlay } from "@/store/loading";
import { useAppDispatch, useAppSelector } from "@/store";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { uploadScore } from "@/services/score/score.service";
import { getOneCourse } from "@/services/course/course.service";
import { editCourse } from "@/store/course";

type Props = {
  opened: boolean;
  onClose: () => void;
  data: Partial<IModelCourse>;
};

export default function ModalUploadScore({ opened, onClose, data }: Props) {
  const [openModalStudentList, setOpenModalStudentList] = useState(false);
  const [openModalTemplateGuide, setOpenModalTemplateGuide] = useState(false);
  const [openModalUploadError, setOpenModalUploadError] = useState(false);
  const [file, setFile] = useState<FileWithPath>();
  const [result, setResult] = useState<any>();
  const [errorStudentId, setErrorStudentId] = useState<
    { name: string; cell: string[] }[]
  >([]);
  const [errorPoint, setErrorPoint] = useState<
    { name: string; cell: string[] }[]
  >([]);
  const [errorSection, setErrorSection] = useState<string[]>([]);
  const [errorStudent, setErrorStudent] = useState<
    { student: string; studentIdNotMatch: boolean; sectionNotMatch: boolean }[]
  >([]);
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!openModalUploadError) {
      setFile(undefined);
      setResult(undefined);
      setErrorStudentId([]);
      setErrorSection([]);
      setErrorPoint([]);
      setErrorStudent([]);
    }
  }, [openModalUploadError]);

  const onClickUpload = async () => {
    if (result) {
      dispatch(setLoadingOverlay(true));
      const res = await uploadScore(result);
      if (res) {
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "Upload success",
          "upload scores success"
        );
        const res = await getOneCourse({
          year: data.year,
          semester: data.semester,
          courseNo: data.courseNo,
        });
        if (res) {
          dispatch(editCourse(res));
        }
        setFile(undefined);
        setResult(undefined);
      }
      dispatch(setLoadingOverlay(false));
    } else {
      showNotifications(NOTI_TYPE.ERROR, "Invalid File", "invalid scores");
    }
  };

  return (
    <>
      <ModalTemplateGuide
        opened={openModalTemplateGuide}
        onClose={() => setOpenModalTemplateGuide(false)}
      />
      <ModalStudentList
        data={data}
        opened={openModalStudentList}
        onClose={() => setOpenModalStudentList(false)}
        type="import_list"
      />

      {/* Main Modal */}
      <Modal.Root
        opened={opened}
        onClose={onClose}
        autoFocus={false}
        fullScreen={true}
        zIndex={50}
      >
        <Modal.Overlay />
        <Modal.Content className="!bg-[#fbfbfb] pt-0 !rounded-none !px-0">
          <Modal.Header
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            className="!pt-4 flex w-full rounded-none pb-4 !px-0"
          >
            <div className="flex px-12 items-center justify-between w-full">
              <div className="inline-flex gap-2 items-center font-semibold text-h2 text-secondary">
                <Modal.CloseButton className="!m-0" />
                <div className="flex flex-col">
                  <p>Upload Score</p>
                  <p className=" text-[12px] text-noData">
                    {data.courseNo} {data.courseName}
                  </p>
                </div>
              </div>
              <Button
                leftSection={
                  <Icon IconComponent={IconFileImport} className="size-4" />
                }
                color="#5268d5"
                variant="outline"
                className="w-28"
                onClick={() => setOpenModalStudentList(true)}
              >
                Import Student list
              </Button>
            </div>
          </Modal.Header>

          <Modal.Body className="flex flex-col h-full w-full">
            {/* Topic */}
            <div className="flex flex-col gap-3 lg:px-44 px-10 py-6 ">
              <Alert
                radius="md"
                variant="light"
                color="red"
                classNames={{
                  body: "flex justify-center",
                }}
                title={
                  <div className="flex items-center gap-2">
                    <Icon IconComponent={IconExclamationCircle} />
                    <p>Important: ScoreOBE + required</p>
                  </div>
                }
              >
                <p className="pl-8 text-default font-medium -mt-1">
                  Use only
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00] font-extrabold">
                    {" "}
                    ScoreOBE + Template{" "}
                  </span>
                  provided below to submit your scores. Please read the template
                  guide carefully, then download the template to upload your
                  score.
                </p>
              </Alert>
              <Alert
                radius="md"
                variant="light"
                color="rgba(0, 156, 140, 1)"
                classNames={{
                  body: " flex justify-center",
                }}
                title={
                  <div className="flex items-center  gap-2">
                    <Icon IconComponent={IconBulb} />
                    <p>
                      Tips:{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                        {" "}
                        ScoreOBE +{" "}
                      </span>
                      support{" "}
                      <span style={{ fontFamily: "Lexand" }}>
                        Gradescope template{" "}
                      </span>
                      for upload score
                    </p>
                  </div>
                }
              >
                <div className="flex items-center mt-2 mb-2">
                  <img
                    src={gradescope}
                    alt="CMULogo"
                    className=" h-[35px] ml-8  w-[156px] "
                  />
                  <p className="pl-8 text-default font-medium leading-[22px]">
                    To upload scores from Gradescope to the ScoreOBE +, simply{" "}
                    <span className="font-extrabold">
                      export the assignment scores
                    </span>{" "}
                    as a CSV file from Gradescope. <br /> Then, upload the CSV
                    file directly. This quick process ensures seamless
                    integration of your grading data.
                  </p>
                </div>
              </Alert>
              <div
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                }}
                className="py-14 bg-white px-[76px] rounded-md"
              >
                <div className="flex flex-col gap-10">
                  <div className="flex gap-3">
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00] font-semibold text-[24px]">
                      ScoreOBE + Template
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 text-[16px]">
                    <p className="text-secondary font-semibold ">
                      Use this template to upload score
                    </p>
                    <p className="text-[#6a6a6a] text-[14px] font-[500]">
                      Accurate grades and TQF5 qualifications rely on <br />{" "}
                      using this template to submit your scores.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      leftSection={
                        <Icon IconComponent={IconFile} className="size-4" />
                      }
                      variant="outline"
                      onClick={() => setOpenModalTemplateGuide(true)}
                    >
                      Template guide
                    </Button>
                    <a
                      href={Template}
                      download="Template"
                      target="_blank"
                      rel="noreferrer"
                      className="h-fit w-fit"
                    >
                      <Button
                        variant="gradient"
                        leftSection={
                          <Icon
                            IconComponent={IconDownload}
                            className="size-4"
                          />
                        }
                        className="size-4 bg-gradient-to-r from-[#4285f4]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00]"
                      >
                        Download template
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
              <Alert
                radius="md"
                variant="light"
                color="blue"
                classNames={{
                  body: " flex justify-center",
                }}
                title={
                  <div className="flex items-center  gap-2">
                    <Icon IconComponent={IconInfo2} />
                    <p>Upload Existing Score</p>
                  </div>
                }
              >
                <p className="pl-8 text-default font-medium -mt-1">
                  <span className="font-extrabold">
                    Existing score will be replaced
                  </span>
                  , when you upload file with matching Section, Assignment, and
                  Question
                </p>
              </Alert>

              <Dropzone
                onDrop={(files) => {
                  onUploadFile(
                    data,
                    files,
                    "score",
                    setResult,
                    setOpenModalUploadError,
                    setErrorStudentId,
                    setErrorSection,
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
                  <div className="flex justify-between p-5">
                    <div className="flex gap-2 items-center">
                      <Icon
                        IconComponent={IconExcel}
                        className="text-[#20884f]"
                      />
                      <p className="text-b2">{file?.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        color="#ffcdcd"
                        className=" text-error pl-4 font-extrabold hover:text-[#f26c6c] text-b3 rounded-md"
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
                        color="#DDE0FF"
                        className=" text-secondary pl-4 font-extrabold hover:text-[#4a58b4] text-b3 rounded-md"
                        leftSection={
                          <Icon IconComponent={IconUpload} className="size-4" />
                        }
                        onClick={(event) => {
                          event.stopPropagation();
                          onClickUpload();
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
                    <div className="flex flex-col font-medium  text-b2 text-red-500  items-center text-center justify-center">
                      <div className="flex gap-2 items-center justify-center">
                        <Icon
                          IconComponent={IconExclamationCircle}
                          className="size-4 stroke-red-600"
                        />
                        <p>Supports only ScoreOBE +</p>
                      </div>
                      <p> Gradescope assignment template</p>
                    </div>
                  </div>
                )}
              </Dropzone>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      {!!(
        errorStudentId.length ||
        errorSection.length ||
        errorPoint.length ||
        errorStudent.length
      ) && (
        <ModalErrorUploadFile
          type="scores"
          opened={openModalUploadError}
          onClose={() => setOpenModalUploadError(false)}
          errorStudentId={errorStudentId}
          errorSection={errorSection}
          errorPoint={errorPoint}
          errorStudent={errorStudent}
        />
      )}
    </>
  );
}
