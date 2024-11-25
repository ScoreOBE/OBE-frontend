import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Alert, Button, Group, Modal, Radio, Tabs } from "@mantine/core";
import Icon from "@/components/Icon";
import IconCheck from "@/assets/icons/Check.svg?react";
import { useParams, useSearchParams } from "react-router-dom";
import maintenace from "@/assets/image/maintenance.png";
import SaveTQFbar, { partLabel, partType } from "@/components/SaveTQFBar";
import { getValueEnumByKey } from "@/helpers/functions/function";
import { useForm, UseFormReturnType } from "@mantine/form";
import Loading from "@/components/Loading/Loading";
import { setShowNavbar, setShowSidebar } from "@/store/config";
import Part1TQF5 from "@/components/TQF5/Part1TQF5";
import Part2TQF5 from "@/components/TQF5/Part2TQF5";
import Part3TQF5 from "@/components/TQF5/Part3TQF5";
import { IModelTQF5 } from "@/models/ModelTQF5";
import { PartTopicTQF5 } from "@/helpers/constants/TQF5.enum";

export type TypeMethodTQF5 = "scoreOBE" | "manual";

export default function TQF5() {
  const { courseNo } = useParams();
  const [params, setParams] = useSearchParams();
  const loading = useAppSelector((state) => state.loading);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  // const tqf5 = useAppSelector((state) => state.tqf3);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<UseFormReturnType<any>>();
  const [tqf5Part, setTqf5Part] = useState<string | null>(
    Object.keys(partLabel)[0]
  );
  const [selectedMethod, setSelectedMethod] =
    useState<TypeMethodTQF5>("manual");
  const [openModalChangeMethod, setOpenModalChangeMethod] = useState(false);
  const partTab = [
    {
      value: Object.keys(partLabel)[0],
      tab: partLabel.part1,
      compo: <Part1TQF5 setForm={setForm} method={selectedMethod} />,
    },
    {
      value: Object.keys(partLabel)[1],
      tab: partLabel.part2,
      compo: <Part2TQF5 setForm={setForm} method={selectedMethod} />,
    },
    {
      value: Object.keys(partLabel)[2],
      tab: partLabel.part3,
      compo: <Part3TQF5 setForm={setForm} method={selectedMethod} />,
    },
  ];

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  // useEffect(() => {
  //   if (academicYear && (tqf5.topic !== tqf3Original?.topic || !tqf3Original)) {
  //     fetchOneCourse(true);
  //   }
  // }, [academicYear, tqf5.topic, courseNo]);

  const checkActiveTerm = () => {
    return (
      parseInt(params.get("year") || "") === academicYear?.year &&
      parseInt(params.get("semester") || "") === academicYear.semester
    );
  };

  // const fetchOneCourse = async (firstFetch: boolean = false) => {
  //   const [resCourse, resPloRequired] = await Promise.all([
  //     getOneCourse({
  //       year: params.get("year"),
  //       semester: params.get("semester"),
  //       courseNo,
  //     }),
  //     getOneCourseManagement(courseNo!),
  //   ]);
  //   if (resCourse) {
  //     if (resCourse.type == COURSE_TYPE.SEL_TOPIC.en) {
  //       const sectionTdf3 = resCourse.sections.find(
  //         (sec: IModelSection) => sec.topic == tqf3.topic
  //       )?.TQF3;
  //       setTqf3Original({
  //         topic: tqf3.topic,
  //         ploRequired: resPloRequired?.plos || [],
  //         part7: {},
  //         ...sectionTdf3,
  //       });
  //       dispatch(
  //         setDataTQF3({
  //           topic: tqf3.topic,
  //           ploRequired: resPloRequired?.plos || [],
  //           ...sectionTdf3,
  //           type: resCourse.type,
  //           sections: [...resCourse.sections],
  //         })
  //       );
  //       if (firstFetch) {
  //         setCurrentPartTQF3(sectionTdf3);
  //       }
  //     } else {
  //       setTqf3Original({
  //         topic: tqf3.topic,
  //         ploRequired: resPloRequired?.plos || [],
  //         part7: {},
  //         ...resCourse.TQF3!,
  //       });
  //       dispatch(
  //         setDataTQF3({
  //           topic: tqf3.topic,
  //           ploRequired: resPloRequired?.plos || [],
  //           ...resCourse.TQF3!,
  //           type: resCourse.type,
  //           sections: [...resCourse.sections],
  //         })
  //       );
  //       if (firstFetch) {
  //         setCurrentPartTQF3(resCourse.TQF3!);
  //       }
  //     }
  //   }
  // };

  const setCurrentPartTQF5 = (tqf5: IModelTQF5) => {
    if (!tqf5 || !tqf5.part1) {
      setTqf5Part("part1");
    } else if (!tqf5.part2) {
      setTqf5Part("part2");
    } else {
      setTqf5Part("part3");
    }
  };

  return loading.loading ? (
    <Loading />
  ) : (
    <>
      <Modal
        opened={openModalChangeMethod}
        onClose={() => setOpenModalChangeMethod(false)}
        centered
        title="Change Method"
        transitionProps={{ transition: "pop" }}
      >
        <div className="flex flex-col gap-2">
          <Alert />
          <Radio.Group
            classNames={{ label: "font-semibold" }}
            value={selectedMethod}
            onChange={setSelectedMethod as any}
          >
            <Group mb={2}>
              <Radio
                classNames={{ label: "font-medium" }}
                value="scoreOBE"
                label={
                  <div>
                    <p className="text-b1">ScoreOBE +</p>
                    <p className="text-b3">
                      The smartest way to evaluate and analyze your TQF 5
                    </p>
                  </div>
                }
              />
              <Radio
                classNames={{ label: "font-medium" }}
                value="manual"
                label={
                  <div>
                    <p className="text-b1">Manual</p>
                    <p className="text-b3">Customize all data what you want</p>
                  </div>
                }
              />
            </Group>
          </Radio.Group>
        </div>
      </Modal>
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
              {checkActiveTerm() && (
                <Button onClick={() => setOpenModalChangeMethod(true)}>
                  Change Method
                </Button>
              )}
              {/* <Combobox
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
              </Combobox> */}
            </div>
          </div>
          <div className="h-full w-full flex overflow-y-auto rounded-md text-[14px]">
            {partTab.map((part, index) => (
              <Tabs.Panel key={index} value={part.value} className="w-full">
                {/* {tqf5Part === part.value && tqf5.id ? (
                  part.compo
                ) : (
                  <div className="flex px-16 sm:max-ipad11:px-8 flex-row items-center justify-between h-full">
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
                )} */}
                {part.compo}
              </Tabs.Panel>
            ))}
          </div>
        </Tabs>
      </div>
    </>
  );
}
