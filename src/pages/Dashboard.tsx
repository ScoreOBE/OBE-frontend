import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Button, Menu } from "@mantine/core";
import { Alert } from "@mantine/core";
import {
  IconDots,
  IconInfoCircle,
  IconPencilMinus,
  IconPlus,
  IconTrash,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { showNotifications, statusColor } from "@/helpers/functions/function";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteCourse, getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { addLoadMoreCourse, removeCourse, setCourseList } from "@/store/course";
import InfiniteScroll from "react-infinite-scroll-component";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import ModalAddCourse from "@/components/Modal/ModalAddCourse";
import { useDisclosure } from "@mantine/hooks";
import notFoundImage from "@/assets/image/notFound.png";
import { ROUTE_PATH } from "@/helpers/constants/route";
import MainPopup from "../components/Popup/MainPopup";
import ModalEditCourse from "../components/Modal/ModalEditCourse";
import { NOTI_TYPE, POPUP_TYPE } from "@/helpers/constants/enum";
import { IModelCourse } from "@/models/ModelCourse";
import Loading from "@/components/Loading";
import { setLoading } from "@/store/loading";
import { IModelUser } from "@/models/ModelUser";

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
  const [openAddModal, { open: openedAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [openMainPopup, { open: openedMainPopup, close: closeMainPopup }] =
    useDisclosure(false);
  const [
    openModalEditCourse,
    { open: openedModalEditCourse, close: closeModalEditCourse },
  ] = useDisclosure(false);

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
        if (!course.courses.length) fetchCourse(acaYear.id);
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
      closeMainPopup();
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Delete Course Success",
        `${delCourse?.courseNo} is deleted`
      );
    }
  };

  const goToCourse = (courseNo: string) => {
    navigate(
      {
        pathname: `${ROUTE_PATH.COURSE}/${courseNo}`,
        search: "?" + params.toString(),
      }
      // { state: { activeTerm: term?.isActive } }
    );
  };

  const icon = <IconExclamationCircle />;

  return (
    <>
      <MainPopup
        opened={openMainPopup}
        onClose={closeMainPopup}
        action={() => onClickDeleteCourse(delCourse?.id!)}
        type={POPUP_TYPE.DELETE}
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
              icon={icon}
              classNames={{ title: "-mt-[2px]" }}
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
        onClose={closeAddModal}
        fetchCourse={(id) => fetchCourse(id)}
      />
      <ModalEditCourse
        opened={openModalEditCourse}
        onClose={closeModalEditCourse}
        value={editCourse}
      />

      <div className="bg-[#ffffff] flex flex-col h-full w-full p-6 py-3 gap-3 overflow-hidden">
        <div className="flex flex-row  items-center justify-between">
          <div className="flex flex-col">
            <p className="text-secondary text-[20px] font-semibold mb-[1px]">
              Hi there, {user.firstNameEN}
            </p>
            <p className="text-[#575757] text-[14px]">
              In semester {term?.semester ?? ""}, {term?.year ?? ""}!{" "}
              {course.courses.length === 0 ? (
                <span>Your course card is currently empty</span>
              ) : (
                <span>
                  Your currently have{" "}
                  <span className="text-[#5768D5] font-semibold">
                    {course.total} Course
                    {course.total > 1 ? "s " : " "}
                  </span>
                  on your plate.
                </span>
              )}
            </p>
          </div>
          {term?.isActive && !!course.courses.length && (
            <Button
              size="xs"
              color="#5768D5"
              leftSection={<IconPlus className=" size-5 -mr-1" stroke={1.5} />}
              className=" rounded-[8px] text-[12px] h-[32px] w-fit "
              onClick={openedAddModal}
            >
              Add Course
            </Button>
          )}
        </div>
        <div className="flex h-full w-full bg-white rounded-[5px]  overflow-hidden">
          {loading ? (
            <Loading />
          ) : course.courses.length === 0 ? (
            <div className=" flex flex-row flex-1 justify-between">
              <div className="h-full px-[60px] justify-center flex flex-col">
                <p className="text-primary text-h2 font-semibold">
                  No course found
                </p>
                <br />
                <p className=" -mt-4 mb-6  text-[#333333] text-b2 break-words font-400 leading-relaxed">
                  It looks like you haven't added any courses yet. <br />
                  Click 'Add Course' button below to get started!
                </p>
                {term?.isActive && (
                  <Button
                    color="#5768D5"
                    className=" rounded-[8px] text-[12px] w-28 font-medium  h-8 px-2 "
                    onClick={openedAddModal}
                  >
                    <IconPlus
                      className="h-5 w-5 mr-1"
                      stroke={1.5}
                      color="#ffffff"
                    />
                    Add course
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
              className="overflow-y-auto w-full h-fit max-h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-1"
              style={{ height: "fit-content", maxHeight: "100%" }}
            >
              {course.courses.map((item) => {
                const statusTQF3 = statusColor(item.TQF3?.status);
                const statusTQF5 = statusColor(item.TQF5?.status);
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
                                    openedModalEditCourse();
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
                                    openedMainPopup();
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
                      <p className="p-2.5 text-secondary font-semibold text-[12px]">
                        {item.sections.length} Section
                        {item.sections.length > 1 ? "s" : ""}
                      </p>
                      <div className="flex gap-3 px-2.5 font-semibold text-[11px] py-1 justify-end items-center">
                        <p
                          className={`px-1 border-[1px] rounded-md ${statusTQF3}`}
                        >
                          TQF 3
                        </p>
                        <p
                          className={`px-1 border-[1px] rounded-md ${statusTQF5}`}
                        >
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
