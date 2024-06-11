import store, { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { statusColor } from "@/helpers/functions/function";
import { useSearchParams } from "react-router-dom";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { addLoadMoreCourse, setCourse } from "@/store/course";
import InfiniteScroll from "react-infinite-scroll-component";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import ModalAddCourse from "@/components/Modal/ModalAddCourse";
import { useDisclosure } from "@mantine/hooks";

export default function Dashboard() {
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

  return (
    <div className="bg-[#F6F6F6] flex flex-col h-full w-full p-6 py-5 gap-3 overflow-hidden">
      <ModalAddCourse opened={openAddModal} onClose={closeAddModal} />
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="text-[#6869AD] text-[22px] font-medium mb-[2px]">
            Hi there, {user.firstNameEN} {user.lastNameEN?.slice(0, 1)}.
          </p>
          <p className="text-[#575757] text-[14px]">
            In semester {term?.semester}, {term?.year}! You currently have{" "}
            <span className="text-[#5768D5] font-semibold">
              {totalCourses} Course
              {totalCourses > 1 ? "s " : " "}
            </span>
            on your plate. Let dive in!
          </p>
        </div>
        <Button
          className=" rounded-[8px] text-[12px] font-medium bg-[#6869AD] h-8 px-2 hover:bg-[#52538A]"
          onClick={openedAddModal}
        >
          <IconPlus className="h-5 w-5 mr-1" stroke={1.5} color="#ffffff" />
          Add course
        </Button>
      </div>
      <div
        className="flex h-full w-full bg-white rounded-[5px] p-3 overflow-hidden"
        style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.50)" }}
      >
        <InfiniteScroll
          dataLength={course.length}
          next={() => onSowMore()}
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
                className="card justify-between xl:h-[145px] md:h-[130px] cursor-pointer rounded-md hover:bg-[#F3F3F3]"
                style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)" }}
              >
                <div className="p-2.5">
                  <p className="font-semibold">{item.courseNo}</p>
                  <p className="text-xs font-medium text-gray-600">
                    {item.courseName}
                  </p>
                </div>
                <div className="bg-primary flex h-8 items-center justify-between rounded-b-md">
                  <p className="p-2.5 text-white font-medium text-[12px]">
                    {item.sections.length} Section
                    {item.sections.length > 1 ? "s" : ""}
                  </p>
                  <div className="flex gap-3 px-2.5 font-medium text-[11px] py-1 justify-end items-center">
                    <p className={`px-1 border-[1px] rounded-md ${statusTQF3}`}>
                      TQF 3
                    </p>
                    <p className={`px-1 border-[1px] rounded-md ${statusTQF5}`}>
                      TQF 5
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
}
