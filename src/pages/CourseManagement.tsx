import { useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Button, Checkbox, Group, Menu, Modal, TextInput } from "@mantine/core";
import {
  IconDots,
  IconTrash,
  IconEdit,
  IconPencilMinus,
  IconPlus,
} from "@tabler/icons-react";
import ManageAdminIcon from "@/assets/icons/manageAdmin.svg?react";
import Icon from "@/components/Icon";
import { CourseManagementRequestDTO } from "@/services/courseManagement/dto/courseManagement.dto";
import { getCourseManagement } from "@/services/courseManagement/courseManagement.service";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  COURSE_TYPE,
  NOTI_TYPE,
  POPUP_TYPE,
  SEMESTER,
} from "@/helpers/constants/enum";
import {
  getSectionNo,
  getUserName,
  showNotifications,
} from "@/helpers/functions/function";
import { useDisclosure } from "@mantine/hooks";
import { isNumber } from "lodash";

import {
  validateCourseNameorTopic,
  validateSectionNo,
} from "@/helpers/functions/validation";

import MainPopup from "@/components/Popup/MainPopup";
import { IModelSection } from "@/models/ModelSection";
import {
  IModelCourseManagement,
  IModelSectionManagement,
} from "@/models/ModelCourseManagement";
import { useForm } from "@mantine/form";
import Loading from "@/components/Loading";
import ModalManageIns from "@/components/Modal/CourseManage/ModalManageIns";
import ModalEditCourse from "@/components/Modal/ModalEdit";

export default function CourseManagement() {
  const user = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<any>();
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [courseManagement, setCourseManagement] = useState<
    IModelCourseManagement[]
  >([]);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [editCourse, setEditCourse] = useState<any>();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {} as Partial<IModelSectionManagement>,
    validate: {
      topic: (value) => validateCourseNameorTopic(value, "Topic"),
      sectionNo: (value) => validateSectionNo(value),
      semester: (value) => {
        return value?.length ? null : "Please select semester at least one.";
      },
    },
    validateInputOnBlur: true,
  });

  const [editSectionModal, setEditSectionModal] = useState(false);
  const [
    modalEditSection,
    { open: openModalEditSection, close: closeModalEditSection },
  ] = useDisclosure(false);

  const [openMainPopup, { open: openedMainPopup, close: closeMainPopup }] =
    useDisclosure(false);

  const [
    openMainPopupDelCourse,
    { open: openedMainPopupDelCourse, close: closeMainPopupDelCourse },
  ] = useDisclosure(false);

  const [
    openModalManageInst,
    { open: openedModalManageInst, close: closeModalManageInst },
  ] = useDisclosure(false);

  const [
    openModalEditCourse,
    { open: openedModalEditCourse, close: closeModalEditCourse },
  ] = useDisclosure(false);

  const [delSec, setDelSec] = useState<
    Partial<IModelSection> & Record<string, any>
  >();

  const [delCourse, setDelCourse] = useState<Partial<IModelCourseManagement>>();

  useEffect(() => {
    if (user.departmentCode) {
      const payloadCourse = {
        ...new CourseManagementRequestDTO(),
        departmentCode: user.departmentCode,
        hasMore: true,
      };
      setPayload(payloadCourse);
      fetchCourse(payloadCourse);
    }
  }, [user]);

  const fetchCourse = async (payloadCourse: any) => {
    setLoading(true);
    const res = await getCourseManagement(payloadCourse);
    if (res) {
      setTotalCourses(res.totalCount);
      setCourseManagement(res.courses);
    }
    setLoading(false);
  };

  const onShowMore = async () => {
    const res = await getCourseManagement({
      ...payload,
      page: payload.page + 1,
    });
    if (res) {
      setCourseManagement([...courseManagement, ...res]);
      setPayload({
        ...payload,
        page: payload.page + 1,
        hasMore: res.length >= payload.limit,
      });
    } else {
      setPayload({ ...payload, hasMore: false });
    }
  };

  const onClickSetEditSemester = (checked: boolean, value: number) => {
    const semester: number[] = editCourse.semester;
    if (checked) {
      semester.push(value);
      semester.sort();
    } else {
      semester.splice(semester.indexOf(value), 1);
      semester.sort();
    }
    setEditCourse({ ...editCourse, semester });
  };

  const onClickEditSecNo = (value: string) => {
    if (isNumber(parseInt(value)) || !value.length) {
      console.log(value);

      setEditCourse((prev: any) => ({
        ...prev,
        sectionNo: value,
      }));
    }
  };

  const onClickDeleteCourse = async (id: string) => {
    // const res = await deleteCourse(id);
    // if (res) {
    //   dispatch(removeCourse(res.id));
    // }
    // closeMainPopup();
    // showNotifications(
    //   NOTI_TYPE.SUCCESS,
    //   "Delete Course Success",
    //   `${delSec?.sectionNo} is deleted`
    // );
  };

  const onClickDeleteSec = async (id: string) => {
    // const res = await deleteCourse(id);
    // if (res) {
    //   dispatch(removeCourse(res.id));
    // }
    // closeMainPopup();
    // showNotifications(
    //   NOTI_TYPE.SUCCESS,
    //   "Delete Course Success",
    //   `${delSec?.sectionNo} is deleted`
    // );
  };

  useEffect(() => {
    console.log(form.getValues());
  }, [form]);

  return (
    <>
      <Modal
        opened={modalEditSection && editCourse}
        onClose={closeModalEditSection}
        closeOnClickOutside={false}
        withCloseButton={false}
        title={`Edit section ${
          editCourse ? getSectionNo(editCourse.sectionNo) : ""
        } in ${editCourse ? editCourse.courseNo : ""}`}
        size="35vw"
        centered
        transitionProps={{ transition: "pop" }}
        classNames={{
          content:
            "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center  overflow-hidden ",
        }}
      >
        <div className="flex flex-col gap-5">
          {/* Text Input */}
          {editCourse?.type === COURSE_TYPE.SEL_TOPIC && (
            <TextInput
              label="Topic"
              withAsterisk
              size="xs"
              classNames={{ input: "focus:border-primary" }}
              {...form.getInputProps("topic")}
            />
          )}
          <TextInput
            label="Section"
            withAsterisk
            size="xs"
            maxLength={3}
            classNames={{ input: "focus:border-primary" }}
            value={getSectionNo(form.getValues().sectionNo)}
            {...form.getInputProps("sectionNo")}
          />

          <div
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            className="w-full p-3 bg-white mb-3 rounded-md gap-2 flex flex-col "
          >
            <div className="flex flex-row items-center justify-between">
              <div className="gap-1 flex flex-col">
                <span className="font-semibold text-[13px]">Open Semester</span>
                <Checkbox
                  classNames={{
                    input:
                      "bg-[black] bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                    body: "mr-3  px-0",
                    label: "text-[13px] text-[#615F5F] cursor-pointer",
                  }}
                  color="#5768D5"
                  size="xs"
                  label={`Open in this semester (${
                    academicYear?.semester
                  }/${academicYear?.year.toString()?.slice(-2)})`}
                  checked={
                    form.getValues().isActive &&
                    (form?.getValues().semester as string[]).includes(
                      academicYear.semester.toString()
                    )
                  }
                  {...form.getInputProps("isActive")}
                  // onChange={(event) =>
                  //   setSemesterInSec(index, event.target.checked)
                  // }
                />
              </div>
              <Checkbox.Group
                classNames={{ error: "mt-2" }}
                {...form.getInputProps("semester")}
                value={form.getValues().semester as string[]}
                onChange={(event: any) => {
                  form.setFieldValue("semester", event.sort());
                }}
              >
                <Group className="flex flex-row gap-1 justify-end">
                  {SEMESTER.map((item) => {
                    const semester =
                      (form?.getValues().semester as string[]) ?? [];
                    return (
                      <Checkbox
                        key={item}
                        classNames={{
                          input:
                            "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                          body: "mr-3",
                          label: "text-[14px] cursor-pointer",
                        }}
                        color="#5768D5"
                        size="xs"
                        label={item}
                        value={item.toString()}
                        disabled={
                          semester.length == 1 &&
                          semester.includes(item.toString())
                        }
                      />
                    );
                  })}
                </Group>
              </Checkbox.Group>
            </div>
          </div>
          <div className="flex gap-2 justify-end w-full">
            <Button
              color="#575757"
              variant="subtle"
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
              justify="start"
              onClick={() => {
                setEditSectionModal(false);
                closeModalEditSection();
              }}
            >
              Cancel
            </Button>
            <Button
              color="#5768d5"
              className="rounded-[8px] font-bold text-[12px] h-[32px] w-fit "
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>

      <MainPopup
        opened={openMainPopup}
        onClose={closeMainPopup}
        action={() => onClickDeleteSec(delSec?.id!)}
        type={POPUP_TYPE.DELETE}
        labelButtonRight="Delete section"
        title={`Delete seciton ${getSectionNo(delSec?.sectionNo)} in ${
          delSec?.courseNo
        }?`}
        message={
          <p>
            Deleting this section will permanently remove all data from the
            current semester. Data from previous semesters will not be affected.{" "}
            <br /> <span>Are you sure you want to deleted this section? </span>
          </p>
        }
      />

      <MainPopup
        opened={openMainPopupDelCourse}
        onClose={closeMainPopupDelCourse}
        action={() => onClickDeleteCourse(delCourse?.id!)}
        type={POPUP_TYPE.DELETE}
        labelButtonRight="Delete course"
        title={`Delete ${delCourse?.courseNo} Course?`}
        message={
          <p>
            Deleting this course will permanently remove all data from the
            current semester. Data from previous semesters will not be affected.{" "}
            <br /> <span>Are you sure you want to deleted this course? </span>
          </p>
        }
      />

      <ModalManageIns
        opened={openModalManageInst}
        onClose={closeModalManageInst}
        data={editCourse}
      />

      <ModalEditCourse
        // key={editCourse?.id ?? undefined}
        opened={openModalEditCourse}
        onClose={closeModalEditCourse}
        value={editCourse}
      />

      <div className="bg-[#ffffff] flex flex-col h-full w-full px-6 py-3 gap-[12px] overflow-hidden">
        <div className="flex flex-col  items-start ">
          <p className="text-secondary text-[16px] font-bold">Dashboard</p>
          <p className="text-tertiary text-[14px] font-medium">
            {totalCourses} Courses
          </p>
        </div>
        {/* Course Detail */}
        {loading ? (
          <Loading />
        ) : (
          <InfiniteScroll
            dataLength={courseManagement.length}
            next={onShowMore}
            height={"100%"}
            hasMore={payload?.hasMore}
            className="overflow-y-auto w-full h-fit max-h-full flex flex-col gap-3 "
            style={{ height: "fit-content", maxHeight: "100%" }}
            loader={<Loading />}
          >
            {courseManagement.map((course, index) => (
              <div
                key={index}
                className="bg-[#bfbfff3e] rounded-md flex flex-col py-4 px-5"
              >
                {/* Course Topic */}
                <div className="gap-3 mb-4 flex items-center w-full justify-between">
                  <div className="flex flex-col  w-fit">
                    <p className=" font-bold text-b2 text-secondary">
                      {course.courseNo}
                    </p>
                    <p className="text-b2 font-medium text-[#4E5150] flex-wrap ">
                      {course.courseName}
                    </p>
                  </div>

                  <div className="rounded-full cursor-pointer size-8 hover:bg-gray-300 p-1 ">
                    <Menu trigger="click" position="bottom-end" offset={2}>
                      <Menu.Target>
                        <IconDots className=" rounded-full hover:bg-gray-300" />
                      </Menu.Target>
                      <Menu.Dropdown
                        className="rounded-md backdrop-blur-xl bg-white/70 "
                        style={{
                          boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        <Menu.Item className="text-[#3E3E3E] font-semibold  text-b2  w-[180px]">
                          <div className="flex items-center gap-2">
                            <IconPlus stroke={2} className="h-4 w-4" />
                            <span>Add section</span>
                          </div>
                        </Menu.Item>
                        <Menu.Item className="text-[#3E3E3E] font-semibold  text-b2  w-[180px]">
                          <div
                            onClick={() => {
                              setEditCourse({
                                id: course.id,
                                courseNo: course.courseNo,
                                courseName: course.courseName,
                              });
                              openedModalEditCourse();
                            }}
                            className="flex items-center gap-2"
                          >
                            <IconPencilMinus stroke={1.5} className="h-4 w-4" />
                            <span>Edit course</span>
                          </div>
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => {}}
                          className="text-[#3E3E3E] font-semibold  text-b2  w-[180px]"
                        >
                          <div
                            className="flex items-center gap-2"
                            onClick={() => {
                              setEditCourse({
                                ...course,
                              });
                              openedModalManageInst();
                            }}
                          >
                            <Icon
                              className="h-4 w-4"
                              IconComponent={ManageAdminIcon}
                            />

                            <span>Manage instructor</span>
                          </div>
                        </Menu.Item>
                        <Menu.Item
                          className="text-[#FF4747]  w-[180px] font-semibold text-b2 hover:bg-[#d55757]/10"
                          onClick={() => {
                            setDelCourse({
                              id: course.id,
                              courseNo: course.courseNo,
                            });
                            openedMainPopupDelCourse();
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <IconTrash className="h-4 w-4" stroke={1.5} />
                            <span>Delete course</span>
                          </div>
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </div>
                </div>
                {/* Section */}
                <div className="flex flex-col">
                  {course.sections.map((sec: any) => {
                    const isActive =
                      sec.isActive &&
                      sec.semester.includes(academicYear.semester);
                    return (
                      <div
                        key={sec.sectionNo}
                        className="bg-white grid grid-cols-5 items-center justify-between first:rounded-t-md last:rounded-b-md py-3 border-b-[1px] border-[#eeeeee] px-5"
                      >
                        {/* Section No & Topic */}
                        <div className="flex flex-col ">
                          <p className="font-medium text-[13px] text-tertiary">
                            Section {getSectionNo(sec.sectionNo)}
                          </p>
                          {course.type === COURSE_TYPE.SEL_TOPIC && (
                            <p className="text-[12px] font-normal text-[#4E5150] flex-wrap ">
                              {sec.topic}
                            </p>
                          )}
                        </div>
                        {/* Status */}
                        <div
                          className={`px-3 py-1 w-fit rounded-[20px]  text-[12px] font-medium ${
                            isActive
                              ? "bg-[#10e5908e] text-[#267156]"
                              : "bg-[#919191] text-white"
                          } `}
                        >
                          <p className=" font-semibold ">
                            {isActive ? "Active" : "Inactive"}
                          </p>
                        </div>
                        {/* Main Instructor */}
                        <div className="flex items-center font-medium text-[#4E5150] text-b3">
                          {getUserName(sec.instructor)}
                        </div>
                        {/* Open Symester */}
                        <div className="flex justify-start items-center gap-1 text-[#4E5150] text-b3">
                          <p className="text-wrap font-medium">Open Semester</p>
                          <div className="flex gap-1">
                            {sec.semester.map((term: any, index: number) => (
                              <span key={index} className="text-wrap">
                                {index === 0
                                  ? term
                                  : index === sec.semester.length - 1
                                  ? ` and ${term}`
                                  : `, ${term}`}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Button */}
                        <div className="flex justify-end gap-4 items-center">
                          {/* <div
                            className="bg-transparent border-[1px] border-secondary text-secondary size-8 bg-none rounded-full cursor-pointer hover:bg-secondary/10"
                            onClick={() => {
                              setEditCourse({
                                courseNo: course.courseNo,
                                ...sec,
                              });
                              openedModalManageInst();
                            }}
                          >
                            <Icon IconComponent={ManageAdminIcon} />
                          </div> */}

                          <div
                            onClick={() => {
                              setEditCourse({
                                ...sec,
                                ...course,
                              });
                              form.setValues({
                                ...sec,
                                semester: sec.semester.map((e: any) =>
                                  e.toString()
                                ),
                              });
                              setEditSectionModal(true);
                              openModalEditSection();
                            }}
                            className="flex justify-center items-center bg-transparent border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full  cursor-pointer hover:bg-[#F39D4E]/10"
                          >
                            <IconEdit className="size-4" stroke={1.5} />
                          </div>
                          <div
                            onClick={() => {
                              setDelSec({ ...sec, courseNo: course.courseNo });
                              openedMainPopup();
                            }}
                            className="flex justify-center items-center bg-transparent border-[1px] border-[#FF4747] text-[#FF4747] size-8 bg-none rounded-full  cursor-pointer hover:bg-[#FF4747]/10"
                          >
                            <IconTrash className="size-4" stroke={1.5} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </InfiniteScroll>
        )}
      </div>
    </>
  );
}
