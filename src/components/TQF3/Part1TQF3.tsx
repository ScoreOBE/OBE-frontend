import { COURSE_TYPE, ROLE } from "@/helpers/constants/enum";
import { IModelTQF3Part1 } from "@/models/ModelTQF3";
import { useAppDispatch, useAppSelector } from "@/store";
import { updatePartTQF3 } from "@/store/tqf3";
import {
  Radio,
  Checkbox,
  TextInput,
  Textarea,
  Group,
  NumberInput,
  Button,
  Tooltip,
} from "@mantine/core";
import Icon from "../Icon";
import IconAdd from "@/assets/icons/plus.svg?react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import { useForm } from "@mantine/form";
import { cloneDeep, isEqual, uniq } from "lodash";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { initialTqf3Part1 } from "@/helpers/functions/tqf3";
import { PartTopicTQF3 } from "@/helpers/constants/TQF3.enum";

type Props = {
  setForm?: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part1TQF3({ setForm = () => {} }: Props) {
  const { courseNo } = useParams();
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [params, setParams] = useSearchParams({});
  const dashboard = useAppSelector((state) => state.config.dashboard);
  const courseType = useAppSelector(
    (state) =>
      (dashboard == ROLE.CURRICULUM_ADMIN
        ? state.allCourse
        : state.course
      ).courses.find((c) => c.courseNo == courseNo)?.type
  );
  const tqf3 = useAppSelector((state) => state.tqf3);
  const disabled =
    parseInt(params.get("year") || "") !== academicYear.year &&
    parseInt(params.get("semester") || "") !== academicYear.semester;
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState<string[]>([]);
  const curriculum = [
    {
      label: "กรอกด้วยตนเอง (Manual)",
      value: "สำหรับหลักสูตร",
    },
    {
      label: "สำหรับหลายหลักสูตร (For a Multiple Curriculums)",
      value: "สำหรับหลายหลักสูตร",
    },
  ];
  const studentYear = [
    { year: 1, en: "1st year", th: "ชั้นปีที่ 1" },
    { year: 2, en: "2nd year", th: "ชั้นปีที่ 2" },
    { year: 3, en: "3rd year", th: "ชั้นปีที่ 3" },
    { year: 4, en: "4th year", th: "ชั้นปีที่ 4" },
    { year: 5, en: "5th year", th: "ชั้นปีที่ 5" },
    { year: 6, en: "6th year", th: "ชั้นปีที่ 6" },
  ];
  const teachingLocation = {
    in: "ในสถานที่ตั้งของมหาวิทยาลัยเชียงใหม่ (Inside of Chiang Mai University)",
    out: "นอกสถานที่ตั้งของมหาวิทยาลัยเชียงใหม่ (Outside of Chiang Mai University)",
  };
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      consultHoursWk: 1,
    } as IModelTQF3Part1,
    validate: {
      curriculum: (value) => {
        if (value.includes("สำหรับหลักสูตร")) {
          const checked = curriculumForm.validate();
          if (checked.hasErrors) {
            return "";
          }
        }
        return !value?.length && "Curriculum is required";
      },
      studentYear: (value) =>
        !value?.length && "Select Student Year at least one",
      mainInstructor: (value) =>
        !value?.length && "Main Instructor is required",
      instructors: (value) => {
        if (!value?.length) return "Input Instructors at least one";
        const duplicates = value?.filter(
          (item, index) => value.indexOf(item) !== index
        );
        if (duplicates.length) {
          const uniqueDuplicates = uniq(duplicates);
          return `Duplicate instructors "${uniqueDuplicates.join(", ")}"`;
        }
        if (value.find((e) => e === "")) return "Input instructor name";
      },
      teachingLocation: (value) =>
        value.in === undefined &&
        value.out === undefined &&
        "Select Teaching Location at least one",
    },
    validateInputOnBlur: true,
    onValuesChange(values, previous) {
      if (!isEqual(values, previous) && !tqf3.courseSyllabus) {
        dispatch(
          updatePartTQF3({ part: "part1", data: cloneDeep(form.getValues()) })
        );
        setForm(form);
      }
    },
  });
  const curriculumForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      department: "",
    },
    validate: {
      name: (value) => !value?.length && "Curriculum name is required",
      department: (value) => !value?.length && "Department name is required",
    },
    validateInputOnBlur: true,
    onValuesChange(values, previous) {
      if (
        !isEqual(values, previous) &&
        form.getValues().curriculum?.includes("สำหรับหลักสูตร")
      ) {
        localStorage.setItem("curriculumName", values.name);
        localStorage.setItem("curriculumDepartment", values.department);
      }
    },
  });

  useEffect(() => {
    if (tqf3.courseSyllabus) return;
    if (tqf3.part1) {
      form.setValues(cloneDeep(tqf3.part1));
      if (tqf3.part1.teachingLocation.in !== undefined) {
        checked.push("in");
      }
      if (tqf3.part1.teachingLocation.out !== undefined) {
        checked.push("out");
      }
      if (tqf3.part1.curriculum?.includes("สำหรับหลักสูตร")) {
        const splitCurriculum = tqf3.part1.curriculum.split(" ");
        curriculumForm.setFieldValue("name", splitCurriculum[1]);
        curriculumForm.setFieldValue("department", splitCurriculum[3]);
      }
      localStorage.removeItem("setReuse");
    } else {
      form.setValues({ ...initialTqf3Part1(tqf3) });
    }
  }, [localStorage.getItem("setReuse")]);

  useEffect(() => {
    let teachingLocation = { ...form.getValues().teachingLocation };
    if (checked.includes("in") && !teachingLocation.in) {
      teachingLocation.in = "";
    } else if (!checked.includes("in")) {
      delete teachingLocation.in;
    }
    if (checked.includes("out") && !teachingLocation.out) {
      teachingLocation.out = "";
    } else if (!checked.includes("out")) {
      delete teachingLocation.out;
    }
    form.setFieldValue("teachingLocation", teachingLocation);
  }, [checked]);

  return !tqf3.courseSyllabus ? (
    <div className="flex w-full flex-col text-[15px] acerSwift:max-macair133:text-b3 max-h-full text-default">
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit grid grid-cols-3  pb-4">
        <div className="flex text-secondary flex-col">
          <p className="font-semibold">
            หลักสูตร <span className="text-red-500">*</span>
          </p>
          <p className="font-semibold">Curriculum</p>
          {/* <p className="font-semibold text-[#888888] mt-3 text-b3 acerSwift:max-macair133:text-b4 text-pretty pr-12 ">
            <span className="underline"> For Multiple Curriculums</span> Choose
            this option if the course is taught across multiple faculties or
            departments. For example, a general course that students from
            various curriculums need to enroll.
          </p> */}
          <p className="error-text mt-1">
            {form.getInputProps("curriculum").error}
          </p>
        </div>
        <Radio.Group
          key={form.key("curriculum")}
          {...form.getInputProps("curriculum")}
          error={<></>}
          value={form.getValues().curriculum?.split(" ")[0]}
          onChange={(event) => form.setFieldValue("curriculum", event)}
        >
          <div className="flex text-default gap-3 flex-col">
            {curriculum.map((item) => (
              <div key={item.value} className="flex gap-1 items-center">
                <Radio
                  key={item.value}
                  classNames={{
                    radio: `${disabled && "!cursor-default"} `,
                    label: `${
                      disabled && "!cursor-default"
                    } font-medium text-b3 acerSwift:max-macair133:text-b4 sm:max-acerSwift:w-[300px]`,
                  }}
                  label={item.label}
                  value={item.value}
                  disabled={disabled}
                />
                {item.value === "สำหรับหลายหลักสูตร" && (
                  <Tooltip
                    arrowOffset={125}
                    arrowSize={8}
                    arrowRadius={1}
                    transitionProps={{
                      transition: "fade",
                      duration: 300,
                    }}
                    multiline
                    withArrow
                    label={
                      <div className="text-[#888888] text-b3 acerSwift:max-macair133:text-b4 p-2 flex flex-col gap-1 w-[380px]">
                        <p className="text-secondary font-bold">
                          For a Multiple Curriculums
                        </p>

                        <p className="font-medium text-b3 acerSwift:max-macair133:text-b4 text-pretty ">
                          Choose this option if{" "}
                          <span className="text-emphasize">
                            the course is taught across multiple faculties or
                            departments.
                          </span>{" "}
                          For example, a general course that students from
                          various curriculums need to enroll.{" "}
                        </p>
                      </div>
                    }
                    color="#FCFCFC"
                    className="w-fit border rounded-md sm:max-acerSwift:!-ml-2"
                    position="bottom-start"
                  >
                    <div className="border-nonep-0.5">
                      <Icon
                        IconComponent={IconInfo2}
                        className="-ml-0 size-5 text-secondary "
                      />
                    </div>
                  </Tooltip>
                )}
              </div>
            ))}

            {form.getValues().curriculum?.includes("สำหรับหลักสูตร") && (
              <div>
                <TextInput
                  className="mt-2"
                  label="สำหรับหลักสูตร (For what curriculum?)"
                  withAsterisk
                  size="xs"
                  classNames={{
                    label:
                      "font-medium text-b3 acerSwift:max-macair133:!text-b4",
                    input: "w-[300px] acerSwift:max-macair133:!text-b4",
                  }}
                  placeholder="Curriculum name e.g วิศวกรรมศาสตร์ (Engineer)"
                  {...curriculumForm.getInputProps("name")}
                  key={curriculumForm.key("name")}
                />
                <TextInput
                  className="mt-3"
                  label="สาขา (For what department)"
                  withAsterisk
                  size="xs"
                  classNames={{
                    label:
                      "font-medium text-b3 acerSwift:max-macair133:!text-b4",
                    input: "w-[300px] acerSwift:max-macair133:text-b4",
                  }}
                  placeholder="Department name e.g คอมพิวเตอร์ (Computer)"
                  {...curriculumForm.getInputProps("department")}
                  key={curriculumForm.key("department")}
                />
              </div>
            )}
          </div>
        </Radio.Group>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit grid grid-cols-3 py-5">
        <div className="flex text-secondary  flex-col">
          <p className="font-semibold">
            ประเภทกระบวนวิชา <span className=" text-red-500">*</span>
          </p>
          <p className="font-semibold">Course Type</p>
        </div>
        <Checkbox.Group
          key={form.key("courseType")}
          {...form.getInputProps("courseType")}
        >
          <div className="flex text-default gap-3 flex-col">
            {Object.values(COURSE_TYPE).map((key) => (
              <Checkbox
                key={key.en}
                classNames={{
                  input: `${disabled && "!cursor-default"}`,
                  label: `${
                    disabled && "!cursor-default"
                  } font-medium text-b3 acerSwift:max-macair133:text-b4`,
                }}
                label={`${key.th} (${key.en})`}
                value={key.en}
                disabled={key.en == courseType || tqf3.courseSyllabus}
              />
            ))}
          </div>
        </Checkbox.Group>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit grid grid-cols-3 py-5  ">
        <div className="flex text-secondary flex-col">
          <p className="font-semibold">
            ชั้นปีที่เรียน <span className=" text-red-500">*</span>
          </p>
          <p className="font-semibold">Student Year</p>
          <p className="error-text mt-1">
            {form.getInputProps("studentYear").error}
          </p>
        </div>
        <Checkbox.Group
          key={form.key("studentYear")}
          {...form.getInputProps("studentYear")}
          error={<></>}
          value={form.getValues().studentYear?.map((e) => e.toString())}
          onChange={(event) =>
            form.setFieldValue(
              "studentYear",
              event.map((e) => parseInt(e))
            )
          }
        >
          <div className="flex flex-col text-default gap-5">
            {studentYear.map((item) => (
              <Checkbox
                key={item.year}
                classNames={{
                  label: `font-medium text-b3 acerSwift:max-macair133:text-b4`,
                }}
                label={`${item.th} (${item.en})`}
                value={item.year.toString()}
                disabled={disabled}
              />
            ))}
          </div>
        </Checkbox.Group>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit items-center  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary flex-col">
          <p className="font-semibold">
            ชื่ออาจารย์ผู้รับผิดชอบ<span className=" text-red-500">*</span>
          </p>
          <p className="font-semibold">Main Instructor</p>
          <p className="error-text mt-1">
            {form.getInputProps("mainInstructor").error}
          </p>
        </div>
        <div className="flex flex-col gap-3 text-default">
          <TextInput
            key={form.key("mainInstructor")}
            withAsterisk
            size="xs"
            label="Instructor"
            classNames={{
              label: "text-default acerSwift:max-macair133:!text-b4",
              input: `${disabled && "!cursor-default"}`,
            }}
            className={`w-[440px] acerSwift:max-macair133:w-[370px]`}
            placeholder="(required)"
            disabled={disabled}
            {...form.getInputProps("mainInstructor")}
            error={form.getInputProps("mainInstructor").error && <></>}
          />
        </div>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit grid grid-cols-3 py-5">
        <div className="flex text-secondary flex-col">
          <p className="font-semibold">
            อาจารย์ผู้สอนทั้งหมด<span className="text-red-500"> *</span>
          </p>
          <p className="font-semibold">Lecturers</p>
          <p className="error-text mt-1">
            {form.getInputProps("instructors").error}
          </p>
        </div>

        <div className="flex flex-col gap-3 text-default w-fit ">
          {form.getValues().instructors?.map((item, index) => (
            <div
              key={form.key(`instructors.${index}`)}
              className="flex gap-2 items-end"
            >
              <TextInput
                withAsterisk={index === 0}
                size="xs"
                label={`Instructor ${index + 1}`}
                classNames={{
                  label: "text-default acerSwift:max-macair133:!text-b4",
                  input: `${disabled && "!cursor-default"}`,
                }}
                className="w-[440px] acerSwift:max-macair133:w-[370px]"
                placeholder={index === 0 ? "(required)" : "(optional)"}
                disabled={disabled}
                {...form.getInputProps(`instructors.${index}`)}
                value={form.getValues().instructors[index]}
              />
              {index !== 0 && !disabled && (
                <Button
                  className="text-center px-2 border-none hover:bg-[#ff4747]/10"
                  variant="outline"
                  color="#ff4747"
                  onClick={() => form.removeListItem("instructors", index)}
                >
                  <Icon
                    IconComponent={IconTrash}
                    className="stroke-[2px] size-5 acerSwift:max-macair133:!size-4"
                  />
                </Button>
              )}
            </div>
          ))}
          {!disabled && (
            <div className=" w-[440px] acerSwift:max-macair133:w-[370px] flex ">
              <Button
                className="text-center px-4 mt-2 "
                variant="outline"
                onClick={() => form.insertListItem("instructors", "")}
              >
                <div className="flex gap-2 acerSwift:max-macair133:!text-b4">
                  <Icon
                    IconComponent={IconAdd}
                    className="acerSwift:max-macair133:size-3"
                  />
                  Add
                </div>
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit grid grid-cols-[1fr_2fr] py-5">
        <div className="flex text-secondary flex-col">
          <p className="font-semibold">
            สถานที่เรียน<span className=" text-red-500"> *</span>
          </p>
          <p className="font-semibold">Teaching Location </p>
          <p className="error-text mt-1">
            {form.getInputProps("teachingLocation").error}
          </p>
        </div>

        <Checkbox.Group
          key={form.key("teachingLocation")}
          className="items-center"
          value={checked}
          onChange={(event) => setChecked(event)}
        >
          <Group className="flex flex-col gap-5 w-full items-start">
            <div className=" last:border-none ">
              <Checkbox
                classNames={{
                  label:
                    "font-medium text-b3 acerSwift:max-macair133:text-b4 w-full",
                }}
                label={teachingLocation.in}
                value={"in"}
                disabled={disabled}
              />
              <Textarea
                key={form.key("teachingLocation.in")}
                className="mt-2 pl-8"
                placeholder="(optional)"
                classNames={{
                  input: `text-b3 acerSwift:max-macair133:text-b4 text-default h-[80px] w-[408px] ${
                    disabled && "!cursor-default"
                  }`,
                }}
                disabled={disabled || !checked.includes("in")}
                {...form.getInputProps("teachingLocation.in")}
              />
            </div>
            <div className="last:border-none ">
              <Checkbox
                classNames={{
                  label:
                    "font-medium text-b3 acerSwift:max-macair133:text-b4 flex flex-nowrap",
                }}
                label={teachingLocation.out}
                value={"out"}
                disabled={disabled}
              />
              <Textarea
                key={form.key("teachingLocation.out")}
                className="mt-2 pl-8"
                placeholder="(optional)"
                classNames={{
                  input: `text-b3 acerSwift:max-macair133:text-b4 text-default h-[80px] w-[408px] ${
                    disabled && "!cursor-default"
                  }`,
                }}
                disabled={disabled || !checked.includes("out")}
                {...form.getInputProps("teachingLocation.out")}
              />
            </div>
          </Group>
        </Checkbox.Group>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit items-center  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary flex-col sm:max-macair133:pr-8 acerSwift:max-macair133:pr-6">
          <p className="font-semibold">
            ชั่วโมงต่อสัปดาห์ในการให้คำปรึกษาแก่นักศึกษารายบุคคล
            <span className="text-red-500"> *</span>
          </p>
          <p className="font-semibold">
            Individual student consultation hours per week
          </p>
        </div>

        <div className="flex items-center text-b3 acerSwift:max-macair133:text-b4 font-medium gap-4">
          <NumberInput
            classNames={{
              input: `${
                disabled && "!cursor-default"
              } acerSwift:max-macair133:text-b4`,
            }}
            key={form.key("consultHoursWk")}
            max={168}
            min={1}
            className="w-[86px] acerSwift:max-macair133:w-[80px]"
            disabled={disabled}
            {...form.getInputProps("consultHoursWk")}
          />
          <p>hours / week</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-[#1f69f3] text-white px-8 py-6 iphone:max-sm:px-4 iphone:max-sm:py-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c8af5] rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0d4ebc] rounded-full opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        <h2 className="text-xl iphone:max-sm:text-lg font-bold relative z-10">
          {PartTopicTQF3.part1}
        </h2>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-100">
        {/* Curriculum */}
        <div className="flex flex-col sm:flex-row p-6 iphone:max-sm:p-4 hover:bg-blue-50/30 transition-all duration-300">
          <div className="w-full sm:w-2/5 mb-3 sm:mb-0">
            <h3 className="font-semibold text-gray-800 flex items-center iphone:max-sm:text-[14px]">
              <span className="inline-block w-1.5 h-5 iphone:max-sm:h-4 bg-[#1f69f3] rounded-sm mr-2"></span>
              หลักสูตร
            </h3>
            <p className="text-sm iphone:max-sm:text-[12px] text-gray-500 ml-3.5">
              Curriculum
            </p>
          </div>
          <div className="w-full sm:w-3/5 font-medium text-gray-700 iphone:max-sm:text-[14px]">
            <p className="py-1 px-3 bg-blue-50 rounded-md inline-block border-l-2 border-[#1f69f3]">
              {tqf3.part1?.curriculum}
            </p>
          </div>
        </div>

        {/* Course Type */}
        <div className="flex flex-col sm:flex-row p-6 iphone:max-sm:p-4 hover:bg-blue-50/30 transition-all duration-300">
          <div className="w-full sm:w-2/5 mb-3 sm:mb-0">
            <h3 className="font-semibold text-gray-800 flex items-center iphone:max-sm:text-[14px]">
              <span className="inline-block w-1.5 h-5 iphone:max-sm:h-4 bg-[#1f69f3] rounded-sm mr-2"></span>
              ประเภทกระบวนวิชา
            </h3>
            <p className="text-sm iphone:max-sm:text-[12px] text-gray-500 ml-3.5">
              Course Type
            </p>
          </div>
          <div className="w-full sm:w-3/5 font-medium text-gray-700 space-y-2 iphone:max-sm:space-y-1.5 iphone:max-sm:text-[14px]">
            {Object.values(COURSE_TYPE)
              .filter((item) => tqf3.part1?.courseType?.includes(item.en))
              ?.map((item) => (
                <p key={item.en} className="flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 iphone:max-sm:w-5 iphone:max-sm:h-5 rounded-full bg-[#1f69f3]/10 text-[#1f69f3] mr-2">
                    <span className="w-2 h-2 iphone:max-sm:w-1.5 iphone:max-sm:h-1.5 bg-[#1f69f3] rounded-full"></span>
                  </span>
                  <span className="text-gray-800">{item.th}</span>
                  <span className="ml-1 text-sm iphone:max-sm:text-[12px] text-[#1f69f3]">
                    ({item.en})
                  </span>
                </p>
              ))}
          </div>
        </div>

        {/* Student Year */}
        <div className="flex flex-col sm:flex-row p-6 iphone:max-sm:p-4 hover:bg-blue-50/30 transition-all duration-300">
          <div className="w-full sm:w-2/5 mb-3 sm:mb-0">
            <h3 className="font-semibold text-gray-800 flex items-center iphone:max-sm:text-[14px]">
              <span className="inline-block w-1.5 h-5 iphone:max-sm:h-4 bg-[#1f69f3] rounded-sm mr-2"></span>
              ชั้นปีที่เรียน
            </h3>
            <p className="text-sm iphone:max-sm:text-[12px] text-gray-500 ml-3.5">
              Student Year
            </p>
          </div>
          <div className="w-full sm:w-3/5 font-medium text-gray-700 flex flex-wrap gap-2 iphone:max-sm:gap-1.5">
            {studentYear
              .filter((item) => tqf3.part1?.studentYear?.includes(item.year))
              .map((item) => (
                <div
                  key={item.year}
                  className="px-3 py-1.5 iphone:max-sm:px-2 iphone:max-sm:py-1 bg-[#1f69f3]/10 rounded-lg border border-[#1f69f3]/20"
                >
                  <p className="text-[#1f69f3] text-sm iphone:max-sm:text-[12px] font-medium">
                    {item.th}
                  </p>
                  <p className="text-xs iphone:max-sm:text-[10px] text-gray-600">
                    {item.en}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Main Instructor */}
        <div className="flex flex-col sm:flex-row p-6 iphone:max-sm:p-4 hover:bg-blue-50/30 transition-all duration-300">
          <div className="w-full sm:w-2/5 mb-3 sm:mb-0">
            <h3 className="font-semibold text-gray-800 flex items-center iphone:max-sm:text-[14px]">
              <span className="inline-block w-1.5 h-5 iphone:max-sm:h-4 bg-[#1f69f3] rounded-sm mr-2"></span>
              ชื่ออาจารย์ผู้รับผิดชอบ
            </h3>
            <p className="text-sm iphone:max-sm:text-[12px] text-gray-500 ml-3.5">
              Main Instructor
            </p>
          </div>
          <div className="w-full sm:w-3/5 font-medium iphone:max-sm:text-[14px]">
            <div className="flex items-center">
              <div className="w-10 h-10 iphone:max-sm:w-8 iphone:max-sm:h-8 rounded-full bg-[#1f69f3]/20 flex items-center justify-center text-[#1f69f3] mr-3">
                <span className="text-lg iphone:max-sm:text-base font-bold">
                  {tqf3.part1?.mainInstructor.charAt(0)}
                </span>
              </div>
              <p className="text-gray-800">{tqf3.part1?.mainInstructor}</p>
            </div>
          </div>
        </div>

        {/* All Instructors */}
        <div className="flex flex-col sm:flex-row p-6 iphone:max-sm:p-4 hover:bg-blue-50/30 transition-all duration-300">
          <div className="w-full sm:w-2/5 mb-3 sm:mb-0">
            <h3 className="font-semibold text-gray-800 flex items-center iphone:max-sm:text-[14px]">
              <span className="inline-block w-1.5 h-5 iphone:max-sm:h-4 bg-[#1f69f3] rounded-sm mr-2"></span>
              อาจารย์ผู้สอนทั้งหมด
            </h3>
            <p className="text-sm iphone:max-sm:text-[12px] text-gray-500 ml-3.5">
              Lecturers
            </p>
          </div>
          <div className="w-full sm:w-3/5 font-medium text-gray-700 space-y-3 iphone:max-sm:space-y-2 iphone:max-sm:text-[14px]">
            {tqf3.part1?.instructors?.map((item, index) => (
              <div
                key={index}
                className="flex items-center p-2 iphone:max-sm:p-1.5 rounded-lg hover:bg-[#1f69f3]/5 transition-colors"
              >
                <div className="w-8 h-8 iphone:max-sm:w-6 iphone:max-sm:h-6 rounded-full bg-[#1f69f3] text-white flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-bold iphone:max-sm:text-xs">
                    {index + 1}
                  </span>
                </div>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Teaching Location */}
        <div className="flex flex-col sm:flex-row p-6 iphone:max-sm:p-4 hover:bg-blue-50/30 transition-all duration-300">
          <div className="w-full sm:w-2/5 mb-3 sm:mb-0">
            <h3 className="font-semibold text-gray-800 flex items-center iphone:max-sm:text-[14px]">
              <span className="inline-block w-1.5 h-5 iphone:max-sm:h-4 bg-[#1f69f3] rounded-sm mr-2"></span>
              สถานที่เรียน
            </h3>
            <p className="text-sm iphone:max-sm:text-[12px] text-gray-500 ml-3.5">
              Teaching Location
            </p>
          </div>
          <div className="w-full sm:w-3/5 font-medium text-gray-700 space-y-4 iphone:max-sm:space-y-3 iphone:max-sm:text-[14px]">
            {!tqf3.part1?.teachingLocation.in &&
              !tqf3.part1?.teachingLocation.out && <p>-</p>}
            {tqf3.part1?.teachingLocation.in && (
              <div className="p-4 iphone:max-sm:p-3 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-sm border border-[#1f69f3]/10">
                <p className="text-sm iphone:max-sm:text-[12px] font-semibold text-[#1f69f3] mb-2 iphone:max-sm:mb-1">
                  {teachingLocation.in}
                </p>
                <p className="flex items-center">
                  <span className="inline-block w-2 h-2 iphone:max-sm:w-1.5 iphone:max-sm:h-1.5 rounded-full bg-[#1f69f3] mr-2"></span>
                  {tqf3.part1?.teachingLocation.in}
                </p>
              </div>
            )}
            {tqf3.part1?.teachingLocation.out && (
              <div className="p-4 iphone:max-sm:p-3 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-sm border border-[#1f69f3]/10">
                <p className="text-sm iphone:max-sm:text-[12px] font-semibold text-[#1f69f3] mb-2 iphone:max-sm:mb-1">
                  {teachingLocation.out}
                </p>
                <p className="flex items-center">
                  <span className="inline-block w-2 h-2 iphone:max-sm:w-1.5 iphone:max-sm:h-1.5 rounded-full bg-[#1f69f3] mr-2"></span>
                  {tqf3.part1?.teachingLocation.out}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Consultation Hours */}
        <div className="flex flex-col sm:flex-row p-6 iphone:max-sm:p-4 hover:bg-blue-50/30 transition-all duration-300">
          <div className="w-full sm:w-2/5 mb-3 sm:mb-0">
            <h3 className="font-semibold text-gray-800 flex items-center iphone:max-sm:text-[14px]">
              <span className="inline-block w-1.5 h-5 iphone:max-sm:h-4 bg-[#1f69f3] rounded-sm mr-2"></span>
              ชั่วโมงต่อสัปดาห์ในการให้คำปรึกษาแก่นักศึกษารายบุคคล
            </h3>
            <p className="text-sm iphone:max-sm:text-[12px] text-gray-500 ml-3.5">
              Individual student consultation hours per week
            </p>
          </div>
          <div className="w-full sm:w-3/5 font-medium text-gray-700 iphone:max-sm:text-[14px]">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-16 h-16 iphone:max-sm:w-12 iphone:max-sm:h-12 rounded-full bg-[#1f69f3]/10 flex items-center justify-center">
                  <span className="text-2xl iphone:max-sm:text-xl font-bold text-[#1f69f3]">
                    {tqf3.part1?.consultHoursWk}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 iphone:max-sm:w-5 iphone:max-sm:h-5 rounded-full bg-[#1f69f3] text-white text-xs iphone:max-sm:text-[10px] flex items-center justify-center">
                  hr
                </div>
              </div>
              <p className="ml-4 iphone:max-sm:ml-3 text-gray-600">
                hours per week
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
