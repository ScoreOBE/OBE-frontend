import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Combobox,
  FocusTrapInitialFocus,
  Group,
  Input,
  InputBase,
  Modal,
  Select,
  Tabs,
  Text,
  Tooltip,
  useCombobox,
} from "@mantine/core";
import Icon from "@/components/Icon";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconDupTQF from "@/assets/icons/dupTQF.svg?react";
import IconCheck from "@/assets/icons/Check.svg?react";
import { useParams, useSearchParams } from "react-router-dom";
import Part1TQF3 from "@/components/TQF5/Part1TQF5";
import Part2TQF3 from "@/components/TQF5/Part2TQF5";
import Part3TQF3 from "@/components/TQF5/Part3TQF5";
import maintenace from "@/assets/image/maintenance.png";

import SaveTQFbar, { partLabel, partType } from "@/components/SaveTQFBar";
import { isEmpty, isEqual } from "lodash";
import { getOneCourse } from "@/services/course/course.service";
import {
  getCourseReuseTQF3,
  reuseTQF3,
  saveTQF3,
} from "@/services/tqf3/tqf3.service";
import { getValueEnumByKey } from "@/helpers/functions/function";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { COURSE_TYPE, NOTI_TYPE } from "@/helpers/constants/enum";
import { useForm, UseFormReturnType } from "@mantine/form";
import exportFile from "@/assets/icons/fileExport.svg?react";
import Loading from "@/components/Loading";
import { IModelCLO, IModelTQF3 } from "@/models/ModelTQF3";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";
import { LearningMethod } from "@/components/Modal/TQF3/ModalManageCLO";
import ModalExportTQF3 from "@/components/Modal/TQF3/ModalExportTQF3";
import { PartTopicTQF3 } from "@/helpers/constants/TQF3.enum";
import { setDataTQF3, updatePartTQF3 } from "@/store/tqf3";
import { IModelSection } from "@/models/ModelCourse";
import { getOneCourseManagement } from "@/services/courseManagement/courseManagement.service";
import { IModelCourse } from "@/models/ModelCourse";
import { initialTqf3Part } from "@/helpers/functions/tqf3";
import Part1TQF5 from "@/components/TQF5/Part1TQF5";
import Part2TQF5 from "@/components/TQF5/Part2TQF5";
import Part3TQF5 from "@/components/TQF5/Part3TQF5";
import { IModelTQF5 } from "@/models/ModelTQF5";
import { PartTopicTQF5 } from "@/helpers/constants/TQF5.enum";

export default function TQF5() {
  const { courseNo } = useParams();
  const [params, setParams] = useSearchParams();
  const [openModalExportTQF3, setOpenModalExportTQF3] = useState(false);
  const loading = useAppSelector((state) => state.loading);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [tqf3Original, setTqf3Original] = useState<
    Partial<IModelTQF5> & { topic?: string; ploRequired?: string[] }
  >();
  const tqf3 = useAppSelector((state) => state.tqf3);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<UseFormReturnType<any>>();
  const [tqf5Part, settqf5Part] = useState<string | null>(
    Object.keys(partLabel)[0]
  );
  const [openWarningEditDataTQF2Or3, setOpenWarningEditDataTQF2Or3] =
    useState(false);
  const [confirmToEditData, setConfirmToEditData] = useState(false);
  const [openModalReuse, setOpenModalReuse] = useState(false);
  const [courseReuseTqf3List, setCourseReuseTqf3List] = useState<any[]>([]);
  const [loadingRes, setLoadingRes] = useState(false);
  const [openAlertDatatqf5Part4, setOpenAlertDatatqf5Part4] = useState(false);
  const partTab = [
    {
      value: Object.keys(partLabel)[0],
      tab: partLabel.part1,
      compo: <Part1TQF5 setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[1],
      tab: partLabel.part2,
      compo: <Part2TQF5 setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[2],
      tab: partLabel.part3,
      compo: <Part3TQF5 setForm={setForm} />,
    },
  ];

  interface option {
    topic: string;
    description: string;
  }

  const groceries: option[] = [
    {
      topic: "ScoreOBE +",
      description: "The smartest way to evaluate and analyze your TQF 5",
    },
    {
      topic: "Manual",
      description: "Customize all data what you want",
    },
  ];

  function SelectOption({ topic, description }: option) {
    return (
      <Group>
        <div>
          <Text fz="sm" fw={500}>
            {topic}
          </Text>
          <Text fz="xs" opacity={0.6}>
            {description}
          </Text>
        </div>
      </Group>
    );
  }
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [value, setValue] = useState<string | null>(null);
  const selectedOption = groceries.find((item) => item.topic === value);

  const options = groceries.map((item) => (
    <Combobox.Option value={item.topic} key={item.topic}>
      <SelectOption {...item} />
    </Combobox.Option>
  ));

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  useEffect(() => {
    if (academicYear && params.get("year") && params.get("semester")) {
      if (checkActiveTerm()) fetchTqf3Reuse();
    }
  }, [academicYear]);

  useEffect(() => {
    if (academicYear && (tqf3.topic !== tqf3Original?.topic || !tqf3Original)) {
      fetchOneCourse(true);
    }
  }, [academicYear, tqf3.topic, courseNo]);

  useEffect(() => {
    replaceReuseTQF3();
  }, [tqf3.id]);

  //   useEffect(() => {
  //     if (!openWarningEditDataTQF2Or3 && confirmToEditData) {
  //       onSave();
  //       setConfirmToEditData(false);
  //     }
  //   }, [openWarningEditDataTQF2Or3, confirmToEditData]);

  const checkActiveTerm = () => {
    return (
      parseInt(params.get("year") || "") === academicYear.year &&
      parseInt(params.get("semester") || "") === academicYear.semester
    );
  };

  const fetchTqf3Reuse = async () => {
    const res = await getCourseReuseTQF3({
      year: academicYear.year,
      semester: academicYear.semester,
    });
    if (res) {
      let uniqueTopicList: any[] = [];
      res.map((course: IModelCourse) => {
        const data = {
          year: course.year,
          semester: course.semester,
          courseNo: course.courseNo,
          type: course.type,
        };
        if (course.type == COURSE_TYPE.SEL_TOPIC.en) {
          course.sections.map((sec) => {
            if (
              sec.topic &&
              !uniqueTopicList.some((item) => item.topic === sec.topic)
            ) {
              uniqueTopicList.push({
                ...data,
                value: sec.TQF3?.id,
                topic: sec.topic,
                label: `${course.courseNo} - ${sec.topic} (${
                  course.semester
                }/${course.year.toString().slice(-2)})`,
              });
            }
          });
        } else {
          uniqueTopicList.push({
            ...data,
            value: course.TQF3?.id,
            label: `${course.courseNo} - ${course.courseName} (${
              course.semester
            }/${course.year.toString().slice(-2)})`,
          });
        }
      });
      setCourseReuseTqf3List(uniqueTopicList);
    }
  };

  const fetchOneCourse = async (firstFetch: boolean = false) => {
    const [resCourse, resPloRequired] = await Promise.all([
      getOneCourse({
        year: params.get("year"),
        semester: params.get("semester"),
        courseNo,
      }),
      getOneCourseManagement(courseNo!),
    ]);
    if (resCourse) {
      if (resCourse.type == COURSE_TYPE.SEL_TOPIC.en) {
        const sectionTdf3 = resCourse.sections.find(
          (sec: IModelSection) => sec.topic == tqf3.topic
        )?.TQF3;
        setTqf3Original({
          topic: tqf3.topic,
          ploRequired: resPloRequired?.plos || [],
          part7: {},
          ...sectionTdf3,
        });
        dispatch(
          setDataTQF3({
            topic: tqf3.topic,
            ploRequired: resPloRequired?.plos || [],
            ...sectionTdf3,
            type: resCourse.type,
            sections: [...resCourse.sections],
          })
        );
        if (firstFetch) {
          setCurrentPartTQF3(sectionTdf3);
        }
      } else {
        setTqf3Original({
          topic: tqf3.topic,
          ploRequired: resPloRequired?.plos || [],
          part7: {},
          ...resCourse.TQF3!,
        });
        dispatch(
          setDataTQF3({
            topic: tqf3.topic,
            ploRequired: resPloRequired?.plos || [],
            ...resCourse.TQF3!,
            type: resCourse.type,
            sections: [...resCourse.sections],
          })
        );
        if (firstFetch) {
          setCurrentPartTQF3(resCourse.TQF3!);
        }
      }
    }
  };

  const replaceReuseTQF3 = () => {
    for (let i = 1; i <= 7; i++) {
      if (localStorage.getItem(`reuse${tqf3.id}-part${i}`)) {
        dispatch(
          updatePartTQF3({
            part: `part${i}`,
            data: JSON.parse(localStorage.getItem(`reuse${tqf3.id}-part${i}`)!),
          })
        );
      }
    }
  };

  const setCurrentPartTQF3 = (tqf3: IModelTQF3) => {
    if (!tqf3 || !tqf3.part1) {
      settqf5Part("part1");
    } else if (!tqf3.part2) {
      settqf5Part("part2");
    } else {
      settqf5Part("part3");
    }
  };

  //   const onSave = async () => {
  //     if (form && tqf3.id && tqf5Part) {
  //       const validationResult = form.validate();
  //       if (Object.keys(validationResult.errors).length > 0) {
  //         const firstErrorPath = Object.keys(validationResult.errors)[0];
  //         form
  //           .getInputNode(firstErrorPath)
  //           ?.scrollIntoView({ behavior: "smooth", block: "end" });
  //         setOpenAlertDatatqf5Part4(true);
  //       } else {
  //         const payload = form.getValues();
  //         payload.id = tqf3.id;
  //         switch (tqf5Part) {
  //           case Object.keys(partLabel)[0]:
  //             payload.instructors = payload.instructors.filter(
  //               (ins: any) => ins.length
  //             );
  //             break;
  //           case Object.keys(partLabel)[1]:
  //             payload.clo?.forEach((clo: IModelCLO) => {
  //               if (!clo.learningMethod.includes(LearningMethod.Other)) {
  //                 delete clo.other;
  //               }
  //             });
  //             break;
  //         }
  //         if (
  //           !confirmToEditData &&
  //           tqf3Original &&
  //           tqf5Part &&
  //           ["part2", "part3"].includes(tqf5Part) &&
  //           ((tqf3Original.part4 &&
  //             (tqf3Original.part2?.clo.length !== tqf3.part2?.clo.length ||
  //               tqf3Original.part3?.eval.length !== tqf3.part3?.eval.length ||
  //               tqf3Original.part3?.eval.some(
  //                 ({ id, percent }) =>
  //                   percent !== tqf3.part3?.eval.find((e) => e.id == id)?.percent
  //               ))) ||
  //             (tqf3Original.part7 &&
  //               tqf3.part2?.clo.length !== tqf3.part2?.clo.length))
  //         ) {
  //           setOpenWarningEditDataTQF2Or3(true);
  //           return;
  //         }
  //         if (confirmToEditData) payload.inProgress = true;
  //         const res = await saveTQF3(tqf5Part, payload);
  //         if (res) {
  //           localStorage.removeItem(`reuse${tqf3.id}-${tqf5Part}`);
  //           setTqf3Original({ ...tqf3Original, ...res });
  //           dispatch(setDataTQF3({ ...tqf3, ...res }));
  //           showNotifications(
  //             NOTI_TYPE.SUCCESS,
  //             `TQF 3, ${tqf5Part} save success`,
  //             `TQF 3 - ${tqf5Part} is saved`
  //           );
  //         }
  //       }
  //     }
  //   };

  //   const checkPartStatus = (value: keyof IModelTQF3) => {
  //     return (!tqf3Original ||
  //       !tqf3.id ||
  //       isEmpty(tqf3[value]) ||
  //       (isEmpty(tqf3Original[value]) &&
  //         isEqual(tqf3[value], initialTqf3Part(tqf3, value)))) &&
  //       !localStorage.getItem(`reuse${tqf3.id}-${value}`)
  //       ? "text-[#DEE2E6]" // No Data
  //       : !isEqual(tqf3Original![value], tqf3[value]) ||
  //         (value === "part4" &&
  //           (tqf3Original!.part2?.clo.some(
  //             ({ id }) =>
  //               !tqf3Original!.part4?.data.map(({ clo }) => clo).includes(id)
  //           ) ||
  //             tqf3Original!.part3?.eval.some(
  //               ({ id, percent }) =>
  //                 percent !==
  //                 tqf3Original!.part4?.data
  //                   .map(({ evals }) => evals.find((e) => e.eval == id))
  //                   .reduce((acc, cur) => acc + (cur?.percent || 0), 0)
  //             ))) ||
  //         (value === "part7" &&
  //           (tqf3.part7?.data?.some(({ plos }) => plos.length == 0) ||
  //             !tqf3.ploRequired?.every((plo) =>
  //               tqf3.part7?.data?.some(({ plos }) =>
  //                 (plos as string[]).includes(plo)
  //               )
  //             ))) ||
  //         localStorage.getItem(`reuse${tqf3.id}-${value}`)
  //       ? "text-edit" // In Progress
  //       : "text-[#24b9a5]"; // Done
  //   };

  return loading || !tqf3Original ? (
    // <Loading />
    <div
      className={`flex flex-col h-full w-full overflow-hidden ${
        !checkActiveTerm() && "pb-2"
      }`}
    >
      <Tabs
        value={tqf5Part}
        onChange={settqf5Part}
        defaultValue={"part1"}
        classNames={{
          root: "overflow-hidden w-full flex flex-col h-full",
          tab: "px-0 !bg-transparent hover:!text-tertiary",
          tabLabel: "!font-semibold text-[12px]",
        }}
        className="px-6 pt-2 flex flex-col h-full w-full"
      >
        <div
          className={`flex flex-col w-full h-fit ${
            tqf5Part === "part2" ? "pb-1" : "border-b-[2px] pb-4 mb-1"
          }`}
        >
          <Tabs.List className="md:gap-x-5 gap-x-3 w-full">
            {partTab.map(({ tab, value }) => (
              <Tabs.Tab key={value} value={value}>
                <div className="flex flex-row items-center gap-2">
                  <Icon
                    IconComponent={IconCheck}
                    //   className={checkPartStatus(value as keyof IModelTQF3)}
                  />
                  {tab}
                </div>
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <div className="flex justify-between pt-4 items-center">
            <div className=" text-secondary   overflow-y-auto font-semibold  whitespace-break-spaces">
              {getValueEnumByKey(PartTopicTQF5, tqf5Part!)}
            </div>
            <Combobox
              store={combobox}
              withinPortal={false}
              onOptionSubmit={(val) => {
                setValue(val);
                combobox.closeDropdown();
              }}
              size="xs"
            >
              <Combobox.Target>
                <InputBase
                  component="button"
                  type="button"
                  pointer
                  size="xs"
                  rightSection={<Combobox.Chevron />}
                  onClick={() => combobox.toggleDropdown()}
                  rightSectionPointerEvents="none"
                  multiline
                  className="w-[25vw]"
                  classNames={{ label: "" }}
                >
                  {selectedOption ? (
                    <SelectOption {...selectedOption} />
                  ) : (
                    <Input.Placeholder>Pick value</Input.Placeholder>
                  )}
                </InputBase>
              </Combobox.Target>

              <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
          </div>
        </div>
        <div
          className={`h-full w-full flex overflow-y-auto rounded-md text-[14px]
          ${
            tqf3Original &&
            (tqf3Original.part3 && tqf5Part === "part4" ? "" : "pt-3 px-3")
          }`}
        >
          {partTab.map((part, index) => (
            <Tabs.Panel key={index} value={part.value} className="w-full">
              {tqf5Part === part.value && tqf3.id ? (
                part.compo
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
  ) : (
    <>
      <div
        className={`flex flex-col h-full w-full overflow-hidden ${
          !checkActiveTerm() && "pb-2"
        }`}
      >
        <Tabs
          value={tqf5Part}
          onChange={settqf5Part}
          defaultValue={"part1"}
          classNames={{
            root: "overflow-hidden w-full flex flex-col h-full",
            tab: "px-0 !bg-transparent hover:!text-tertiary",
            tabLabel: "!font-semibold text-[12px]",
          }}
          className="px-6 pt-2 flex flex-col h-full w-full"
        >
          <div
            className={`flex flex-col w-full h-fit ${
              tqf5Part === "part2" ? "pb-1" : "border-b-[2px] pb-4 mb-1"
            }`}
          >
            <Tabs.List className="md:gap-x-5 gap-x-3 w-full">
              {partTab.map(({ tab, value }) => (
                <Tabs.Tab key={value} value={value}>
                  <div className="flex flex-row items-center gap-2">
                    <Icon
                      IconComponent={IconCheck}
                      //   className={checkPartStatus(value as keyof IModelTQF3)}
                    />
                    {tab}
                  </div>
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <div className="flex justify-between pt-4 items-center">
              <div className=" text-secondary   overflow-y-auto font-semibold  whitespace-break-spaces">
                {getValueEnumByKey(PartTopicTQF5, tqf5Part!)}
              </div>
              <Combobox
                store={combobox}
                withinPortal={false}
                onOptionSubmit={(val) => {
                  setValue(val);
                  combobox.closeDropdown();
                }}
                size="xs"
              >
                <Combobox.Target>
                  <InputBase
                    component="button"
                    type="button"
                    pointer
                    size="xs"
                    rightSection={<Combobox.Chevron />}
                    onClick={() => combobox.toggleDropdown()}
                    rightSectionPointerEvents="none"
                    multiline
                    className="w-[25vw]"
                    classNames={{ label: "" }}
                  >
                    {selectedOption ? (
                      <SelectOption {...selectedOption} />
                    ) : (
                      <Input.Placeholder>Pick value</Input.Placeholder>
                    )}
                  </InputBase>
                </Combobox.Target>

                <Combobox.Dropdown>
                  <Combobox.Options>{options}</Combobox.Options>
                </Combobox.Dropdown>
              </Combobox>
            </div>
          </div>
          <div
            className={`h-full w-full flex overflow-y-auto rounded-md text-[14px]
              ${
                tqf3Original &&
                (tqf3Original.part3 && tqf5Part === "part4" ? "" : "pt-3 px-3")
              }`}
          >
            {partTab.map((part, index) => (
              <Tabs.Panel key={index} value={part.value} className="w-full">
                {tqf5Part === part.value && tqf3.id ? (
                  part.compo
                ) : (
                  <div className="flex px-16  flex-row items-center justify-between h-full">
                    <div className="h-full  justify-center flex flex-col">
                      <p className="text-secondary text-[21px] font-semibold">
                        TQF 5 is coming soon to{" "}
                        <span className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                          ScoreOBE +{" "}
                        </span>{" "}
                      </p>
                      <br />
                      <p className=" -mt-3 mb-6 text-b2 break-words font-medium leading-relaxed">
                        Instructors, get ready to experience a new and improved
                        way to complete TQF 5 <br /> starting February 2025.
                      </p>
                    </div>
                    <img
                      className=" z-50  w-[25vw] "
                      src={maintenace}
                      alt="loginImage"
                    />
                  </div>
                )}
              </Tabs.Panel>
            ))}
          </div>
        </Tabs>
      </div>
    </>
  );
}
