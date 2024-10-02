import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FocusTrapInitialFocus,
  Modal,
  Select,
  Tabs,
  Tooltip,
} from "@mantine/core";
import dupTQF from "@/assets/icons/dupTQF.svg?react";
import Icon from "@/components/Icon";
import { useParams } from "react-router-dom";
import CheckIcon from "@/assets/icons/Check.svg?react";
import Part1TQF3 from "@/components/TQF3/Part1TQF3";
import Part2TQF3 from "@/components/TQF3/Part2TQF3";
import Part3TQF3 from "@/components/TQF3/Part3TQF3";
import Part4TQF3 from "@/components/TQF3/Part4TQF3";
import Part5TQF3 from "@/components/TQF3/Part5TQF3";
import Part6TQF3 from "@/components/TQF3/Part6TQF3";
import { IconExclamationCircle } from "@tabler/icons-react";
import SaveTQFbar, { partLabel, partType } from "@/components/SaveTQFBar";
import { isEmpty, isEqual } from "lodash";
import { getOneCourse } from "@/services/course/course.service";
import { saveTQF3 } from "@/services/tqf3/tqf3.service";
import {
  getValueEnumByKey,
  showNotifications,
} from "@/helpers/functions/function";
import { COURSE_TYPE, NOTI_TYPE } from "@/helpers/constants/enum";
import { UseFormReturnType } from "@mantine/form";
import exportFile from "@/assets/icons/exportFile.svg?react";
import Loading from "@/components/Loading";
import { IModelCLO, IModelTQF3 } from "@/models/ModelTQF3";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";
import Part7TQF3 from "@/components/TQF3/Part7TQF3";
import { LearningMethod } from "@/components/Modal/TQF3/ModalManageCLO";
import ModalExportTQF3 from "@/components/Modal/TQF3/ModalExportTQF3";
import { PartTopicTQF3 } from "@/helpers/constants/TQF3.enum";
import { setDataTQF3 } from "@/store/tqf3";
import { IModelSection } from "@/models/ModelSection";
import { setLoading } from "@/store/loading";

export default function TQF3() {
  const { courseNo } = useParams();
  const [openModalExportTQF3, setOpenModalExportTQF3] = useState(false);
  const loading = useAppSelector((state) => state.loading);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [tqf3Original, setTqf3Original] = useState<
    IModelTQF3 & { topic?: string }
  >();
  const tqf3 = useAppSelector((state) => state.tqf3);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<UseFormReturnType<any>>();
  const [tqf3Part, setTqf3Part] = useState<string | null>(
    Object.keys(partLabel)[0]
  );
  const [openWarningEditDataTQF2Or3, setOpenWarningEditDataTQF2Or3] =
    useState(false);
  const [confirmToEditData, setConfirmToEditData] = useState(false);
  const [openModalReuse, setOpenModalReuse] = useState(false);
  const partTab = [
    {
      value: Object.keys(partLabel)[0],
      tab: partLabel.part1,
      compo: <Part1TQF3 setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[1],
      tab: partLabel.part2,
      compo: <Part2TQF3 setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[2],
      tab: partLabel.part3,
      compo: <Part3TQF3 setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[3],
      tab: partLabel.part4,
      compo: <Part4TQF3 setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[4],
      tab: partLabel.part5,
      compo: <Part5TQF3 setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[5],
      tab: partLabel.part6,
      compo: <Part6TQF3 setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[6],
      tab: partLabel.part7,
      compo: <Part7TQF3 setForm={setForm} />,
    },
  ];

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  useEffect(() => {
    if (academicYear) fetchOneCourse(true);
  }, [academicYear]);

  useEffect(() => {
    if (tqf3.topic !== tqf3Original?.topic) {
      fetchOneCourse(true);
    }
  }, [tqf3.topic]);

  const fetchOneCourse = async (firstFetch: boolean = false) => {
    const res = await getOneCourse({
      academicYear: academicYear.id,
      courseNo,
    });
    if (res) {
      if (res.type == COURSE_TYPE.SEL_TOPIC.en) {
        const sectionTdf3 = res.sections.find(
          (sec: IModelSection) => sec.topic == tqf3.topic
        ).TQF3;
        setTqf3Original({ topic: tqf3.topic, ...sectionTdf3 });
        dispatch(
          setDataTQF3({
            topic: tqf3.topic,
            ...sectionTdf3,
            type: res.type,
            sections: [...res.sections],
          })
        );
        if (firstFetch) {
          setCurrentPartTQF3(sectionTdf3);
        }
      } else {
        setTqf3Original({ topic: tqf3.topic, ...res.TQF3! });
        dispatch(
          setDataTQF3({
            topic: tqf3.topic,
            ...res.TQF3!,
            type: res.type,
            sections: [...res.sections],
          })
        );
        if (firstFetch) {
          setCurrentPartTQF3(res.TQF3!);
        }
      }
    }
  };

  const setCurrentPartTQF3 = (tqf3: IModelTQF3) => {
    if (!tqf3.part1) {
      setTqf3Part("part1");
    } else if (!tqf3.part2) {
      setTqf3Part("part2");
    } else if (!tqf3.part3) {
      setTqf3Part("part3");
    } else if (!tqf3.part4) {
      setTqf3Part("part4");
    } else if (!tqf3.part5) {
      setTqf3Part("part5");
    } else if (!tqf3.part6) {
      setTqf3Part("part6");
    } else {
      setTqf3Part("part7");
    }
  };

  useEffect(() => {
    if (!openWarningEditDataTQF2Or3 && confirmToEditData) {
      onSave();
      setConfirmToEditData(false);
    }
  }, [openWarningEditDataTQF2Or3, confirmToEditData]);

  const onSave = async () => {
    if (form && tqf3.id && tqf3Part) {
      const validationResult = form.validate();
      if (Object.keys(validationResult.errors).length > 0) {
        const firstErrorPath = Object.keys(validationResult.errors)[0];
        form
          .getInputNode(firstErrorPath)
          ?.scrollIntoView({ behavior: "smooth", block: "end" });
      } else {
        const payload = form.getValues();
        payload.id = tqf3.id;
        switch (tqf3Part) {
          case Object.keys(partLabel)[0]:
            payload.instructors = payload.instructors.filter(
              (ins: any) => ins.length
            );
            break;
          case Object.keys(partLabel)[1]:
            payload.clo?.forEach((clo: IModelCLO) => {
              if (!clo.learningMethod.includes(LearningMethod.Other)) {
                delete clo.other;
              }
            });
            break;
        }
        if (
          !confirmToEditData &&
          tqf3Original &&
          tqf3Part &&
          ["part2", "part3"].includes(tqf3Part) &&
          ((tqf3Original.part4 &&
            (tqf3Original.part2?.clo.length !== tqf3.part2?.clo.length ||
              tqf3Original.part3?.eval.length !== tqf3.part3?.eval.length ||
              tqf3Original.part3?.eval.some(
                ({ id, percent }) =>
                  percent !== tqf3.part3?.eval.find((e) => e.id == id)?.percent
              ))) ||
            (tqf3Original.part7 &&
              tqf3.part2?.clo.length !== tqf3Original.part7.data.length))
        ) {
          setOpenWarningEditDataTQF2Or3(true);
          return;
        }
        const res = await saveTQF3(tqf3Part, payload);
        if (res) {
          setTqf3Original({ ...tqf3Original, ...res });
          dispatch(setDataTQF3({ ...tqf3, ...res }));
          showNotifications(
            NOTI_TYPE.SUCCESS,
            `TQF 3, ${tqf3Part} save success`,
            `TQF 3 - ${tqf3Part} is saved`
          );
        }
      }
    }
  };

  return loading || !tqf3Original ? (
    <Loading />
  ) : (
    <>
      {/* Modal Export TQF3 */}
      <ModalExportTQF3
        opened={openModalExportTQF3}
        onClose={() => setOpenModalExportTQF3(false)}
      />
      {/* Reuse TQF3 */}
      <Modal
        title="Reuse TQF 3"
        opened={openModalReuse}
        closeOnClickOutside={false}
        onClose={() => setOpenModalReuse(false)}
        transitionProps={{ transition: "pop" }}
        size="39vw"
        centered
        classNames={{
          content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
          body: "flex flex-col overflow-hidden max-h-full h-fit",
        }}
      >
        <FocusTrapInitialFocus />
        <div className="flex flex-col gap-3 ">
          {/* <Alert
            variant="light"
            color="blue"
            title={`Reusing TQF 3 will import all 6 parts of TQF 3 data from your selected course to automatically fill in the TQF 3 for ${courseNo}`}
            icon={<IconInfoCircle />}
            classNames={{ icon: "size-6" }}
          ></Alert> */}
          <Alert
            variant="light"
            color="red"
            title="After reusing TQF 3, please remember to double-check and save the data for all 6 parts of the course you selected"
            icon={<IconExclamationCircle />}
            classNames={{ icon: "size-6" }}
          ></Alert>
          <Select
            rightSectionPointerEvents="all"
            placeholder="Select course"
            searchable
            allowDeselect
            size="xs"
            label="Select course to reuse"
            className="w-full border-none "
            classNames={{
              input: `rounded-md`,
              option: `py-1  `,
            }}
          ></Select>
          <div className="flex gap-2 mt-3 justify-end">
            <Button variant="subtle" onClick={() => setOpenModalReuse(false)}>
              Cancel
            </Button>
            <Button>Reuse TQF 3</Button>
          </div>
        </div>
      </Modal>
      {/* Modal Confirm Change Data */}
      <Modal
        opened={openWarningEditDataTQF2Or3}
        onClose={() => setOpenWarningEditDataTQF2Or3(false)}
        closeOnClickOutside={false}
        title="Save Changes"
        size="35vw"
        centered
        transitionProps={{ transition: "pop" }}
        classNames={{
          content:
            "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center  overflow-hidden ",
        }}
      >
        <div className={`w-full  bg-white  rounded-md gap-2 flex flex-col`}>
          <Alert
            radius="md"
            variant="light"
            color="red"
            classNames={{
              body: " flex justify-center",
            }}
            title={
              <div className="flex items-center  gap-2">
                <IconExclamationCircle />
                <p>
                  Your changes affected in TQF 3 Part
                  {[tqf3Original.part4 && " 4 ", tqf3Original.part7 && " 7 "]
                    .filter(Boolean)
                    .join("&")}
                </p>
              </div>
            }
            className="mb-4"
          >
            <p className="pl-8 text-default -mt-1 leading-6 font-medium ">
              After you save this changes, you will need to update data in TQF 3
              Part
              {[tqf3Original.part4 && " 4 ", tqf3Original.part7 && " 7 "]
                .filter(Boolean)
                .join("&")}
               again. Do you want to save this changes?
            </p>
          </Alert>
        </div>

        <div className="flex gap-2 mt-2 justify-end w-full">
          <Button
            onClick={() => setOpenWarningEditDataTQF2Or3(false)}
            variant="subtle"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setConfirmToEditData(true);
              setOpenWarningEditDataTQF2Or3(false);
            }}
          >
            Save Changes
          </Button>
        </div>
      </Modal>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <Tabs
          value={tqf3Part}
          onChange={setTqf3Part}
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
              tqf3Part === "part4" && tqf3Original![tqf3Part]
                ? "pb-1"
                : "border-b-[2px] pb-4 mb-1"
            } 
           
            `}
          >
            <Tabs.List className="md:gap-x-5 gap-x-3 w-full">
              {partTab.map(({ tab, value }) => (
                <Tabs.Tab key={value} value={value}>
                  <div className="flex flex-row items-center gap-2">
                    <Icon
                      IconComponent={CheckIcon}
                      className={
                        !tqf3Original ||
                        !tqf3.id ||
                        isEmpty(tqf3Original[value as keyof IModelTQF3])
                          ? "text-[#DEE2E6]"
                          : !isEqual(
                              tqf3Original[value as keyof IModelTQF3],
                              tqf3[value as keyof IModelTQF3]
                            ) ||
                            (value === "part4" &&
                              (tqf3Original.part2?.clo.some(
                                ({ id }) =>
                                  !tqf3Original.part4?.data
                                    .map(({ clo }) => clo)
                                    .includes(id)
                              ) ||
                                tqf3Original.part3?.eval.some(
                                  ({ id, percent }) =>
                                    percent !==
                                    tqf3Original.part4?.data
                                      .map(({ evals }) =>
                                        evals.find((e) => e.eval == id)
                                      )
                                      .reduce(
                                        (acc, cur) => acc + (cur?.percent || 0),
                                        0
                                      )
                                )))
                          ? "text-edit"
                          : "text-[#24b9a5]"
                      }
                    />
                    {tab}
                  </div>
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <div className="flex justify-between pt-4 items-center">
              <div className=" text-secondary   overflow-y-auto font-semibold  whitespace-break-spaces">
                {getValueEnumByKey(PartTopicTQF3, tqf3Part!)}
              </div>
              <div className="flex flex-row flex-wrap gap-3">
                <Tooltip
                  onClick={() => setOpenModalReuse(true)}
                  withArrow
                  arrowPosition="side"
                  arrowOffset={50}
                  arrowSize={7}
                  position="bottom-end"
                  label={
                    <div className="text-default text-[13px] p-2 flex flex-col gap-2">
                      <p className=" font-medium">
                        <span className="text-secondary font-bold">
                          Reuse TQF 3
                        </span>
                        <br />
                        We'll automatically import all 6 parts of the TQF 3 data
                        from your selected course.
                      </p>
                    </div>
                  }
                  color="#FCFCFC"
                >
                  <Button
                    variant="outline"
                    leftSection={
                      <Icon IconComponent={dupTQF} className="size-5 -mr-1" />
                    }
                    color="#ee933e"
                    className="pr-4 px-3"
                  >
                    Reuse TQF 3
                  </Button>
                </Tooltip>
                <Button
                  onClick={() => setOpenModalExportTQF3(true)}
                  color="#24b9a5"
                  className="px-4"
                >
                  <div className="flex gap-2 items-center">
                    <Icon IconComponent={exportFile} />
                    Export TQF3
                  </div>
                </Button>
              </div>
            </div>
          </div>
          <div
            className={`h-full w-full flex overflow-y-auto rounded-md text-[14px]
              ${
                tqf3Original &&
                (tqf3Original.part3 && tqf3Part === "part4" ? "" : "pt-3 px-3")
              }`}
          >
            {partTab.map((part, index) => (
              <Tabs.Panel key={index} value={part.value} className="w-full">
                {tqf3Part === part.value && tqf3.id ? (
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
      {tqf3Original &&
        tqf3.id &&
        (tqf3Part == "part1" ||
          (tqf3Part == "part5" && tqf3Original.part4) ||
          tqf3Original[
            Object.keys(partLabel)[
              Object.keys(partLabel).findIndex((e) => e == tqf3Part) - 1
            ] as keyof IModelTQF3
          ]) && (
          <SaveTQFbar
            tqf="3"
            part={tqf3Part as partType}
            data={tqf3Original[tqf3Part as keyof IModelTQF3]}
            onSave={onSave}
            disabledSave={
              isEqual(
                tqf3Original[tqf3Part as keyof IModelTQF3],
                tqf3[tqf3Part as keyof IModelTQF3]
              ) && tqf3Part !== "part5"
            }
          />
        )}
    </>
  );
}
