import { Menu, Modal, Table, TextInput } from "@mantine/core";
import { Alert, Button } from "@mantine/core";
import { useState } from "react";
import { TbSearch } from "react-icons/tb";
import Iconbin from "@/assets/icons/trash.svg?react";
import notFoundImage from "@/assets/image/notFound.jpg";
import Icon from "@/components/Icon";
import IconImport from "@/assets/icons/fileImport.svg?react";
import IconDots from "@/assets/icons/dots.svg?react";
import IconManageAdmin from "@/assets/icons/addCo.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import { useAppSelector } from "@/store";
import { getSectionNo, getUserName } from "@/helpers/functions/function";
import { useParams } from "react-router-dom";
import ModalStudentList from "@/components/Modal/ModalStudentList";
import MainPopup from "@/components/Popup/MainPopup";
import { IModelUser } from "@/models/ModelUser";

export default function Roster() {
  const { courseNo } = useParams();
  const [filter, setFilter] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<IModelUser | null>(null);
  const [openModalAddStudent, setOpenModalAddStudent] = useState(false);
  const [openModalUploadStudentList, setOpenModalUploadStudentList] =
    useState(false);
  const [openPopupDeleteStudent, setOpenPopupDeleteStudent] = useState(false);
  const course = useAppSelector((state) =>
    state.course.courses.find((c) => c.courseNo == courseNo)
  );

  const onClickDeleteTopic = () => {
    console.log("hello");
  };

  const [sectionNo, setSectionNo] = useState("");
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [cmuAccount, setCmuAccount] = useState("");

  const allRequiredFieldsFilled = sectionNo && studentId && name;

  const clearForm = () => {
    setSectionNo("");
    setStudentId("");
    setName("");
    setCmuAccount("");
    setOpenModalAddStudent(false);
  };

  const handleSectionNoChange = (e:any) => {
    const value = e.target.value;
    if (/^\d{0,3}$/.test(value)) { 
      setSectionNo(value);
    }
  };

  const handleStudentIDNoChange = (e:any) => {
    const value = e.target.value;
    if (/^\d{0,9}$/.test(value)) { 
      setStudentId(value);
    }
  };

  const rows = course?.sections?.map((sec) =>
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
          <Table.Td>{getSectionNo(sec.sectionNo)}</Table.Td>
          <Table.Td>{student.studentId}</Table.Td>
          <Table.Td>{getUserName(student, 3)}</Table.Td>
          <Table.Td>{student.email ? student.email : "Not login yet"}</Table.Td>
          <Table.Td>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedUser(student);
                setOpenPopupDeleteStudent(true);
              }}
              color="red"
              className="tag-tqf !px-3 !rounded-full text-center"
            >
              <Icon className="size-5" IconComponent={Iconbin} />
            </Button>
          </Table.Td>
        </Table.Tr>
      ))
  );

  const studentTable = () => {
    const hasData = rows && rows.flat().length > 0;
    return (
      <>
        {hasData && (
          <div className=" px-1 flex items-center justify-between">
            <p className="  text-secondary font-semibold">
              {(() => {
                const totalStudents = course?.sections.reduce(
                  (total, sec) => total + (sec.students?.length || 0),
                  0
                );

                return `${totalStudents} ${
                  totalStudents === 1 ? "Student" : "Students"
                }`;
              })()}
            </p>
            <div className="flex gap-3 items-center">
              <TextInput
                leftSection={<TbSearch />}
                placeholder="Section No, Student No, Name"
                size="xs"
                rightSectionPointerEvents="all"
                className="mx-1 w-[25vw] "
                onChange={(event) => setFilter(event.currentTarget.value)}
              ></TextInput>
              <div className="rounded-full hover:bg-gray-300 p-1 cursor-pointer">
                <Menu trigger="click" position="bottom-end">
                  <Menu.Target>
                    <div>
                      <Icon IconComponent={IconDots} />
                    </div>
                  </Menu.Target>
                  <Menu.Dropdown
                    className="rounded-md translate-y-1 backdrop-blur-xl bg-white "
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <Menu.Item
                      className=" text-[#3e3e3e] font-semibold text-[12px] h-7 "
                      onClick={() => setOpenModalAddStudent(true)}
                      // onClick={() => {
                      //   setAddSec({ ...course });
                      //   setOpenModalAddSec(true);
                      // }}
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          className="size-4"
                          IconComponent={IconManageAdmin}
                        />
                        <span>Add student</span>
                      </div>
                    </Menu.Item>

                    <Menu.Item className="text-[#3e3e3e] font-semibold text-[12px] h-7 ">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4" IconComponent={IconImport} />
                        <span>Import new Course Roster</span>
                      </div>
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
            </div>
          </div>
        )}
        <div
          style={{
            boxShadow: hasData ? "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" : "none",
          }}
          className="mx-1 mt-3 max-h-screen sm:max-ipad11:max-h-[400px] h-fit flex flex-col bg-white mb-1 rounded-md overflow-y-auto"
        >
          {hasData ? (
            <Table stickyHeader striped>
              <Table.Thead>
                <Table.Tr className="bg-[#e5e7f6]">
                  <Table.Th className="w-[10%]">Section</Table.Th>
                  <Table.Th className="w-[17%]">Student ID</Table.Th>
                  <Table.Th className="w-[25%]">Name</Table.Th>
                  <Table.Th className="w-[25%]">CMU Account</Table.Th>
                  <Table.Th className="w-[10%]">Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          ) : (
            <div className="flex items-center !h-screen  justify-between px-8 !w-full">
              <p className="text-start font-semibold text-[20px] text-secondary p-6 py-10">
                No Course Roster found
                <br />
                <p className="mt-1  text-[#333333] font-medium text-b2" font->
                  {" "}
                  Course Roster will show when you import first.
                </p>
                <Button
                  leftSection={
                    <Icon className="size-5" IconComponent={IconImport} />
                  }
                  variant="filled"
                  onClick={() => setOpenModalUploadStudentList(true)}
                  className=" font-bold mt-5"
                >
                  Import Course Roster
                </Button>
              </p>

              <div className="h-full  w-[20vw] justify-center flex flex-col">
                <img src={notFoundImage} alt="notFound"></img>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className=" flex flex-col p-5 h-full w-full overflow-hidden">
      <MainPopup
        opened={openPopupDeleteStudent}
        onClose={() => setOpenPopupDeleteStudent(false)}
        type="delete"
        title={`Delete Student ${course?.courseNo}`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title={
                <p>
                  This action cannot be undone. After you delete this Student,{" "}
                  <br /> it will be permanently deleted from this course.
                </p>
              }
              icon={
                <Icon
                  IconComponent={IconExclamationCircle}
                  className="size-6"
                />
              }
            ></Alert>
            <div className="flex flex-col mt-3 ">
              <p className="text-b3  text-[#808080]">Section</p>
              <p className="-translate-y-[2px] text-b1 mb-2">idk</p>
              <p className="text-b3  text-[#808080]">Student ID</p>
              <p className="-translate-y-[2px] text-b1 mb-2">
                {selectedUser?.studentId}
              </p>
              <p className="text-b3  text-[#808080]">Student Name</p>

              <p className="-translate-y-[2px] text-b1">
                {getUserName(selectedUser!, 3)}
              </p>
            </div>
          </>
        }
        labelButtonRight="Delete Student"
        action={onClickDeleteTopic}
      />
      <ModalStudentList
        type="import"
        data={course!}
        opened={openModalUploadStudentList}
        onClose={() => setOpenModalUploadStudentList(false)}
      />
      <Modal
        opened={openModalAddStudent}
        onClose={clearForm}
        size="45vw"
        title={`Add Student ${courseNo}`}
        centered
        transitionProps={{ transition: "pop" }}
        closeOnClickOutside={false}
        classNames={{
          content: "flex flex-col overflow-hidden !pb-1 max-h-full h-fit",
          body: "flex flex-col overflow-hidden h-fit",
        }}
      >
        <div className="flex flex-col gap-3">
          <TextInput
            size="xs"
            placeholder="e.g. 1 or 001"
            label="Section No."
            value={sectionNo}
            onChange={handleSectionNoChange}
            withAsterisk
          ></TextInput>
          <TextInput
            size="xs"
            placeholder="9 Digits e.g. 640123456"
            label="Student ID"
            value={studentId}
            onChange={handleStudentIDNoChange}
            withAsterisk
          ></TextInput>
          <TextInput
            size="xs"
            placeholder="e.g. สมชาย เรียนดี"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            withAsterisk
          ></TextInput>
          <TextInput
            size="xs"
            placeholder="e.g. example@cmu.ac.th"
            label="CMU Account"
            value={cmuAccount}
            onChange={(e) => setCmuAccount(e.target.value)}
          ></TextInput>
          <div className="flex gap-2 sm:max-macair133:fixed sm:max-macair133:bottom-6 sm:max-macair133:right-8 mt-4  items-end  justify-end h-fit">
            <Button onClick={() => clearForm()} variant="subtle">
              Cancel
            </Button>
            <Button disabled={!allRequiredFieldsFilled}>Add</Button>
          </div>
        </div>
      </Modal>
      {studentTable()}
    </div>
  );
}
