import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  Group,
  Menu,
  Modal,
  Skeleton,
  Switch,
  TextInput,
} from "@mantine/core";
import { IconDots, IconTrash, IconEdit } from "@tabler/icons-react";
import ManageAdminIcon from "@/assets/icons/manageAdmin.svg?react";
import Icon from "@/components/Icon";
import { CourseManagementRequestDTO } from "@/services/courseManagement/dto/courseManagement.dto";
import {
  deleteCourse,
  getCourseManagement,
} from "@/services/courseManagement/courseManagement.service";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  COURSE_TYPE,
  NOTI_TYPE,
  POPUP_TYPE,
  SEMESTER,
} from "@/helpers/constants/enum";
import {
  getSection,
  getUserName,
  showNotifications,
} from "@/helpers/functions/function";
import { useDisclosure } from "@mantine/hooks";
import { isNumber } from "lodash";
import { containsOnlyNumbers } from "@/helpers/functions/validation";
import ComproMangementIns from "@/components/ComproManageIns";
import MainPopup from "@/components/Popup/MainPopup";
import course, { removeCourse } from "@/store/course";
import { IModelSection } from "@/models/ModelSection";

export default function CourseManagement() {
  const user = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<any>();
  const [courseManagement, setCourseManagement] = useState<any[]>([]);
  const [editCourse, setEditCourse] = useState<any>();
  const [editSectionNo, setEditSectionNo] = useState<any>();
  const [editSectionModal, setEditSectionModal] = useState(false);
  const [editInstructorModal, setEditInstructorModal] = useState(false);
  const [
    modalEditSection,
    { open: openModalEditSection, close: closeModalEditSection },
  ] = useDisclosure(false);
  const [
    modalEditInstructor,
    { open: openModalEditInstructor, close: closeModalEditInstructor },
  ] = useDisclosure(false);
  const dispatch = useAppDispatch();
  const validateCourseNameorTopic = (value?: string) => {
    const maxLength = 70;
    if (!value) return `Topic is required`;
    if (!value.trim().length) return "Cannot have only spaces";
    if (value.length > maxLength)
      return `You have ${value.length - 70} characters too many`;
    const isValid = /^[0-9A-Za-z "%&()*+,-./<=>?@[\]\\^_]+$/.test(value);
    return isValid
      ? null
      : `only contain 0-9, a-z, A-Z, space, "%&()*+,-./<=>?@[]\\^_`;
  };
  const [openMainPopup, { open: openedMainPopup, close: closeMainPopup }] =
    useDisclosure(false);
  const [delSec, setdelSec] = useState<Partial<IModelSection>>();
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
      setCourseManagement(res);
    }
    setLoading(false);
  };

  const onShowMore = async () => {
    const res = await getCourseManagement({
      ...payload,
      page: payload.page + 1,
    });
    if (res.length) {
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
    const res = await deleteCourse(id);
    if (res) {
      dispatch(removeCourse(res.id));
    }
    closeMainPopup();
    showNotifications(
      NOTI_TYPE.SUCCESS,
      "Delete Course Success",
      `${delSec?.sectionNo} is deleted`
    );
  };

  return (
    <>
      <Modal
        opened={modalEditSection && editCourse}
        onClose={closeModalEditSection}
        closeOnClickOutside={false}
        title={`Edit section ${
          editCourse ? getSection(editCourse.sectionNo) : ""
        } in ${editCourse ? editCourse.courseNo : ""}`}
        size="30vw"
        centered
        transitionProps={{ transition: "pop" }}
        classNames={{
          content:
            "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center  overflow-hidden ",
        }}
      >
        {" "}
        <div className="flex flex-col gap-5">
          {/* Text Input */}
          {editCourse?.type === COURSE_TYPE.SEL_TOPIC && (
            <TextInput
              classNames={{ input: "focus:border-primary" }}
              label="Topic"
              size="xs"
              value={editCourse ? editCourse.topic : ""}
              withAsterisk
              onChange={(e) => {
                const updatedCourseTopic = e.target.value;
                setEditCourse((editCourse: any) => ({
                  ...editCourse,
                  topic: updatedCourseTopic,
                }));
              }}
            />
          )}
          <TextInput
            classNames={{ input: "focus:border-primary" }}
            label="Section"
            size="sm"
            value={editCourse ? getSection(editCourse.sectionNo) : ""}
            withAsterisk
            maxLength={3}
            onChange={(e) => {
              const updatedSectionNo = e.target.value;
              setEditCourse((editCourse: any) => ({
                ...editCourse,
                sectionNo: updatedSectionNo,
              }));
            }}
          />
          {/* Open in */}
          <div
            className="flex justify-between items-center rounded-lg p-3  gap-1 bg-white"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <span className="text-[#3E3E3E] font-semibold">
              Open in Semester 3/66
            </span>
            <Switch
              color="#5768d5"
              size="lg"
              onLabel="ON"
              offLabel="OFF"
              checked={editCourse?.isActive}
              onChange={() => {
                setEditCourse(!editCourse?.isActive);
              }}
            />
          </div>

          {/* Open Semester */}
          <div
            className="flex justify-between items-center rounded-lg p-4 mb-3  bg-white"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <span className="text-[#3E3E3E] font-semibold">Open Semester</span>
            <Checkbox.Group
              classNames={{ error: "mt-2" }}
              className="flex items-center   justify-center"
              value={editCourse?.semester}
            >
              <Group className="flex flex-row gap-1 items-center justify-center ">
                {SEMESTER.map((item) => {
                  return (
                    <Checkbox
                      key={item}
                      classNames={{
                        input:
                          "bg-black bg-opacity-0 border-[1.5px]  border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                        label: "text-[14px] cursor-pointer",
                      }}
                      disabled={
                        editCourse?.semester.length == 1 &&
                        editCourse?.semester.includes(item)
                      }
                      color="#5768D5"
                      size="xs"
                      label={item}
                      value={item}
                      onChange={(event) => {
                        onClickSetEditSemester(event.target.checked, item);
                      }}
                    />
                  );
                })}
              </Group>
            </Checkbox.Group>
          </div>

          <div className="flex gap-2 justify-end w-full">
            <Button
              color="#575757"
              variant="subtle"
              className="rounded-[8px] text-[12px]   h-[36px] "
              justify="start"
              onClick={() => {
                setEditSectionModal(false);
                closeModalEditSection;
              }}
            >
              Cancel
            </Button>
            <Button
              color="#5768d5"
              className="rounded-[8px] text-[12px] font-bold h-[36px] w-fit"
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>

      <MainPopup
        opened={openMainPopup}
        onClose={closeMainPopup}
        action={() => onClickDeleteCourse(delSec?.id!)}
        type={POPUP_TYPE.DELETE}
        title={`Delete ${getSection(delSec?.sectionNo)} in Course ไม่รู้ทำไง`}
        message={
          <p>
            All data form the current semester for this course will be
            permanently deleted. Data from previous semesters will not be
            affected. <br />{" "}
            <span>Are you sure you want to deleted this course? </span>
          </p>
        }
      />

      <div className="bg-[#ffffff] flex flex-col h-full w-full px-6 py-5 gap-3 overflow-hidden">
        <div className="flex flex-col  py-1 gap-1 items-start ">
          <p className="text-secondary text-[16px] font-bold">Dashboard</p>
          <p className="text-tertiary text-[14px] font-medium">XX Courses</p>
        </div>
        {/* Course Detail */}
        {loading ? (
          <Skeleton></Skeleton>
        ) : (
          <InfiniteScroll
            dataLength={courseManagement.length}
            next={onShowMore}
            height={"100%"}
            loader={
              <l-tailspin
                size="40"
                stroke="5"
                speed="0.9"
                color="black"
              ></l-tailspin>
            }
            hasMore={payload?.hasMore}
            className="overflow-y-auto w-full h-fit max-h-full flex flex-col gap-4 "
            style={{ height: "fit-content", maxHeight: "100%" }}
          >
            {courseManagement.map((course, index) => (
              <div
                key={index}
                className="bg-[#eff0fd] rounded-md flex flex-col  p-5 "
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

                  <div className="rounded-full hover:bg-gray-300 p-1 cursor-pointer">
                    <IconDots />
                  </div>
                </div>
                {/* Section */}
                <div className="flex flex-col ">
                  {course.sections.map((sec: any) => (
                    <div className="bg-white flex flex-col first:rounded-t-md last:rounded-b-md py-4 border-b-[1px] border-[#eeeeee]  px-5 ">
                      <div className="gap-3 flex items-center justify-between ">
                        <div className="flex flex-row items-center w-fit gap-6">
                          <div className="flex flex-col w-56">
                            <p className="font-semibold text-[14px] text-tertiary">
                              Section {getSection(sec.sectionNo)}
                            </p>
                            {course.type === COURSE_TYPE.SEL_TOPIC && (
                              <p className="text-[12px] font-normal text-[#4E5150] flex-wrap ">
                                {sec.topic}
                              </p>
                            )}
                          </div>

                          <div
                            className={`px-3 py-1  rounded-[20px]  text-[12px] font-medium ${
                              sec.isActive
                                ? "bg-[#10e5908e] text-[#267156]"
                                : "bg-[#919191] text-white"
                            } `}
                          >
                            <p className=" font-semibold ">
                              {sec.isActive ? "Active" : "Inactive"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-row w-[60%] items-center justify-between text-[#4E5150] text-[12px] font-normal ">
                          {/* Main Instructor */}
                          <p className="text-wrap w-[20%] font-medium">
                            {getUserName(sec.instructor)}
                          </p>
                          {/* Open Symester */}
                          <div className="flex flex-row gap-1 w-[30%]">
                            <p className="text-wrap font-medium ">
                              Open Semester
                            </p>
                            <div className="flex flex-row gap-1">
                              {sec.semester.map((term: any, index: number) => (
                                <span key={index} className="text-wrap ">
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
                          <div className="flex flex-row gap-4 items-center">
                            <div
                              className="flex flex-row justify-center items-center  bg-transparent  border-[1px] border-secondary text-secondary size-8 bg-none rounded-full  cursor-pointer hover:bg-secondary/10"
                              onClick={() => {
                                setEditCourse({
                                  ...sec,
                                  ...course,
                                });
                                setEditInstructorModal(true);

                                openModalEditInstructor();
                              }}
                            >
                              <Icon IconComponent={ManageAdminIcon} />
                            </div>

                            <div
                              onClick={() => {
                                setEditCourse({
                                  ...sec,
                                  ...course,
                                });
                                setEditSectionNo(sec.sectionNo);
                                setEditSectionModal(true);
                                openModalEditSection();
                              }}
                              className="flex flex-row justify-center items-center bg-transparent  border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full  cursor-pointer hover:bg-[#F39D4E]/10"
                            >
                              <IconEdit className="size-4" stroke={1.5} />
                            </div>
                            <div
                              onClick={() => {
                                setdelSec(sec);
                                openedMainPopup();
                              }}
                              className="flex flex-row justify-center items-center bg-transparent  border-[1px] border-[#FF4747] text-[#FF4747] size-8 bg-none rounded-full  cursor-pointer hover:bg-[#FF4747]/10"
                            >
                              <IconTrash className="size-4" stroke={1.5} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </InfiniteScroll>
        )}
      </div>
    </>
  );
}
