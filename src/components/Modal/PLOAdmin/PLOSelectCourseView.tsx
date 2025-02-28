import {
  Checkbox,
  Modal,
  Select,
  Group,
  Button,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { TbSearch } from "react-icons/tb";
import { IModelCourse } from "@/models/ModelCourse";
import { IModelCurriculum } from "@/models/ModelFaculty";
import { COURSE_TYPE, ROLE } from "@/helpers/constants/enum";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { setLoadingOverlay } from "@/store/loading";
import { CoursePloScore } from "./PLOYearView";
import {
  getSectionNo,
  getUniqueTopicsWithTQF,
  sortData,
} from "@/helpers/functions/function";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { IModelTQF5 } from "@/models/ModelTQF5";
import { IModelPLO } from "@/models/ModelPLO";
import { getPLOs } from "@/services/plo/plo.service";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function PLOSelectCourseView({ opened, onClose }: Props) {
  const user = useAppSelector((state) => state.user);
  const currentYear = useAppSelector(
    (state) => state.academicYear.find(({ isActive }) => isActive)?.year
  );
  const dispatch = useAppDispatch();
  const curriculum = useAppSelector((state) => state.faculty.curriculum);
  const [curriculumList, setCurriculumList] = useState<IModelCurriculum[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<string | null>();
  const [curriculumPLOs, setCurriculumPLOs] = useState<Partial<IModelPLO>[]>(
    []
  );
  const [courses, setCourses] = useState<IModelCourse[]>([]);
  const [courseOption, setCourseOption] = useState<
    { value: string; courseNo: string; courseName: string; topic?: string }[]
  >([]);
  const [coursePloScoreList, setCoursePloScoreList] = useState<
    CoursePloScore[]
  >([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string[]>([]);

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
    if (selectedCurriculum?.length) {
      fetchCourse();
    } else {
      setCourses([]);
      setSelectedCourse([]);
    }
  }, [selectedCurriculum]);

  useEffect(() => {
    if (opened && currentYear && selectedCurriculum?.length) {
      clearFilter();
      fetchPLO();
      fetchCourse();
    } else {
      setSelectedCurriculum(undefined);
    }
  }, [opened, selectedCurriculum]);

  useEffect(() => {
    if (courses.length) {
      const ploScore = (tqf3: IModelTQF3, tqf5: IModelTQF5, plo: string) => {
        const clos = tqf3.part7?.list
          ?.find((e) => e.curriculum == selectedCurriculum)
          ?.data.filter(({ plos }) => (plos as string[]).includes(plo))
          .map(({ clo }) => clo);
        const sum = clos?.length
          ? tqf5.part3?.data
              .filter(({ clo }) => clos?.includes(clo))
              .reduce((a, b) => a + b.score, 0)
          : undefined;
        const score = sum ? sum / (clos?.length ?? 1) : "N/A";
        return score;
      };
      const options: {
        value: string;
        courseNo: string;
        courseName: string;
        topic?: string;
      }[] = [];
      const list: CoursePloScore[] = [];
      courses.map((course) => {
        const uniqueTopic = getUniqueTopicsWithTQF(course.sections!);
        let ploRequire = course.ploRequire?.find(
          (item) =>
            item.curriculum == selectedCurriculum &&
            curriculumPLOs.find(({ id }) => id == item.plo)
        );
        let tempPlo = curriculumPLOs.find(({ id }) => id == ploRequire?.plo)!;
        let ploItem: any = course.TQF3
          ? ploRequire?.list.map((plo) => {
              return {
                ...tempPlo.data?.find(({ id }) => id == plo),
                avgScore: ploScore(course.TQF3!, course.TQF5!, plo),
              };
            })
          : [];
        sortData(ploItem, "no");
        if (course.type == COURSE_TYPE.SEL_TOPIC.en) {
          uniqueTopic.map((sec) => {
            ploRequire = sec.ploRequire?.find(
              (item) =>
                item.curriculum == selectedCurriculum &&
                curriculumPLOs.find(({ id }) => id == item.plo)
            );
            tempPlo = curriculumPLOs.find(({ id }) => id == ploRequire?.plo)!;
            ploItem = ploRequire?.list.map((plo) => {
              return {
                ...tempPlo.data?.find(({ id }) => id == plo),
                avgScore: ploScore(sec.TQF3!, sec.TQF5!, plo),
              };
            });
            sortData(ploItem, "no");
            if (ploRequire?.list.length) {
              if (
                !options.find(
                  (item) =>
                    item.courseNo == course.courseNo && item.topic == sec.topic
                )
              ) {
                options.push({
                  value: `${course.courseNo} - ${sec.topic}`,
                  courseNo: course.courseNo,
                  courseName: course.courseName,
                  topic: sec.topic,
                });
              }
              console.log(
                course.sections
                  .filter(
                    ({ curriculum, topic, isActive }) =>
                      curriculum == selectedCurriculum &&
                      isActive &&
                      topic == sec.topic
                  )
                  .map(({ sectionNo }) => getSectionNo(sectionNo))
              );

              list.push({
                label: `${course.courseNo} - ${sec.topic}`,
                year: course.year,
                semester: course.semester,
                courseNo: course.courseNo,
                courseName: course.courseName,
                sections: course.sections
                  .filter(
                    ({ curriculum, topic, isActive }) =>
                      curriculum == selectedCurriculum &&
                      isActive &&
                      topic == sec.topic
                  )
                  .map(({ sectionNo }) => getSectionNo(sectionNo)),
                topic: sec.topic,
                ploRequire: ploItem,
              });
            }
          });
        } else if (ploRequire?.list.length) {
          if (!options.find((item) => item.courseNo == course.courseNo)) {
            options.push({
              value: course.courseNo,
              courseNo: course.courseNo,
              courseName: course.courseName,
            });
          }
          console.log(
            course.sections
              .filter(
                ({ curriculum, isActive }) =>
                  curriculum == selectedCurriculum && isActive
              )
              .map(({ sectionNo }) => getSectionNo(sectionNo))
          );
          list.push({
            label: course.courseNo,
            year: course.year,
            semester: course.semester,
            courseNo: course.courseNo,
            courseName: course.courseName,
            sections: course.sections
              .filter(
                ({ curriculum, isActive }) =>
                  curriculum == selectedCurriculum && isActive
              )
              .map(({ sectionNo }) => getSectionNo(sectionNo)),
            ploRequire: ploItem,
          });
        }
      });
      setCoursePloScoreList(list);
      setCourseOption(options);
    } else {
      setCoursePloScoreList([]);
      setCourseOption([]);
    }
  }, [courses]);

  const fetchCourse = async () => {
    dispatch(setLoadingOverlay(true));
    const res = await getCourse({
      ...new CourseRequestDTO(),
      manage: true,
      ignorePage: true,
      ploRequire: true,
      curriculumPlo: true,
      year: currentYear!,
      curriculum: [selectedCurriculum!],
    });
    if (res) {
      setCourses(res.courses);
    }
    dispatch(setLoadingOverlay(false));
  };

  const fetchPLO = async () => {
    const resPloCol = await getPLOs({
      curriculum: [selectedCurriculum],
    });
    if (resPloCol) {
      setCurriculumPLOs(
        resPloCol.plos.find((item: any) => item.code == selectedCurriculum)
          .collections
      );
    }
  };

  const clearFilter = () => {
    setSearchValue("");
    setSelectedCourse([]);
  };

  return (
    <Modal.Root
      opened={opened}
      onClose={onClose}
      autoFocus={false}
      fullScreen={true}
      zIndex={50}
      classNames={{ content: "!p-0 !bg-[#fafafa]" }}
    >
      <Modal.Content>
        {/* Header */}
        <Modal.Header className="flex w-full h-[64px] !bg-white px-6 !py-4 border-b">
          <div className="flex items-center gap-3">
            <Modal.CloseButton className="ml-0" />
            <p className="font-semibold text-h2  text-secondary">
              Curriculum View
            </p>
          </div>
        </Modal.Header>
        {/* Body */}
        <Modal.Body className="flex h-full max-h-[92vh] m p-6 px-10   gap-4 overflow-hidden">
          {/* Left Section */}
          <div className="w-1/3 bg-white shadow-lg flex flex-col rounded-lg p-5 border justify-between overflow-y-clip border-gray-200">
            <div className="flex flex-col w-full">
              <div className="flex flex-col w-full ">
                <div className="mb-2 text-secondary">
                  <p className="text-[14px] font-semibold">
                    Step 1: Select Curriculum
                  </p>
                  <p className="text-[12px] text-gray-500">
                    Courses below will be available once you make a selection.
                  </p>
                </div>

                <div className="flex gap-3 mb-4 pb-4 border-b ">
                  <Select
                    rightSectionPointerEvents="all"
                    label="Select Curriculum"
                    placeholder="Curriculum"
                    data={curriculumList?.map((cur) => ({
                      value: cur.code,
                      label: `${cur.nameTH} [${cur.code}]`,
                    }))}
                    value={selectedCurriculum}
                    onChange={(event) => setSelectedCurriculum(event)}
                    searchable
                    size="xs"
                    nothingFoundMessage="No result"
                    className="w-full border-none "
                    classNames={{
                      input: `rounded-md`,
                      option: `py-1`,
                      label: `!text-[12px]`,
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col border-b w-full  mb-4">
                <div className="mb-3 text-secondary">
                  <p className="text-[14px] font-semibold">
                    Step 2: Select Courses
                  </p>
                  {!selectedCurriculum && (
                    <p className="text-[12px] text-gray-500">
                      Please select a curriculum first.
                    </p>
                  )}
                </div>
                <div>
                  <TextInput
                    leftSection={<TbSearch />}
                    placeholder="Course No / Course Name / Course Topic"
                    size="xs"
                    value={searchValue}
                    onChange={(event: any) =>
                      setSearchValue(event.currentTarget.value)
                    }
                  />
                  <Checkbox.Group
                    classNames={{
                      label:
                        "mb-1 font-semibold text-default acerSwift:max-macair133:!text-b4",
                    }}
                    value={selectedCourse}
                    onChange={setSelectedCourse}
                    className="!h-full   my-3 "
                  >
                    <div className="flex flex-col gap-4 overflow-y-auto h-[40vh]">
                      {courseOption
                        .filter(
                          (item) =>
                            item.courseNo
                              .toLowerCase()
                              .includes(searchValue.toLowerCase()) ||
                            item.courseName
                              .toLowerCase()
                              .includes(searchValue.toLowerCase()) ||
                            item.topic
                              ?.toLowerCase()
                              .includes(searchValue.toLowerCase())
                        )
                        .map((item) => (
                          <Checkbox.Card
                            key={item.value}
                            className={`p-3 items-center px-4 flex h-fit rounded-md w-full ${
                              selectedCourse.includes(item.value) &&
                              "!border-[1px] !border-secondary"
                            }`}
                            style={{
                              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.15)",
                            }}
                            value={item.value}
                          >
                            <Group
                              wrap="nowrap"
                              className="items-center flex"
                              align="flex-start"
                            >
                              <Checkbox.Indicator className="mt-1" />
                              <div className="flex flex-col w-fit !text-b4">
                                <p className="font-bold text-secondary">
                                  {item.courseNo}
                                </p>
                                <p className="font-medium text-[#4E5150] flex-wrap ">
                                  {item.courseName}
                                  <br />
                                  {item.topic && `(${item.topic})`}
                                </p>
                              </div>
                            </Group>
                          </Checkbox.Card>
                        ))}
                    </div>
                  </Checkbox.Group>
                </div>
              </div>
            </div>
            <Button
              className="!w-full bg-delete hover:bg-[#ed4141] !text-[13px] !font-semibold !h-10"
              onClick={clearFilter}
            >
              Clear Filter
            </Button>
          </div>

          {/* Right Section */}
          <div className="w-2/3 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-secondary">
                {selectedCurriculum} Curriculum
              </p>
              <p className="text-sm text-gray-600">
                {courseOption.length} Courses
              </p>
            </div>
            <div className="h-full overflow-y-auto space-y-4">
              {selectedCourse.map((item) => {
                const course = courseOption.find(({ value }) => value == item)!;
                const list = coursePloScoreList.filter(
                  ({ label }) => label == item
                );
                return (
                  <div
                    key={item}
                    className="bg-white shadow-md rounded-lg p-5 border"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-sm font-bold text-secondary">
                          {course.courseNo}
                        </p>
                        <p className="text-xs text-gray-600">
                          {course.courseName} <br />
                          {course.topic && `(${course.topic})`}
                        </p>
                      </div>
                    </div>

                    {/* Sections */}
                    {list.map((course, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 rounded-md p-4 mb-2"
                      >
                        <p className="text-sm font-semibold text-default">
                          Section:{" "}
                          {course.sections?.length
                            ? course.sections?.join(", ")
                            : "All Section not active"}
                        </p>
                        <p className="text-xs text-gray-600">
                          Semester {course.semester}/{course.year}
                        </p>

                        {/* PLO Scores */}
                        {!!course.sections?.length && (
                          <div className="mt-3 p-3 bg-bgTableHeader rounded-md">
                            {course.ploRequire.map((plo, ploIndex) => (
                              <div
                                key={ploIndex}
                                className="flex justify-between py-1 text-xs"
                              >
                                <p>PLO {plo.no}</p>
                                <p className="font-medium text-secondary">
                                  {plo.avgScore != "N/A"
                                    ? plo.avgScore.toFixed(2)
                                    : plo.avgScore}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
