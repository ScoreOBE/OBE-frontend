import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Button, Group, Menu, Modal, Select } from "@mantine/core";
import { Alert } from "@mantine/core";
import {
  IconDots,
  IconPencilMinus,
  IconTrash,
  IconExclamationCircle,
  IconUpload,
  IconArrowRight,
} from "@tabler/icons-react";
import { showNotifications } from "@/helpers/functions/function";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteCourse, getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { addLoadMoreCourse, removeCourse, setCourseList } from "@/store/course";
import InfiniteScroll from "react-infinite-scroll-component";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import ModalAddCourse from "@/components/Modal/CourseManage/ModalAddCourse";
import notFoundImage from "@/assets/image/notFound.png";
import { ROUTE_PATH } from "@/helpers/constants/route";
import MainPopup from "../components/Popup/MainPopup";
import ModalEditCourse from "../components/Modal/CourseManage/ModalEditCourse";
import { NOTI_TYPE, TQF_STATUS } from "@/helpers/constants/enum";
import { IModelCourse } from "@/models/ModelCourse";
import Loading from "@/components/Loading";
import { setLoading } from "@/store/loading";
import { IModelUser } from "@/models/ModelUser";
import { setShowSidebar } from "@/store/showSidebar";
import Icon from "@/components/Icon";
import AddIcon from "@/assets/icons/plus.svg?react";
import { setShowNavbar } from "@/store/showNavbar";
import ModalUploadScore from "../components/Modal/ModalUploadScore";
import ModalUploadStudentList from "@/components/Modal/ModalUploadStudentList";

export default function Dashboard() {
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading);
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const course = useAppSelector((state) => state.course);
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
  const [uploadCourse, setUploadCourse] = useState<Partial<IModelCourse>>();

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  useEffect(() => {
    const yearId = params.get("id");
    const year = parseInt(params.get("year")!);
    const semester = parseInt(params.get("semester")!);
    if (academicYear.length) {
      const acaYear = academicYear.find(
        (e) => e.id == yearId && e.semester == semester && e.year == year
      );
      if (acaYear && yearId != term.id) {
        setTerm(acaYear);
      }
    }
  }, [academicYear, term, params]);

  useEffect(() => {
    if (term) {
      setPayload({
        ...new CourseRequestDTO(),
        academicYear: term.id,
        search: course.search,
        hasMore: true,
      });
      localStorage.removeItem("search");
    }
  }, [localStorage.getItem("search")]);

  const fetchCourse = async (id: string) => {
    dispatch(setLoading(true));
    const payloadCourse = new CourseRequestDTO();
    payloadCourse.academicYear = id;
    setPayload({ ...payloadCourse, hasMore: true });
    const res = await getCourse(payloadCourse);
    if (res) {
      dispatch(setCourseList(res));
    }
    dispatch(setLoading(false));
  };

  const onShowMore = async () => {
    if (payload.academicYear) {
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
        "Delete Course Success",
        `${delCourse?.courseNo} is deleted`
      );
    }
  };

  const goToCourse = (courseNo: string) => {
    const pathname = `${ROUTE_PATH.COURSE}/${courseNo}/${ROUTE_PATH.SECTION}`;
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
              title=" After you delete this course, it's permanently deleted all data from
            the current semester. Data from previous semesters will not be affected. 
            "
              icon={<IconExclamationCircle />}
              classNames={{ icon: "size-6" }}
            ></Alert>
            <div className="flex flex-col mt-3 gap-2">
              <div className="flex flex-col  ">
                <p className="text-b3 text-[#808080]">Course no.</p>
                <p className="  -translate-y-[2px] text-b1">{`${delCourse?.courseNo}`}</p>
              </div>
              <div className="flex flex-col ">
                <p className="text-b3  text-[#808080]">Course name</p>
                <p className=" -translate-y-[2px] text-b1">{`${delCourse?.courseName}`}</p>
              </div>
            </div>
          </>
        }
      />
      <ModalAddCourse
        opened={openAddModal}
        onClose={() => setOpenAddModal(false)}
        fetchCourse={(id) => fetchCourse(id)}
      />
      <ModalEditCourse
        opened={openModalEditCourse}
        onClose={() => setOpenModalEditCourse(false)}
        value={editCourse}
      />
      <Modal
        title="Upload score"
        transitionProps={{ transition: "pop" }}
        size="32vw"
        centered
        classNames={{
          content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
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
            size="xs"
            searchable
            data={course.courses.map((c) => {
              return {
                value: c.courseNo,
                id: c.id,
                courseName: c.courseName,
                label: `${c.courseNo} ${c.courseName}`,
              };
            })}
            value={uploadCourse?.courseNo}
            onChange={(value, option: any) =>
              setUploadCourse({
                id: option.id,
                courseNo: option.value,
                courseName: option.courseName,
              })
            }
            renderOption={(item: any) => (
              <div className="flex w-full gap-2">
                <p className="w-[9%] min-w-fit">{item.option.value}</p>
                <p>{item.option.courseName}</p>
              </div>
            )}
          />
          <div className="flex justify-end w-full">
            <Group className="flex w-full h-fit items-end justify-end">
              <div>
                <Button
                  variant="subtle"
                  onClick={() => setOpenModalSelectCourse(false)}
                >
                  Cancel
                </Button>
              </div>
              <Button
                onClick={() => {
                  setOpenModalUploadStudentList(true);
                  setOpenModalSelectCourse(false);
                }}
                disabled={!uploadCourse}
                rightSection={
                  <IconArrowRight
                    color="#ffffff"
                    className="size-5 items-center"
                    stroke={2}
                    size={20}
                  />
                }
              >
                Next
              </Button>
            </Group>
          </div>
        </div>
      </Modal>
      <ModalUploadScore
        data={uploadCourse!}
        opened={openModalUploadScore}
        onClose={() => setOpenModalUploadScore(false)}
      />
      <ModalUploadStudentList
        data={uploadCourse!}
        opened={openModalUploadStudentList}
        onClose={() => setOpenModalUploadStudentList(false)}
        onBack={() => {
          setOpenModalUploadStudentList(false), setOpenModalSelectCourse(true);
        }}
        onNext={() => {setOpenModalUploadScore(true), setOpenModalUploadStudentList(false)}}
      />

      <div className=" flex flex-col h-full w-full  overflow-hidden">
        <div className="flex flex-row px-6 pt-3   items-center justify-between">
          <div className="flex flex-col">
            <p className="text-secondary text-[18px] font-semibold ">
              Hi there, {user.firstNameEN}
            </p>
            {course.search.length ? (
              <p className="text-[#575757] text-[14px]">
                {course.total} result{course.total > 1 ? "s " : " "} found
              </p>
            ) : (
              <p className="text-[#575757] text-[14px]">
                In semester {term?.semester ?? ""}, {term?.year ?? ""}!{" "}
                {course.courses.length === 0 ? (
                  <span>Your course card is currently empty</span>
                ) : (
                  <span>
                    You have{" "}
                    <span className="text-[#5768D5] font-semibold">
                      {course.total} Course
                      {course.total > 1 ? "s " : " "}
                    </span>
                    on your plate.
                  </span>
                )}
              </p>
            )}
          </div>
          {term?.isActive && !!course.courses.length && (
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="outline"
                className="text-center px-4"
                onClick={() => setOpenAddModal(true)}
              >
                <div className="flex gap-2">
                  <Icon IconComponent={AddIcon} />
                  Add course
                </div>
              </Button>
              <Button
                className="text-center px-4"
                leftSection={<IconUpload className="size-4" />}
                onClick={() => setOpenModalSelectCourse(true)}
              >
                <div className="flex gap-2">Upload score</div>
              </Button>
            </div>
          )}
        </div>
        <div className="flex h-full w-full overflow-hidden">
          {loading ? (
            <Loading />
          ) : course.courses.length === 0 ? (
            <div className=" flex flex-row flex-1 justify-between">
              <div className="h-full px-[60px] justify-center flex flex-col">
                <p className="text-primary text-h2 font-semibold">
                  {course.search.length
                    ? `No results for "${course.search}" `
                    : "No course found"}
                </p>
                <br />
                <p className=" -mt-4 mb-6   text-b2 break-words font-400 leading-relaxed">
                  {course.search.length ? (
                    <>Check the spelling or try a new search.</>
                  ) : (
                    <>
                      It looks like you haven't added any courses yet.
                      <br />
                      Click 'Add Course' button below to get started!
                    </>
                  )}
                </p>

                {term?.isActive && !course.search.length && (
                  // <Button
                  //   className="!w-28 px-2"
                  //   onClick={() => setOpenAddModal(true)}
                  // >
                  //   <IconPlus
                  //     className="h-5 w-5 mr-1"
                  //     stroke={1.5}
                  //     color="#ffffff"
                  //   />
                  //   Add course
                  // </Button>
                  <Button
                    className="text-center px-4"
                    onClick={() => setOpenAddModal(true)}
                  >
                    <div className="flex gap-2">
                      <Icon IconComponent={AddIcon} />
                      Add course
                    </div>
                  </Button>
                )}
              </div>
              <div className="h-full px-[60px] bg-slate-300  justify-center flex flex-col">
                <img src={notFoundImage} alt="notFound"></img>
              </div>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={course.courses.length}
              next={onShowMore}
              height={"100%"}
              loader={<Loading />}
              hasMore={payload?.hasMore}
              className="overflow-y-auto w-full h-fit max-h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-6 p-3"
              style={{ height: "fit-content", maxHeight: "100%" }}
            >
              {course.courses.map((item) => {
                const statusTqf3Sec: any[] = item.sections.map(
                  (sec) => sec.TQF3?.status
                );
                const statusTqf5Sec: any[] = item.sections.map(
                  (sec) => sec.TQF5?.status
                );
                const statusTqf3 =
                  item.TQF3?.status ??
                  (statusTqf3Sec.some((e) => e == TQF_STATUS.IN_PROGRESS)
                    ? TQF_STATUS.IN_PROGRESS
                    : statusTqf3Sec.every((e) => e == TQF_STATUS.DONE)
                    ? TQF_STATUS.DONE
                    : TQF_STATUS.NO_DATA);
                const statusTqf5 =
                  item.TQF5?.status ??
                  (statusTqf5Sec.some((e) => e == TQF_STATUS.IN_PROGRESS)
                    ? TQF_STATUS.IN_PROGRESS
                    : statusTqf5Sec.every((e) => e == TQF_STATUS.DONE)
                    ? TQF_STATUS.DONE
                    : TQF_STATUS.NO_DATA);
                return (
                  <div
                    key={item.id}
                    className="card relative justify-between xl:h-[135px] md:h-[120px] cursor-pointer rounded-[4px] hover:bg-[#F3F3F3]"
                    onClick={() => goToCourse(item.courseNo)}
                  >
                    <div className="p-2.5 flex flex-col">
                      <p className="font-bold text-sm">{item.courseNo}</p>
                      <p className="text-xs font-medium text-gray-600">
                        {item.courseName}
                      </p>
                      {item.sections.find(
                        (sec) => (sec.instructor as IModelUser).id == user.id
                      ) &&
                        item.addFirstTime &&
                        term?.isActive && (
                          <div onClick={(event) => event.stopPropagation()}>
                            <Menu
                              trigger="click"
                              position="bottom-end"
                              offset={2}
                            >
                              <Menu.Target>
                                <IconDots className="absolute top-2 right-2 rounded-full hover:bg-gray-300" />
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
                                    });
                                    setOpenModalEditCourse(true);
                                  }}
                                  className="text-[#3E3E3E] font-semibold  text-b3 h-7 w-[180px]"
                                >
                                  <div className="flex items-center gap-2">
                                    <IconPencilMinus
                                      stroke={1.5}
                                      className="h-4 w-4"
                                    />
                                    <span>Edit Course</span>
                                  </div>
                                </Menu.Item>
                                <Menu.Item
                                  className="text-[#FF4747] h-7 w-[180px] font-semibold text-b3 hover:bg-[#d55757]/10"
                                  onClick={() => {
                                    setDelCourse(item);
                                    setOpenDelPopup(true);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <IconTrash
                                      className="h-4 w-4"
                                      stroke={1.5}
                                    />
                                    <span>Delete Course</span>
                                  </div>
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </div>
                        )}
                    </div>
                    <div className="bg-[#e7eaff] flex h-8 items-center justify-between rounded-b-[4px]">
                      <p className="p-2.5 text-secondary font-[700] text-[12px]">
                        {item.sections.length} Section
                        {item.sections.length > 1 ? "s" : ""}
                      </p>
                      <div className="flex gap-3 px-2.5 font-semibold py-1 justify-end items-center">
                        <p className="tag-tqf" tqf-status={statusTqf3}>
                          TQF 3
                        </p>
                        <p className="tag-tqf" tqf-status={statusTqf5}>
                          TQF 5
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </>
  );
}
