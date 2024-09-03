import {
  COURSE_TYPE,
  EVALUATE_TYPE,
  TEACHING_METHOD,
} from "@/helpers/constants/enum";
import { Radio, Checkbox, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {};
export default function Part1TQF3() {
  const studentYear = [
    { key: 1, en: "1st year", th: "ชั้นปีที่ 1" },
    { key: 2, en: "2nd year", th: "ชั้นปีที่ 2" },
    { key: 3, en: "3rd year", th: "ชั้นปีที่ 3" },
    { key: 4, en: "4th year", th: "ชั้นปีที่ 4" },
    { key: 5, en: "5th year", th: "ชั้นปีที่ 5" },
    { key: 6, en: "6th year", th: "ชั้นปีที่ 6" },
  ];
  const form = useForm();
  return (
    <div className="flex w-full flex-col text-[14px] max-h-full px-3 py-1">
      <div className="w-full border-b-[1px] border-[#e6e6e6]  justify-between h-fit  items-top  grid grid-cols-3 pb-5">
        <div className="flex text-secondary  flex-col">
          <p className="font-medium">
            ประเภทกระบวนวิชา <span className=" text-red-500">*</span>
          </p>
          <p className="font-semibold">Course Type</p>{" "}
        </div>

        <div className="flex text-[#333333] gap-3  flex-col">
          {Object.values(COURSE_TYPE).map((key) => (
            <Radio
              key={key.en}
              classNames={{ label: "font-medium text-[13px]" }}
              label={`${key.th} ${key.en}`}
            />
          ))}
        </div>
      </div>
      <div className=" border-b-[1px] border-[#e6e6e6] justify-between h-fit w-full  items-top  grid grid-cols-3 py-5   ">
        <div className="flex text-secondary flex-col ">
          <p className="font-medium">
            ลักษณะของกระบวนวิชา <span className=" text-red-500">*</span>
          </p>
          <p className="font-semibold">Teachig Method</p>
        </div>
        <div className="flex text-[#333333] gap-4  flex-col">
          {Object.values(TEACHING_METHOD).map((key) => (
            <Checkbox
              key={key.en}
              classNames={{ label: "font-medium text-[13px]" }}
              label={`${key.th} ${key.en}`}
            />
          ))}
        </div>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary pt-2 flex-col">
          <p className="font-medium">
            ชั้นปีที่เรียน <span className=" text-red-500">*</span>
          </p>
          <p className="font-semibold">Student Year</p>
        </div>

        <div className="flex gap-8 text-[#333333]">
          <div className="flex flex-col gap-5">
            {studentYear.map((item) => (
              <Checkbox
                key={item.key}
                classNames={{ label: "font-medium text-[13px]" }}
                label={`${item.th} (${item.en})`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-center  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary flex-col">
          <p className="font-medium">
            การวัดและประเมินผล <span className=" text-red-500">*</span>
          </p>
          <p className="font-semibold">Evaluation</p>
        </div>

        <div className="flex gap-8 text-[#333333]">
          {Object.values(EVALUATE_TYPE).map((eva) => (
            <Radio
              classNames={{ label: "font-medium text-[13px]" }}
              label={eva}
            />
          ))}
        </div>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary flex-col">
          <p className="font-medium">
            อาจารย์ผู้สอนทั้งหมด<span className=" text-red-500">*</span>
          </p>
          <p className="font-semibold">Lecturers</p>
        </div>

        <div className="flex flex-col gap-3 text-[#333333]">
          <TextInput
            withAsterisk
            size="xs"
            label="Instructor 1"
            classNames={{ label: "text-[#333333]" }}
            className="w-[440px]"
            placeholder="(required)"
          />
          <TextInput
            label="Instructor 2"
            size="xs"
            classNames={{ label: "text-[#333333]" }}
            className="w-[440px]"
            placeholder="(optional)"
          />
          <TextInput
            label="Instructor 3"
            size="xs"
            classNames={{ label: "text-[#333333]" }}
            className="w-[440px]"
            placeholder="(optional)"
          />
          <TextInput
            label="Instructor 4"
            size="xs"
            classNames={{ label: "text-[#333333]" }}
            className="w-[440px]"
            placeholder="(optional)"
          />
          <TextInput
            label="Instructor 5"
            size="xs"
            classNames={{ label: "text-[#333333]" }}
            className="w-[440px]"
            placeholder="(optional)"
          />
          <TextInput
            label="Instructor 6"
            size="xs"
            classNames={{ label: "text-[#333333]" }}
            className="w-[440px]"
            placeholder="(optional)"
          />
          <TextInput
            label="Instructor 7"
            size="xs"
            classNames={{ label: "text-[#333333]" }}
            className="w-[440px]"
            placeholder="(optional)"
          />
          <TextInput
            label="Instructor 8"
            size="xs"
            classNames={{ label: "text-[#333333]" }}
            className="w-[440px]"
            placeholder="(optional)"
          />
        </div>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary flex-col">
          <p className="font-medium">สถานที่สอนคาบบรรยาย</p>
          <p className="font-semibold">Lectures Venue</p>
        </div>

        <div className="flex flex-col gap-3 text-[#333333]">
          <Textarea
            label="Description"
            size="xs"
            placeholder="(optional)"
            className="w-[440px]"
            classNames={{ input: "h-[180px] p-3" }}
          ></Textarea>
        </div>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary flex-col">
          <p className="font-medium">สถานที่สอนคาบแลป</p>
          <p className="font-semibold">Laboratory Venue</p>
        </div>

        <div className="flex flex-col gap-3 text-[#333333]">
          <Textarea
            label="Description"
            size="xs"
            placeholder="(optional)"
            className="w-[440px]"
            classNames={{ input: "h-[180px] p-3", label: "text-[#333333]" }}
          ></Textarea>
        </div>
      </div>
      <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
        <div className="flex text-secondary flex-col">
          <p className="font-medium">ตำราและเอกสาร</p>
          <p className="font-semibold">Main Reference</p>
        </div>

        <div className="flex flex-col gap-3 text-[#333333]">
          <Textarea
            label="Description"
            size="xs"
            placeholder="(optional)"
            className="w-[440px]"
            classNames={{ input: "h-[180px] p-3", label: "text-[#333333]" }}
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

        <div className="flex flex-col gap-3 text-[#333333]">
          <Textarea
            label="Description"
            size="xs"
            placeholder="(optional)"
            className="w-[440px]"
            classNames={{ input: "h-[180px] p-3", label: "text-[#333333]" }}
          ></Textarea>
        </div>
      </div>
    </div>
  );
}
