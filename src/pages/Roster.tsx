import { Menu, Modal, Table, TextInput } from "@mantine/core";
import { Alert, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import Iconbin from "@/assets/icons/trash.svg?react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import notFoundImage from "@/assets/image/notFound.jpg";
import Icon from "@/components/Icon";
import IconEdit from "@/assets/icons/edit.svg?react";
import IconImport from "@/assets/icons/fileImport.svg?react";
import IconDots from "@/assets/icons/dots.svg?react";
import IconManageAdmin from "@/assets/icons/addCo.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getSectionNo, getUserName } from "@/helpers/functions/function";
import { useParams, useSearchParams } from "react-router-dom";
import ModalStudentList from "@/components/Modal/ModalStudentList";
import MainPopup from "@/components/Popup/MainPopup";
import { IModelUser } from "@/models/ModelUser";
import Loading from "@/components/Loading/Loading";
import { setLoadingOverlay } from "@/store/loading";
import {
  addStudent,
  deleteStudent,
  updateStudent,
} from "@/services/section/section.service";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import {
  validateEmail,
  validateSectionNo,
  validateStudentId,
  validateThaiLanguage,
} from "@/helpers/functions/validation";
import { useForm } from "@mantine/form";
import { updateStudentList } from "@/store/course";
import { isEqual } from "lodash";
import { setShowSidebar, setShowNavbar, setDashboard } from "@/store/config";

export default function Roster() {
  const { courseNo } = useParams();
  const [params, setParams] = useSearchParams();
  const user = useAppSelector((state) => state.user);
  const loading = useAppSelector((state) => state.loading);
  const activeTerm = useAppSelector((state) =>
    state.academicYear.find(
      (term) =>
        term.year == parseInt(params.get("year") || "") &&
        term.semester == parseInt(params.get("semester") || "")
    )
  )?.isActive;
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<string>("");
  const [actionModal, setActionModal] = useState<"Add" | "Edit" | "">("");
  const [openModalAddEditStudent, setOpenModalAddEditStudent] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    IModelUser & { sectionNo: string }
  >();
  const [openModalUploadStudentList, setOpenModalUploadStudentList] =
    useState(false);
  const [openPopupDeleteStudent, setOpenPopupDeleteStudent] = useState(false);
  const course = useAppSelector((state) =>
    state.course.courses.find((c) => c.courseNo == courseNo)
  );
  const form = useForm({
    mode: "controlled",
    initialValues: { sectionNo: "", studentId: "", name: "", email: "" },
    validate: {
      sectionNo: (value) =>
        validateSectionNo(value) ??
        (value.length &&
          !course?.sections
            .map(({ sectionNo }) => sectionNo)
            .includes(parseInt(value)) &&
          `Section ${getSectionNo(value)} is not exist in this course`),
      studentId: (value) => {
        let exist = course?.sections.find((sec) =>
          sec.students?.find((std) => std.student.studentId == value)
        );
        if (actionModal == "Edit" && selectedUser?.studentId == value) {
          exist = undefined;
        }
        return (
          validateStudentId(value) ??
          (value.length &&
            exist &&
            `student ${value} already exist in section ${exist.sectionNo}`)
        );
      },
      name: (value) => !value.length && "Please enter a student name",
      email: (value) =>
        !value.length
          ? null
          : !validateEmail(value) &&
            "Please enter a valid email address (e.g., example@cmu.ac.th).",
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.INSTRUCTOR));
    localStorage.setItem("dashboard", ROLE.INSTRUCTOR);
  }, []);

  const onClickAddStudent = async () => {
    if (!form.validate().hasErrors) {
      dispatch(setLoadingOverlay(true));
      const data: any = { ...form.getValues() };
      const name = data.name.split(" ");
      if (validateThaiLanguage(data.name)) {
        data.firstNameTH = name[0];
        data.lastNameTH = name[1];
      } else {
        data.firstNameEN = name[0];
        data.lastNameEN = name[1];
      }
      delete data.name;
      const res = await addStudent({
        year: course?.year,
        semester: course?.semester,
        course: course?.id,
        ...data,
        sectionNo: parseInt(data.sectionNo),
      });
      if (res) {
        dispatch(updateStudentList({ id: course?.id, sections: res }));
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "Student Added Successfully",
          `${data.studentId} has been successfully added to to the course roster.`
        );
        clearForm();
      }
      dispatch(setLoadingOverlay(false));
    }
  };

  const onClickDeleteStudent = async () => {
    if (selectedUser) {
      dispatch(setLoadingOverlay(true));
      const res = await deleteStudent({
        year: course?.year,
        semester: course?.semester,
        course: course?.id,
        sectionNo: parseInt(selectedUser.sectionNo),
        student: selectedUser.id,
      });
      if (res) {
        dispatch(updateStudentList({ id: course?.id, sections: res }));
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "Student Deleted Successfully",
          `${selectedUser.studentId} has been successfully deleted from the course roster`
        );
        setOpenPopupDeleteStudent(false);
        setSelectedUser(undefined);
      }
      dispatch(setLoadingOverlay(false));
    }
  };

  const onClickEditStudent = async () => {
    if (selectedUser && !form.validate().hasErrors) {
      dispatch(setLoadingOverlay(true));
      const data: any = { ...form.getValues() };
      if (!selectedUser.termsOfService) {
        const name = data.name.split(" ");
        if (validateThaiLanguage(data.name)) {
          data.firstNameTH = name[0];
          data.lastNameTH = name[1];
        } else {
          data.firstNameEN = name[0];
          data.lastNameEN = name[1];
        }
      } else {
        delete data.studentId;
        delete data.email;
      }
      delete data.name;
      const res = await updateStudent({
        year: course?.year,
        semester: course?.semester,
        course: course?.id,
        oldSectionNo: parseInt(selectedUser.sectionNo),
        ...data,
        sectionNo: parseInt(form.getValues().sectionNo),
        student: selectedUser.id,
      });
      if (res) {
        dispatch(updateStudentList({ id: course?.id, sections: res }));
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "Student Edited Successfully",
          `${selectedUser?.studentId} has been successfully updated`
        );
        setOpenModalAddEditStudent(false);
        setSelectedUser(undefined);
      }
      dispatch(setLoadingOverlay(false));
    }
  };

  const clearForm = () => {
    setOpenModalAddEditStudent(false);
    form.reset();
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
          className="font-medium text-default text-b3 acerSwift:max-macair133:!text-b4"
          key={student.studentId}
        >
          <Table.Td>{getSectionNo(sec.sectionNo)}</Table.Td>
          <Table.Td>{student.studentId}</Table.Td>
          <Table.Td>{getUserName(student, 3)}</Table.Td>
          <Table.Td>{student.email ? student.email : "Not login yet"}</Table.Td>
          {activeTerm && user.role != ROLE.TA && (
            <Table.Td>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setActionModal("Edit");
                    setSelectedUser({
                      sectionNo: getSectionNo(sec.sectionNo),
                      ...student,
                    });
                    form.setValues({
                      sectionNo: getSectionNo(sec.sectionNo),
                      name: getUserName(student, 3),
                      studentId: student.studentId,
                      email: student.email,
                    });
                    setOpenModalAddEditStudent(true);
                  }}
                  color="yellow"
                  className="tag-tqf !px-3 !rounded-full text-center"
                >
                  <Icon
                    className="size-5 acerSwift:max-macair133:size-4"
                    IconComponent={IconEdit}
                  />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedUser({
                      sectionNo: getSectionNo(sec.sectionNo),
                      ...student,
                    });
                    setOpenPopupDeleteStudent(true);
                  }}
                  color="red"
                  className="tag-tqf !px-3 !rounded-full text-center"
                >
                  <Icon
                    className="size-5 acerSwift:max-macair133:size-4"
                    IconComponent={Iconbin}
                  />
                </Button>
              </div>
            </Table.Td>
          )}
        </Table.Tr>
      ))
  );

  const studentTable = () => {
    const hasData = rows && rows.flat().length > 0;
    const search = filter.length > 0;
    return (
      <>
        {(hasData || search) && (
          <div className=" px-1 mb-2 flex items-center justify-between">
            <p className="  text-secondary font-semibold acerSwift:max-macair133:!text-b2">
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
              {activeTerm && user.role != ROLE.TA && (
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
                        className=" text-default font-semibold text-b4 acerSwift:max-macair133:!text-b5 h-7 "
                        onClick={() => {
                          setActionModal("Add");
                          setOpenModalAddEditStudent(true);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Icon
                            className="size-4"
                            IconComponent={IconManageAdmin}
                          />
                          <span>Add student</span>
                        </div>
                      </Menu.Item>

                      <Menu.Item
                        className="text-default font-semibold text-b4 acerSwift:max-macair133:!text-b5 h-7"
                        onClick={() => setOpenModalUploadStudentList(true)}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="size-4" IconComponent={IconImport} />
                          <span>Import new Course Roster</span>
                        </div>
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </div>
              )}
            </div>
          </div>
        )}
        <div
          style={{
            boxShadow: hasData ? "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" : "none",
          }}
          className="mx-1 mt-3 max-h-screen sm:max-ipad11:max-h-[400px] h-fit flex flex-col bg-white mb-1 rounded-md overflow-y-auto acerSwift:max-macair133:!text-b4"
        >
          {hasData ? (
            <Table stickyHeader striped>
              <Table.Thead>
                <Table.Tr className="bg-[#e5e7f6]">
                  <Table.Th className="w-[10%] acerSwift:max-macair133:!text-b3">
                    Section
                  </Table.Th>
                  <Table.Th className="w-[17%] acerSwift:max-macair133:!text-b3">
                    Student ID
                  </Table.Th>
                  <Table.Th className="w-[20%] acerSwift:max-macair133:!text-b3">
                    Name
                  </Table.Th>
                  <Table.Th className="w-[25%] acerSwift:max-macair133:!text-b3">
                    CMU account
                  </Table.Th>
                  {activeTerm && user.role != ROLE.TA && (
                    <Table.Th className="w-[10%] acerSwift:max-macair133:!text-b3">
                      Action
                    </Table.Th>
                  )}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          ) : (
            <div className="flex items-center !h-screen  justify-between px-10 !w-full">
              <p className="text-start font-semibold text-[20px] text-secondary px-6 -translate-y-1 py-10">
                {search
                  ? `No results for "${filter}"`
                  : "No Course Roster found"}
                <br />
                <p className="mt-1 text-[#333333] font-medium text-b2">
                  {search
                    ? "Check the spelling or try a new search."
                    : "Course Roster will show when you import first."}
                </p>
                {!search && activeTerm && (
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
                )}
              </p>

              <div className="h-full  w-[24vw] m-6 justify-center -translate-y-1 flex flex-col">
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
              <p className="text-b4  text-[#808080]">Section</p>
              <p className="-translate-y-[2px] text-b1 mb-2">
                {getSectionNo(selectedUser?.sectionNo)}
              </p>
              <p className="text-b4  text-[#808080]">Student ID</p>
              <p className="-translate-y-[2px] text-b1 mb-2">
                {selectedUser?.studentId}
              </p>
              <p className="text-b4  text-[#808080]">Student Name</p>

              <p className="-translate-y-[2px] text-b1">
                {getUserName(selectedUser!, 3)}
              </p>
            </div>
          </>
        }
        labelButtonRight="Delete Student"
        action={onClickDeleteStudent}
      />
      <ModalStudentList
        type="replace"
        data={course!}
        opened={openModalUploadStudentList}
        onClose={() => setOpenModalUploadStudentList(false)}
        selectCourse={false}
        onBack={() => setOpenModalUploadStudentList(false)}
      />

      {/* Modal Add/Edit Student */}
      <Modal
        opened={openModalAddEditStudent}
        closeOnEscape={false}
        onClose={clearForm}
        size="35vw"
        title={`${actionModal} Student ${
          actionModal == "Add" ? courseNo : selectedUser?.studentId
        }`}
        centered
        transitionProps={{ transition: "pop" }}
        closeOnClickOutside={false}
        classNames={{
          content: "flex flex-col overflow-hidden !pb-1 max-h-full h-fit",
          body: "flex flex-col overflow-hidden h-fit",
          title: "acerSwift:max-macair133:!text-b1",
        }}
      >
        {actionModal == "Edit" && selectedUser?.termsOfService && (
          <Alert
            radius="md"
            variant="light"
            color="blue"
            classNames={{
              body: " flex justify-center",
            }}
            title={
              <div className="flex items-center gap-2">
                <Icon
                  IconComponent={IconInfo2}
                  className="acerSwift:max-macair133:!size-5"
                />
                <p className="acerSwift:max-macair133:!text-b3">
                  You can only edit section for the student who is currently
                  logged into ScoreOBE +.
                </p>
              </div>
            }
            className="mb-3"
          ></Alert>
        )}
        <div className="flex flex-col gap-3">
          <TextInput
            size="xs"
            placeholder="e.g. 1 or 001"
            label="Section No."
            classNames={{
              input: "focus:border-primary acerSwift:max-macair133:!text-b4",
              label: "acerSwift:max-macair133:!text-b4",
            }}
            withAsterisk
            {...form.getInputProps("sectionNo")}
          ></TextInput>
          <TextInput
            size="xs"
            placeholder="9 Digits e.g. 640123456"
            label="Student ID"
            classNames={{
              input: "focus:border-primary acerSwift:max-macair133:!text-b4",
              label: "acerSwift:max-macair133:!text-b4",
            }}
            withAsterisk
            disabled={actionModal == "Edit" && selectedUser?.termsOfService}
            {...form.getInputProps("studentId")}
          ></TextInput>
          <TextInput
            size="xs"
            placeholder="e.g. สมชาย เรียนดี"
            label="Name"
            withAsterisk
            classNames={{
              input: "focus:border-primary acerSwift:max-macair133:!text-b4",
              label: "acerSwift:max-macair133:!text-b4",
            }}
            disabled={actionModal == "Edit" && selectedUser?.termsOfService}
            {...form.getInputProps("name")}
          ></TextInput>
          <TextInput
            size="xs"
            placeholder="e.g. example@cmu.ac.th"
            label="CMU account"
            id="email"
            classNames={{
              input: "focus:border-primary acerSwift:max-macair133:!text-b4",
              label: "acerSwift:max-macair133:!text-b4",
            }}
            disabled={actionModal == "Edit" && selectedUser?.termsOfService}
            {...form.getInputProps("email")}
          ></TextInput>
          <div className="flex gap-2 items-end mt-3 justify-end h-fit acerSwift:max-macair133:mt-1">
            <Button
              onClick={() => clearForm()}
              variant="subtle"
              className="acerSwift:max-macair133:!text-b5"
            >
              Cancel
            </Button>
            <Button
              onClick={
                actionModal == "Add" ? onClickAddStudent : onClickEditStudent
              }
              disabled={
                actionModal == "Edit" &&
                selectedUser &&
                isEqual(
                  {
                    ...form.getValues(),
                    sectionNo: parseInt(form.getValues().sectionNo),
                  },
                  {
                    sectionNo: parseInt(selectedUser.sectionNo),
                    name: getUserName(selectedUser, 3),
                    studentId: selectedUser.studentId,
                    email: selectedUser.email,
                  }
                )
              }
              className="acerSwift:max-macair133:!text-b5"
            >
              {actionModal == "Add" ? "Add" : "Save"}
            </Button>
          </div>
        </div>
      </Modal>
      {loading.loading ? <Loading /> : studentTable()}
    </div>
  );
}
