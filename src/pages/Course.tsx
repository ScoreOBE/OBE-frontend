import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { Button, Menu } from "@mantine/core";
import {
  IconDots,
  IconPencilMinus,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { IModelCourse } from "@/models/ModelCourse";
import { getOneCourse } from "@/services/course/course.service";
import { setCourseList } from "@/store/course";
import { getSection } from "@/helpers/functions/function";
import PageError from "./PageError";

export default function Course() {
  const { courseNo } = useParams();
  const [params, setParams] = useSearchParams();
  const error = useAppSelector((state) => state.errorResponse);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const academicYear = useAppSelector((state) => state.academicYear);
  const activeTerm = useLocation().state.activeTerm;
  const courseList = useAppSelector((state) => state.course);
  const [course, setCourse] = useState<IModelCourse>();

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await getOneCourse({
        academicYear: params.get("id"),
        courseNo,
      });
      if (res) {
        dispatch(setCourseList([res]));
        setCourse(res);
      }
    };

    if (!courseList.length && params.get("id")) fetchCourse();

    if (!course && courseNo) {
      setCourse(courseList.find((e) => e.courseNo == courseNo));
    }
  }, [academicYear, courseList]);

  return (
    <>
      {error.statusCode ? (
        <PageError />
      ) : (
        <div className="bg-white flex flex-col h-full w-full p-6 py-3 gap-3 overflow-hidden">
          <div className="flex flex-row  py-2  items-center justify-between">
            <p className="text-secondary text-[16px] font-semibold">
              {course?.sections.length} Section
              {course?.sections.length! > 1 && "s"}
            </p>
            {activeTerm && (
              <div className="flex gap-5 items-center">
                <Button
                  leftSection={<IconUpload className="h-5 w-5" />}
                  color="#5768D5"
                  className="rounded-[8px] font-semibold  text-[13px]  h-9 px-3"
                >
                  Upload and Assets
                </Button>
                <div className="rounded-full hover:bg-gray-300 p-1 cursor-pointer">
                  <IconDots />
                </div>
              </div>
            )}
          </div>
          <div className="flex h-full w-full rounded-[5px] pt-1  overflow-hidden">
            <div className="overflow-y-auto w-full h-fit max-h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-1">
              {course?.sections.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="card relative justify-between xl:h-[135px] md:h-[120px] cursor-pointer rounded-[4px] hover:bg-[#F3F3F3]"
                  >
                    <div className="p-2.5 flex flex-col">
                      <p className="font-semibold text-sm">
                        Section {getSection(item.sectionNo)}
                      </p>
                      {course.addFirstTime && activeTerm && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
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
                              <Menu.Item className="text-[#3E3E3E] font-semibold text-[12px] h-7 w-[180px] ">
                                <div className="flex items-center gap-2">
                                  <IconPencilMinus
                                    stroke={1.5}
                                    className="h-4 w-4"
                                  />
                                  <span>Edit Section</span>
                                </div>
                              </Menu.Item>
                              <Menu.Item
                                className="text-[#FF4747] hover:bg-[#d55757]/10 font-semibold text-[12px] h-7 w-[180px]"
                                // onClick={() => onClickDeleteCourse(item.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <IconTrash className="h-4 w-4" stroke={1.5} />
                                  <span>Delete Section</span>
                                </div>
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </div>
                      )}
                    </div>
                    <div className="bg-[#e7eaff] flex h-8 items-center justify-between rounded-b-[4px]">
                      <p className="p-2.5 text-secondary font-semibold text-[12px]">
                        {(item.assignments?.length ?? 0) === 1
                          ? "Assignment"
                          : (item.assignments?.length ?? 0) > 1
                          ? "Assignments"
                          : "No Assignment"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
