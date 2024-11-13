import { Dropzone, FileWithPath, MS_EXCEL_MIME_TYPE } from "@mantine/dropzone";
import { Table, Tabs, TextInput } from "@mantine/core";
import { Alert, Button, Modal } from "@mantine/core";
import { IModelCourse } from "@/models/ModelCourse";
import regcmu from "@/assets/image/regCMULogo.png";
import exStudentList from "@/assets/image/exStudentList.png";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import Icon from "../Icon";
import IconExcel from "@/assets/icons/excel.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconFileImport from "@/assets/icons/fileImport.svg?react";
import IconX from "@/assets/icons/x.svg?react";
import IconExternalLink from "@/assets/icons/externalLink.svg?react";
import IconUpload from "@/assets/icons/upload.svg?react";
import IconArrowRight from "@/assets/icons/arrowRight.svg?react";
import { onUploadFile, onRejectFile } from "@/helpers/functions/uploadFile";
import ModalErrorUploadFile from "./ModalErrorUploadFile";
import { uploadStudentList } from "@/services/section/section.service";
import { updateStudentList } from "@/store/course";
import { useAppDispatch, useAppSelector } from "@/store";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import { getSectionNo, getUserName } from "@/helpers/functions/function";
import { setLoadingOverlay } from "@/store/loading";

type modalType = "import" | "list" | "import_list";
type Props = {
  opened: boolean;
  onClose: () => void;
  type: modalType;
  selectCourse?: boolean;
  data: Partial<IModelCourse> & Record<string, any>;
  onBack?: () => void;
  onNext?: () => void;
};

export default function ModalStudentList({
  opened,
  onClose,
  type,
  selectCourse = true,
  data,
  onBack,
  onNext,
}: Props) {
  const [tab, setTab] = useState<string | null>("importStudentList");
  const [file, setFile] = useState<FileWithPath>();
  const [filter, setFilter] = useState<string>("");
  const [result, setResult] = useState<any>();
  const [openModalUploadError, setOpenModalUploadError] = useState(false);
  const [errorStudentId, setErrorStudentId] = useState<string[]>([]);
  const [errorSection, setErrorSection] = useState<string[]>([]);
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (opened) {
      setFile(undefined);
      setResult(undefined);
    }
  }, [opened]);

  useEffect(() => {
    if (!openModalUploadError) {
      setFile(undefined);
      setResult(undefined);
      setErrorStudentId([]);
      setErrorSection([]);
    }
  }, [openModalUploadError]);

  const uploadList = async () => {
    if (result) {
      dispatch(setLoadingOverlay(true));
      const res = await uploadStudentList(result);
      if (res) {
        dispatch(updateStudentList({ id: data.id, sections: res }));
        setFile(undefined);
        setResult(undefined);
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "Upload success",
          "upload student list success"
        );
        if (onNext) {
          onNext();
        }
      }
      dispatch(setLoadingOverlay(false));
    } else {
      showNotifications(
        NOTI_TYPE.ERROR,
        "Invalid File",
        "invalid student list"
      );
    }
  };

  const rows = data.sections?.map((sec) =>
    sec.students
      ?.map(({ student }) => student)
      .filter((student) =>
        parseInt(filter)
          ? student.studentId?.toString().includes(filter) ||
            sec.sectionNo?.toString().includes(filter)
          : getUserName(student, 3)?.includes(filter)
      )
      ?.map((student) => (
        <Table.Tr
          className="font-medium text-default text-[13px]"
          key={student.studentId}
        >
          {/* <Table.Td>{student.studentId}</Table.Td> */}
          <Table.Td>{getSectionNo(sec.sectionNo)}</Table.Td>
          {/* <Table.Td>{student.seclab}</Table.Td> */}
          <Table.Td>{student.studentId}</Table.Td>
          <Table.Td>{getUserName(student, 3)}</Table.Td>
        </Table.Tr>
      ))
  );

  const studentTable = () => {
    const hasData = rows && rows.flat().length > 0; // Check if there's any data
    return (
      <>
        {hasData && (
          <TextInput
            leftSection={<TbSearch />}
            placeholder="Section No, Student No, Name"
            size="xs"
            rightSectionPointerEvents="all"
            className="mx-1"
            onChange={(event: any) => setFilter(event.currentTarget.value)}
          ></TextInput>
        )}
        <div
          className="mx-1 max-h-[500px] h-fit flex flex-col bg-white mb-1 mt-4 rounded-md overflow-y-auto"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          {hasData ? (
            <Table stickyHeader striped>
              <Table.Thead>
                <Table.Tr className="bg-[#e5e7f6]">
                  <Table.Th className="w-[10%]">Section</Table.Th>
                  <Table.Th className="w-[17%]">Student Id</Table.Th>
                  <Table.Th className="w-[58%]">Name</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          ) : (
            <p className="text-start font-semibold text-secondary p-6 py-10">
              No data found for {data.courseNo}
              <br />
              <p className="mt-2 text-[#777777] font-medium text-b3" font->
                {" "}
                Please ensure you have uploaded the student list from your
                course page <br /> by clicking the 'Upload Score' button.
              </p>
            </p>
          )}
        </div>
      </>
    );
  };

  const dropZoneFile = () => {
    return (
      <Dropzone
        onDrop={(files) => {
          onUploadFile(
            data,
            files,
            "studentList",
            setResult,
            setOpenModalUploadError,
            setErrorStudentId,
            setErrorSection
          );
          setFile(files[0]);
        }}
        onReject={(files) => onRejectFile(files)}
        maxFiles={1}
        maxSize={5 * 1024 ** 2}
        accept={MS_EXCEL_MIME_TYPE}
        className="border-[#8f9ae37f] mt-3 hover:bg-gray-100 border-dashed bg-gray-50 cursor-pointer border-[2px] rounded-md"
      >
        {result?.sections ? (
          <div className="flex justify-between p-3">
            <div className="flex gap-2 items-center">
              <Icon IconComponent={IconExcel} className="text-[#20884f]" />
              <p className="text-b2">{file?.name}</p>
            </div>
            <Button
              color="red"
              variant="outline"
              onClick={(event) => {
                event.stopPropagation();
                setResult(undefined);
                setFile(undefined);
              }}
              className="!rounded-full px-2 hover:bg-[#ffcdcd]"
            >
              <Icon
                IconComponent={IconTrash}
                className="size-4 stroke-[2px] stroke-[#ff4747] flex items-center"
              />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 min-h-56 justify-center items-center pointer-events-none">
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
            <p className="font-semibold text-b2 text-default">
              <span className="text-secondary underline">Click to import</span>{" "}
              or drag and drop
            </p>
            <p className="-mt-2 font-medium items-center justify-center text-center text-secondary text-b3">
              XLSX format only (up to 10MB)
            </p>
            <div className="flex flex-col text-b3 font-medium  text-red-500  items-center text-center justify-center">
              <div className="flex gap-2 items-center justify-center">
                <Icon
                  IconComponent={IconExclamationCircle}
                  className="size-4 stroke-red-600"
                />
                <p>Supports only Student List ({data?.courseNo}) template</p>
              </div>
              <p>from CMU Registration (Reg CMU)</p>
            </div>
          </div>
        )}
      </Dropzone>
    );
  };

  return (
    <>
      {/* Main Modal */}
      <Modal
        title={
          type === "import" ? (
            <div className="flex flex-col gap-2">
              <p>Import Student list from Reg CMU</p>
              <p className=" text-[12px] text-noData">
                {data.courseNo} {data.courseName}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p>{type === "import_list" ? "Import " : ""}Student list</p>
              <p className=" text-[12px] text-noData">
                {data.courseNo} - {data.courseName}
              </p>
            </div>
          )
        }
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
        {type == "import_list" ? (
          <Tabs
            classNames={{
              root: "overflow-hidden flex -mt-1 flex-col max-h-full",
            }}
            value={tab}
            onChange={setTab}
          >
            <Tabs.List className="mb-2">
              <Tabs.Tab value="importStudentList">
                Import file from Reg CMU
              </Tabs.Tab>{" "}
              <Tabs.Tab value="studentList">Student List</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel className="flex flex-col gap-1" value="studentList">
              {studentTable()}
            </Tabs.Panel>
            <Tabs.Panel
              className="overflow-hidden flex"
              value="importStudentList"
            >
              <div className="overflow-y-auto max-h-[502px] gap-3">
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
                      <p>
                        How to import Student List for Course {data?.courseNo}
                      </p>
                    </div>
                  }
                >
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <img
                        src={regcmu}
                        alt="CMULogo"
                        className=" h-[38px] w-[185px] "
                      />
                      <p className="pl-5 text-default leading-6 font-medium ">
                        ou must import the student list (.xlsx) in this course
                        for all sections from the CMU Registration System.
                        <a
                          href="https://www1.reg.cmu.ac.th/registrationoffice/searchcourse.php"
                          target="_blank"
                        >
                          <span className="text-secondary font-semibold hover:text-[#394cc9] hover:underline inline-flex items-center">
                            Reg CMU{" "}
                            <span className="ml-1">
                              <Icon
                                IconComponent={IconExternalLink}
                                className="size-4"
                              />
                            </span>
                          </span>
                        </a>
                      </p>
                    </div>
                    <img
                      style={{
                        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                      className="rounded-md mx-2 mb-1 mt-2"
                      src={exStudentList}
                    />
                  </div>
                </Alert>
                {dropZoneFile()}
              </div>
            </Tabs.Panel>
            {tab === "importStudentList" && (
              <div className="flex justify-end mt-3 sticky w-full">
                <Button
                  onClick={uploadList}
                  loading={loading}
                  leftSection={
                    <Icon
                      IconComponent={IconFileImport}
                      className="size-5 stroke-[2px] stroke-[#ffffff] items-center"
                    />
                  }
                >
                  Import
                </Button>
              </div>
            )}
          </Tabs>
        ) : type == "list" ? (
          studentTable()
        ) : (
          <div className="flex flex-col gap-2 overflow-hidden">
            <div className=" flex-col overflow-y-auto h-full gap-3">
              <Alert
                radius="md"
                variant="light"
                color="red"
                className="mb-3"
                classNames={{
                  body: " flex justify-center",
                }}
                title={
                  <div className="flex items-center  gap-2">
                    <Icon IconComponent={IconExclamationCircle} />
                    <p>
                      Important: Import Student List for Course {data?.courseNo}
                    </p>
                  </div>
                }
              >
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <img
                      src={regcmu}
                      alt="CMULogo"
                      className=" h-[38px] w-[185px] "
                    />
                    <p className="pl-5 text-default leading-6 font-medium ">
                      <span className="font-bold">
                        Before uploading scores for course {data?.courseNo}{" "}
                        {data?.courseName}
                      </span>
                      , <br /> you must import the student list (.xlsx) in this
                      course for all sections from the CMU Registration System.
                      <a
                        href="https://www1.reg.cmu.ac.th/registrationoffice/searchcourse.php"
                        target="_blank"
                      >
                        <span className="text-secondary font-semibold hover:text-[#394cc9] hover:underline inline-flex items-center">
                          Reg CMU
                          <span className="ml-1">
                            <Icon
                              IconComponent={IconExternalLink}
                              className="size-4"
                            />
                          </span>
                        </span>
                      </a>
                    </p>
                  </div>
                  <img
                    style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" }}
                    className="rounded-md mx-2 mb-1 mt-2"
                    src={exStudentList}
                  />
                </div>
              </Alert>
              {dropZoneFile()}
            </div>
            <div className="flex gap-2 justify-end w-full h-fit">
              <Button onClick={onBack} variant="subtle">
                {selectCourse ? "Back" : "Cancel"}
              </Button>
              <Button
                onClick={uploadList}
                loading={loading}
                rightSection={
                  <Icon
                    IconComponent={IconArrowRight}
                    className="size-5 stroke-[#ffffff] stroke-[2px] items-center"
                  />
                }
              >
                Import & Next to Upload
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {(errorStudentId.length || errorSection.length) && (
        <ModalErrorUploadFile
          type="students"
          opened={openModalUploadError}
          onClose={() => setOpenModalUploadError(false)}
          errorStudentId={errorStudentId}
          errorSection={errorSection}
        />
      )}
    </>
  );
}
