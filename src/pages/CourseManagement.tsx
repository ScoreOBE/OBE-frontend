import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Menu } from "@mantine/core";
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
import {
  deleteCourseManagement,
  deleteSectionManagement,
  getCourseManagement,
} from "@/services/courseManagement/courseManagement.service";
import InfiniteScroll from "react-infinite-scroll-component";
import { COURSE_TYPE, NOTI_TYPE, POPUP_TYPE } from "@/helpers/constants/enum";
import {
  getSectionNo,
  getUserName,
  showNotifications,
} from "@/helpers/functions/function";
import { useDisclosure } from "@mantine/hooks";
import MainPopup from "@/components/Popup/MainPopup";
import { IModelSection } from "@/models/ModelSection";
import Loading from "@/components/Loading";
import ModalManageIns from "@/components/Modal/CourseManage/ModalManageIns";
import ModalEditCourse from "@/components/Modal/ModalEditCourse";
import ModalEditSection from "@/components/Modal/ModalEditSection";
import {
  addLoadMoreCourseManagement,
  removeCourseManagement,
  setCourseManagementList,
} from "@/store/courseManagement";
import { removeCourse } from "@/store/course";

export default function CourseManagement() {
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const courseManagement = useAppSelector((state) => state.courseManagement);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<any>();
  const [editCourse, setEditCourse] = useState<any>();
  const [delSec, setDelSec] = useState<
    Partial<IModelSection> & Record<string, any>
  >();
  const [
    openMainPopupDelSec,
    { open: openedMainPopupDelSec, close: closeMainPopupDelSec },
  ] = useDisclosure(false);
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
  const [
    modalEditSection,
    { open: openModalEditSection, close: closeModalEditSection },
  ] = useDisclosure(false);

  useEffect(() => {
    if (user.departmentCode) {
      const payloadCourse = {
        ...new CourseManagementRequestDTO(),
        departmentCode: user.departmentCode,
        search: courseManagement.search,
        hasMore: true,
      };
      setPayload(payloadCourse);
      fetchCourse(payloadCourse);
    }
  }, [user]);

  useEffect(() => {
    setPayload({
      ...new CourseManagementRequestDTO(),
      departmentCode: user.departmentCode,
      search: courseManagement.search,
      hasMore: true,
    });
    localStorage.removeItem("search");
  }, [localStorage.getItem("search")]);

  const fetchCourse = async (payloadCourse?: any) => {
    setLoading(true);
    if (!payloadCourse) {
      payloadCourse = {
        ...new CourseManagementRequestDTO(),
        departmentCode: user.departmentCode,
        search: courseManagement.search,
        hasMore: true,
      };
      setPayload(payloadCourse);
    }
    const res = await getCourseManagement(payloadCourse);
    if (res) {
      dispatch(setCourseManagementList(res));
    }
    setLoading(false);
  };

  const onShowMore = async () => {
    const res = await getCourseManagement({
      ...payload,
      page: payload.page + 1,
    });
    if (res) {
      dispatch(addLoadMoreCourseManagement(res));
      setPayload({
        ...payload,
        page: payload.page + 1,
        hasMore: res.length >= payload.limit,
      });
    } else {
      setPayload({ ...payload, hasMore: false });
    }
  };

  const onClickDeleteCourse = async (coures: any) => {
    const res = await deleteCourseManagement(coures.id, coures);
    if (res) {
      closeMainPopupDelCourse();
      dispatch(removeCourseManagement(res.id));
      dispatch(removeCourse(res.courseId));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Delete Course Success",
        `${coures.courseNo} is deleted`
      );
    }
  };

  const onClickDeleteSec = async (coures: any) => {
    const res = await deleteSectionManagement(coures.id, coures.secId, coures);
    if (res) {
      closeMainPopupDelSec();
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Delete Section Success",
        `${delSec?.sectionNo} is deleted`
      );
    }
  };

  return (
    <>
      <MainPopup
        opened={openMainPopupDelCourse}
        onClose={closeMainPopupDelCourse}
        action={() => onClickDeleteCourse(editCourse)}
        type={POPUP_TYPE.DELETE}
        labelButtonRight="Delete course"
        title={`Delete ${editCourse?.courseNo} Course?`}
        message={
          <p>
            Deleting this course will permanently remove all data from the
            current semester. Data from previous semesters will not be affected.{" "}
            <br /> <span>Are you sure you want to deleted this course? </span>
          </p>
        }
      />
      <MainPopup
        opened={openMainPopupDelSec}
        onClose={closeMainPopupDelSec}
        action={() => onClickDeleteSec(delSec)}
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
      <ModalManageIns
        opened={openModalManageInst}
        onClose={closeModalManageInst}
        data={editCourse}
      />
      <ModalEditCourse
        opened={openModalEditCourse}
        onClose={closeModalEditCourse}
        isCourseManage={true}
        value={editCourse}
      />
      <ModalEditSection
        opened={modalEditSection && editCourse}
        onClose={closeModalEditSection}
        isCourseManage={true}
        title={`Edit section ${
          editCourse && getSectionNo(editCourse.sectionNo)
        } in ${editCourse && editCourse.courseNo}`}
        value={editCourse}
        fetchCourse={fetchCourse}
      />
      <div className="bg-[#ffffff] flex flex-col h-full w-full px-6 py-3 gap-[12px] overflow-hidden">
        <div className="flex flex-col  items-start ">
          <p className="text-secondary text-[16px] font-bold">Dashboard</p>
          <p className="text-tertiary text-[14px] font-medium">
            {courseManagement.total} Course
            {courseManagement.total > 1 ? "s " : " "}
          </p>
        </div>
        {/* Course Detail */}
        {loading ? (
          <Loading />
        ) : (
          <InfiniteScroll
            dataLength={courseManagement.courseManagements.length}
            next={onShowMore}
            height={"100%"}
            hasMore={payload?.hasMore}
            className="overflow-y-auto w-full h-fit max-h-full flex flex-col gap-3 "
            style={{ height: "fit-content", maxHeight: "100%" }}
            loader={<Loading />}
          >
            {courseManagement.courseManagements.map((course, index) => (
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
                                oldCourseNo: course.courseNo,
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
                            setEditCourse({
                              id: course.id,
                              academicYear: academicYear.id,
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
                              ? "bg-[#10e5908e] text-[#228762]"
                              : "bg-[#a2a2a2] text-[#ffffff]"
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
                          <div
                            onClick={() => {
                              setEditCourse({
                                ...sec,
                                ...course,
                                semester: sec.semester.map((e: any) =>
                                  e.toString()
                                ),
                              });
                              openModalEditSection();
                            }}
                            className="flex justify-center items-center bg-transparent border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full  cursor-pointer hover:bg-[#F39D4E]/10"
                          >
                            <IconEdit className="size-4" stroke={1.5} />
                          </div>
                          <div
                            onClick={() => {
                              setDelSec({
                                id: course.id,
                                secId: sec.id,
                                sectionNo: sec.sectionNo,
                              });
                              openedMainPopupDelSec();
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
