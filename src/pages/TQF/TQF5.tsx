import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Alert, Button, Group, Modal, Radio, Tabs } from "@mantine/core";
import Icon from "@/components/Icon";
import IconCheck from "@/assets/icons/Check.svg?react";
import IconExchange from "@/assets/icons/change.svg?react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import { useParams, useSearchParams } from "react-router-dom";
import unplug from "@/assets/image/unplug.png";
import SaveTQFbar, { partLabel, partType } from "@/components/SaveTQFBar";
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
import { IModelSection } from "@/models/ModelCourse";
import { getOneCourse } from "@/services/course/course.service";
import { getOneCourseManagement } from "@/services/courseManagement/courseManagement.service";
import { setDataTQF5, setPloTQF5 } from "@/store/tqf5";
import { setPloTQF3 } from "@/store/tqf3";
import { isEmpty, isEqual } from "lodash";
import { changeMethodTQF5, saveTQF5 } from "@/services/tqf5/tqf5.service";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { getOnePLO } from "@/services/plo/plo.service";
import MainPopup from "@/components/Popup/MainPopup";
import { IModelTQF3 } from "@/models/ModelTQF3";

export default function TQF5() {
  const { courseNo } = useParams();
  const [params, setParams] = useSearchParams();
  const loading = useAppSelector((state) => state.loading);
  const dashboard = useAppSelector((state) => state.config.dashboard);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const courseAdmin = useAppSelector((state) =>
    state.allCourse.courses.find((course) => course.courseNo == courseNo)
  );
  const [tqf3, setTqf3] = useState<IModelTQF3>();
  const [tqf5Original, setTqf5Original] = useState<
    Partial<IModelTQF5> & { topic?: string; ploRequired?: string[] }
  >();
  const tqf5 = useAppSelector((state) => state.tqf5);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<UseFormReturnType<any>>();
  const [tqf5Part, setTqf5Part] = useState<string | null>(
    Object.keys(partLabel)[0]
  );
  const [selectedMethod, setSelectedMethod] = useState<METHOD_TQF5>();
  const [openModalChangeMethod, setOpenModalChangeMethod] = useState(false);
  const [openModalAssignmentMapping, setOpenModalAssignmentMapping] =
    useState(false);
  const [openMainPopupConfirmChange, setOpenMainPopupConfirmChange] =
    useState(false);
  const partTab = [
    {
      value: Object.keys(partLabel)[0],
      tab: partLabel.part1,
      compo: <Part1TQF5 setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[1],
      tab: partLabel.part2,
      compo: <Part2TQF5 setForm={setForm} tqf3={tqf3!} />,
    },
    {
      value: Object.keys(partLabel)[2],
      tab: partLabel.part3,
      compo: <Part3TQF5 setForm={setForm} tqf3={tqf3!} />,
    },
  ];

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  useEffect(() => {
    if (academicYear && params.get("year") && params.get("semester")) {
      if (!tqf5.coursePLO?.id) {
        fetchPLO();
      }
    }
  }, [academicYear]);

  const fetchPLO = async () => {
    const resPloCol = await getOnePLO({
      year: params.get("year"),
      semester: params.get("semester"),
      courseCode: courseNo?.slice(0, -3),
    });
    if (resPloCol) {
      dispatch(setPloTQF3(resPloCol));
      dispatch(setPloTQF5(resPloCol));
    }
  };

  useEffect(() => {
    if (
      academicYear &&
      courseNo &&
      tqf5.coursePLO &&
      (tqf5.topic !== tqf5Original?.topic || !tqf5Original)
    ) {
      if (!tqf3?.status || tqf3?.status == TQF_STATUS.DONE) {
        fetchOneCourse(true);
      }
    }
  }, [academicYear, tqf5.topic, tqf5.coursePLO]);

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
      }),
      getOneCourseManagement(courseNo!),
    ]);
    if (dashboard == ROLE.ADMIN) {
      resCourse = courseAdmin;
    }
    if (resCourse) {
      if (resCourse.type == COURSE_TYPE.SEL_TOPIC.en) {
        const section = resCourse.sections.find(
          (sec: IModelSection) => sec.topic == tqf5.topic
        );
        const sectionTdf5 = section?.TQF5;
        setTqf3(section?.TQF3);
        const ploRequire = resPloRequired?.sections
          .find((item: any) => item.topic == tqf5.topic)
          ?.ploRequire.find((plo: any) => plo.plo == tqf5.coursePLO?.id)?.list;
        setTqf5Original({
          topic: tqf5.topic,
          ploRequired: ploRequire || [],
          ...sectionTdf5,
        });
        setSelectedMethod(sectionTdf5.method);
        dispatch(
          setDataTQF5({
            topic: tqf5.topic,
            ploRequired: ploRequire || [],
            ...sectionTdf5,
            type: resCourse.type,
            sections: [...resCourse.sections],
          })
        );
        if (firstFetch) {
          setCurrentPartTQF5(sectionTdf5);
        }
      } else {
        const ploRequire = resPloRequired?.ploRequire.find(
          (plo: any) => plo.plo == tqf5.coursePLO?.id
        )?.list;
        setTqf3(resCourse.TQF3);
        setTqf5Original({
          topic: tqf5.topic,
          ploRequired: ploRequire || [],
          ...resCourse.TQF5!,
        });
        setSelectedMethod(resCourse.TQF5.method);
        dispatch(
          setDataTQF5({
            topic: tqf5.topic,
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
      if (Object.keys(validationResult.errors).length > 0) {
        const firstErrorPath = Object.keys(validationResult.errors)[0];
        form
          .getInputNode(firstErrorPath)
          ?.scrollIntoView({ behavior: "smooth", block: "end" });
      } else {
        const payload = form.getValues();
        payload.id = tqf5.id;
        const res = await saveTQF5(tqf5Part, payload);
        if (res) {
          setTqf5Original({ ...tqf5Original, ...res });
          dispatch(setDataTQF5({ ...tqf5, ...res }));
          showNotifications(
            NOTI_TYPE.SUCCESS,
            `TQF 5, ${tqf5Part} save successfully`,
            `TQF 5 - ${tqf5Part} is saved`
          );
          if (tqf5Part !== "part3") {
            setTqf5Part(`part${parseInt(tqf5Part.slice(-1)) + 1}`);
          }
        }
      }
    }
  };

  const onChangeMethod = async (method?: string) => {
    const res = await changeMethodTQF5(tqf5.id, {
      method: method ?? selectedMethod,
    });
    if (res) {
      const newTqf5 = tqf5Original;
      delete newTqf5?.part2;
      delete newTqf5?.part3;
      setTqf5Original({ ...newTqf5, method: res.method });
      dispatch(setDataTQF5({ ...newTqf5, method: res.method }));
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Change Method successfully",
        `now method TQF5 is ${method ?? selectedMethod}.`
      );
      setOpenMainPopupConfirmChange(false);
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

  return loading.loading ? (
    <Loading />
  ) : (
    <>
      <Modal
        opened={openModalChangeMethod}
        onClose={() => setOpenModalChangeMethod(false)}
        centered
        size="500"
        title="Change Method"
        transitionProps={{ transition: "pop" }}
      >
        <div className="flex flex-col gap-5 justify-between ">
          <div className="flex flex-col gap-2">
            <Alert
              radius="md"
              icon={<Icon IconComponent={IconInfo2} />}
              variant="light"
              color="blue"
              className="mb-5"
              classNames={{
                icon: "size-6",
                body: " flex justify-center",
              }}
              title={<p>Changing the method will impact TQF 5 Part 2 & 3.</p>}
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
                  <Group wrap="nowrap" align="flex-start">
                    <Radio.Indicator />
                    <div>
                      <p className="text-b1">{METHOD_TQF5.SCORE_OBE}</p>
                      <p className="text-b3">
                        The smartest way to evaluate and analyze your TQF 5
                      </p>
                      {tqf5.method === METHOD_TQF5.SCORE_OBE && (
                        <span className="text-xs text-secondary">
                          (Currently in use)
                        </span>
                      )}
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
                  <Group wrap="nowrap" align="flex-start">
                    <Radio.Indicator />
                    <div>
                      <p className="text-b1">{METHOD_TQF5.MANUAL}</p>
                      <p className="text-b3">
                        Customize all data what you want
                      </p>
                      {tqf5.method === METHOD_TQF5.MANUAL && (
                        <p className="text-xs text-secondary">
                          (Currently in use)
                        </p>
                      )}
                    </div>
                  </Group>
                </Radio.Card>
              </Group>
            </Radio.Group>
          </div>
          <div className="flex justify-end">
            <Button
              className="font-bold"
              disabled={selectedMethod === tqf5.method}
              onClick={() => {
                setOpenMainPopupConfirmChange(true);
                setOpenModalChangeMethod(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
      <MainPopup
        opened={openMainPopupConfirmChange}
        onClose={() => setOpenMainPopupConfirmChange(false)}
        action={() => onChangeMethod()}
        type="warning"
        labelButtonRight={`Switch to ${selectedMethod} ${
          selectedMethod !== "Manual" ? "+" : ""
        }`}
        title={`Your save will be lost ? `}
        message={
          <>
            <Alert
              variant="light"
              color="orange"
              title={
                <p>
                  Head Up!{" "}
                  <span className="text-[#CD5E00]">
                    {" "}
                    Switch to {selectedMethod}
                  </span>{" "}
                  will be removed your save in TQF 5 Parts 2 & 3. Are you sure
                  you want to switch?
                </p>
              }
              icon={<Icon IconComponent={IconExclamationCircle} />}
              classNames={{ icon: "size-6" }}
            ></Alert>
          </>
        }
      />
      <Modal
        opened={openModalAssignmentMapping}
        onClose={() => setOpenModalAssignmentMapping(false)}
        centered
        title="Evaluation Mapping"
        transitionProps={{ transition: "pop" }}
      >
        Evaluation Mapping is coming soon.
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
          <div className="flex flex-col w-full h-fit border-b-[2px] pb-2 mb-1">
            <Tabs.List className="md:gap-x-5 gap-x-3 w-full">
              {partTab.map(({ tab, value }) => (
                <Tabs.Tab key={value} value={value}>
                  <div className="flex flex-row items-center gap-2">
                    <Icon
                      IconComponent={IconCheck}
                      className={checkPartStatus(value as keyof IModelTQF5)}
                    />
                    {tab}
                  </div>
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <div className="flex justify-between pt-4 items-center">
              <div className=" text-secondary overflow-y-auto font-semibold min-h-14 whitespace-break-spaces">
                {getValueEnumByKey(PartTopicTQF5, tqf5Part!)}
              </div>
              {checkActiveTerm() && tqf5Part != "part1" && tqf5.method && (
                <div className="flex gap-2 items-center">
                  {tqf5Part == "part2" &&
                    tqf5.method == METHOD_TQF5.SCORE_OBE && (
                      <Button
                        onClick={() => setOpenModalAssignmentMapping(true)}
                      >
                        Evaluation Mapping
                      </Button>
                    )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (tqf5.method) setSelectedMethod(tqf5.method);
                      setOpenModalChangeMethod(true);
                    }}
                    className="flex flex-col items-start !justify-start text-left"
                  >
                    <div className="flex items-center gap-2">
                      {/* <Icon
                        IconComponent={IconExchange}
                        className="size-4 stroke-[2px]"
                      /> */}
                      <div className="flex flex-col gap-1 font-semibold">
                        <p className="text-[13px]">
                          Change Method{" "}
                          <span className="text-primary font-medium">
                            ({tqf5.method})
                          </span>
                        </p>{" "}
                      </div>
                    </div>
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="h-full w-full flex overflow-y-auto text-[14px] pt-3">
            {partTab.map((part, index) => (
              <Tabs.Panel key={index} value={part.value} className="w-full">
                {tqf5Part === part.value &&
                tqf5.id &&
                tqf3?.status == TQF_STATUS.DONE &&
                (tqf5Part == "part1" || tqf5.method) ? (
                  part.compo
                ) : tqf3?.status != TQF_STATUS.DONE ? (
                  <div className="flex px-16 sm:max-ipad11:px-8 flex-row items-center justify-between h-full">
                    <div className="h-full  justify-center flex flex-col">
                      <p className="text-secondary text-[21px] font-semibold">
                        TQF3 incompleted
                      </p>
                      <br />
                      <p className=" -mt-3 mb-6 text-b2 break-words font-medium leading-relaxed">
                        Your TQF3 is incompleted in all part.
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
                        Choose method to evaluate TQF5 First
                      </p>
                      <p className=" text-[#333333] leading-6 font-medium text-[14px] sm:max-ipad11:text-[13px]">
                        To start TQF5 Part 2, please choose method to evaluate.{" "}
                        <br />
                        Once done, you can continue to do it.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => onChangeMethod(METHOD_TQF5.MANUAL)}
                        >
                          {METHOD_TQF5.MANUAL}
                        </Button>
                        <Button
                          onClick={() => onChangeMethod(METHOD_TQF5.SCORE_OBE)}
                        >
                          {METHOD_TQF5.SCORE_OBE}
                        </Button>
                      </div>
                    </div>
                    <img
                      className=" z-50 ipad11:w-[380px] sm:w-[340px] w-[340px]  macair133:w-[580px] macair133:h-[300px] "
                      src={unplug}
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
      {checkActiveTerm() &&
        tqf5Original &&
        tqf5.id &&
        (tqf5Part == "part1" ||
          tqf5Original[
            Object.keys(partLabel)[
              Object.keys(partLabel).findIndex((e) => e == tqf5Part) - 1
            ] as keyof IModelTQF5
          ]) && (
          <SaveTQFbar
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
