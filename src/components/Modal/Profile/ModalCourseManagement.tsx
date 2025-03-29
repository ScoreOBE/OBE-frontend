import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Menu, Modal, Select, Tabs } from "@mantine/core";
import Icon from "@/components/Icon";
import IconManageAdmin from "@/assets/icons/manageAdmin.svg?react";
import IconDots from "@/assets/icons/dots.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconEdit from "@/assets/icons/edit.svg?react";
import IconPencilMinus from "@/assets/icons/pencilMinus.svg?react";
import IconPlus2 from "@/assets/icons/plus2.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconChevronLeft from "@/assets/icons/chevronLeft.svg?react";
import IconChevronRight from "@/assets/icons/chevronRight.svg?react";
import { CourseManagementSearchDTO } from "@/services/courseManagement/dto/courseManagement.dto";
import {
  deleteCourseManagement,
  deleteSectionManagement,
  getCourseManagement,
} from "@/services/courseManagement/courseManagement.service";
import { COURSE_TYPE, NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { getSectionNo, getUserName } from "@/helpers/functions/function";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import MainPopup from "@/components/Popup/MainPopup";
import { IModelSection } from "@/models/ModelCourse";
import Loading from "@/components/Loading/Loading";
import ModalManageIns from "@/components/Modal/CourseManage/ModalManageIns";
import ModalEditCourse from "@/components/Modal/CourseManage/ModalEditCourse";
import ModalEditSection from "@/components/Modal/CourseManage/ModalEditSection";
import {
  removeCourseManagement,
  removeSectionManagement,
  setCourseManagementList,
} from "@/store/courseManagement";
import { removeCourse, removeSection } from "@/store/course";
import ModalAddSection from "@/components/Modal/CourseManage/ModalAddSection";
import { SearchInput } from "@/components/SearchInput";
import { setLoading } from "@/store/loading";
import { IModelCurriculum } from "@/models/ModelFaculty";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalCourseManagement({ opened, onClose }: Props) {
  const user = useAppSelector((state) => state.user);
  const curriculum = useAppSelector((state) => state.faculty.curriculum);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const courseManagement = useAppSelector((state) => state.courseManagement);
  const loading = useAppSelector((state) => state.loading.loading);
  const dispatch = useAppDispatch();
  const [maxTabs, setMaxTabs] = useState(0);
  const [startEndTab, setStartEndTab] = useState({ start: 0, end: maxTabs });
  const [payload, setPayload] = useState<any>({ page: 1, limit: 10 });
  const [startEndPage, setStartEndPage] = useState({ start: 1, end: 10 });
  const [editCourse, setEditCourse] = useState<any>();
  const [editSec, setEditSec] = useState<
    Partial<IModelSection> & Record<string, any>
  >();
  const [openMainPopupDelSec, setOpenMainPopupDelSec] = useState(false);
  const [openMainPopupDelCourse, setOpenMainPopupDelCourse] = useState(false);
  const [openModalManageIns, setOpenModalManageIns] = useState(false);
  const [openModalEditCourse, setOpenModalEditCourse] = useState(false);
  const [openModalEditSec, setOpenModalEditSec] = useState(false);
  const [openModalAddSec, setOpenModalAddSec] = useState(false);
  const [curriculumList, setCurriculumList] = useState<
    Partial<IModelCurriculum>[]
  >([]);
  const [selectCurriculum, setSelectCurriculum] = useState<
    Partial<IModelCurriculum>
  >({});

  useLayoutEffect(() => {
    const updateSize = () => {
      let tabs;
      if (window.innerWidth >= 1440) {
        tabs = 16;
      } else if (window.innerWidth >= 1280) {
        tabs = 14;
      } else if (window.innerWidth >= 1024) {
        tabs = 10;
        // } else if (window.innerWidth >= 768) {
        //   tabs = 6;
      } else if (window.innerWidth >= 640) {
        tabs = 6;
      } else {
        tabs = 4;
      }
      setMaxTabs(tabs);
      setStartEndTab(({ start, end }) => {
        return { start: 0, end: tabs };
      });
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (opened) {
      if (user.role == ROLE.ADMIN) {
        setCurriculumList([
          {
            nameEN: "All Courses",
            code: "All Courses",
          },
          ...curriculum,
        ]);
        setSelectCurriculum({
          nameEN: "All Courses",
          code: "All Courses",
        });
      } else {
        setCurriculumList(
          curriculum.filter(({ code }) => user.curriculums?.includes(code))
        );
        setSelectCurriculum({
          nameEN: user.curriculums![0],
          code: user.curriculums![0],
        });
      }
    }
  }, [opened]);

  useEffect(() => {
    if (opened && selectCurriculum.code) {
      fetchCourse();
    }
  }, [selectCurriculum]);

  const initialPayload = () => {
    const cur = selectCurriculum.code?.includes("All")
      ? ["All"]
      : [selectCurriculum.code!];
    return {
      ...new CourseManagementSearchDTO(),
      search: courseManagement.search,
      curriculum: cur,
    };
  };

  const fetchCourse = async () => {
    dispatch(setLoading(true));
    const payloadCourse = initialPayload();
    setPayload(payloadCourse);
    const res = await getCourseManagement(payloadCourse);
    if (res) {
      dispatch(setCourseManagementList(res));
    }
    dispatch(setLoading(false));
  };

  const searchCourse = async (searchValue: string, reset?: boolean) => {
    let payloadCourse = initialPayload();
    if (reset) payloadCourse.search = "";
    else payloadCourse.search = searchValue;
    setPayload(payloadCourse);
    const res = await getCourseManagement(payloadCourse);
    if (res) {
      res.search = payloadCourse.search;
      dispatch(setCourseManagementList(res));
    }
  };

  const onChangePage = async (page: number, selectLimit?: number) => {
    const total = courseManagement.total;
    if (page < 1 || page > Math.ceil(total / payload.limit)) return;
    const limit = selectLimit ?? payload.limit;
    const res = await getCourseManagement({
      ...payload,
      limit,
      page,
    });
    if (res) {
      setStartEndPage({
        start: (page - 1) * limit + 1,
        end: Math.min(page * limit, total),
      });
      dispatch(setCourseManagementList(res));
      setPayload({
        ...payload,
        limit,
        page,
      });
    }
  };

  const onClickDeleteCourse = async (course: any) => {
    const res = await deleteCourseManagement(course.id, course);
    if (res) {
      setOpenMainPopupDelCourse(false);
      dispatch(removeCourseManagement(res.id));
      dispatch(removeCourse(res.courseId));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Course Deleted Successfully",
        `${course.courseNo} has been successfully deleted`
      );
    }
  };

  const onClickDeleteSec = async (course: any) => {
    let payload = { ...course };
    delete payload.id;
    const res = await deleteSectionManagement(course.id, course.secId, payload);
    if (res) {
      setOpenMainPopupDelSec(false);
      dispatch(removeSectionManagement({ id: course.id, secId: course.secId }));
      dispatch(removeSection({ id: res.courseId, secId: res.secId }));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Section Deleted Successfully",
        `${getSectionNo(editSec?.sectionNo)} has been successfully deleted`
      );
    }
  };

  return (
    <>
      <ModalAddSection
        opened={openModalAddSec}
        onClose={() => {
          setEditCourse({});
          setOpenModalAddSec(false);
        }}
        isManage={true}
        data={editCourse}
      />
      <ModalEditCourse
        opened={openModalEditCourse}
        onClose={() => setOpenModalEditCourse(false)}
        isCourseManage={true}
        value={editCourse}
      />
      <ModalManageIns
        opened={openModalManageIns}
        onClose={() => setOpenModalManageIns(false)}
        data={editCourse}
        setNewData={setEditCourse}
      />
      <MainPopup
        opened={openMainPopupDelCourse}
        onClose={() => setOpenMainPopupDelCourse(false)}
        action={() => onClickDeleteCourse(editCourse)}
        type="delete"
        labelButtonRight="Delete course"
        title={`Delete course`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title={
                <p>
                  After you delete this course, it's permanently deleted all
                  data from the current semester. Data from previous semesters
                  will not be affected.
                </p>
              }
              icon={<Icon IconComponent={IconExclamationCircle} />}
              className=" border border-red-100 rounded-xl bg-red-50"
              classNames={{
                title: "acerSwift:max-macair133:!text-b3",
                icon: "size-6",
                root: "p-4",
                wrapper: "items-start",
              }}
            ></Alert>
            <div className="flex flex-col mt-3 gap-2">
              <div className="flex flex-col  ">
                <p className="text-b4 text-[#808080]">Course no.</p>
                <p className="  -translate-y-[2px] text-b1">{`${editCourse?.courseNo}`}</p>
              </div>
              <div className="flex flex-col ">
                <p className="text-b4  text-[#808080]">Course name</p>
                <p className=" -translate-y-[2px] text-b1">{`${editCourse?.courseName}`}</p>
              </div>
            </div>
          </>
        }
      />
      <ModalEditSection
        opened={openModalEditSec}
        onClose={() => setOpenModalEditSec(false)}
        isCourseManage={true}
        title={`Edit section ${getSectionNo(editSec?.sectionNo)} in ${
          editSec?.courseNo
        }`}
        value={editSec}
      />
      <MainPopup
        opened={openMainPopupDelSec}
        onClose={() => setOpenMainPopupDelSec(false)}
        action={() => onClickDeleteSec(editSec)}
        type="delete"
        labelButtonRight="Delete section"
        title={`Delete section`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title=" After you delete this section, it's permanently deleted all data from
          the current semester. Data from previous semesters will not be affected. 
          "
              icon={<Icon IconComponent={IconExclamationCircle} />}
              className="border border-red-100 rounded-xl bg-red-50"
              classNames={{
                title: "acerSwift:max-macair133:!text-b3",
                icon: "size-6",
                root: "p-4",
                wrapper: "items-start",
              }}
            ></Alert>
            <div className="flex flex-col mt-3 gap-2">
              <div className="flex flex-col  ">
                <p className="text-b4 text-[#808080]">Course no.</p>
                <p className="  -translate-y-[2px] text-b1">{`${editSec?.courseNo}`}</p>
              </div>
              <div className="flex flex-col ">
                <p className="text-b4  text-[#808080]">Course name</p>
                <p className=" -translate-y-[2px] text-b1">{`${editSec?.courseName}`}</p>
              </div>
              <div className="flex flex-col ">
                <p className="text-b4  text-[#808080]">Section</p>
                <p className=" -translate-y-[2px] text-b1">{`${getSectionNo(
                  editSec?.sectionNo
                )}`}</p>
              </div>
            </div>
          </>
        }
      />
      <Modal.Root
        opened={opened}
        onClose={onClose}
        autoFocus={false}
        fullScreen={true}
        zIndex={50}
        classNames={{ content: "!pt-0 !bg-[#fafafa]" }}
      >
        <Modal.Overlay />
        <Modal.Content className="overflow-hidden !rounded-none !px-0">
          <Modal.Header className="flex w-full !bg-[#fafafa] !pb-0 !px-0 !pt-4 rounded-none">
            <div className="flex  flex-col gap-[6px] items-start w-full">
              <div className="inline-flex relative px-12 w-full items-center justify-center gap-2  ">
                <div className="flex absolute left-12 gap-2">
                  <Modal.CloseButton className="ml-0" />
                  <p className="font-semibold text-h2 text-secondary">
                    Course Management
                  </p>
                </div>
                <SearchInput
                  onSearch={searchCourse}
                  placeholder="Course No / Course Name"
                />
              </div>
              <Tabs
                classNames={{
                  root: "w-full left-0",
                  tab: "px-1 !bg-transparent hover:!text-tertiary",
                  tabLabel: "!font-semibold",
                }}
                value={selectCurriculum.code}
                onChange={(event) => {
                  setSelectCurriculum(
                    curriculumList.find(({ code }) => code == event)!
                  );
                  setPayload({ ...payload });
                }}
              >
                <Tabs.List
                  grow
                  className="!bg-transparent gap-3 flex-nowrap px-[53px] overflow-x-auto items-center flex w-full"
                >
                  {curriculumList.map((cur) => (
                    <Tabs.Tab key={cur.code} value={cur.code!}>
                      {cur.code}
                    </Tabs.Tab>
                  ))}

                  {/* </div> */}
                </Tabs.List>
              </Tabs>
            </div>
          </Modal.Header>
          <Modal.Body className="px-28 flex flex-col h-full pb-24 w-full overflow-hidden">
            <div className="flex flex-row py-6 px-6 items-center justify-between">
              <div className="flex flex-col items-start">
                <p className="text-secondary text-[16px] font-bold">
                  {courseManagement.search ? "Search" : "All Courses"}
                </p>
                <p className="text-tertiary text-[14px] font-medium">
                  {courseManagement.search.length ? (
                    <>
                      {courseManagement.total} result
                      {courseManagement.total > 1 ? "s " : " "} found
                    </>
                  ) : (
                    <>
                      {courseManagement.total} Course
                      {courseManagement.total > 1 ? "s" : ""}
                    </>
                  )}
                </p>
              </div>
              <div className="text-b4 gap-3 font-medium flex flex-row justify-end items-center">
                Courses per page:{" "}
                <Select
                  size="sm"
                  allowDeselect={false}
                  classNames={{
                    input: "border-none !h-[32px]",
                    wrapper: "!h-[32px]",
                  }}
                  className=" w-[74px] mr-3 h-[32px]"
                  data={["10", "20", "50"]}
                  value={payload.limit.toString()}
                  onChange={(event) => {
                    setPayload((prev: any) => {
                      return { ...prev, limit: parseInt(event!) };
                    });
                    onChangePage(1, parseInt(event!));
                  }}
                />
                <div>
                  {startEndPage.start} - {startEndPage.end} of{" "}
                  {courseManagement.total}
                </div>
                <div
                  aria-disabled={startEndPage.start == 1}
                  onClick={() => onChangePage(payload.page - 1)}
                  className={`cursor-pointer aria-disabled:cursor-default aria-disabled:text-[#dcdcdc] p-1 ${
                    startEndPage.start !== 1 && "hover:bg-[#eeeeee]"
                  } rounded-full`}
                >
                  <Icon IconComponent={IconChevronLeft} />
                </div>
                <div
                  aria-disabled={startEndPage.end == courseManagement.total}
                  onClick={() => onChangePage(payload.page + 1)}
                  className={` cursor-pointer aria-disabled:cursor-default aria-disabled:text-[#dcdcdc] p-1 ${
                    startEndPage.end !== courseManagement.total &&
                    "hover:bg-[#eeeeee]"
                  } rounded-full`}
                >
                  <Icon IconComponent={IconChevronRight} />
                </div>
              </div>
            </div>

            {/* Course Detail */}
            {loading ? (
              <Loading />
            ) : courseManagement.courseManagements.length === 0 ? (
              <div className="text-center h-full gap-1 justify-center items-center flex flex-col ">
                <p className=" text-secondary text-[18px] font-semibold">
                  {courseManagement.search.length ? (
                    <>No results for {courseManagement.search}</>
                  ) : (
                    <>Oops, No Courses here!</>
                  )}
                </p>
                <p>
                  {courseManagement.search.length ? (
                    <>Check the spelling or try a new search.</>
                  ) : (
                    <>Currently, No courses are added.</>
                  )}
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-full  overflow-y-auto relative gap-4 pb-1 px-6 pt-1">
                {courseManagement.courseManagements.map((course, index) => (
                  <div
                    key={index}
                    className="bg-[#ffffff] border-[2px] rounded-md flex flex-col py-4 px-5"
                  >
                    {/* Course Topic */}
                    <div className="gap-2 mb-3 flex items-center w-full justify-between">
                      <div className="flex flex-col w-fit">
                        <p className=" font-bold text-b2 text-secondary">
                          {course.courseNo}
                        </p>
                        <p className="text-b2 font-medium text-[#4E5150] flex-wrap ">
                          {course.courseName}
                        </p>
                      </div>

                      <div className="rounded-full cursor-pointer size-8 hover:bg-gray-200 p-1 text-default">
                        <Menu
                          trigger="click"
                          position="bottom-end"
                          offset={2}
                          zIndex={50}
                        >
                          <Menu.Target>
                            <div>
                              <Icon
                                IconComponent={IconDots}
                                className="rounded-full hover:bg-gray-200"
                              />
                            </div>
                          </Menu.Target>
                          <Menu.Dropdown
                            className="rounded-md backdrop-blur-xl bg-white/70"
                            style={{
                              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                            }}
                          >
                            <Menu.Item
                              onClick={() => {
                                setEditCourse({ ...course });
                                setOpenModalAddSec(true);
                              }}
                              className="text-default font-semibold  text-b2  w-[180px]"
                            >
                              <div className="flex items-center gap-2">
                                <Icon
                                  IconComponent={IconPlus2}
                                  className=" stroke-[2px] size-4"
                                />
                                <span>Add section</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item
                              onClick={() => {
                                setEditCourse({
                                  id: course.id,
                                  oldCourseNo: course.courseNo,
                                  courseNo: course.courseNo,
                                  courseName: course.courseName,
                                  descTH: course.descTH,
                                  descEN: course.descEN,
                                });
                                setOpenModalEditCourse(true);
                              }}
                              className="text-default font-semibold  text-b2  w-[180px]"
                            >
                              <div className="flex items-center gap-2">
                                <Icon
                                  IconComponent={IconPencilMinus}
                                  className="size-4 stroke-[2px]"
                                />
                                <span>Edit course</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item
                              onClick={() => {
                                setEditCourse({ ...course });
                                setOpenModalManageIns(true);
                              }}
                              className="text-default font-semibold  text-b2  w-[180px]"
                            >
                              <div className="flex items-center gap-2">
                                <Icon
                                  className="size-4 "
                                  IconComponent={IconManageAdmin}
                                />
                                <span>Manage instructor</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item
                              className="text-[#FF4747]  w-[180px] font-semibold text-b2 hover:bg-[#d55757]/10"
                              onClick={() => {
                                setEditCourse({
                                  id: course.id,
                                  year: academicYear.year,
                                  semester: academicYear.semester,
                                  courseNo: course.courseNo,
                                  courseName: course.courseName,
                                });
                                setOpenMainPopupDelCourse(true);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <Icon
                                  IconComponent={IconTrash}
                                  className="size-4 stroke-[2px]"
                                />
                                <span>Delete course</span>
                              </div>
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </div>
                    </div>
                    {/* Section */}
                    <div className="flex flex-col">
                      {course.sections.map((sec: any, index: number) => (
                        <div
                          key={sec.sectionNo}
                          className="first:rounded-t-md last:rounded-b-md bg-blue-50 "
                        >
                          <div className="grid grid-cols-5 items-center justify-between py-4 px-7">
                            {/* Section No & Topic */}
                            <div className="flex flex-col ">
                              <div className="flex flex-wrap items-center gap-1">
                                <p className="font-medium text-[13px] text-black w-[79px]">
                                  Section {getSectionNo(sec.sectionNo)}
                                </p>
                                {/* Curriculum */}
                                {sec.curriculum && (
                                  <div className="flex justify-center items-center text-center px-3 py-1 ml-1 w-fit min-w-10 rounded-[20px] font-medium bg-[#8DBEFF]/70 text-[#26257D]">
                                    <p className="font-semibold text-[12px]">
                                      {sec.curriculum}
                                    </p>
                                  </div>
                                )}
                              </div>
                              {course.type === COURSE_TYPE.SEL_TOPIC.en && (
                                <p className="text-[12px] font-normal text-[#4E5150] flex-wrap">
                                  {sec.topic}
                                </p>
                              )}
                            </div>
                            {/* Status */}
                            <div
                              className={`px-3 py-1 w-fit rounded-[20px]  text-[12px] font-medium ${
                                sec.isActive
                                  ? "bg-[#71EBC1] text-[#164232]"
                                  : "bg-[#a2a2a2] text-[#ffffff]"
                              } `}
                            >
                              <p className=" font-semibold ">
                                {sec.isActive ? "Active" : "Inactive"}
                              </p>
                            </div>
                            {/* Main Instructor */}
                            <div className="flex items-center font-medium text-[#4E5150] text-b4">
                              {getUserName(sec.instructor)}
                            </div>
                            {/* Open Symester */}
                            <div className="flex justify-start items-center gap-1 text-[#4E5150] text-b4">
                              <p className="text-wrap font-medium">Semester</p>
                              <div className="flex gap-1">
                                {sec.semester.map(
                                  (term: any, index: number) => (
                                    <span key={index} className="text-wrap">
                                      {index === 0
                                        ? term
                                        : index === sec.semester.length - 1
                                        ? ` and ${term}`
                                        : `, ${term}`}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>

                            {/* Button */}
                            <div className="flex justify-end gap-4 items-center">
                              <div
                                onClick={() => {
                                  setEditSec({
                                    id: course.id,
                                    year: academicYear.year,
                                    semester: academicYear.semester as any,
                                    courseNo: course.courseNo,
                                    secId: sec.id,
                                    oldSectionNo: sec.sectionNo,
                                    type: course.type,
                                    isActive: sec.isActive,
                                    data: {
                                      topic: sec.topic,
                                      sectionNo: sec.sectionNo,
                                      semester: sec.semester.map((e: any) =>
                                        e.toString()
                                      ),
                                      curriculum: sec.curriculum,
                                    },
                                  });
                                  setOpenModalEditSec(true);
                                }}
                                className="flex justify-center items-center bg-transparent border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full  cursor-pointer hover:bg-[#F39D4E]/10"
                              >
                                <Icon
                                  IconComponent={IconEdit}
                                  className="size-4 stroke-[2px]"
                                />
                              </div>
                              <div
                                onClick={() => {
                                  if (course.sections.length > 1) {
                                    setEditSec({
                                      id: course.id,
                                      year: academicYear.year,
                                      semester: academicYear.semester as any,
                                      courseNo: course.courseNo,
                                      courseName: course.courseName,
                                      secId: sec.id,
                                      sectionNo: sec.sectionNo,
                                    });
                                    setOpenMainPopupDelSec(true);
                                  }
                                }}
                                className={`flex  justify-center items-center bg-transparent border-[1px]  size-8 bg-none rounded-full  
                              ${
                                course.sections.length > 1
                                  ? "cursor-pointer border-[#FF4747] text-[#FF4747] hover:bg-[#FF4747]/10"
                                  : "cursor-not-allowed bg-[#f1f3f5] text-[#adb5bd] border-[#adb5bd]"
                              }`}
                              >
                                <Icon
                                  IconComponent={IconTrash}
                                  className="size-4 stroke-[2px]"
                                />
                              </div>
                            </div>
                          </div>
                          {index < course.sections.length - 1 && (
                            <div className="border-b-[1px] mx-5 border-blue-200"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
