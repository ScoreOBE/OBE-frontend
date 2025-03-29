import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Alert, Button, Group, Menu, Modal, Radio, Tabs } from "@mantine/core";
import Icon from "@/components/Icon";
import IconDots from "@/assets/icons/dots.svg?react";
import IconCheck from "@/assets/icons/Check.svg?react";
import IconEdit from "@/assets/icons/edit.svg?react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconOneToMany from "@/assets/icons/onetomany.svg?react";
import IconHorizontalAdjustments from "@/assets/icons/horizontalAdjustments.svg?react";
import { useParams, useSearchParams } from "react-router-dom";
import unplug from "@/assets/image/unplug.png";
import pictureTQF5 from "@/assets/image/TQF5.jpg";
import Bottombar, { partLabel, partType } from "@/components/Bottombar";
import { getValueEnumByKey } from "@/helpers/functions/function";
import { UseFormReturnType } from "@mantine/form";
import Loading from "@/components/Loading/Loading";
import { setShowNavbar, setShowSidebar } from "@/store/config";
import Part1TQF5 from "@/components/TQF5/Part1TQF5";
import Part2TQF5 from "@/components/TQF5/Part2TQF5";
import Part3TQF5 from "@/components/TQF5/Part3TQF5";
import { IModelTQF5 } from "@/models/ModelTQF5";
import { PartTopicTQF5 } from "@/helpers/constants/TQF5.enum";
import {
  COURSE_TYPE,
  METHOD_TQF5,
  NOTI_TYPE,
  ROLE,
  TQF_STATUS,
} from "@/helpers/constants/enum";
import { IModelAssignment, IModelSection } from "@/models/ModelCourse";
import { getOneCourse } from "@/services/course/course.service";
import { getOneCourseManagement } from "@/services/courseManagement/courseManagement.service";
import { setDataTQF5, setPloTQF5 } from "@/store/tqf5";
import { setPloTQF3 } from "@/store/tqf3";
import { isEmpty, isEqual, unionBy, uniq } from "lodash";
import { changeMethodTQF5, saveTQF5 } from "@/services/tqf5/tqf5.service";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { getPLOs } from "@/services/plo/plo.service";
import { IModelTQF3 } from "@/models/ModelTQF3";
import ModalMappingAssignment from "@/components/Modal/TQF5/ModalMappingAssignment";
import exportFile from "@/assets/icons/fileExport.svg?react";
import { setLoadingOverlay } from "@/store/loading";
import ModalExportTQF5 from "@/components/Modal/TQF5/ModalExportTQF5";
import ModalSetRange from "@/components/Modal/TQF5/ModalSetRange";
import { IModelPLORequire } from "@/models/ModelCourseManagement";

export default function TQF5() {
  const { courseNo } = useParams();
  const [params, setParams] = useSearchParams();
  const loading = useAppSelector((state) => state.loading);
  const dashboard = useAppSelector((state) => state.config.dashboard);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const course = useAppSelector((state) =>
    state.course.courses.find((course) => course.courseNo == courseNo)
  );
  const courseAdmin = useAppSelector((state) =>
    state.allCourse.courses.find((course) => course.courseNo == courseNo)
  );
  const [cannotSelectScoreOBE, setCannotSelectScoreOBE] = useState(false);
  const [assignments, setAssignments] = useState<IModelAssignment[]>();
  const [tqf3, setTqf3] = useState<IModelTQF3>();
  const [tqf5Original, setTqf5Original] = useState<
    Partial<IModelTQF5> & { topic?: string; ploRequired?: IModelPLORequire[] }
  >();
  const tqf5 = useAppSelector((state) => state.tqf5);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<UseFormReturnType<any>>();
  const [tqf5Part, setTqf5Part] = useState<string | null>(
    Object.keys(partLabel)[0]
  );
  const [selectedMethod, setSelectedMethod] = useState<METHOD_TQF5>();
  const [openModalChangeMethod, setOpenModalChangeMethod] = useState(false);
  const [openModalExportTQF5, setOpenModalExportTQF5] = useState(false);
  const [openModalAssignmentMapping, setOpenModalAssignmentMapping] =
    useState(false);
  const [openModalSetRange, setOpenModalSetRange] = useState(false);
  const partTab = [
    {
      value: Object.keys(partLabel)[0],
      tab: partLabel.part1,
      compo: <Part1TQF5 setForm={setForm} tqf5Original={tqf5Original!} />,
    },
    {
      value: Object.keys(partLabel)[1],
      tab: partLabel.part2,
      compo: (
        <Part2TQF5 setForm={setForm} tqf3={tqf3!} assignments={assignments!} />
      ),
    },
    {
      value: Object.keys(partLabel)[2],
      tab: partLabel.part3,
      compo: (
        <Part3TQF5 setForm={setForm} tqf3={tqf3!} assignments={assignments!} />
      ),
    },
  ];

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  useEffect(() => {
    if (
      academicYear &&
      (course || courseAdmin) &&
      (tqf5.topic != tqf5Original?.topic || !tqf5.coursePLO?.length)
    ) {
      fetchPLO();
    }
  }, [academicYear, courseAdmin, course, tqf5.topic]);

  const uniqueCurriculum = () => {
    if ((courseAdmin ?? course)?.type == COURSE_TYPE.SEL_TOPIC.en) {
      return uniq(
        (courseAdmin ?? course)?.sections
          .filter((item) => item.topic == tqf5.topic)
          .flatMap(({ curriculum }) => curriculum)
          .flat()
          .filter(Boolean)
      );
    } else {
      return uniq(
        (courseAdmin ?? course)?.sections
          .flatMap(({ curriculum }) => curriculum)
          .flat()
          .filter(Boolean)
      );
    }
  };

  const fetchPLO = async () => {
    const curriculum = uniqueCurriculum();
    if (curriculum.length) {
      const resPloCol = await getPLOs({ curriculum });
      if (resPloCol) {
        dispatch(setPloTQF3({ curriculum, coursePLO: resPloCol.plos }));
        dispatch(setPloTQF5({ curriculum, coursePLO: resPloCol.plos }));
      }
    } else {
      dispatch(setPloTQF3({ curriculum, coursePLO: [] }));
      dispatch(setPloTQF5({ curriculum, coursePLO: [] }));
    }
  };

  useEffect(() => {
    if (
      academicYear &&
      courseNo &&
      (dashboard == ROLE.CURRICULUM_ADMIN ? courseAdmin : true) &&
      tqf5.coursePLO &&
      (tqf5.topic !== tqf5Original?.topic || !tqf5Original)
    ) {
      if (
        tqf5.topic !== tqf5Original?.topic ||
        !tqf3?.status ||
        tqf3?.status == TQF_STATUS.DONE
      ) {
        fetchOneCourse(true);
      }
    }
  }, [academicYear, courseAdmin, tqf5.topic, tqf5.coursePLO]);

  const checkActiveTerm = () => {
    return (
      parseInt(params.get("year") || "") === academicYear?.year &&
      parseInt(params.get("semester") || "") === academicYear.semester
    );
  };

  const fetchOneCourse = async (firstFetch: boolean = false) => {
    let [resCourse, resPloRequired] = await Promise.all([
      getOneCourse({
        year: params.get("year"),
        semester: params.get("semester"),
        courseNo,
        curAdmin: dashboard == ROLE.CURRICULUM_ADMIN,
      }),
      getOneCourseManagement({ courseNo }),
    ]);
    if (resCourse) {
      if (resCourse.type == COURSE_TYPE.SEL_TOPIC.en) {
        const section = resCourse.sections.find(
          (sec: IModelSection) => sec.topic == tqf5.topic
        );
        setCannotSelectScoreOBE(!section?.assignments?.length);
        setAssignments(
          Array.from(
            resCourse.sections
              .filter((sec: any) => sec.topic == tqf5.topic)
              .flatMap((sec: any) => sec.assignments)
              .reduce((map: any, assignment: any) => {
                if (!map.has(assignment.name)) {
                  map.set(assignment.name, assignment);
                }
                return map;
              }, new Map<string, IModelAssignment>())
              .values()
          )
        );
        setTqf3(section?.TQF3);
        const ploRequire = unionBy(
          resPloRequired?.sections
            .filter((item: any) => item.topic == tqf5.topic)
            .flatMap((item: any) => item.ploRequire),
          "curriculum"
        )?.filter((plo: any) =>
          tqf5.coursePLO?.find((cPlo) => cPlo.id == plo.plo)
        );
        setTqf5Original({
          topic: tqf5.topic,
          ploRequired: ploRequire || [],
          ...section?.TQF5,
        });
        setSelectedMethod(section?.TQF5?.method);
        dispatch(
          setDataTQF5({
            ploRequired: ploRequire || [],
            ...section?.TQF5,
            type: resCourse.type,
            sections: [...resCourse.sections],
          })
        );
        if (firstFetch) {
          setCurrentPartTQF5(section?.TQF5);
        }
      } else {
        const ploRequire = resPloRequired?.ploRequire.filter((plo: any) =>
          tqf5.coursePLO?.find((cPlo) => cPlo.id == plo.plo)
        );
        setCannotSelectScoreOBE(!resCourse.sections[0].assignments.length);
        setAssignments(
          Array.from(
            resCourse.sections
              .flatMap((sec: any) => sec.assignments!)
              .reduce((map: any, assignment: any) => {
                if (!map.has(assignment.name)) {
                  map.set(assignment.name, assignment);
                }
                return map;
              }, new Map<string, IModelAssignment>())
              .values()
          )
        );
        setTqf3(resCourse.TQF3);
        setTqf5Original({
          topic: tqf5.topic,
          ploRequired: ploRequire || [],
          ...resCourse.TQF5!,
        });
        setSelectedMethod(resCourse.TQF5?.method);
        dispatch(
          setDataTQF5({
            ploRequired: ploRequire || [],
            ...resCourse.TQF5!,
            type: resCourse.type,
            sections: [...resCourse.sections],
          })
        );
        if (firstFetch) {
          setCurrentPartTQF5(resCourse.TQF5!);
        }
      }
    }
  };

  const setCurrentPartTQF5 = (tqf5: IModelTQF5) => {
    if (!tqf5 || !tqf5.part1) {
      setTqf5Part("part1");
    } else if (!tqf5.part2) {
      setTqf5Part("part2");
    } else {
      setTqf5Part("part3");
    }
  };

  const onSave = async () => {
    if (form && tqf5.id && tqf5Part) {
      const validationResult = form.validate();
      switch (tqf5Part) {
        case Object.keys(partLabel)[0]:
          break;
        case Object.keys(partLabel)[1]:
          if (tqf5.method == METHOD_TQF5.MANUAL) {
            form.getValues().data.forEach((cloItem: any, indexClo: number) =>
              cloItem.assignments.forEach((item: any, indexEval: number) =>
                item.questions.map((ques: any, indexQues: number) => {
                  if (!ques.length) {
                    form.setFieldError(
                      `data.${indexClo}.assignments.${indexEval}.questions.${indexQues}`,
                      "Please input question."
                    );
                  }
                })
              )
            );
          }
          break;
      }
      if (Object.keys(validationResult.errors).length > 0) {
        const firstErrorPath = Object.keys(validationResult.errors)[0];
        form
          .getInputNode(firstErrorPath)
          ?.scrollIntoView({ behavior: "smooth", block: "end" });
      } else {
        dispatch(setLoadingOverlay(true));
        const payload = form.getValues();
        payload.id = tqf5.id;
        const res = await saveTQF5(tqf5Part, payload);
        if (res) {
          setTqf5Original({ ...tqf5Original, ...res });
          dispatch(setDataTQF5({ ...tqf5, ...res }));
          showNotifications(
            NOTI_TYPE.SUCCESS,
            `TQF 5, ${tqf5Part} Saved Successfully`,
            `TQF 5 - ${tqf5Part} has been successfully saved`
          );
          if (tqf5Part !== "part3") {
            setTqf5Part(`part${parseInt(tqf5Part.slice(-1)) + 1}`);
          }
        }
        dispatch(setLoadingOverlay(false));
      }
    }
  };

  const onChangeMethod = async (method?: string) => {
    if (
      cannotSelectScoreOBE &&
      [method, selectedMethod].includes(METHOD_TQF5.SCORE_OBE)
    ) {
      showNotifications(
        NOTI_TYPE.ERROR,
        "Method Changed Failed",
        `This course must have import score for use ${
          method || selectedMethod
        } method.`
      );
      return;
    }
    const res = await changeMethodTQF5(tqf5.id, {
      method: method ?? selectedMethod,
    });
    if (res) {
      const newTqf5 = tqf5Original;
      delete newTqf5?.assignmentsMap;
      delete newTqf5?.part2;
      delete newTqf5?.part3;
      setTqf5Original({ ...newTqf5, ...res, method: res.method });
      dispatch(
        setDataTQF5({
          ...newTqf5,
          ...res,
          type: tqf5.type,
          sections: tqf5.sections,
          method: res.method,
        })
      );
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Method Changed Successfully",
        `The evaluation method for TQF 5 has been successfully updated to ${
          method ?? selectedMethod
        }.`
      );
      setOpenModalChangeMethod(false);
    }
  };

  const checkPartStatus = (value: keyof IModelTQF5) => {
    return !tqf5Original ||
      !tqf5.id ||
      isEmpty(tqf5[value]) ||
      isEmpty(tqf5Original[value])
      ? "text-[#DEE2E6]" // No Data
      : !isEqual(tqf5Original![value], tqf5[value])
      ? "text-edit" // In Progress
      : "text-[#24b9a5]"; // Done
  };

  const showSaveTQFbar = () => {
    if (tqf3?.status != TQF_STATUS.DONE) return false;
    if (tqf5Original && tqf5.id) {
      if (tqf5Part == "part1") {
        return true;
      } else if (
        tqf5Part == "part2" &&
        tqf5.method == METHOD_TQF5.SCORE_OBE &&
        !tqf5.assignmentsMap?.length
      ) {
        return false;
      } else {
        return tqf5Original[
          Object.keys(partLabel)[
            Object.keys(partLabel).findIndex((e) => e == tqf5Part) - 1
          ] as keyof IModelTQF5
        ];
      }
    }
    return false;
  };

  return loading.loading || !tqf5Original ? (
    <Loading />
  ) : (
    <>
      <Modal
        opened={openModalChangeMethod}
        onClose={() => setOpenModalChangeMethod(false)}
        centered
        size="41vw"
        title="Method to evaluate TQF 5"
        transitionProps={{ transition: "pop" }}
      >
        <div className="flex flex-col gap-5 justify-between ">
          <div className="flex flex-col gap-2">
            <Alert
              radius="md"
              icon={<Icon IconComponent={IconInfo2} />}
              variant="light"
              color="orange"
              className="mb-3"
              classNames={{
                icon: "size-6",
                body: " flex justify-center",
                root: "border border-amber-200 rounded-xl",
              }}
              title={
                <p>
                  Changing the method will be removed your changes in TQF 5
                  Parts 2 and 3
                </p>
              }
            ></Alert>
            <Radio.Group
              classNames={{ label: "font-semibold" }}
              value={selectedMethod}
              onChange={setSelectedMethod as any}
            >
              <Group mb={2}>
                <Radio.Card
                  value={METHOD_TQF5.SCORE_OBE}
                  style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.15)",
                  }}
                  className={`p-4 flex flex-col rounded-md ${
                    selectedMethod === METHOD_TQF5.SCORE_OBE
                      ? "border-2 border-secondary"
                      : "border"
                  }`}
                >
                  <Group
                    wrap="nowrap"
                    align="flex-start"
                    className=" flex items-center"
                  >
                    <Radio.Indicator />
                    <div>
                      <span className=" font-semibold text-b2 text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                        ScoreOBE+
                      </span>
                      <p className="text-b4">
                        The
                        <span className=" text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                          {" "}
                          smartest
                        </span>{" "}
                        way to evaluate and analyze your TQF 5
                      </p>
                    </div>
                  </Group>
                </Radio.Card>
                <Radio.Card
                  value={METHOD_TQF5.MANUAL}
                  style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.15)",
                  }}
                  className={`p-4 flex flex-col rounded-md ${
                    selectedMethod === METHOD_TQF5.MANUAL
                      ? "border-2 border-secondary"
                      : "border"
                  }`}
                >
                  <Group
                    wrap="nowrap"
                    align="flex-start"
                    className=" flex items-center"
                  >
                    <Radio.Indicator />
                    <div>
                      <span className="text-b2 font-semibold">Manual</span>
                      <p className="text-b4">
                        Customize all data what you want
                      </p>
                    </div>
                  </Group>
                </Radio.Card>
              </Group>
            </Radio.Group>
          </div>
          <div className="flex gap-2 mt-2 justify-end">
            <Button
              variant="subtle"
              onClick={() => {
                setOpenModalChangeMethod(false);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={selectedMethod === tqf5.method}
              onClick={() => {
                onChangeMethod();
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
      <ModalMappingAssignment
        opened={openModalAssignmentMapping}
        onClose={() => setOpenModalAssignmentMapping(false)}
        tqf3={tqf3!}
        assignments={assignments!}
      />
      {tqf5Part == "part3" && (
        <ModalSetRange
          opened={openModalSetRange}
          onClose={() => setOpenModalSetRange(false)}
          tqf3={tqf3!}
          tqf5Form={form!}
        />
      )}
      <ModalExportTQF5
        opened={openModalExportTQF5}
        onClose={() => setOpenModalExportTQF5(false)}
        tqf3={tqf3?.id!}
      />
      <div
        className={`flex flex-col h-full w-full overflow-hidden ${
          !checkActiveTerm() && "pb-2"
        }`}
      >
        <Tabs
          value={tqf5Part}
          onChange={setTqf5Part}
          defaultValue={"part1"}
          classNames={{
            root: "overflow-hidden w-full flex flex-col h-full",
            tab: "px-0 !bg-transparent hover:!text-tertiary",
            tabLabel: "!font-semibold text-b4",
          }}
          className="px-6 pt-2 flex flex-col h-full w-full"
        >
          <div
            className={`flex flex-col w-full h-fit ${
              (tqf5Part == "part3" && tqf5.method == METHOD_TQF5.SCORE_OBE) ||
              (tqf5Part == "part1" && !!tqf5.curriculum?.length)
                ? ""
                : "border-b-[2px]"
            }  `}
          >
            <Tabs.List className="md:gap-x-5 gap-x-3 w-full">
              {partTab.map(({ tab, value }) => (
                <Tabs.Tab key={value} value={value}>
                  <div className="flex flex-row items-center gap-2">
                    {value != "part1" && (
                      <Icon
                        IconComponent={IconCheck}
                        className={checkPartStatus(value as keyof IModelTQF5)}
                      />
                    )}
                    {tab}
                  </div>
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <div className="flex justify-between pt-4 items-center ">
              <div className=" text-secondary mb-4 -mt-1 overflow-y-auto items-center justify-normal flex font-semibold min-h-14 acerSwift:max-macair133:!min-h-12 whitespace-break-spaces acerSwift:max-macair133:!text-b2 ">
                {getValueEnumByKey(PartTopicTQF5, tqf5Part!)}
              </div>
              <div className="flex gap-2 -mt-4">
                <Button
                  onClick={() => setOpenModalExportTQF5(true)}
                  color="#24b9a5"
                  className="px-4 min-w-max mr-2 "
                >
                  <div className="flex gap-2 items-center acerSwift:max-macair133:text-b5">
                    <Icon
                      className="size-5 acerSwift:max-macair133:size-4"
                      IconComponent={exportFile}
                    />
                    Export TQF5
                  </div>
                </Button>
                {checkActiveTerm() && tqf5Part != "part1" && tqf5.method && (
                  <div className="rounded-full hover:bg-gray-300 p-1 mr-2 cursor-pointer">
                    <Menu
                      trigger="click"
                      openDelay={100}
                      closeDelay={200}
                      classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
                    >
                      <Menu.Target>
                        <div className="cursor-pointer">
                          <Icon IconComponent={IconDots} />
                        </div>
                      </Menu.Target>
                      <Menu.Dropdown
                        className="rounded-md translate-y-1 -translate-x-6 backdrop-blur-xl bg-white"
                        style={{
                          boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        <Menu.Item
                          onClick={() => {
                            if (tqf5.method) setSelectedMethod(tqf5.method);
                            setOpenModalChangeMethod(true);
                          }}
                          className=" text-[#3e3e3e] mb-[2px] font-semibold text-b4 h-7  acerSwift:max-macair133:!text-b5"
                        >
                          <div className="flex justify-between items-center gap-2">
                            <div className="flex gap-2 items-center acerSwift:max-macair133:text-b5">
                              <Icon
                                className="mr-3"
                                IconComponent={IconHorizontalAdjustments}
                              />
                              Method ({tqf5.method})
                            </div>
                          </div>
                        </Menu.Item>
                        {tqf5Part == "part2" &&
                          !!tqf5.assignmentsMap?.length &&
                          tqf5.method == METHOD_TQF5.SCORE_OBE && (
                            <Menu.Item
                              className=" text-[#3e3e3e] mb-[2px] font-semibold text-b4 h-7  acerSwift:max-macair133:!text-b5"
                              onClick={() =>
                                setOpenModalAssignmentMapping(true)
                              }
                            >
                              <div className="flex justify-between items-center gap-2">
                                <div className="flex gap-2 items-center acerSwift:max-macair133:text-b5">
                                  <Icon
                                    className="mr-2"
                                    IconComponent={IconOneToMany}
                                  />
                                  Evaluation Mapping
                                </div>
                              </div>
                            </Menu.Item>
                          )}
                        {tqf5Part == "part3" &&
                          !!tqf5.assignmentsMap?.length &&
                          tqf5.method == METHOD_TQF5.SCORE_OBE && (
                            <Menu.Item
                              className=" text-[#3e3e3e] mb-[2px] font-semibold text-b4 h-7  acerSwift:max-macair133:!text-b5"
                              onClick={() => setOpenModalSetRange(true)}
                            >
                              <div className="flex justify-between items-center gap-2">
                                <div className="flex gap-2 items-center acerSwift:max-macair133:text-b5">
                                  <Icon
                                    className="mr-[12px] size-5 stroke-[1.4px]"
                                    IconComponent={IconEdit}
                                  />
                                  Set Range Assessment tool
                                </div>
                              </div>
                            </Menu.Item>
                          )}
                      </Menu.Dropdown>
                    </Menu>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="h-full w-full flex overflow-y-auto text-b2 acerSwift:max-macair133:!text-b3 pt-3">
            {partTab.map((part, index) => (
              <Tabs.Panel key={index} value={part.value} className="w-full">
                {tqf5Part === part.value &&
                tqf5.id &&
                tqf3?.status == TQF_STATUS.DONE &&
                (tqf5Part == "part1" || tqf5.method) ? (
                  part.compo
                ) : tqf3?.status != TQF_STATUS.DONE ? (
                  <div className="flex px-12 sm:max-ipad11:px-8 flex-row items-center justify-between h-full">
                    <div className="h-full  justify-center flex flex-col">
                      <p className="text-secondary text-[21px] font-semibold">
                        TQF 3 Completion Needed
                      </p>
                      <br />
                      <p className=" -mt-3 mb-6 text-b2 break-words font-medium leading-relaxed">
                        It seems this TQF 3 for {courseNo} isn’t fully completed
                        all parts yet. <br /> Review and fill in the missing
                        sections to ensure everything is in place!
                      </p>
                    </div>
                    <img
                      className=" z-50  w-[25vw] "
                      src={unplug}
                      alt="loginImage"
                    />
                  </div>
                ) : !tqf5.method ? (
                  <div className="flex px-16  w-full ipad11:px-8 sm:px-2  gap-5  items-center justify-between h-full">
                    <div className="flex justify-center  h-full items-start gap-2 flex-col">
                      <p className="   text-secondary font-semibold text-[22px] sm:max-ipad11:text-[20px]">
                        Select method to evaluate TQF 5
                      </p>
                      <p className=" text-[#333333] leading-6 font-medium text-b2 acerSwift:max-macair133:!text-b3 sm:max-ipad11:text-[13px]">
                        To start TQF5 Part 2, please seleect method to evaluate.{" "}
                      </p>

                      <div className="flex flex-col mt-3 w-[410px]">
                        <Radio.Group
                          classNames={{ label: "font-semibold" }}
                          value={selectedMethod}
                          onChange={setSelectedMethod as any}
                        >
                          <Group mb={2}>
                            <Radio.Card
                              value={METHOD_TQF5.SCORE_OBE}
                              style={{
                                boxShadow:
                                  "0px 0px 4px 0px rgba(0, 0, 0, 0.15)",
                              }}
                              className={`p-4 flex flex-col rounded-md ${
                                selectedMethod === METHOD_TQF5.SCORE_OBE
                                  ? "border-2 border-secondary"
                                  : "border"
                              }`}
                            >
                              <Group
                                wrap="nowrap"
                                align="flex-start"
                                className="flex items-center"
                              >
                                <Radio.Indicator />
                                <div>
                                  <span className=" font-semibold text-b1 text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                                    ScoreOBE+{" "}
                                  </span>
                                  <p className="text-b4">
                                    The{" "}
                                    <span className=" text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                                      {" "}
                                      smartest
                                    </span>{" "}
                                    way to evaluate and analyze your TQF 5
                                  </p>
                                </div>
                              </Group>
                            </Radio.Card>
                            <Radio.Card
                              value={METHOD_TQF5.MANUAL}
                              style={{
                                boxShadow:
                                  "0px 0px 4px 0px rgba(0, 0, 0, 0.15)",
                              }}
                              className={`p-4 flex flex-col rounded-md ${
                                selectedMethod === METHOD_TQF5.MANUAL
                                  ? "border-2 border-secondary"
                                  : "border"
                              }`}
                            >
                              <Group
                                wrap="nowrap"
                                align="flex-start"
                                className="flex items-center"
                              >
                                <Radio.Indicator />
                                <div>
                                  <p className="text-b1 font-semibold">
                                    {METHOD_TQF5.MANUAL}
                                  </p>
                                  <p className="text-b4">
                                    Customize all data what you want
                                  </p>
                                </div>
                              </Group>
                            </Radio.Card>
                          </Group>
                        </Radio.Group>

                        {selectedMethod && (
                          <Button
                            onClick={() => onChangeMethod(selectedMethod)}
                            className="!w-full mt-5 !text-b2 acerSwift:max-macair133:!text-b3 !font-bold !text-[#1f69f3] !h-10"
                            variant="light"
                          >
                            Get Start
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              className=" ml-3 "
                            >
                              <path
                                d="M0.9375 8.4373L12.0563 8.4373L8.65312 12.5248C8.49399 12.7163 8.41744 12.9631 8.44029 13.211C8.46315 13.4589 8.58355 13.6875 8.775 13.8467C8.96645 14.0058 9.21328 14.0824 9.46118 14.0595C9.70908 14.0367 9.93775 13.9163 10.0969 13.7248L14.7844 8.0998C14.8159 8.05506 14.8441 8.00806 14.8688 7.95918C14.8688 7.9123 14.8687 7.88418 14.9344 7.8373C14.9769 7.72981 14.9991 7.61539 15 7.4998C14.9991 7.38422 14.9769 7.2698 14.9344 7.1623C14.9344 7.11543 14.9344 7.0873 14.8688 7.04043C14.8441 6.99155 14.8159 6.94454 14.7844 6.8998L10.0969 1.2748C10.0087 1.16898 9.89835 1.08387 9.77358 1.02554C9.64882 0.967205 9.51273 0.937079 9.375 0.937304C9.15595 0.936875 8.94367 1.01316 8.775 1.15293C8.68007 1.23163 8.6016 1.32829 8.54408 1.43736C8.48656 1.54644 8.45113 1.66579 8.43981 1.78858C8.42849 1.91137 8.4415 2.03519 8.47811 2.15294C8.51471 2.27069 8.57419 2.38007 8.65312 2.4748L12.0563 6.5623L0.9375 6.5623C0.68886 6.5623 0.450402 6.66108 0.274587 6.83689C0.0987711 7.01271 0 7.25116 0 7.4998C0 7.74844 0.0987711 7.9869 0.274587 8.16272C0.450402 8.33853 0.68886 8.4373 0.9375 8.4373Z"
                                fill="#1f69f3"
                              />
                            </svg>
                          </Button>
                        )}
                      </div>
                    </div>
                    <img
                      className=" z-50  w-[38vw] "
                      src={pictureTQF5}
                      alt="loginImage"
                    />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loading />
                  </div>
                )}
              </Tabs.Panel>
            ))}
          </div>
        </Tabs>
      </div>
      {checkActiveTerm() && tqf5Original && tqf5.id && showSaveTQFbar() && (
        <Bottombar
          tqf="5"
          part={tqf5Part as partType}
          data={tqf5Original[tqf5Part as keyof IModelTQF5]}
          onSave={onSave}
          disabledSave={isEqual(
            tqf5Original[tqf5Part as keyof IModelTQF5],
            tqf5[tqf5Part as keyof IModelTQF5]
          )}
        />
      )}
    </>
  );
}
