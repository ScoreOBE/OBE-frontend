import { COURSE_TYPE } from "@/helpers/constants/enum";
import { getUserName } from "@/helpers/functions/function";
import { IModelTQF3Part1 } from "@/models/ModelTQF3";
import { IModelUser } from "@/models/ModelUser";
import { useAppDispatch, useAppSelector } from "@/store";
import { updatePartTQF3 } from "@/store/tqf3";
import AddIcon from "@/assets/icons/plus.svg?react";
import {
  Radio,
  Checkbox,
  TextInput,
  Textarea,
  Group,
  NumberInput,
  Button,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { cloneDeep, isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "../Icon";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part1TQF3({ setForm }: Props) {
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [params, setParams] = useSearchParams({});
  const disabled =
    parseInt(params.get("year") || "") !== academicYear.year &&
    parseInt(params.get("semester") || "") !== academicYear.semester;
  const tqf3 = useAppSelector((state) => state.tqf3);
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState<string[]>([]);
  const curriculum = ["สำหรับหลักสูตร", "สำหรับหลายหลักสูตร"];
  const studentYear = [
    { year: 1, en: "1st year", th: "ชั้นปีที่ 1" },
    { year: 2, en: "2nd year", th: "ชั้นปีที่ 2" },
    { year: 3, en: "3rd year", th: "ชั้นปีที่ 3" },
    { year: 4, en: "4th year", th: "ชั้นปีที่ 4" },
    { year: 5, en: "5th year", th: "ชั้นปีที่ 5" },
    { year: 6, en: "6th year", th: "ชั้นปีที่ 6" },
  ];
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      consultHoursWk: 1,
    } as IModelTQF3Part1,
    validate: {
      curriculum: (value) => !value?.length && "Curriculum is required",
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
          const uniqueDuplicates = [...new Set(duplicates)];
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
      if (!isEqual(values, previous)) {
        dispatch(
          updatePartTQF3({ part: "part1", data: cloneDeep(form.getValues()) })
        );
        setForm(form);
      }
    },
  });

  useEffect(() => {
    if (tqf3.part1) {
      form.setValues(cloneDeep(tqf3.part1));
      form.setFieldValue("courseType", tqf3.type);
      if (tqf3.part1.teachingLocation.in !== undefined) {
        checked.push("in");
      }
      if (tqf3.part1.teachingLocation.out !== undefined) {
        checked.push("out");
      }
    } else {
      form.setFieldValue("courseType", tqf3.type);
      form.setFieldValue(
        "mainInstructor",
        getUserName(tqf3.sections[0].instructor as IModelUser, 3)!
      );
      const uniqueInstructors = Array.from(
        new Set(
          (
            tqf3.sections?.flatMap((sec) => [
              sec.instructor,
              ...(sec.coInstructors as IModelUser[]),
            ]) as IModelUser[]
          )?.map((instructor) => getUserName(instructor, 3)!)
        )
      );
      form.setFieldValue("instructors", uniqueInstructors);
    }
  }, []);

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

  return (
    <div className="flex w-full flex-col text-[15px] max-h-full   text-default ">
      <div className="w-full border-b-[1px] border-[#e6e6e6]  justify-between h-fit  items-top  grid grid-cols-3  pb-4">
        <div className="flex text-secondary flex-col">
          <p className="font-semibold">
            หลักสูตร <span className=" text-red-500">*</span>
          </p>
          <p className="font-semibold">Curriculum</p>
          <p className="error-text mt-1">
            {form.getInputProps("curriculum").error}
          </p>
        </div>
        <Radio.Group
          key={form.key("curriculum")}
          {...form.getInputProps("curriculum")}
          error={<></>}
          value={form.getValues().curriculum}
          onChange={(event) => form.setFieldValue("curriculum", event)}
        >
          <div className="flex text-default gap-3 flex-col">
            {curriculum.map((item) => (
              <Radio
                key={item}
                classNames={{
                  radio: `${disabled && "!cursor-default"}`,
                  label: `${
                    disabled && "!cursor-default"
                  } font-medium text-[13px]`,
                }}
                label={item}
                value={item}
                disabled={disabled}
              />
            ))}
          </div>
        </Radio.Group>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6]  justify-between h-fit  grid grid-cols-3 py-5">
        <div className="flex text-secondary  flex-col">
          <p className="font-semibold">
            ประเภทกระบวนวิชา <span className=" text-red-500">*</span>
          </p>
          <p className="font-semibold">Course Type</p>
        </div>
        <Radio.Group
          key={form.key("courseType")}
          {...form.getInputProps("courseType")}
        >
          <div className="flex text-default gap-3 flex-col">
            {Object.values(COURSE_TYPE).map((key) => (
              <Radio
                key={key.en}
                classNames={{
                  radio: `${disabled && "!cursor-default"}`,
                  label: `${
                    disabled && "!cursor-default"
                  } font-medium text-[13px]`,
                }}
                label={`${key.th} (${key.en})`}
                disabled={true}
                value={key.en}
              />
            ))}
          </div>
        </Radio.Group>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary pt-2 flex-col">
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
                classNames={{ label: `font-medium text-[13px]` }}
                label={`${item.th} (${item.en})`}
                value={item.year.toString()}
                disabled={disabled}
              />
            ))}
          </div>
        </Checkbox.Group>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-center  grid grid-cols-3 py-5  ">
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
              label: "text-default",
              input: `${disabled && "!cursor-default"}`,
            }}
            className={`w-[440px]`}
            placeholder="(required)"
            disabled={disabled}
            {...form.getInputProps("mainInstructor")}
            error={form.getInputProps("mainInstructor").error && <></>}
          />
        </div>
      </div>
      {/* อาจารย์ผู้สอนทั้งหมด  */}
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit items-top grid grid-cols-3 py-5">
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
                  label: "text-default",
                  input: `${disabled && "!cursor-default"}`,
                }}
                className="w-[440px]"
                placeholder={index === 0 ? "(required)" : "(optional)"}
                disabled={disabled}
                {...form.getInputProps(`instructors.${index}`)}
                value={form.getValues().instructors[index]}
              />
              {index !== 0 && (
                <Button
                  className="text-center px-2 border-none hover:bg-[#ff4747]/10"
                  variant="outline"
                  color="#ff4747"
                  onClick={() => form.removeListItem("instructors", index)}
                >
                  <IconTrash size={18} stroke={1.5} />
                </Button>
              )}
            </div>
          ))}
          <div className=" w-[440px] flex ">
            <Button
              className="text-center px-4  mt-2"
              variant="outline"
              onClick={() => form.insertListItem("instructors", "")}
            >
              <div className="flex gap-2">
                <Icon IconComponent={AddIcon} />
                Add
              </div>
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit items-top grid grid-cols-[1fr_2fr] py-5">
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
                classNames={{ label: "font-medium text-[13px] w-full" }}
                label={`ในสถานที่ตั้งของมหาวิทยาลัยเชียงใหม่ (Inside of Chiang Mai University)`}
                value={"in"}
                disabled={disabled}
              />

              <Textarea
                key={form.key("teachingLocation.in")}
                className="mt-2 pl-8"
                placeholder="(optional)"
                classNames={{
                  input: `text-[13px] text-default h-[80px] w-[408px] ${
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
                  label: "font-medium text-[13px] flex flex-nowrap",
                }}
                label={`นอกสถานที่ตั้งของมหาวิทยาลัยเชียงใหม่ (Outside of Chiang Mai University)`}
                value={"out"}
                disabled={disabled}
              />
              <Textarea
                key={form.key("teachingLocation.out")}
                className="mt-2 pl-8"
                placeholder="(optional)"
                classNames={{
                  input: `text-[13px] text-default h-[80px] w-[408px] ${
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

      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-center  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary flex-col">
          <p className="font-semibold">
            ชั่วโมงต่อสัปดาห์ในการให้คำปรึกษาแก่นักศึกษารายบุคคล
            <span className="text-red-500"> *</span>
          </p>
          <p className="font-semibold">
            Individual student consultation hours per week
          </p>
        </div>

        <div className="flex items-center text-[13px] font-medium gap-4">
          <NumberInput
            classNames={{
              input: `${disabled && "!cursor-default"}`,
            }}
            key={form.key("consultHoursWk")}
            max={168}
            min={1}
            className="w-[86px]"
            disabled={disabled}
            {...form.getInputProps("consultHoursWk")}
          />
          <p>hours / week</p>
        </div>
      </div>
    </div>
  );
}
