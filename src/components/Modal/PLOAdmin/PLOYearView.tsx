import Icon from "@/components/Icon";
import IconExcel from "@/assets/icons/excel.svg?react";
import { COURSE_TYPE, ROLE } from "@/helpers/constants/enum";
import { IModelCourse } from "@/models/ModelCourse";
import { IModelCurriculum } from "@/models/ModelFaculty";
import { IModelPLO, IModelPLONo } from "@/models/ModelPLO";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { getOnePLO } from "@/services/plo/plo.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { setLoadingOverlay } from "@/store/loading";
import { Button, Modal, Select, Tabs } from "@mantine/core";
import { ScrollArea } from "@mantine/core";
import { useEffect, useState } from "react";
import ModalExportPLO from "../ModalExportPLO";
import { getUniqueTopicsWithTQF, sortData } from "@/helpers/functions/function";
import { calPloScore } from "@/helpers/functions/score";

export type CoursePloScore = {
  label: string;
  year: number;
  semester: number;
  courseNo: string;
  courseName: string;
  sections?: string[];
  topic?: string;
  ploRequire: (Partial<IModelPLONo> & { avgScore: number | "N/A" })[];
};

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function PLOYearView({ opened, onClose }: Props) {
  const user = useAppSelector((state) => state.user);
  const curriculum = useAppSelector((state) => state.faculty.curriculum);
  const dispatch = useAppDispatch();
  const currentYear = useAppSelector(
    (state) => state.academicYear.find(({ isActive }) => isActive)?.year
  );
  const [selectYear, setSelectYear] = useState<string | null>();
  const yearOption = Array.from({ length: 5 }, (_, i) =>
    (currentYear! - i).toString()
  );
  const [courses, setCourses] = useState<IModelCourse[]>([]);
  const [coursePloScoreList, setCoursePloScoreList] = useState<
    CoursePloScore[]
  >([]);
  const [curriculumList, setCurriculumList] = useState<IModelCurriculum[]>([]);
  const [selectCurriculum, setSelectCurriculum] = useState<
    Partial<IModelCurriculum>
  >({});
  const [curriculumPLO, setCurriculumPLO] = useState<Partial<IModelPLO>>({});
  const [openModalExportPLO, setOpenModalExportPLO] = useState(false);
  const semesters = [
    { title: "Semester 1", semester: 1 },
    { title: "Semester 2", semester: 2 },
    { title: "Semester 3", semester: 3 },
  ];

  useEffect(() => {
    if (curriculum?.length) {
      if (user.role == ROLE.ADMIN) {
        setCurriculumList(curriculum);
      } else {
        setCurriculumList(
          curriculum.filter(({ code }) => user.curriculums?.includes(code))
        );
      }
    }
  }, [curriculum]);

  useEffect(() => {
    if (currentYear && curriculumList.length) {
      setSelectYear(currentYear.toString());
      setSelectCurriculum({
        nameEN: curriculumList[0].code,
        code: curriculumList[0].code,
      });
    }
  }, [currentYear, curriculumList]);

  useEffect(() => {
    if (opened && selectYear && selectCurriculum) {
      fetchPLO();
      fetchCourse();
    }
  }, [opened, selectYear, selectCurriculum]);

  useEffect(() => {
    if (courses.length) {
      const list: CoursePloScore[] = [];
      courses.map((course) => {
        const uniqueTopic = getUniqueTopicsWithTQF(course.sections!);
        let ploRequire =
          course.ploRequire?.find(
            (item) => item.curriculum == selectCurriculum.code
          )?.list || [];
        let ploItem: any = course.TQF3
          ? ploRequire.map((plo) => {
              return {
                ...curriculumPLO.data?.find(({ id }) => id == plo),
                avgScore: calPloScore(
                  selectCurriculum.code,
                  course.TQF3!,
                  course.TQF5!,
                  plo
                ),
              };
            })
          : [];
        sortData(ploItem, "no");
        if (course.type == COURSE_TYPE.SEL_TOPIC.en) {
          uniqueTopic.map((sec) => {
            ploRequire =
              sec.ploRequire?.find(
                (item) => item.curriculum == selectCurriculum.code
              )?.list || [];
            ploItem = ploRequire.map((plo) => {
              return {
                ...curriculumPLO.data?.find(({ id }) => id == plo),
                avgScore: calPloScore(
                  selectCurriculum.code,
                  sec.TQF3!,
                  sec.TQF5!,
                  plo
                ),
              };
            });
            sortData(ploItem, "no");
            if (ploRequire.length) {
              list.push({
                label: `${course.courseNo} - ${sec.topic}`,
                year: course.year,
                semester: course.semester,
                courseNo: course.courseNo,
                courseName: course.courseName,
                topic: sec.topic,
                ploRequire: ploItem,
              });
            }
          });
        } else if (ploRequire.length) {
          list.push({
            label: course.courseNo,
            year: course.year,
            semester: course.semester,
            courseNo: course.courseNo,
            courseName: course.courseName,
            ploRequire: ploItem,
          });
        }
      });
      setCoursePloScoreList(list);
    } else {
      setCoursePloScoreList([]);
    }
  }, [courses]);

  const fetchCourse = async () => {
    dispatch(setLoadingOverlay(true));
    const res = await getCourse({
      ...new CourseRequestDTO(),
      manage: true,
      ignorePage: true,
      ploRequire: true,
      year: parseInt(selectYear!),
      curriculum: [selectCurriculum.code!],
    });
    if (res) {
      setCourses(res.courses);
    }
    dispatch(setLoadingOverlay(false));
  };

  const fetchPLO = async () => {
    const resPloCol = await getOnePLO({ curriculum: selectCurriculum.code });
    if (resPloCol) {
      setCurriculumPLO(resPloCol);
    }
  };

  return (
    <>
      {selectYear && selectCurriculum.code && (
        <ModalExportPLO
          opened={openModalExportPLO}
          onClose={() => setOpenModalExportPLO(false)}
          curriculum={selectCurriculum.code}
          year={selectYear}
          plo={curriculumPLO}
          data={coursePloScoreList}
        />
      )}
      <Modal.Root
        opened={opened}
        onClose={onClose}
        autoFocus={false}
        fullScreen={true}
        zIndex={50}
        classNames={{ content: "!pt-0 !bg-[#fafafa]" }}
      >
        <Modal.Content className="overflow-hidden !rounded-none !px-0">
          {/* Header */}
          <Modal.Header className="flex w-full !bg-[#fafafa] !pb-0 !px-0 !pt-4 rounded-none">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex px-12 w-full justify-between items-center">
                <div className="flex items-center gap-3">
                  <Modal.CloseButton className="ml-0" />
                  <p className="font-semibold text-h2  text-secondary">
                    Year View
                  </p>
                  <Select
                    size="xs"
                    data={yearOption}
                    value={selectYear}
                    onChange={setSelectYear}
                    allowDeselect={false}
                    classNames={{
                      input:
                        "focus:border-primary w-24 acerSwift:max-macair133:!text-b5",
                      label: "acerSwift:max-macair133:!text-b4",
                    }}
                  />
                </div>

                <Button
                  color="#20884f"
                  onClick={() => setOpenModalExportPLO(true)}
                  className="font-semibold text-b4 acerSwift:max-macair133:!text-b5 h-7 "
                >
                  <div className="flex items-center  gap-2">
                    <Icon
                      className="size-4 acerSwift:max-macair133:!size-3.5"
                      IconComponent={IconExcel}
                    />
                    <span>Export PLO</span>
                  </div>
                </Button>
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
                }}
              >
                <Tabs.List
                  grow
                  className="!bg-transparent gap-3 flex-nowrap px-[53px] overflow-x-auto items-center flex w-full"
                >
                  {curriculumList?.map((cur) => (
                    <Tabs.Tab key={cur.code} value={cur.code!}>
                      {cur.code}
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs>
            </div>
          </Modal.Header>
          {/* Body */}
          <Modal.Body className="flex h-full  w-full gap-4 pt-4 pb-[104px] overflow-hidden">
            {semesters.map((semester) => {
              const courseList = coursePloScoreList.filter(
                (course) => course.semester == semester.semester
              );
              return (
                <div
                  key={semester.semester}
                  className="bg-white w-full rounded-xl shadow p-5 border h-full flex flex-col flex-1"
                >
                  <h3 className="text-lg font-bold text-gray-700">
                    {semester.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {courseList.length}{" "}
                    {courseList?.length <= 1 ? "Course" : "Courses"}
                  </p>
                  <ScrollArea className="mt-4 flex-1 h-full  overflow-auto">
                    {!!courseList.length ? (
                      courseList.map((course, index) => {
                        return (
                          <div
                            key={index}
                            className="p-4 mb-4 border rounded-lg shadow-sm bg-gray-50"
                          >
                            <p className="text-sm font-bold text-gray-700">
                              {course.courseNo}
                            </p>
                            <p className="text-xs text-gray-500">
                              {course.courseName} {course.topic && course.topic}
                            </p>
                            <div className="mt-3 p-3 bg-bgTableHeader rounded-md">
                              {course.ploRequire.map((plo, ploIndex) => (
                                <div
                                  key={ploIndex}
                                  className="flex justify-between py-1 text-xs"
                                >
                                  <p>PLO {plo.no}</p>
                                  <p className="font-medium text-blue-600">
                                    {plo.avgScore}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-[65vh] w-full flex items-center text-center justify-center flex-1">
                        <p className=" text-noData font-semibold">
                          No Course Found
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              );
            })}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
