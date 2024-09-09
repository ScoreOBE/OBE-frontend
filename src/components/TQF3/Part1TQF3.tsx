import {
  COURSE_TYPE,
  EVALUATE_TYPE,
  TEACHING_METHOD,
} from "@/helpers/constants/enum";
import { getUserName } from "@/helpers/functions/function";
import { IModelCourse } from "@/models/ModelCourse";
import { IModelTQF3Part1 } from "@/models/ModelTQF3";
import { IModelUser } from "@/models/ModelUser";
import { Radio, Checkbox, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

type Props = {
  data: IModelCourse;
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part1TQF3({ data, setForm }: Props) {
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
    initialValues: {} as Partial<IModelTQF3Part1>,
    validate: {
      teachingMethod: (value) =>
        !value?.length && "Select Teaching Method at least one",
      studentYear: (value) =>
        !value?.length && "Select Student Year at least one",
      evaluate: (value) => !value?.length && "Evaluation is required",
      instructors: (value) => {
        if (!value?.length) return "Input Instructors at least one";
        const duplicates = value.filter(
          (item, index) => value.indexOf(item) !== index
        );
        if (duplicates.length) {
          const uniqueDuplicates = [...new Set(duplicates)];
          return `Duplicate instructors "${uniqueDuplicates.join(", ")}"`;
        }
      },
      coordinator: (value) =>
        !value?.length && "Course Coordinator is required",
    },
    validateInputOnBlur: true,
    onValuesChange: (values) => {
      setForm(form);
    },
  });

  useEffect(() => {
    if (data) {
      if (data?.TQF3?.part1) {
        form.setValues(data.TQF3.part1);
      } else {
        if (
          data.type == COURSE_TYPE.SEL_TOPIC.en &&
          data.sections![0].TQF3?.part1 // select first topic
        ) {
          form.setValues(data.sections![0].TQF3?.part1);
        }
        form.setFieldValue("courseType", data.type);
        const uniqueInstructors = Array.from(
          new Set(
            (
              data.sections?.flatMap((sec) => [
                sec.instructor,
                ...(sec.coInstructors as IModelUser[]),
              ]) as IModelUser[]
            )?.map((instructor) => getUserName(instructor, 3)!)
          )
        ).slice(0, 8);
        form.setFieldValue("instructors", uniqueInstructors);
      }
    }
  }, [data]);

  return (
    <div className="flex w-full flex-col text-[15px] max-h-full px-2 py-1">
      <div className="w-full border-b-[1px] border-[#e6e6e6]  justify-between h-fit  items-top  grid grid-cols-3 pb-5">
        <div className="flex text-secondary  flex-col">
          <p className="font-medium">
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
                classNames={{ label: "font-medium text-[13px]" }}
                label={`${key.th} (${key.en})`}
                disabled={true}
                value={key.en}
              />
            ))}
          </div>
        </Radio.Group>
      </div>
      <div className=" border-b-[1px] border-[#e6e6e6] justify-between h-fit w-full  items-top  grid grid-cols-3 py-5   ">
        <div className="flex text-secondary flex-col ">
          <p className="font-medium">
            ลักษณะของกระบวนวิชา <span className=" text-red-500">*</span>
          </p>
          <p className="font-semibold">Teaching Method</p>
        </div>
        <Checkbox.Group
          key={form.key("teachingMethod")}
          classNames={{ error: "mt-2" }}
          {...form.getInputProps("teachingMethod")}
        >
          <div className="flex flex-col text-default gap-4">
            {Object.values(TEACHING_METHOD).map((key) => (
              <Checkbox
                key={key.en}
                classNames={{ label: "font-medium text-[13px]" }}
                label={`${key.th} (${key.en})`}
                value={key.en}
              />
            ))}
          </div>
        </Checkbox.Group>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary pt-2 flex-col">
          <p className="font-medium">
            ชั้นปีที่เรียน <span className=" text-red-500">*</span>
          </p>
          <p className="font-semibold">Student Year</p>
        </div>

        <Checkbox.Group
          key={form.key("studentYear")}
          classNames={{ error: "mt-2" }}
          {...form.getInputProps("studentYear")}
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
                classNames={{ label: "font-medium text-[13px]" }}
                label={`${item.th} (${item.en})`}
                value={item.year.toString()}
              />
            ))}
          </div>
        </Checkbox.Group>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-center  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary flex-col">
          <p className="font-medium">
            การวัดและประเมินผล <span className=" text-red-500">*</span>
          </p>
          <p className="font-semibold">Evaluation</p>
        </div>
        <Radio.Group
          key={form.key("evaluate")}
          classNames={{ error: "mt-2" }}
          {...form.getInputProps("evaluate")}
        >
          <div className="flex gap-8 text-default">
            {Object.values(EVALUATE_TYPE).map((item) => (
              <Radio
                key={item}
                classNames={{ label: "font-medium text-[13px]" }}
                label={item}
                value={item}
              />
            ))}
          </div>
        </Radio.Group>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary flex-col">
          <p className="font-medium">
            อาจารย์ผู้สอนทั้งหมด<span className=" text-red-500">*</span>
          </p>
          <p className="font-semibold">Lecturers</p>
        </div>

        <div
          className="flex flex-col gap-3 text-default"
          key={form.key("instructors")}
          {...form.getInputProps("instructors")}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <TextInput
              key={form.key(`instructors.${index}`)}
              withAsterisk={index == 0}
              size="xs"
              label={`Instructor ${index + 1}`}
              classNames={{ label: "text-default" }}
              className="w-[440px]"
              placeholder={index == 0 ? "(required)" : "(optional)"}
              {...form.getInputProps(`instructors.${index}`)}
            />
          ))}
          <p className="text-error text-b3 -mt-1">
            {form.getInputProps("instructors").error}
          </p>
        </div>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary flex-col">
          <p className="font-medium">
            ผู้ประสานงานกระบวนวิชา<span className=" text-red-500">*</span>
          </p>
          <p className="font-semibold">Course Coordinator</p>
        </div>

        <div className="flex flex-col gap-3 text-default">
          <TextInput
            key={form.key("coordinator")}
            withAsterisk
            size="xs"
            label="Instructor"
            classNames={{ label: "text-default" }}
            className="w-[440px]"
            placeholder="(required)"
            {...form.getInputProps("coordinator")}
          />
        </div>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary flex-col">
          <p className="font-medium">สถานที่สอนคาบบรรยาย</p>
          <p className="font-semibold">Lectures Venue</p>
        </div>

        <div className="flex flex-col gap-3 text-default">
          <Textarea
            key={form.key("lecPlace")}
            label="Description"
            size="xs"
            placeholder="(optional)"
            className="w-[440px]"
            classNames={{ input: "h-[180px] p-3" }}
            {...form.getInputProps("lecPlace")}
          ></Textarea>
        </div>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary flex-col">
          <p className="font-medium">สถานที่สอนคาบแลป</p>
          <p className="font-semibold">Laboratory Venue</p>
        </div>

        <div className="flex flex-col gap-3 text-default">
          <Textarea
            key={form.key("labPlace")}
            label="Description"
            size="xs"
            placeholder="(optional)"
            className="w-[440px]"
            classNames={{ input: "h-[180px] p-3", label: "text-default" }}
            {...form.getInputProps("labPlace")}
          ></Textarea>
        </div>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary flex-col">
          <p className="font-medium">ตำราและเอกสาร</p>
          <p className="font-semibold">Main Reference</p>
        </div>

        <div className="flex flex-col gap-3 text-default">
          <Textarea
            key={form.key("mainRef")}
            label="Description"
            size="xs"
            placeholder="(optional)"
            className="w-[440px]"
            classNames={{ input: "h-[180px] p-3", label: "text-default" }}
            {...form.getInputProps("mainRef")}
          ></Textarea>
        </div>
      </div>
      <div className="w-full justify-between h-fit  items-top  grid grid-cols-3 pt-5 pb-6  ">
        <div className="flex text-secondary flex-col">
          <p className="font-medium">เอกสารแนะนำ</p>
          <p className="font-semibold">
            Recommended Documents, e.g. Lecture notes, E-documents, etc.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-default">
          <Textarea
            key={form.key("recDoc")}
            label="Description"
            size="xs"
            placeholder="(optional)"
            className="w-[440px]"
            classNames={{ input: "h-[180px] p-3", label: "text-default" }}
            {...form.getInputProps("recDoc")}
          ></Textarea>
        </div>
      </div>
    </div>
  );
}
