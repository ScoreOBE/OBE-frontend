import { COURSE_TYPE, TEACHING_METHOD } from "@/helpers/constants/enum";
import { Radio, Checkbox, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {};
export default function Part1TQF3() {
  const form = useForm();
  return (
    <div className="flex w-full justify-start  max-h-full">
      <div className="flex  w-full flex-col text-[14px]">
        <div className="w-full border-b-[1px] border-[#e6e6e6]  justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
          <div className="flex text-secondary pl-6  flex-col">
            <p className="font-medium">
              ประเภทกระบวนวิชา <span className=" text-red-500">*</span>
            </p>
            <p className="font-semibold">Course Type</p>{" "}
          </div>

          <div className="flex text-[#333333] gap-3  flex-col">
            {Object.keys(COURSE_TYPE).map((key) => (
              <Radio
                classNames={{ label: "font-medium text-[13px]" }}
                label={key}
              />
            ))}
          </div>
        </div>
        <div className=" border-b-[1px] border-[#e6e6e6] justify-between h-fit w-full  items-top  grid grid-cols-3 py-5   ">
          <div className="flex text-secondary pl-6 flex-col ">
            <p className="font-medium">
              ลักษณะของกระบวนวิชา <span className=" text-red-500">*</span>
            </p>
            <p className="font-semibold">Teachig Method</p>
          </div>
          <div className="flex text-[#333333] gap-4  flex-col">
            {Object.keys(TEACHING_METHOD).map((key) => (
              <Checkbox
                classNames={{ label: "font-medium text-[13px]" }}
                label={key}
              />
            ))}
          </div>
        </div>
        <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
          <div className="flex text-secondary pl-6 pt-2 flex-col">
            <p className="font-medium">
              ชั้นปีที่เรียน <span className=" text-red-500">*</span>
            </p>
            <p className="font-semibold">Student Year</p>
          </div>

          <div className="flex gap-8 text-[#333333]">
            <div className="flex flex-col gap-5">
              <Checkbox
                classNames={{ label: "font-medium text-[13px]" }}
                label="ชั้นปีที่ 1 (1st year)"
              />
              <Checkbox
                classNames={{ label: "font-medium text-[13px]" }}
                label="ชั้นปีที่ 2 (2nd year)"
              />{" "}
              <Checkbox
                classNames={{ label: "font-medium text-[13px]" }}
                label="ชั้นปีที่ 3 (3rd year)"
              />
            </div>
            <div className="flex flex-col gap-5">
              <Checkbox
                classNames={{ label: "font-medium text-[13px]" }}
                label="ชั้นปีที่ 4 (4th year)"
              />
              <Checkbox
                classNames={{ label: "font-medium text-[13px]" }}
                label="ชั้นปีที่ 5 (5th year)"
              />{" "}
              <Checkbox
                classNames={{ label: "font-medium text-[13px]" }}
                label="ชั้นปีที่ 6 (6th year)"
              />
            </div>
          </div>
        </div>
        <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-center  grid grid-cols-3 py-5  ">
          <div className="flex text-secondary pl-6 flex-col">
            <p className="font-medium">
              การวัดและประเมินผล <span className=" text-red-500">*</span>
            </p>
            <p className="font-semibold">Evaluation</p>
          </div>

          <div className="flex gap-8 text-[#333333]">
            <Radio
              classNames={{ label: "font-medium text-[13px]" }}
              label="A-F"
            />
            <Radio
              classNames={{ label: "font-medium text-[13px]" }}
              label="S/U"
            />{" "}
            <Radio
              classNames={{ label: "font-medium text-[13px]" }}
              label="P"
            />
          </div>
        </div>
        <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
          <div className="flex text-secondary pl-6 flex-col">
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
          <div className="flex text-secondary pl-6 flex-col">
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
          <div className="flex text-secondary pl-6 flex-col">
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
          <div className="flex text-secondary pl-6 flex-col">
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
        <div className="w-full border-b-[1px] border-[#e6e6e6] justify-between h-fit  items-top  grid grid-cols-3 py-5  ">
          <div className="flex text-secondary pl-6 flex-col">
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
    </div>
  );
}
