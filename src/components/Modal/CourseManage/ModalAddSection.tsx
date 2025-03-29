import { useState } from "react";
import {
  Stepper,
  Button,
  Group,
  Modal,
  TextInput,
  Checkbox,
  TagsInput,
  List,
  Menu,
  Alert,
  Chip,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Icon from "@/components/Icon";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconCircleFilled from "@/assets/icons/circleFilled.svg?react";
import IconArrowRight from "@/assets/icons/arrowRight.svg?react";
import IconUsers from "@/assets/icons/users.svg?react";
import { COURSE_TYPE, NOTI_TYPE } from "@/helpers/constants/enum";
import { SEMESTER } from "@/helpers/constants/enum";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  validateTextInput,
  validateSectionNo,
} from "@/helpers/functions/validation";
import {
  getSectionNo,
  getUserName,
  sortData,
} from "@/helpers/functions/function";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import CompoManageIns from "@/components/CompoManageIns";
import { IModelSection } from "@/models/ModelCourse";
import { IModelCourse } from "@/models/ModelCourse";
import {
  checkCanCreateCourse,
  createCourse,
} from "@/services/course/course.service";
import { getOneCourseManagement } from "@/services/courseManagement/courseManagement.service";
import { editCourse } from "@/store/course";
import { editCourseManagement } from "@/store/courseManagement";
import { setLoadingOverlay } from "@/store/loading";

type Props = {
  opened: boolean;
  onClose: () => void;
  data: Partial<IModelCourse>;
  isManage?: boolean;
  fetchOneCourse?: () => void;
};
export default function ModalAddSection({
  opened,
  onClose,
  data = {},
  isManage = false,
  fetchOneCourse,
}: Props) {
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const curriculum = useAppSelector((state) => state.faculty.curriculum);
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(0);
  const [sectionNoList, setSectionNoList] = useState<string[]>([]);
  const [coInsList, setCoInsList] = useState<any[]>([]);
  const [firstInput, setFirstInput] = useState(true);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { sections: [{}] as Partial<IModelSection>[] },
    validate: {
      sections: {
        topic: (value) => validateTextInput(value, "Topic"),
        sectionNo: (value) => validateSectionNo(value),
        semester: (value) => {
          return value?.length || !isManage
            ? null
            : "Please choose at least one semester.";
        },
        curriculum: (value) => (!value ? "Curriculum is required" : null),
        instructor: (value: any) =>
          value?.value?.length ? null : "Please select one instructor",
      },
    },
    validateInputOnBlur: true,
  });

  const nextStep = async () => {
    dispatch(setLoadingOverlay(true));
    setFirstInput(false);
    let isValid = true;
    const length = form.getValues().sections.length || 0;
    if (active == 0) {
      for (let i = 0; i < length; i++) {
        isValid = !form.validateField(`sections.${i}.sectionNo`).hasError;
        if (!isValid) break;
      }
      form.validateField("sections.0.topic");
      isValid =
        isValid &&
        (!form.validateField("sections.0.topic").hasError ||
          data.type !== COURSE_TYPE.SEL_TOPIC.en);
      if (isValid) {
        const res = await checkCanCreateCourse({
          courseNo: data.courseNo,
          sections: sectionNoList.map((sec) => parseInt(sec)),
        });
        if (!res) isValid = false;
      }
    } else if (isManage && active == 1) {
      for (let i = 0; i < length; i++) {
        const isError = form.validateField(`sections.${i}.instructor`).hasError;
        if (isValid) {
          isValid = !isError;
        } else {
          form.validateField(`sections.${i}.instructor`);
        }
      }
    } else if (isManage ? active == 2 : active == 1) {
      const secNoList: string[] = [];
      for (let i = 0; i < length; i++) {
        const semesterError = form.validateField(
          `sections.${i}.semester`
        ).hasError;
        const curriculumError = form.validateField(
          `sections.${i}.curriculum`
        ).hasError;
        if (semesterError || curriculumError) {
          secNoList.push(
            getSectionNo(form.getValues().sections?.[i]?.sectionNo)
          );
          isValid = false;
        }
      }
      if (secNoList.length) {
        secNoList.sort((a: any, b: any) => parseInt(a) - parseInt(b));
        showNotifications(
          NOTI_TYPE.ERROR,
          "Missing Required Fields",
          `Please select a semester and a valid curriculum for section ${secNoList.join(
            ", "
          )}`
        );
      }
    }
    if (isValid) {
      setFirstInput(true);
      setActive((cur) => (cur < (isManage ? 4 : 3) ? cur + 1 : cur));
      if (isManage ? active == 4 : active == 3) {
        await addSection();
      }
    }
    dispatch(setLoadingOverlay(false));
  };
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));
  const closeModal = () => {
    setActive(0);
    setSectionNoList([]);
    setCoInsList([]);
    form.setValues({ sections: [{}] });
    onClose();
  };

  const setPayload = () => {
    let payload = {
      ...data,
      sections: [...form.getValues().sections],
      year: academicYear.year,
      semester: academicYear.semester,
    };
    delete payload.id;

    payload.sections?.forEach((sec: any) => {
      if (payload.type == COURSE_TYPE.SEL_TOPIC.en) {
        sec.topic = form.getValues().sections![0].topic;
      }
      if (sec.curriculum == "-") {
        delete sec.curriculum;
      }
      sec.semester = sec.semester?.map((term: string) => parseInt(term));
      if (isManage) {
        sec.instructor = sec.instructor.value;
      }
      sec.coInstructors = sec.coInstructors?.map((coIns: any) => coIns.value);
    });

    return payload;
  };

  const addSection = async () => {
    const res = await createCourse(setPayload());
    if (res) {
      if (fetchOneCourse) fetchOneCourse();
      if (isManage) {
        const resOne = await getOneCourseManagement({
          courseNo: data.courseNo,
        });
        if (resOne) {
          dispatch(editCourseManagement(resOne));
        }
        dispatch(
          editCourse({
            id: res.courseId,
            ...res,
          })
        );
      }
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Section Added Successfully",
        `${sectionNoList.join(
          ", "
        )}  has been successfully added to this course`
      );
      closeModal();
    }
  };

  const setSectionList = (value: string[]) => {
    let sections = form.getValues().sections ?? [];
    const lastValue = value[value.length - 1];
    const type = data.type;
    // validate section No
    if (value.length && value.length >= sections.length) {
      if (
        !parseInt(lastValue) ||
        lastValue.length > 3 ||
        sections.some((sec) => sec.sectionNo === parseInt(lastValue))
      )
        return;
    }
    const sectionNo: string[] = value.sort((a, b) => parseInt(a) - parseInt(b));
    setSectionNoList(sectionNo.map((secNo) => getSectionNo(secNo)));
    // reset sections and instructors
    let initialSection: Partial<IModelSection> = { semester: [] };
    if (type == COURSE_TYPE.SEL_TOPIC.en) {
      initialSection.topic = sections[0]?.topic;
    }
    if (!sectionNo.length) {
      sections = [{ ...initialSection }];
      setCoInsList([]);
    } else if (sections?.length == sectionNo.length) {
      sections[sectionNo.length - 1] = {
        ...initialSection,
        sectionNo: parseInt(lastValue),
        instructor: isManage ? "" : user.id,
        coInstructors: coInsList
          .map((coIns) => ({ ...coIns }))
          .filter(
            (coIns) =>
              coIns.value !=
              (
                sections.find(
                  ({ sectionNo }) => sectionNo == parseInt(lastValue)
                )?.instructor as any
              ).value
          ),
      };
    }
    // adjust coInstructors
    else if (sectionNo.length > sections?.length) {
      coInsList.forEach((coIns) => {
        coIns.sections = coIns.sections.filter((sec: string) =>
          sectionNo.includes(sec)
        );
        if (!coIns.sections.includes(lastValue)) {
          coIns.sections.push(getSectionNo(lastValue));
          coIns.sections.sort((a: any, b: any) => parseInt(a) - parseInt(b));
        }
      });
      setCoInsList(coInsList.filter((coIns) => coIns.sections.length > 0));
      sections.push({
        ...initialSection,
        sectionNo: parseInt(lastValue),
        instructor: isManage ? "" : user.id,
        coInstructors: coInsList
          .map((coIns) => ({ ...coIns }))
          .filter(
            (coIns) =>
              coIns.value !=
              (
                sections.find(
                  ({ sectionNo }) => sectionNo == parseInt(lastValue)
                )?.instructor as any
              ).value
          ),
      });
    } else {
      coInsList.forEach((coIns) => {
        coIns.sections = coIns.sections.filter((sec: string) =>
          sectionNo.includes(sec)
        );
        if (!coIns.sections.includes(lastValue)) {
          coIns.sections.push(getSectionNo(lastValue));
          coIns.sections.sort((a: any, b: any) => parseInt(a) - parseInt(b));
        }
      });
      setCoInsList(coInsList.filter((coIns) => coIns.sections.length > 0));
      sections = sections.filter((sec) =>
        sectionNo.includes(getSectionNo(sec.sectionNo))
      );
    }
    sections.forEach((sec) => sortData(sec.coInstructors!, "label", "string"));
    sortData(sections, "sectionNo");
    form.setFieldValue("sections", [...sections]);
  };

  const addCoIns = (
    {
      inputUser,
      instructorOption,
    }: { inputUser: any; instructorOption: any[] },
    {
      setInputUser,
      setInstructorOption,
    }: {
      setInputUser: React.Dispatch<React.SetStateAction<any>>;
      setInstructorOption: React.Dispatch<React.SetStateAction<any[]>>;
    }
  ) => {
    if (inputUser?.value) {
      inputUser.sections = [];
      const updatedInstructorOptions = instructorOption.map((option: any) =>
        option?.value == inputUser.value
          ? { ...option, disabled: true }
          : option
      );
      setInstructorOption(updatedInstructorOptions);
      delete inputUser.disabled;
      const updatedSections = form.getValues().sections?.map((sec) => {
        const coInsArr = [...(sec.coInstructors ?? []), inputUser];
        sortData(coInsArr, "label", "string");
        if ((sec.instructor as any).value != inputUser.value) {
          inputUser.sections.push(getSectionNo(sec.sectionNo));
          inputUser.sections.sort(
            (a: any, b: any) => parseInt(a) - parseInt(b)
          );
        }
        return {
          ...sec,
          coInstructors: [...coInsArr],
        };
      });
      setCoInsList([inputUser, ...coInsList]);
      form.setFieldValue("sections", [...updatedSections!]);
    }
    setInputUser({ value: null });
  };

  const removeCoIns = (coIns: any) => {
    const newList = coInsList.filter((e) => e.value !== coIns.value);
    const updatedSections = form.getValues().sections?.map((sec) => ({
      ...sec,
      coInstructors: (sec.coInstructors ?? []).filter(
        (p) => p.value !== coIns.value
      ),
    }));
    form.setFieldValue("sections", [...updatedSections!]);
    setCoInsList(newList);
  };

  const editCoInsInSec = (sectionNo: string, checked: boolean, coIns: any) => {
    const updatedSections = form.getValues().sections;
    updatedSections?.forEach((sec, index) => {
      const secNo = getSectionNo(sec.sectionNo);
      if (sectionNo == secNo) {
        if (checked) {
          if (!coIns.sections.includes(secNo)) {
            coIns.sections = [...coIns.sections, secNo].sort(
              (a: any, b: any) => a - b
            );
          }
          sec.coInstructors?.push({ ...coIns });
        } else {
          coIns.sections = coIns.sections.filter((e: any) => e !== secNo);
          sec.coInstructors = sec.coInstructors?.filter(
            (p: any) => p.value !== coIns.value
          );
        }
        sortData(sec.coInstructors, "label", "string");
      }
      return sec;
    });
    form.setFieldValue("sections", [...updatedSections!]);
  };

  const setSemesterInSec = (
    index: number,
    checked: boolean,
    semester?: string[]
  ) => {
    const semesterList: any[] =
      form.getValues().sections?.at(index)?.semester ?? [];
    if (!semester) {
      form.setFieldValue(`sections.${index}.openThisTerm`, checked);
      // if (
      //   checked &&
      //   !semesterList?.includes(academicYear?.semester.toString())
      // ) {
      //   semesterList.push(academicYear?.semester.toString());
      //   semesterList.sort((a: any, b: any) => parseInt(a) - parseInt(b));
      //   form.setFieldValue(`sections.${index}.semester`, semesterList);
      // }
    } else {
      form.setFieldValue(`sections.${index}.semester`, semester.sort());
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      closeOnClickOutside={false}
      title="Add Section"
      size="50vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: "acerSwift:max-macair133:!text-b1",
        content:
          "flex flex-col justify-center bg-[#F6F7FA] item-center overflow-hidden",
      }}
    >
      <Stepper
        active={active}
        color="#6869AD"
        onStepClick={setActive}
        allowNextStepsSelect={false}
        icon={<Icon IconComponent={IconCircleFilled} />}
        classNames={{
          separator: `text-primary mb-12 h-[3px] `,
          step: "flex flex-col  items-start  w-[42px] ",
          stepIcon: "mb-2 text-[#E6E6FF] bg-[#E6E6FF] border-[#E6E6FF]",
          stepBody: "flex-col-reverse m-0 text-nowrap",
          stepLabel: "text-b3 acerSwift:max-macair133:text-b4 font-semibold",
          stepDescription:
            "text-b3 acerSwift:max-macair133:text-b4 font-semibold ",
        }}
        className=" justify-center items-center mt-1  text-b2 acerSwift:max-macair133:text-b3 max-h-full"
      >
        <Stepper.Step
          allowStepSelect={false}
          label="Section"
          description="STEP 1"
        >
          <div className="w-full  mt-2 h-fit  bg-white mb-5 rounded-md">
            <div className="flex flex-col gap-3">
              {data.type == COURSE_TYPE.SEL_TOPIC.en && (
                <TextInput
                  label="Course Topic"
                  withAsterisk
                  size="xs"
                  classNames={{
                    input:
                      "focus:border-primary acerSwift:max-macair133:!text-b4",
                    label: "acerSwift:max-macair133:!text-b4",
                  }}
                  placeholder="Full Stack Development"
                  {...form.getInputProps("sections.0.topic")}
                />
              )}
              <TagsInput
                label="Section"
                withAsterisk
                classNames={{
                  input:
                    " h-[145px] bg-[#ffffff] mt-[2px] p-3 text-b4 rounded-md",
                  pill: "bg-secondary text-white font-bold !pr-1 pb-1  acerSwift:max-macair133:!text-b4",
                  label:
                    "font-semibold text-tertiary text-b2 acerSwift:max-macair133:!text-b4",
                  error: "text-[10px] !border-none",
                }}
                placeholder="001 or 1 (Press Enter or Spacebar for fill the next section)"
                splitChars={[",", " ", "|"]}
                {...form.getInputProps(`section.sectionNo`)}
                error={
                  !firstInput &&
                  form.validateField(`sections.0.sectionNo`).error
                }
                value={sectionNoList}
                onChange={setSectionList}
              ></TagsInput>
              <p>{form.validateField("sections.sectionNo").error}</p>
            </div>
          </div>
        </Stepper.Step>
        {isManage && (
          <Stepper.Step
            allowStepSelect={false}
            label="Instructor"
            description="STEP 2"
          >
            <Alert
              radius="md"
              icon={<Icon IconComponent={IconInfo2} />}
              variant="light"
              color="blue"
              className="mb-2"
              classNames={{
                icon: "size-6",
                body: " flex justify-center",
                root: "bg-blue-50 border border-blue-100 rounded-xl text-blue-700",
              }}
              title={
                <p className="text-blue-700">
                  Each section can only have one instructor.
                </p>
              }
            ></Alert>
            <div className="flex flex-col max-h-[380px] h-fit w-full mt-1 mb-5  p-[2px]    overflow-y-auto  ">
              <div className="flex flex-col font-medium text-b2 acerSwift:max-macair133:text-b3 gap-5">
                {form
                  .getValues()
                  .sections?.map((sec: Partial<IModelSection>, index) => (
                    <div className="flex flex-col" key={index}>
                      <span className="text-secondary font-semibold">
                        Select instructor for section{" "}
                        {getSectionNo(sec.sectionNo)}
                        <span className="text-red-500"> *</span>
                        <br />
                        {/* <span className="text-b4 text-[#a2a2a2] -mt-2">Only one instructor is allowed per section</span> */}
                      </span>

                      <CompoManageIns
                        opened={active == 1}
                        type="mainIns"
                        value={sec.instructor as string}
                        swapMethod={(sec.instructor as any)?.label?.includes(
                          "@cmu.ac.th"
                        )}
                        action={(value) =>
                          form.setFieldValue(
                            `sections.${index}.instructor`,
                            value
                          )
                        }
                        error={
                          firstInput
                            ? undefined
                            : form
                                .validateField(`sections.${index}.instructor`)
                                .error?.toString()
                        }
                      />
                    </div>
                  ))}
              </div>
            </div>
          </Stepper.Step>
        )}
        <Stepper.Step
          allowStepSelect={false}
          label="Semester"
          description={`STEP ${isManage ? 3 : 2}`}
        >
          <div className="flex flex-col max-h-[380px] acerSwift:max-macair133:max-h-[270px] h-fit w-full mt-2 mb-5 p-[2px] overflow-y-auto  ">
            <div className="flex flex-col font-medium text-b2 acerSwift:max-macair133:text-b3 gap-5">
              {form.getValues().sections?.map((sec: any, index) => (
                <div className="flex flex-col gap-1" key={index}>
                  <span className="text-secondary text-b2 acerSwift:max-macair133:text-b3 font-bold">
                    Section {getSectionNo(sec.sectionNo)}{" "}
                    <span className="text-red-500">*</span>
                  </span>
                  <div className="w-full justify-center  border-b-[1.5px]  pr-[18px] pt-2 pb-1  flex flex-col ">
                    <div className="gap-2 flex flex-col">
                      <Select
                        label={`Select the Curriculum for Section ${getSectionNo(
                          sec.sectionNo
                        )}`}
                        size="xs"
                        placeholder="Select curriculum"
                        searchable
                        nothingFoundMessage="No result"
                        data={[
                          {
                            value: "-",
                            label:
                              "หลักสูตรอื่นๆ (No curriculum for this section.)",
                          },
                          ...(curriculum?.map((item) => ({
                            value: item.code,
                            label: `${item.nameTH} [${item.code}]`,
                          })) || []),
                        ]}
                        allowDeselect={false}
                        classNames={{
                          input:
                            "focus:border-primary acerSwift:max-macair133:!text-b5",
                          label: "acerSwift:max-macair133:!text-b4",
                        }}
                        {...form.getInputProps(`sections.${index}.curriculum`)}
                      />
                      <div className="p-5 mt-1 mb-3 bg-[#f5f5f5] rounded-xl">
                        <span className="font-semibold mt-2 text-default text-b2  acerSwift:max-macair133:text-b4">
                          Repeat on semester
                        </span>
                        <Chip.Group
                          {...form.getInputProps(`sections.${index}.semester`)}
                          value={sec.semester}
                          onChange={(event) => {
                            setSemesterInSec(index, true, event as string[]);
                          }}
                          multiple
                        >
                          <Group className="flex flex-row mt-2 gap-4">
                            {SEMESTER.map((item) => (
                              <Chip
                                key={item}
                                icon={<></>}
                                classNames={{
                                  input:
                                    "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                                  iconWrapper: "w-0",
                                  label:
                                    "text-b2 acerSwift:max-macair133:text-b3 px-5 cursor-pointer",
                                }}
                                size="sm"
                                value={item.toString()}
                                disabled={
                                  sec.openThisTerm &&
                                  item == academicYear.semester &&
                                  sec.semester?.includes(item.toString())
                                }
                              >
                                {item}
                              </Chip>
                            ))}
                          </Group>
                        </Chip.Group>
                        <Checkbox
                          classNames={{
                            input:
                              " bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                            body: "mr-3 px-0",
                            label:
                              "text-b3 acerSwift:max-macair133:text-b4 font-semibold text-default cursor-pointer",
                          }}
                          className="mt-5 mb-1"
                          size="xs"
                          label={`Section ${getSectionNo(
                            sec.sectionNo
                          )} open in this semester (${
                            academicYear?.semester
                          }/${academicYear?.year.toString()?.slice(-2)})`}
                          checked={sec.openThisTerm}
                          onChange={(event) =>
                            setSemesterInSec(index, event.target.checked)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={false}
          label="Co-Instructor"
          description={`STEP ${isManage ? 4 : 3}`}
        >
          <div className="flex flex-col max-h-[420px] acerSwift:max-macair133:max-h-[280px] mb-4 mt-2 h-fit overflow-y-scroll p-[2px]">
            <div>
              <Alert
                radius="md"
                icon={
                  <Icon
                    IconComponent={IconInfo2}
                    className="acerSwift:max-macair133:size-5"
                  />
                }
                variant="light"
                color="blue"
                className="mb-1"
                classNames={{
                  icon: "size-6 text-blue-500",
                  body: " flex justify-center",
                  root: "bg-blue-50 border border-blue-100 rounded-xl text-blue-700",
                }}
                title={
                  <p className="acerSwift:max-macair133:text-b3 acerSwift:max-macair133:mt-0.5">
                    Co-instructors can only access and import scores for your
                    selected sections and manage the course TQF documents.
                  </p>
                }
              ></Alert>
            </div>
            <CompoManageIns
              opened={(active == 2 && !isManage) || (active == 3 && isManage)}
              type="add"
              isManage={isManage}
              action={addCoIns}
              sections={form.getValues().sections}
              setUserList={setCoInsList}
            />
            {!!coInsList.length && (
              <div
                className="w-full flex flex-col mt-3 bg-white border-secondary border-[1px]  rounded-md"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className=" bg-bgTableHeader acerSwift:max-macair133:text-b3 flex gap-3 h-fit font-semibold items-center rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary ">
                  <Icon IconComponent={IconUsers} /> Added Co-Instructor
                </div>
                <div className="flex flex-col  h-fit w-full px-2">
                  <div className="flex flex-col  h-fit p-1">
                    {coInsList.map((coIns, index) => (
                      <div
                        key={index}
                        className="w-full h-fit p-3   gap-4 flex flex-col border-b-[1px] border-[#c9c9c9] last:border-none"
                      >
                        <div className="flex w-full justify-between items-center">
                          <span className="text-[#3e3e3e] -translate-y-1 font-semibold text-b3 acerSwift:max-macair133:text-b4">
                            {coIns.label}
                          </span>

                          <div className="flex justify-end gap-4 mt-1">
                            <Menu shadow="md" width={200}>
                              <Menu.Target>
                                <Button variant="outline" className="!h-7 px-3">
                                  Access
                                </Button>
                              </Menu.Target>
                              <Menu.Dropdown className="overflow-y-auto max-h-[180px] h-fit">
                                <Menu.Label className="-translate-x-1">
                                  Can access
                                </Menu.Label>
                                <div className="flex flex-col pl-3  pb-2 h-fit gap-4 w-full">
                                  {sectionNoList.map((sectionNo, index) => (
                                    <Checkbox
                                      disabled={
                                        coIns.sections?.length == 1 &&
                                        coIns.sections?.includes(sectionNo)
                                      }
                                      key={index}
                                      classNames={{
                                        input:
                                          "bg-black bg-opacity-0  border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                                        body: "mr-3",
                                        label:
                                          "text-b2 acerSwift:max-macair133:text-b4 font-medium cursor-pointer",
                                      }}
                                      size="xs"
                                      label={`Section ${sectionNo}`}
                                      checked={coIns.sections?.includes(
                                        sectionNo
                                      )}
                                      onChange={(event) =>
                                        editCoInsInSec(
                                          sectionNo,
                                          event.currentTarget.checked,
                                          coIns
                                        )
                                      }
                                    />
                                  ))}
                                </div>
                              </Menu.Dropdown>
                            </Menu>
                            <Button
                              color="red"
                              variant="outline"
                              className="!h-7 px-3"
                              onClick={() => removeCoIns(coIns)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                        <div className="flex text-secondary flex-row -mt-5 gap-1 font-medium text-b4 acerSwift:max-macair133:text-b5">
                          <div className=" font-semibold">
                            Can access section:
                          </div>
                          <div className="flex gap-1 w-[60%] flex-wrap ">
                            {coIns.sections?.map(
                              (sectionNo: any, index: number) => (
                                <p key={index}>
                                  {sectionNo}
                                  {index !== coIns.sections?.length - 1 && ","}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={false}
          label="Review"
          description={`STEP ${isManage ? 5 : 4}`}
        >
          <div
            className="w-full flex flex-col bg-white border-secondary border-[1px] mt-2 mb-5 rounded-md"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="bg-bgTableHeader flex flex-col justify-start gap-[2px] font-semibold  rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary ">
              <p className="acerSwift:max-macair133:text-b3">
                {data.courseNo} - {data.courseName}{" "}
              </p>
              {form.getValues().sections?.at(0)?.topic && (
                <p className="text-secondary text-b4 acerSwift:max-macair133:text-b5">
                  Topic: {form.getValues().sections.at(0)?.topic}
                </p>
              )}
            </div>
            <div className="flex flex-col max-h-[320px] acerSwift:max-macair133:max-h-[220px] h-fit w-full   px-2   overflow-y-auto ">
              <div className="flex flex-col gap-3 mt-3 font-medium text-b4 acerSwift:max-macair133:text-b5">
                {form.getValues().sections.map((sec, index) => (
                  <div
                    key={index}
                    className="w-full border-b-[1px] border-[#c9c9c9] pb-2  h-fit px-4    gap-1 flex flex-col"
                  >
                    <span className="text-primary font-semibold text-b2 acerSwift:max-macair133:text-b3 mb-2">
                      Section {getSectionNo(sec.sectionNo)}
                    </span>

                    <div className="flex flex-col gap-1">
                      <span className="text-[#3E3E3E] font-semibold">
                        instructor
                      </span>
                      <div className="ps-1.5 text-secondary">
                        <List size="sm" listStyleType="disc">
                          <List.Item className="mb-[3px] acerSwift:max-macair133:text-b4">
                            {(sec?.instructor as any)?.label ??
                              getUserName(user, 1)}
                          </List.Item>
                        </List>
                      </div>
                    </div>

                    {!!sec.coInstructors?.length && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[#3E3E3E] font-semibold">
                          Co-Instructor
                        </span>
                        <div className="ps-1.5 text-secondary mb-2">
                          <List size="sm" listStyleType="disc">
                            {sec.coInstructors?.map((coIns, index) => (
                              <List.Item
                                className="mb-[3px] acerSwift:max-macair133:text-b4"
                                key={index}
                              >
                                {coIns?.label}
                              </List.Item>
                            ))}
                          </List>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <span className="text-[#3E3E3E] font-semibold">
                        Open in Semester
                      </span>
                      <div className="ps-1.5 text-secondary mb-2">
                        <List
                          size="sm"
                          listStyleType="disc"
                          className="flex flex-col gap-1"
                        >
                          {!!sec.semester?.length && (
                            <List.Item className="acerSwift:max-macair133:text-b4">
                              {sec.semester
                                ?.join(", ")
                                .replace(/, ([^,]*)$/, " and $1")}
                            </List.Item>
                          )}
                          {sec.openThisTerm && (
                            <List.Item className="mb-[3px] acerSwift:max-macair133:text-b4">
                              Open in this semester ({academicYear.semester}/
                              {academicYear.year.toString().slice(-2)})
                            </List.Item>
                          )}
                        </List>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Stepper.Step>
      </Stepper>

      <Group className="flex w-full h-fit items-end justify-between">
        <div>
          {active > 0 && (
            <Button variant="subtle" onClick={prevStep} loading={loading}>
              Back
            </Button>
          )}
        </div>
        <Button
          loading={loading}
          onClick={() => nextStep()}
          className="acerSwift:max-macair133:!text-b5"
          rightSection={
            ((active != 3 && !isManage) || (active != 4 && isManage)) && (
              <Icon
                IconComponent={IconArrowRight}
                className=" stroke-[2px] size-5 acerSwift:max-macair133:size-4"
              />
            )
          }
        >
          {(active == 3 && !isManage) || (active == 4 && isManage)
            ? "Done"
            : "Next step"}
        </Button>
      </Group>
    </Modal>
  );
}
