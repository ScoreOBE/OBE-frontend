import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Button, Menu } from "@mantine/core";
import {
  IconDots,
  IconPencilMinus,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { statusColor } from "@/helpers/functions/function";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteCourse, getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { addLoadMoreCourse, removeCourse } from "@/store/course";
import InfiniteScroll from "react-infinite-scroll-component";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import ModalAddCourse from "@/components/Modal/ModalAddCourse";
import { useDisclosure } from "@mantine/hooks";
import notFoundImage from "@/assets/image/notFound.png";
import { ROUTE_PATH } from "@/helpers/constants/route";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const course = useAppSelector((state) => state.course);
  const dispatch = useAppDispatch();
  const totalCourses = parseInt(localStorage.getItem("totalCourses") ?? "0");
  const [payload, setPayload] = useState<any>();
  const [params, setParams] = useSearchParams({});
  const [term, setTerm] = useState<IModelAcademicYear>();
  const [openAddModal, { open: openedAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const loading = useAppSelector((state) => state.loading);

  useEffect(() => {
    const year = parseInt(params.get("year")!);
    const semester = parseInt(params.get("semester")!);
    if (year != term?.year && semester != term?.semester) {
      const acaYear = academicYear.find(
        (e) => e.semester == semester && e.year == year
      );
      if (acaYear) {
        setTerm(acaYear);
        setPayload({
          ...new CourseRequestDTO(),
          academicYear: acaYear.id,
          hasMore: true,
        });
      }
    }
  }, [academicYear, params]);

  useEffect(() => {
    if (term) {
      setPayload({
        ...new CourseRequestDTO(),
        academicYear: term.id,
        hasMore: true,
      });
      localStorage.removeItem("search");
    }
  }, [localStorage.getItem("search")]);

  const onSowMore = async () => {
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
    }
  };

  const goToCourse = (courseNo: number) => {
    navigate(
      `${ROUTE_PATH.COURSE}/${courseNo}?year=${term?.year}&semester=${term?.semester}`
    );
  };

  return (
    <div className="bg-[#F6F6F6] flex flex-col h-full w-full p-6 py-5 gap-3 overflow-hidden">
      <ModalAddCourse opened={openAddModal} onClose={closeAddModal} />
      <div className="flex flex-row  items-center justify-between">
        <div className="flex flex-col">
          <p className="text-[#6869AD] text-[20px] font-medium mb-[1px]">
            Hi there, {user.firstNameEN} {user.lastNameEN?.slice(0, 1)}.
          </p>
          <p className="text-[#575757] text-[14px]">
            In semester {term?.semester}, {term?.year}!{" "}
            {course.length === 0 ? (
              <span>Your course card is currently empty</span>
            ) : (
              <span>
                You currently have{" "}
                <span className="text-[#5768D5] font-semibold">
                  {totalCourses} Course
                  {totalCourses > 1 ? "s " : " "}
                </span>
                on your plate. Let dive in!
              </span>
            )}
          </p>
        </div>
        {course.length === 0 ? (
          <span></span>
        ) : (
          <Button
            color="#6869AD"
            leftSection={<IconPlus className="h-5 w-5 -mr-1" stroke={1.5} />}
            className=" rounded-[10px]  text-[12px] font-medium h-8 px-3"
            onClick={openedAddModal}
          >
            Add course
          </Button>
        )}
      </div>
      <div
        className="flex h-full w-full bg-white rounded-[5px] p-3 overflow-hidden"
        style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.50)" }}
      >
        {loading ? (
          <div>hello</div>
        ) : course.length === 0 ? (
          <div className=" flex flex-row flex-1 justify-between">
            <div className="h-full px-[60px] justify-center flex flex-col">
              <p className="text-primary text-h2 font-semibold">
                No course found
              </p>
              <br />
              <p className=" -mt-4 mb-6  text-black text-b2 break-words font-400 leading-relaxed">
                It looks like you haven't added any courses yet. <br />
                Click 'Add Course' button below to get started!
              </p>
              {term?.isActive && (
                <Button
                  className=" rounded-[8px] text-[12px] w-28 font-medium bg-[#6869AD] h-8 px-2 hover:bg-[#52538A]"
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
            dataLength={course.length}
            next={onSowMore}
            height={"100%"}
            loader={<></>}
            hasMore={payload?.hasMore}
            className="overflow-y-auto w-full h-fit max-h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-1"
            style={{ height: "fit-content", maxHeight: "100%" }}
          >
            {course.map((item) => {
              const statusTQF3 = statusColor(item.TQF3?.status);
              const statusTQF5 = statusColor(item.TQF5?.status);
              return (
                <div
                  key={item.id}
                  className="card relative justify-between xl:h-[145px] md:h-[130px] cursor-pointer rounded-md hover:bg-[#F3F3F3]"
                  style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)" }}
                  onClick={() => goToCourse(item.courseNo)}
                >
                  <div className="p-2.5 flex flex-col">
                    <p className="font-semibold">{item.courseNo}</p>
                    <p className="text-xs font-medium text-gray-600">
                      {item.courseName}
                    </p>
                    {item.addFirstTime && (
                      <Menu trigger="click" position="bottom-end" offset={2}>
                        <Menu.Target>
                          <IconDots className="absolute top-2 right-2 rounded-full hover:bg-gray-300" />
                        </Menu.Target>
                        <Menu.Dropdown
                          className="rounded-xl backdrop-blur-xl bg-white/70 "
                          style={{
                            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          <Menu.Item className="text-[#3E3E3E] h-8 w-[200px] hover:bg-[#5768D5]/20">
                            <div className="flex items-center gap-2">
                              <IconPencilMinus
                                stroke={1.5}
                                className="h-5 w-5"
                              />
                              <span>Edit Course</span>
                            </div>
                          </Menu.Item>
                          <Menu.Item
                            className="text-[#FF4747] h-8 w-[200px] hover:bg-[#d55757]/20"
                            onClick={() => onClickDeleteCourse(item.id)}
                          >
                            <div className="flex items-center gap-2">
                              <IconTrash className="h-5 w-5" stroke={1.5} />
                              <span>Delete Course</span>
                            </div>
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    )}
                  </div>
                  <div className="bg-primary flex h-8 items-center justify-between rounded-b-md">
                    <p className="p-2.5 text-white font-medium text-[12px]">
                      {item.sections.length} Section
                      {item.sections.length > 1 ? "s" : ""}
                    </p>
                    <div className="flex gap-3 px-2.5 font-medium text-[11px] py-1 justify-end items-center">
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
  );
}
