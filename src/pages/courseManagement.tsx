import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Menu, Switch } from "@mantine/core";
import { IconDots, IconTrash, IconEdit } from "@tabler/icons-react";
import { IModelCourse } from "@/models/ModelCourse";
import { getCourse, getOneCourse } from "@/services/course/course.service";
import { addLoadMoreCourse, setCourseList } from "@/store/course";
import ManageAdminIcon from "@/assets/icons/manageAdmin.svg?react";
import Icon from "@/components/Icon";
import { CourseManagementRequestDTO } from "@/services/courseManagement/dto/courseManagement.dto";
import { getCourseManagement } from "@/services/courseManagement/courseManagement.service";
import { setLoading } from "@/store/loading";
import InfiniteScroll from "react-infinite-scroll-component";
import { COURSE_TYPE } from "@/helpers/constants/enum";
import {
  getCourseNo,
  getSection,
  getUserName,
} from "@/helpers/functions/function";

export default function CourseManagement() {
  const [payload, setPayload] = useState<any>();
  const [courseManagement, setCourseManagement] = useState<any[]>([]);
  // const courseManagement = useAppSelector((state) => state.course);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const payloadCourse = {
      ...new CourseManagementRequestDTO(),
      hasMore: true,
    };
    setPayload(payloadCourse);
    fetchCourse(payloadCourse);
  }, []);

  const fetchCourse = async (payloadCourse: any) => {
    dispatch(setLoading(true));
    const res = await getCourseManagement(payloadCourse);
    if (res) {
      setCourseManagement(res);
      // dispatch(setCourseList(res));
    }
    dispatch(setLoading(false));
    console.log(courseManagement);
  };

  const onShowMore = async () => {
    const res = await getCourseManagement({
      ...payload,
      page: payload.page + 1,
    });
    if (res.length) {
      setCourseManagement([...courseManagement, ...res]);
      // dispatch(addLoadMoreCourse(res));
      setPayload({
        ...payload,
        page: payload.page + 1,
        hasMore: res.length >= payload.limit,
      });
    } else {
      setPayload({ ...payload, hasMore: false });
    }
  };

  return (
    <div className="bg-[#ffffff] flex flex-col h-full w-full p-6 py-3 gap-3 overflow-hidden">
      <div className="flex flex-col  py-1 gap-1 items-start ">
        <p className="text-secondary text-[16px] font-semibold">Dashboard</p>
        <p className="text-tertiary text-[12px] font-medium">XX Courses</p>
      </div>
      {/* Course Detail */}
      <InfiniteScroll
        dataLength={courseManagement.length}
        next={onShowMore}
        height={"100%"}
        loader={<></>}
        hasMore={payload?.hasMore}
        className="overflow-y-auto w-full h-fit max-h-full flex flex-col gap-4 p-1"
        style={{ height: "fit-content", maxHeight: "100%" }}
      >
        {courseManagement.map((course, index) => (
          <div
            key={index}
            className="bg-[#F4F5FE] flex flex-col rounded-lg py-5 px-8 gap-4"
          >
            {/* Course Topic */}
            <div className="gap-3 flex items-center w-full justify-between">
              <div className="flex flex-col w-[25%]">
                <p className="font-semibold text-[14px] text-secondary">
                  {getCourseNo(course.courseNo)}
                </p>
                <p className="text-[12px] font-normal text-[#4E5150] flex-wrap ">
                  {course.courseName}
                </p>
              </div>

              <div className="rounded-full hover:bg-gray-300 p-1 cursor-pointer">
                <IconDots />
              </div>
            </div>
            {/* Section */}
            {course.sections.map((sec: any) => (
              <div className="flex flex-col gap-4">
                <div
                  className="bg-white py-3 px-5 rounded-lg"
                  style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.20)" }}
                >
                  <div className="gap-3 flex items-center justify-between ">
                    <div className="flex flex-row items-center w-fit gap-6">
                      <div className="flex flex-col w-56">
                        <p className="font-semibold text-[14px] text-tertiary">
                          Section {getSection(sec.sectionNo)}
                          {/* {e.courseNo} */}
                        </p>
                        {course.type === COURSE_TYPE.SEL_TOPIC && (
                          <p className="text-[12px] font-normal text-[#4E5150] flex-wrap ">
                            {sec.topic}
                          </p>
                        )}
                      </div>

                      <div
                        className={`px-4 py-2  rounded-full text-white text-[12px] font-medium ${
                          sec.isActive ? "bg-[#13CE66]" : "bg-[#919191]"
                        } `}
                      >
                        <p>{sec.isActive ? "Active" : "Inactive"}</p>
                      </div>
                    </div>

                    <div className="flex flex-row w-[60%] items-center justify-between text-[#4E5150] text-[12px] font-normal ">
                      {/* Main Instructor */}
                      <p className="text-wrap w-[20%]">Thanaporn P.</p>
                      {/* Open Symester */}
                      <div className="flex flex-row gap-1 w-[30%]">
                        <p className="text-wrap ">Open Semester</p>
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
                      <div className="flex flex-row gap-4">
                        <Button className="flex flex-row justify-center items-center bg-transparent  border-1 border-secondary text-secondary h-8 w-8 bg-none rounded-lg  cursor-pointer hover:bg-secondary ">
                          <Icon IconComponent={ManageAdminIcon} />
                        </Button>
                        <Button className="flex flex-row justify-center items-center bg-transparent  border-1 border-[#F39D4E] text-[#F39D4E] h-8 w-8 bg-none rounded-lg  cursor-pointer hover:bg-[#F39D4E]">
                          <IconEdit className="size-4" stroke={1.5} />
                        </Button>
                        <Button className="flex flex-row justify-center items-center bg-transparent  border-1 border-[#FF4747] text-[#FF4747] h-8 w-8 bg-none rounded-lg  cursor-pointer hover:bg-[#FF4747]">
                          <IconTrash className="size-4" stroke={1.5} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
function dispatch(arg0: { payload: any; type: "course/addLoadMoreCourse" }) {
  throw new Error("Function not implemented.");
}
