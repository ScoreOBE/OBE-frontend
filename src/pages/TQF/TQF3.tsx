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
import Icon from "@/components/Icon";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconDupTQF from "@/assets/icons/dupTQF.svg?react";
import IconCheck from "@/assets/icons/Check.svg?react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import { useParams, useSearchParams } from "react-router-dom";
import Part1TQF3 from "@/components/TQF3/Part1TQF3";
import Part2TQF3 from "@/components/TQF3/Part2TQF3";
import Part3TQF3 from "@/components/TQF3/Part3TQF3";
import Part4TQF3 from "@/components/TQF3/Part4TQF3";
import Part5TQF3 from "@/components/TQF3/Part5TQF3";
import Part6TQF3 from "@/components/TQF3/Part6TQF3";
import Part7TQF3 from "@/components/TQF3/Part7TQF3";
import Bottombar, { partLabel, partType } from "@/components/Bottombar";
import { isEmpty, isEqual, unionBy, uniq } from "lodash";
import { getOneCourse } from "@/services/course/course.service";
import {
  getCourseReuseTQF3,
  reuseTQF3,
  saveTQF3,
} from "@/services/tqf3/tqf3.service";
import { getValueEnumByKey } from "@/helpers/functions/function";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { COURSE_TYPE, NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { useForm, UseFormReturnType } from "@mantine/form";
import exportFile from "@/assets/icons/fileExport.svg?react";
import Loading from "@/components/Loading/Loading";
import { IModelCLO, IModelTQF3 } from "@/models/ModelTQF3";
import { setShowNavbar, setShowSidebar } from "@/store/config";
import { LearningMethod } from "@/components/Modal/TQF3/ModalManageCLO";
import ModalExportTQF3 from "@/components/Modal/TQF3/ModalExportTQF3";
import { PartTopicTQF3 } from "@/helpers/constants/TQF3.enum";
import { setDataTQF3, setPloTQF3, updatePartTQF3 } from "@/store/tqf3";
import { IModelSection } from "@/models/ModelCourse";
import { getOneCourseManagement } from "@/services/courseManagement/courseManagement.service";
import { IModelCourse } from "@/models/ModelCourse";
import { initialTqf3Part } from "@/helpers/functions/tqf3";
import { setLoadingOverlay } from "@/store/loading";
import { getPLOs } from "@/services/plo/plo.service";
import { OldRecommendation, setPloTQF5 } from "@/store/tqf5";
import { IModelTQF5 } from "@/models/ModelTQF5";
import { IModelPLORequire } from "@/models/ModelCourseManagement";

export default function TQF3() {
  const { courseNo } = useParams();
  const [params, setParams] = useSearchParams();
  const [openModalExportTQF3, setOpenModalExportTQF3] = useState(false);
  const loading = useAppSelector((state) => state.loading);
  const dashboard = useAppSelector((state) => state.config.dashboard);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const course = useAppSelector((state) =>
    state.course.courses.find((course) => course.courseNo == courseNo)
  );
  const courseAdmin = useAppSelector((state) =>
    state.allCourse.courses.find((course) => course.courseNo == courseNo)
  );
  const [tqf3Original, setTqf3Original] = useState<
    Partial<IModelTQF3> & { topic?: string; ploRequired?: IModelPLORequire[] }
  >();
  const [tqf5, setTqf5] = useState<
    IModelTQF5 & { oldRecommendation?: OldRecommendation[] }
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
  const [courseReuseTqf3List, setCourseReuseTqf3List] = useState<any[]>([]);
  const [openAlertDataTQF3Part4, setOpenAlertDataTQF3Part4] = useState(false);
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
      compo: (
        <Part4TQF3
          setForm={setForm}
          openedAlert={openAlertDataTQF3Part4}
          onCloseAlert={() => setOpenAlertDataTQF3Part4(false)}
        />
      ),
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
      compo: <Part7TQF3 setForm={setForm} tqf3Original={tqf3Original!} />,
    },
  ];

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  useEffect(() => {
    if (academicYear && params.get("year") && params.get("semester")) {
      if (checkActiveTerm()) {
        fetchTqf3Reuse();
      }
    }
  }, [academicYear]);

  useEffect(() => {
    if (
      academicYear &&
      (course || courseAdmin) &&
      (tqf3.topic != tqf3Original?.topic || !tqf3.coursePLO?.length)
    ) {
      fetchPLO();
    }
  }, [academicYear, courseAdmin, course, tqf3.topic]);

  const uniqueCurriculum = () => {
    if ((courseAdmin ?? course)?.type == COURSE_TYPE.SEL_TOPIC.en) {
      return uniq(
        (courseAdmin ?? course)?.sections
          .filter((item) => item.topic == tqf3.topic)
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
      tqf3.coursePLO &&
      (tqf3.topic !== tqf3Original?.topic || !tqf3Original)
    ) {
      fetchOneCourse(true);
    }
  }, [academicYear, courseAdmin, tqf3.topic, tqf3.coursePLO]);

  useEffect(() => {
    if (localStorage.getItem(`reuse${tqf3.id}-part1`)?.length) {
      replaceReuseTQF3();
    }
  }, [localStorage.getItem(`reuse${tqf3.id}-part1`)]);

  useEffect(() => {
    if (!openWarningEditDataTQF2Or3 && confirmToEditData) {
      onSave();
      setConfirmToEditData(false);
    }
  }, [openWarningEditDataTQF2Or3, confirmToEditData]);

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
          (sec: IModelSection) => sec.topic == tqf3.topic
        );
        setTqf5(section?.TQF5);
        const ploRequire = unionBy(
          resPloRequired?.sections
            .filter((item: any) => item.topic == tqf3.topic)
            .flatMap((item: any) => item.ploRequire),
          "curriculum"
        )?.filter((plo: any) =>
          tqf3.coursePLO?.find((cPlo) => cPlo.id == plo.plo)
        );
        setTqf3Original({
          topic: tqf3.topic,
          ploRequired: ploRequire || [],
          ...section?.TQF3,
        });
        dispatch(
          setDataTQF3({
            ploRequired: ploRequire || [],
            ...section?.TQF3,
            type: resCourse.type,
            sections: [...resCourse.sections],
          })
        );
        if (firstFetch) {
          setCurrentPartTQF3(section?.TQF3);
        }
      } else {
        const ploRequire = resPloRequired?.ploRequire.filter((plo: any) =>
          tqf3.coursePLO?.find((cPlo) => cPlo.id == plo.plo)
        );
        setTqf5(resCourse.TQF5);
        setTqf3Original({
          topic: tqf3.topic,
          ploRequired: ploRequire || [],
          ...resCourse.TQF3!,
        });
        dispatch(
          setDataTQF3({
            ploRequired: ploRequire || [],
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
    setTqf3Part("part1");
    localStorage.setItem("setReuse", "true");
  };

  const setCurrentPartTQF3 = (tqf3: IModelTQF3) => {
    if (!tqf3 || !tqf3.part1) {
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

  const onSave = async () => {
    if (form && tqf3.id && tqf3Part) {
      const validationResult = form.validate();
      if (Object.keys(validationResult.errors).length > 0) {
        const firstErrorPath = Object.keys(validationResult.errors)[0];
        form
          .getInputNode(firstErrorPath)
          ?.scrollIntoView({ behavior: "smooth", block: "end" });
        if (tqf3Part == "part4") setOpenAlertDataTQF3Part4(true);
      } else {
        const payload = form.getValues();
        payload.id = tqf3.id;
        switch (tqf3Part) {
          case Object.keys(partLabel)[0]:
            if (payload.curriculum.includes("สำหรับหลักสูตร")) {
              payload.curriculum = `สำหรับหลักสูตร ${localStorage.getItem(
                "curriculumName"
              )} สาขา ${localStorage.getItem("curriculumDepartment")}`;
              localStorage.removeItem("curriculumName");
              localStorage.removeItem("curriculumDepartment");
            }
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
              tqf3.part2?.clo.length !== tqf3.part2?.clo.length))
        ) {
          setOpenWarningEditDataTQF2Or3(true);
          return;
        }
        dispatch(setLoadingOverlay(true));
        if (tqf3Part == "part4") {
          payload.tqf5 = tqf5?.id;
          if (tqf3Original?.part6) payload.done = true;
        } else if (tqf3Part == "part6" && !tqf3.coursePLO?.length)
          payload.done = true;
        if (confirmToEditData) payload.inProgress = true;
        const res = await saveTQF3(tqf3Part, payload);
        if (res) {
          localStorage.removeItem(`reuse${tqf3.id}-${tqf3Part}`);
          setTqf3Original({ ...tqf3Original, ...res });
          dispatch(setDataTQF3({ ...tqf3, ...res }));
          showNotifications(
            NOTI_TYPE.SUCCESS,
            `TQF 3, ${tqf3Part} Saved Successfully`,
            `TQF 3 - ${tqf3Part} has been successfully saved`
          );
          if (tqf3Part !== "part7") {
            setTqf3Part(`part${parseInt(tqf3Part.slice(-1)) + 1}`);
          }
        }
        dispatch(setLoadingOverlay(false));
      }
    }
  };

  const selectTqf3Reuse = useForm({
    mode: "controlled",
    initialValues: { value: "" },
    validate: {
      value: (value) => !value.length && "Select one course to reuse",
    },
    validateInputOnBlur: true,
  });

  const onCloseReuseModal = () => {
    setOpenModalReuse(false);
    selectTqf3Reuse.reset();
  };

  const onClickReuseTQF3 = async () => {
    if (!selectTqf3Reuse.validate().hasErrors && tqf3Original) {
      dispatch(setLoadingOverlay(true));
      const res = await reuseTQF3({
        id: tqf3Original.id,
        reuseId: selectTqf3Reuse.getValues().value,
      });
      if (res) {
        setTqf3Original({
          id: tqf3.id,
          topic: tqf3.topic,
          ploRequired: tqf3.ploRequired,
          part7: {} as any,
        });
        delete res.status;
        delete res.updatedAt;
        Object.keys(res).map((key) => {
          if (key.includes("part")) {
            delete res[key].updatedAt;
            localStorage.setItem(
              `reuse${tqf3.id}-${key}`,
              JSON.stringify(res[key])
            );
          }
        });
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "TQF 3 Reused Successfully",
          "This course has been successfully reused data from the selected course."
        );
      }
      dispatch(setLoadingOverlay(false));
      setOpenModalReuse(false);
      selectTqf3Reuse.reset();
    }
  };

  const checkPartStatus = (value: keyof IModelTQF3) => {
    return (!tqf3Original ||
      !tqf3.id ||
      isEmpty(tqf3[value]) ||
      (isEmpty(tqf3Original[value]) &&
        isEqual(tqf3[value], initialTqf3Part(tqf3, value)))) &&
      !localStorage.getItem(`reuse${tqf3.id}-${value}`)
      ? "text-[#DEE2E6]" // No Data
      : !isEqual(tqf3Original![value], tqf3[value]) ||
        (value === "part4" &&
          (tqf3Original!.part2?.clo.some(
            ({ id }) =>
              !tqf3Original!.part4?.data.map(({ clo }) => clo).includes(id)
          ) ||
            tqf3Original!.part3?.eval.some(
              ({ id, percent }) =>
                percent !==
                tqf3Original!.part4?.data
                  .map(({ evals }) => evals.find((e) => e.eval == id))
                  .reduce((acc, cur) => acc + (cur?.percent || 0), 0)
            ))) ||
        localStorage.getItem(`reuse${tqf3.id}-${value}`)
      ? "text-edit" // In Progress
      : "text-[#24b9a5]"; // Done
  };

  return loading.loading || !tqf3Original ? (
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
        onClose={onCloseReuseModal}
        transitionProps={{ transition: "pop" }}
        size="auto"
        centered
        classNames={{
          content:
            "flex flex-col overflow-hidden pb-2 max-h-full h-fit max-w-[45vw] acerSwift:max-macair133:!max-w-[47vw]",
          body: "flex flex-col overflow-hidden max-h-full h-fit",
          title: "acerSwift:max-macair133:!text-b1",
        }}
      >
        <FocusTrapInitialFocus />
        <div className="flex flex-col gap-3 ">
          <Alert
            variant="light"
            color="red"
            title="After reusing TQF 3, please recheck and save the data for all 7 parts of the course you selected"
            icon={
              <Icon
                IconComponent={IconExclamationCircle}
                className="size-6 acerSwift:max-macair133:!size-5"
              />
            }
            className="border border-red-100 rounded-xl bg-red-50"
            classNames={{
              title: "acerSwift:max-macair133:!text-b3",
              icon: "size-6",
              body: " flex justify-center",
              root: "p-4",
              wrapper: "items-start",
            }}
          ></Alert>
          <Alert
            variant="light"
            color="blue"
            title="TQF 3 Part 7  will not be reused if the reused course has a mismatched PLOs."
            icon={
              <Icon
                IconComponent={IconInfo2}
                className="size-6 acerSwift:max-macair133:!size-5"
              />
            }
            classNames={{
              title: "acerSwift:max-macair133:!text-b3",
              root: "bg-blue-50 border border-blue-100 rounded-xl text-blue-700",
            }}
          ></Alert>
          <Select
            rightSectionPointerEvents="all"
            placeholder="Select course"
            searchable
            allowDeselect
            size="sm"
            label="Select course to reuse"
            className="w-full border-none"
            classNames={{
              input: `rounded-md acerSwift:max-macair133:!text-b4`,
              option: `py-1 acerSwift:max-macair133:!text-b4 `,
              label: "acerSwift:max-macair133:!text-b4",
            }}
            data={courseReuseTqf3List}
            {...selectTqf3Reuse.getInputProps("value")}
          />
          <div className="flex gap-2 mt-3 justify-end ">
            <Button
              variant="subtle"
              onClick={onCloseReuseModal}
              className="acerSwift:max-macair133:!text-b5"
            >
              Cancel
            </Button>
            <Button
              loading={loading.loadingOverlay}
              onClick={onClickReuseTQF3}
              className="acerSwift:max-macair133:!text-b5"
            >
              Reuse
            </Button>
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
            "flex flex-col justify-start bg-[#F6F7FA] text-b2 acerSwift:max-macair133:!text-b3 item-center overflow-hidden",
        }}
      >
        <div className={`w-full  bg-white  rounded-md gap-2 flex flex-col`}>
          <Alert
            radius="md"
            variant="light"
            color="red"
            className="mb-4 border border-red-100 rounded-xl bg-red-50"
            classNames={{
              title: "acerSwift:max-macair133:!text-b3",
              icon: "size-6",
              body: " flex justify-center",
              root: "p-4",
              wrapper: "items-start",
            }}
            title={
              <div className="flex items-center gap-2">
                <Icon
                  IconComponent={IconExclamationCircle}
                  className="size-6"
                />
                <p>
                  Your changes affected in TQF 3 Part
                  {[tqf3Original.part4 && " 4", tqf3Original.part7 && " 7 "]
                    .filter(Boolean)
                    .join(",")}
                  {tqf5?.part2 && `and TQF 5 Part 2${tqf5?.part3 ? ", 3" : ""}`}
                </p>
              </div>
            }
          >
            <p className="pl-8 text-default -mt-1 leading-6 font-medium ">
              After you save this changes, you will need to update data in TQF 3
              Part
              {[tqf3Original.part4 && " 4", tqf3Original.part7 && "  7 "]
                .filter(Boolean)
                .join(",")}
              again
              {tqf5?.part2 &&
                ` and data in TQF 5 Part 2${
                  tqf5?.part3 ? ", 3" : ""
                } will be deleted.`}
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
      <div
        className={`flex flex-col h-full w-full overflow-hidden ${
          !checkActiveTerm() && "pb-2"
        }`}
      >
        <Tabs
          value={tqf3Part}
          onChange={setTqf3Part}
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
              (tqf3Part === "part4" &&
                (tqf3Original.part4 ||
                  (tqf3Original.part3 &&
                    localStorage.getItem(`reuse${tqf3.id}-part4`)))) ||
              tqf3Part === "part7"
                ? "pb-1"
                : "border-b-[2px] pb-4 mb-1"
            }`}
          >
            <Tabs.List className="md:gap-x-5 gap-x-3 w-full">
              {partTab.map(({ tab, value }) => (
                <Tabs.Tab key={value} value={value}>
                  <div className="flex flex-row items-center gap-2">
                    {value != "part7" && (
                      <Icon
                        IconComponent={IconCheck}
                        className={checkPartStatus(value as keyof IModelTQF3)}
                      />
                    )}
                    {tab}
                  </div>
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <div className="flex justify-between pt-4 items-center">
              <div className=" text-secondary acerSwift:max-macair133:!text-b2  overflow-y-auto font-semibold  whitespace-break-spaces">
                {getValueEnumByKey(PartTopicTQF3, tqf3Part!)}
              </div>
              <div className="flex flex-row flex-wrap gap-3">
                <div className="flex flex-row flex-wrap gap-3">
                  {checkActiveTerm() && (
                    <Tooltip
                      onClick={() => setOpenModalReuse(true)}
                      withArrow
                      arrowPosition="side"
                      arrowOffset={50}
                      arrowSize={7}
                      position="bottom-end"
                      label={
                        <div className="text-default text-b3 acerSwift:max-macair133:text-b4 p-2 flex flex-col gap-2">
                          <p className=" font-medium">
                            <span className="text-secondary font-bold">
                              Reuse TQF 3
                            </span>
                            <br />
                            We'll automatically import all 7 parts of the TQF 3
                            data from your selected course.
                          </p>
                        </div>
                      }
                      color="#FCFCFC"
                    >
                      <Button
                        variant="outline"
                        leftSection={
                          <Icon
                            IconComponent={IconDupTQF}
                            className="text-[#ee933e] size-5 -mr-1 acerSwift:max-macair133:size-4"
                          />
                        }
                        color="#ee933e"
                        className="pr-4 px-3 acerSwift:max-macair133:!text-b5"
                      >
                        Reuse TQF 3
                      </Button>
                    </Tooltip>
                  )}
                  <Button
                    onClick={() => setOpenModalExportTQF3(true)}
                    color="#24b9a5"
                    className="px-4"
                  >
                    <div className="flex gap-2 items-center acerSwift:max-macair133:text-b5">
                      <Icon
                        className="size-5 acerSwift:max-macair133:size-4"
                        IconComponent={exportFile}
                      />
                      Export TQF 3
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`h-full w-full flex overflow-y-auto text-b2 acerSwift:max-macair133:text-b3
              ${
                tqf3Original &&
                (tqf3Original.part3 && ["part4", "part7"].includes(tqf3Part!)
                  ? ""
                  : "pt-3 px-3")
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
      {checkActiveTerm() &&
        tqf3Original &&
        tqf3.id &&
        (tqf3Part == "part1" ||
          (tqf3Part == "part5" && tqf3Original.part4) ||
          tqf3Original[
            Object.keys(partLabel)[
              Object.keys(partLabel).findIndex((e) => e == tqf3Part) - 1
            ] as keyof IModelTQF3
          ]) && (
          <Bottombar
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
