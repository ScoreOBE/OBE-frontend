import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Group, rem, Table, Tabs, TextInput, Tooltip } from "@mantine/core";
import { Alert, Button, Modal } from "@mantine/core";
import {
  IconArrowRight,
  IconExclamationCircle,
  IconFileImport,
  IconInfoCircle,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { IModelCourse } from "@/models/ModelCourse";
import regcmu from "@/assets/image/regCMULogo.png";
import exStudentList from "@/assets/image/exStudentList.png";
import { useState } from "react";
import { TbSearch } from "react-icons/tb";
type modalType = 'import' | 'studentList'
type Props = {
  opened: boolean;
  onClose: () => void;
  data: Partial<IModelCourse>;
  type: modalType;
};

export default function ModalStudentList({ opened, onClose, data, type }: Props) {
  const [tab, setTab] = useState<string | null>("importStudentList");
  const studentData = [
    {
      no: 1,
      seclec: "003",
      seclab: "000",
      studentNo: 630610720,
      name: "Khomsan Suangkaew",
    },
    {
      no: 2,
      seclec: "003",
      seclab: "000",
      studentNo: 640610627,
      name: "Thidayu Peaungtham",
    },
    {
      no: 3,
      seclec: "003",
      seclab: "000",
      studentNo: 640610629,
      name: "Natacha Rungbanpant ",
    },

    {
      no: 4,
      seclec: "003",
      seclab: "000",
      studentNo: 640610638,
      name: "Thanaporn Chanchanayothin",
    },
    {
      no: 5,
      seclec: "003",
      seclab: "000",
      studentNo: 640610643,
      name: "Teerit Youngmeesuk",
    },
    {
      no: 6,
      seclec: "003",
      seclab: "000",
      studentNo: 640610651,
      name: "Piyaphat Khaosaeng",
    },
    {
      no: 7,
      seclec: "003",
      seclab: "000",
      studentNo: 640610657,
      name: "Patrasorn Khantipong",
    },
    {
      no: 8,
      seclec: "003",
      seclab: "000",
      studentNo: 640610665,
      name: "Raiwin Inthasit",
    },
    {
      no: 9,
      seclec: "003",
      seclab: "000",
      studentNo: 640610666,
      name: "Worapitcha Muangyot",
    },
    {
      no: 10,
      seclec: "003",
      seclab: "000",
      studentNo: 640610672,
      name: "Sawit Charuekpoonpol",
    },
    {
      no: 11,
      seclec: "003",
      seclab: "000",
      studentNo: 640610673,
      name: "Surabordin Ngaosai",
    },
    {
      no: 12,
      seclec: "003",
      seclab: "000",
      studentNo: 640610674,
      name: "Atipat Daowraeng",
    },
    {
      no: 13,
      seclec: "003",
      seclab: "000",
      studentNo: 640610675,
      name: "Haris Saema",
    },
  ];
  const rows = studentData.map((element) => (
    <Table.Tr
      className="font-medium text-default text-[13px]"
      key={element.studentNo}
    >
      <Table.Td>{element.no}</Table.Td>
      <Table.Td>{element.seclec}</Table.Td>
      <Table.Td>{element.seclab}</Table.Td>
      <Table.Td>{element.studentNo}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
    </Table.Tr>
  ));

  const studentTable = () => {
    return (
      <>
        <TextInput
          leftSection={<TbSearch />}
          placeholder="Section No, Student No, Name"
          size="xs"
          rightSectionPointerEvents="all"
          className="mx-1 mb-1 mt-1"
        ></TextInput>
        <div
          className=" mx-1 max-h-[500px] h-fit  flex flex-col bg-white mb-1  mt-2 rounded-md overflow-y-auto"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* <Table.ScrollContainer className="!max-h-[400px] " minWidth={500}> */}
          <Table stickyHeader striped>
            <Table.Thead>
              <Table.Tr className="bg-[#e5e7f6]">
                <Table.Th className=" w-[5%]">No.</Table.Th>
                <Table.Th className=" w-[10%]">SECLEC</Table.Th>
                <Table.Th className=" w-[10%]">SECLAB</Table.Th>
                <Table.Th className=" w-[15%]">Student No.</Table.Th>
                <Table.Th className=" w-[60%]">Name</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
          {/* </Table.ScrollContainer> */}
        </div>
      </>
    );
  };

  return (
    <>
      {/* Main Modal */}
      <Modal
        title={
          <div className="flex flex-col gap-2">
            <p>Import Student list</p>
            <p className=" text-[12px] text-noData">
              {data?.courseNo} - {data?.courseName}
            </p>

            <p className=" text-[12px] text-noData">
              Section 003 - IT Infra and Cloud Tech
            </p>
          </div>
        }
        size="65vw"
        opened={opened}
        onClose={onClose}
        centered
        transitionProps={{ transition: "pop" }}
        closeOnClickOutside={false}
        classNames={{
          content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
          body: "flex  flex-col  overflow-hidden  h-fit",
        }}
      >
        { type == 'import' ? <Tabs
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
            className="flex-col overflow-auto "
            value="importStudentList"
          >
            <div className=" overflow-y-auto flex flex-col  h-full gap-3">
              <Alert
                radius="md"
                variant="light"
                color="blue"
                classNames={{
                  body: " flex justify-center",
                }}
                title={
                  <div className="flex items-center  gap-2">
                    <IconInfoCircle />
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
                      ou must import the student list (.xlsx) in this course for
                      all sections from <br /> the CMU Registration System.
                      <a
                        href="https://www1.reg.cmu.ac.th/registrationoffice/searchcourse.php"
                        target="_blank"
                      >
                        {" "}
                        <span className="text-secondary font-semibold hover:text-[#394cc9] underline">
                          Click here to go to Reg CMU
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
              <Dropzone
                onDrop={(files) => console.log("accepted files", files)}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={5 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
                className="  border-[#8f9ae37f] hover:bg-gray-100 border-dashed bg-gray-50 cursor-pointer border-[2px] rounded-md"
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={220}
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <IconUpload
                      style={{
                        width: rem(52),
                        height: rem(52),
                        color: "var(--mantine-color-blue-6)",
                      }}
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      style={{
                        width: rem(52),
                        height: rem(52),
                        color: "var(--mantine-color-red-6)",
                      }}
                      stroke={1.5}
                    />
                  </Dropzone.Reject>

                  <div className=" flex flex-col gap-3 justify-center items-center">
                    <IconUpload
                      color="#5768d5"
                      stroke={1.5}
                      className=" bg-[#DDE0FF] hover:bg-[#cfd2f8] size-16 p-3 rounded-full"
                    />
                    <p className="font-semibold text-b2 text-default">
                      <span className="text-secondary underline">
                        {" "}
                        Click to import
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="-mt-2 font-medium items-center justify-center text-center text-secondary text-b3">
                      XLSX format only (up to 10MB)
                    </p>
                    <div className="flex flex-col text-b3 font-medium  text-red-500  items-center text-center justify-center">
                      <div className="flex gap-2 items-center justify-center">
                        <IconExclamationCircle color="red" className="size-4" />
                        <p>
                          Supports only Student List ({data?.courseNo}) template
                        </p>
                      </div>
                      <p>from CMU Registration (Reg CMU)</p>
                    </div>
                  </div>
                </Group>
              </Dropzone>
            </div>
          </Tabs.Panel>
          {tab === "importStudentList" && (
            <div className="flex justify-end mt-3 sticky w-full">
              <Button
                leftSection={
                  <IconFileImport
                    color="#ffffff"
                    className="size-5 items-center"
                    stroke={2}
                    size={20}
                  />
                }
              >
                Import
              </Button>
            </div>
          )}
        </Tabs> : studentTable()  }
      </Modal>
    </>
  );
}
