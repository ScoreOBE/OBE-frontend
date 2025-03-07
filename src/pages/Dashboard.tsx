import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Button, Group, Menu, Modal, Select } from "@mantine/core";
import { Alert } from "@mantine/core";
import Icon from "@/components/Icon";
import IconAdd from "@/assets/icons/plus.svg?react";
import IconDots from "@/assets/icons/dots.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconUpload from "@/assets/icons/upload.svg?react";
import IconPencilMinus from "@/assets/icons/pencilMinus.svg?react";
import IconArrowRight from "@/assets/icons/arrowRight.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteCourse, getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { addLoadMoreCourse, removeCourse, setCourseList } from "@/store/course";
import InfiniteScroll from "react-infinite-scroll-component";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import ModalAddCourse from "@/components/Modal/CourseManage/ModalAddCourse";
import notFoundImage from "@/assets/image/notFound.jpg";
import { ROUTE_PATH } from "@/helpers/constants/route";
import MainPopup from "../components/Popup/MainPopup";
import ModalEditCourse from "../components/Modal/CourseManage/ModalEditCourse";
import { NOTI_TYPE, ROLE, TQF_STATUS } from "@/helpers/constants/enum";
import { IModelCourse } from "@/models/ModelCourse";
import Loading from "@/components/Loading/Loading";
import { setLoading } from "@/store/loading";
import { IModelUser } from "@/models/ModelUser";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import ModalUploadScore from "../components/Modal/Score/ModalUploadScore";
import { IModelSection } from "@/models/ModelCourse";
import ModalStudentList from "@/components/Modal/ModalStudentList";

export default function Dashboard() {
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const courseList = useAppSelector((state) => state.course);
  const dispatch = useAppDispatch();
  const [payload, setPayload] = useState<any>();
  const [params, setParams] = useSearchParams({});
  const [term, setTerm] = useState<Partial<IModelAcademicYear>>({});
  const [delCourse, setDelCourse] = useState<Partial<IModelCourse>>();
  const [editCourse, setEditCourse] = useState<Partial<IModelCourse>>();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDelPopup, setOpenDelPopup] = useState(false);
  const [openModalEditCourse, setOpenModalEditCourse] = useState(false);
  const [openModalSelectCourse, setOpenModalSelectCourse] = useState(false);
  const [openModalUploadScore, setOpenModalUploadScore] = useState(false);
  const [openModalUploadStudentList, setOpenModalUploadStudentList] =
    useState(false);
  const [uploadCourse, setUploadCourse] = useState<
    Partial<IModelCourse & IModelSection> & { value?: string | null }
  >();

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.INSTRUCTOR));
    localStorage.setItem("dashboard", ROLE.INSTRUCTOR);
  }, []);

  useEffect(() => {
    const year = parseInt(params.get("year")!);
    const semester = parseInt(params.get("semester")!);
    if (academicYear.length) {
      const acaYear = academicYear.find(
        (e) => e.semester == semester && e.year == year
      );
      if (acaYear && acaYear.id != term.id) {
        setTerm(acaYear);
      }
    }
  }, [academicYear, term, params]);

  useEffect(() => {
    if (term.id) {
      fetchCourse(term.year!, term.semester!);
    }
  }, [term]);

  useEffect(() => {
    if (term) {
      setPayload({
        ...new CourseRequestDTO(),
        year: term.year,
        semester: term.semester,
        search: courseList.search,
        hasMore: courseList.total >= payload?.limit,
      });
      localStorage.removeItem("search");
    }
  }, [localStorage.getItem("search")]);

  const fetchCourse = async (year: number, semester: number) => {
    if (!user.termsOfService) return;
    dispatch(setLoading(true));
    const payloadCourse = { ...new CourseRequestDTO(), year, semester };
    const res = await getCourse(payloadCourse);
    if (res) {
      dispatch(setCourseList(res));
      setPayload({
        ...payloadCourse,
        hasMore: res.totalCount >= payload.limit,
      });
    }
    dispatch(setLoading(false));
  };

  const onShowMore = async () => {
    if (payload.year && payload.semester) {
      const res = await getCourse({ ...payload, page: payload.page + 1 });
      if (res.length) {
        dispatch(addLoadMoreCourse(res));
        setPayload({
          ...payload,
          page: payload.page + 1,
          hasMore: res.length >= payload.limit,
        });
      } else {
        setPayload({ ...payload, hasMore: false });
      }
    }
  };

  const onClickDeleteCourse = async (id: string) => {
    const res = await deleteCourse(id);
    if (res) {
      dispatch(removeCourse(res.id));
      setOpenDelPopup(false);
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Course Deleted Successfully",
        `${delCourse?.courseNo} has been deleted from your plate`
      );
    }
  };

  const goToCourse = (courseNo: string) => {
    const pathname = `${ROUTE_PATH.COURSE}/${courseNo}/${ROUTE_PATH.EVALUATION}`;
    navigate({
      pathname,
      search: "?" + params.toString(),
    });
  };

  return (
    <>
      <MainPopup
        opened={openDelPopup}
        onClose={() => setOpenDelPopup(false)}
        action={() => onClickDeleteCourse(delCourse?.id!)}
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
                  This action cannot be undone. After you delete this course,
                  <br /> it will be permanently deleted all data from the
                  current semester. Data from previous semesters will not be
                  affected.
                </p>
              }
              icon={
                <Icon
                  IconComponent={IconExclamationCircle}
                  className="size-6"
                />
              }
            ></Alert>
            <div className="flex flex-col mt-3 gap-2">
              <div className="flex flex-col  ">
                <p className="text-b4 text-[#808080]">Course no.</p>
                <p className="  -translate-y-[2px] text-b1">{`${delCourse?.courseNo}`}</p>
              </div>
              <div className="flex flex-col ">
                <p className="text-b4  text-[#808080]">Course name</p>
                <p className=" -translate-y-[2px] text-b1">{`${delCourse?.courseName}`}</p>
              </div>
            </div>
          </>
        }
      />
      <ModalAddCourse
        opened={openAddModal}
        onClose={() => setOpenAddModal(false)}
        fetchCourse={(year, semester) => fetchCourse(year, semester)}
      />
      <ModalEditCourse
        opened={openModalEditCourse}
        onClose={() => setOpenModalEditCourse(false)}
        value={editCourse}
      />
      <Modal
        title="Upload score"
        transitionProps={{ transition: "pop" }}
        centered
        classNames={{
          title: "acerSwift:max-macair133:!text-b1",
          content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
          body: "flex flex-col overflow-hidden max-h-full h-fit",
        }}
        closeOnClickOutside={false}
        opened={openModalSelectCourse}
        onClose={() => setOpenModalSelectCourse(false)}
      >
        <div className="flex flex-col gap-8">
          <Select
            label="Select course to upload"
            placeholder="Course"
            size="sm"
            searchable
            data={courseList.courses.flatMap((course) => {
              return {
                value: course.id,
                id: course.id,
                year: course.year,
                semester: course.semester,
                courseNo: course.courseNo,
                courseName: course.courseName,
                sections: course.sections,
                label: `${course.courseNo} - ${course.courseName}`,
              };
            })}
            classNames={{
              input: "acerSwift:max-macair133:text-b4",
              label: "acerSwift:max-macair133:!text-b3",
            }}
            value={uploadCourse?.value}
            onChange={(value, option: any) =>
              setUploadCourse({
                value: value,
                id: option.id,
                year: option.year,
                semester: option.semester,
                courseNo: option.courseNo,
                courseName: option.courseName,
                sections: option.sections,
                // topic: option.topic,
              })
            }
            renderOption={(item: any) => (
              <div className="flex w-full gap-2 acerSwift:max-macair133:text-b4">
                <p>{item.option.courseNo}</p>
                <p className="">
                  {item.option.courseName}
                  {/* {item.option.topic && (
                    <>
                      <br />
                      {item.option.topic}
                    </>
                  )} */}
                </p>
              </div>
            )}
          />
          <div className="flex justify-end w-full">
            <Group className="flex w-full h-fit items-end justify-end">
              <Button
                variant="subtle"
                className=" acerSwift:max-macair133:!text-b4"
                onClick={() => {
                  setOpenModalSelectCourse(false);
                  setUploadCourse(undefined);
                }}
              >
                Cancel
              </Button>
              <Button
                className="acerSwift:max-macair133:!text-b4"
                onClick={() => {
                  if (
                    courseList.courses.find(({ id }) => id == uploadCourse?.id)
                      ?.sections[0].students?.length
                  ) {
                    setOpenModalUploadScore(true);
                    setOpenModalSelectCourse(false);
                  } else {
                    setOpenModalUploadStudentList(true);
                    setOpenModalSelectCourse(false);
                  }
                }}
                disabled={!uploadCourse}
                rightSection={
                  <Icon
                    IconComponent={IconArrowRight}
                    className={`${
                      !uploadCourse ? "text-[#BCC3CA]" : "text-[#ffffff]"
                    } stroke-2  size-5 items-center`}
                  />
                }
              >
                Next
              </Button>
            </Group>
          </div>
        </div>
      </Modal>
      {uploadCourse && (
        <ModalUploadScore
          data={uploadCourse}
          opened={openModalUploadScore}
          onClose={() => {
            setOpenModalUploadScore(false);
            setUploadCourse(undefined);
          }}
        />
      )}
      {uploadCourse && (
        <ModalStudentList
          type="import"
          data={uploadCourse}
          opened={openModalUploadStudentList}
          onClose={() => setOpenModalUploadStudentList(false)}
          onBack={() => {
            setOpenModalUploadStudentList(false);
            setOpenModalSelectCourse(true);
          }}
          onNext={() => {
            setOpenModalUploadScore(true);
            setOpenModalUploadStudentList(false);
          }}
        />
      )}
      <div className="flex flex-col h-full w-full overflow-hidden">
        <div className="flex flex-row px-6 pt-3 items-center justify-between">
          <div className="flex flex-col ">
            <p className="text-secondary text-h2 acerSwift:max-macair133:text-[17px] font-semibold ">
              Hi there, {user.firstNameEN}
            </p>
            {courseList.search.length ? (
              <p className="text-[#575757] text-b2 acerSwift:max-macair133:text-b3">
                {courseList.total} result{courseList.total > 1 ? "s " : " "}{" "}
                found
              </p>
            ) : (
              <p className="text-[#575757] text-b2 acerSwift:max-macair133:text-b3">
                In semester{" "}
                <span className="text-[#1f69f3] font-semibold">
                  {" "}
                  {term?.semester ?? ""}/{term?.year ?? ""}!
                </span>{" "}
                {courseList.courses.length === 0 ? (
                  <span>Your course card is currently empty</span>
                ) : (
                  <span>
                    You have{" "}
                    <span className="text-secondary font-semibold">
                      {courseList.total} Course
                      {courseList.total > 1 ? "s " : " "}
                    </span>
                    on your plate.
                  </span>
                )}
              </p>
            )}
          </div>
          {term?.isActive && !!courseList.courses.length && (
            <div className="flex gap-3 flex-wrap">
              {user.role != ROLE.TA && (
                <Button
                  variant="outline"
                  className="text-center px-4 acerSwift:max-macair133:!text-b5"
                  leftSection={
                    <Icon
                      IconComponent={IconAdd}
                      className="acerSwift:max-macair133:size-3.5"
                    />
                  }
                  onClick={() => setOpenAddModal(true)}
                >
                  Add Course
                </Button>
              )}
              <Button
                className="text-center px-4 acerSwift:max-macair133:!text-b5"
                leftSection={
                  <Icon
                    IconComponent={IconUpload}
                    className="size-4 acerSwift:max-macair133:size-3.5"
                  />
                }
                onClick={() => {
                  setUploadCourse(undefined);
                  setOpenModalSelectCourse(true);
                }}
              >
                Upload score
              </Button>
            </div>
          )}
        </div>
        <div className="flex h-full w-full overflow-hidden">
          {loading ? (
            <Loading />
          ) : courseList.total ? (
            <div className="flex flex-col h-full w-full overflow-hidden">
              <Alert
                radius="md"
                variant="light"
                classNames={{
                  body: " flex justify-center",
                }}
                className=" mt-3 mb-2 mx-6 "
                color="orange"
                title={
                  <div className="flex items-center gap-2">
                    <Icon IconComponent={IconInfo2} className="mr-2" />
                    <p>
                      ScoreOBE+ is currently in its development (beta) phase.
                      You may encounter unstable features or bugs. Please report
                      any issues using the button at the top right of your
                      profile.
                    </p>
                  </div>
                }
              ></Alert>
              <InfiniteScroll
                dataLength={courseList.courses.length}
                next={onShowMore}
                height={"100%"}
                loader={<Loading />}
                hasMore={payload?.hasMore}
                className="overflow-y-auto w-full h-fit max-h-full grid grid-cols-2 sm:grid-cols-3 acerSwift:grid-cols-4 pb-5 gap-4 px-6 p-3"
                style={{ height: "fit-content", maxHeight: "100%" }}
              >
                {courseList.courses.map((item) => {
                  const statusTqf3Sec: any[] = item.sections.map(
                    (sec) => sec.TQF3?.status
                  );
                  const statusTqf5Sec: any[] = item.sections.map(
                    (sec) => sec.TQF5?.status
                  );
                  const statusTqf3 =
                    item.TQF3?.status ??
                    (statusTqf3Sec.every((e) => e == TQF_STATUS.DONE)
                      ? TQF_STATUS.DONE
                      : statusTqf3Sec.some((e) =>
                          [TQF_STATUS.IN_PROGRESS, TQF_STATUS.DONE].includes(e)
                        )
                      ? TQF_STATUS.IN_PROGRESS
                      : TQF_STATUS.NO_DATA);
                  const statusTqf5 =
                    item.TQF5?.status ??
                    (statusTqf5Sec.every((e) => e == TQF_STATUS.DONE)
                      ? TQF_STATUS.DONE
                      : statusTqf5Sec.some((e) =>
                          [TQF_STATUS.IN_PROGRESS, TQF_STATUS.DONE].includes(e)
                        )
                      ? TQF_STATUS.IN_PROGRESS
                      : TQF_STATUS.NO_DATA);
                  return (
                    <div
                      key={item.id}
                      className="card relative justify-between h-[125px] macair133:h-[135px] sm:h-[128px] cursor-pointer rounded-[4px] hover:bg-[#f3f3f3]"
                      onClick={() => goToCourse(item.courseNo)}
                    >
                      <div className="p-2.5 flex flex-col">
                        <p className="font-bold text-sm acerSwift:max-macair133:text-b3">
                          {item.courseNo}
                        </p>
                        <p className="text-xs acerSwift:max-macair133:text-b5 font-medium text-gray-600">
                          {item.courseName}
                        </p>
                        {item.sections.find(
                          (sec) => (sec.instructor as IModelUser).id == user.id
                        ) && (
                          <div onClick={(event) => event.stopPropagation()}>
                            <Menu
                              trigger="click"
                              position="bottom-end"
                              offset={-15}
                            >
                              <Menu.Target>
                                <div>
                                  <Icon
                                    IconComponent={IconDots}
                                    className="absolute top-2 right-2 rounded-full hover:bg-gray-300 acerSwift:max-macair133:size-5.5"
                                  />
                                </div>
                              </Menu.Target>
                              <Menu.Dropdown
                                className="rounded-md backdrop-blur-xl bg-white/70 "
                                style={{
                                  boxShadow:
                                    "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                                }}
                              >
                                <Menu.Item
                                  onClick={() => {
                                    setEditCourse({
                                      id: item.id,
                                      courseNo: item.courseNo,
                                      courseName: item.courseName,
                                      addFirstTime: item.addFirstTime,
                                    });
                                    setOpenModalEditCourse(true);
                                  }}
                                  className="text-[#3E3E3E] font-semibold text-b4 acerSwift:max-macair133:!text-b5 h-7 w-[180px]"
                                >
                                  <div className="flex items-center gap-2">
                                    <Icon
                                      IconComponent={IconPencilMinus}
                                      className="size-4 stroke-[2px] acerSwift:max-macair133:size-3"
                                    />
                                    <span>Edit Course</span>
                                  </div>
                                </Menu.Item>
                                {item.addFirstTime && (
                                  <Menu.Item
                                    className="text-[#FF4747] h-7 w-[180px] font-semibold text-b4 acerSwift:max-macair133:!text-b5 hover:bg-[#d55757]/10"
                                    onClick={() => {
                                      setDelCourse(item);
                                      setOpenDelPopup(true);
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Icon
                                        IconComponent={IconTrash}
                                        className="size-4 stroke-[2px] acerSwift:max-macair133:size-3"
                                      />
                                      <span>Delete Course</span>
                                    </div>
                                  </Menu.Item>
                                )}
                              </Menu.Dropdown>
                            </Menu>
                          </div>
                        )}
                      </div>
                      <div className="bg-[#e7f0ff] flex h-8 items-center justify-between rounded-b-[4px]">
                        <p className="p-2.5 text-secondary font-[700] text-b4 acerSwift:max-macair133:text-b5">
                          {item.sections.length} Section
                          {item.sections.length > 1 ? "s" : ""}
                        </p>
                        <div className="flex gap-3 px-2.5 font-semibold py-1 justify-end items-center">
                          <p
                            className="tag-tqf rounded-xl !text-b5 acerSwift:max-macair133:!text-b6"
                            tqf-status={statusTqf3}
                          >
                            TQF 3
                          </p>
                          <p
                            className="tag-tqf rounded-xl !text-b5 acerSwift:max-macair133:!text-b6"
                            tqf-status={statusTqf5}
                          >
                            TQF 5
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </InfiniteScroll>
            </div>
          ) : (
            <div className=" flex flex-row flex-1 px-[95px] sm:max-ipad11:px-[70px] justify-between">
              <div className="h-full  justify-center flex flex-col">
                <p className="text-secondary text-[22px] sm:max-ipad11:text-[20px] font-semibold">
                  {courseList.search.length
                    ? `No results for "${courseList.search}" `
                    : "No Course Found"}
                </p>
                <br />
                <p className=" -mt-4 mb-6 sm:max-ipad11:mb-2 text-b2 break-words font-medium leading-relaxed">
                  {courseList.search.length ? (
                    <>Check the spelling or try a new search.</>
                  ) : (
                    <>
                      It looks like you haven't added any courses yet.
                      <br />
                      Click 'Add Course' button below to get started!
                    </>
                  )}
                </p>

                {term?.isActive && !courseList.search.length && (
                  <Button
                    className="text-center px-4"
                    onClick={() => setOpenAddModal(true)}
                  >
                    <div className="flex gap-2">
                      <Icon IconComponent={IconAdd} />
                      Add Course
                    </div>
                  </Button>
                )}
              </div>
              <div className="h-full  w-[24vw] justify-center flex flex-col">
                <img src={notFoundImage} alt="notFound"></img>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
