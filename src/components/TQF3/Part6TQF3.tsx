import { COURSE_TYPE, TEACHING_METHOD } from "@/helpers/constants/enum";
import {
  Radio,
  Checkbox,
  TextInput,
  Textarea,
  Button,
  Alert,
  Table,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconInfoCircle } from "@tabler/icons-react";
import AddIcon from "@/assets/icons/plus.svg?react";
import Icon from "../Icon";
import IconPLO from "@/assets/icons/PLOdescription.svg?react";
import DrawerPLOdes from "@/components/DrawerPLO";
import { useState } from "react";

type Props = {};
export default function Part6TQF3() {
  let topics = [
    {
      no: 1,
      en: "test",
      th: "กลยุทธ์การประเมินประสิทธิผลของกระบวนวิชาโดยนักศึกษา",
      list: [
        { label: "ไม่มี" },
        { label: "แบบประเมินกระบวนวิชา" },
        { label: "การสนทนากลุ่มระหว่างผู้สอนและผู้เรียน" },
        { label: "การสะท้อนคิดจากพฤติกรรมของผู้เรียน" },
        {
          label:
            "ข้อเสนอแนะผ่านเวบบอร์ดที่อาจารย์ผู้สอนได้จัดทำเป็นช่องทางการสื่อสารกับนักศึกษา",
        },
        { label: "อื่นๆ (Other)" },
      ],
    },
    {
      no: 2,
      en: "2nd year",
      th: "กลยุทธ์การประเมินการสอน",
      list: [
        { label: "ไม่มี" },
        { label: "แบบประเมินกระบวนวิชา" },
        { label: "การสนทนากลุ่มระหว่างผู้สอนและผู้เรียน" },
        { label: "การสะท้อนคิดจากพฤติกรรมของผู้เรียน" },
        {
          label:
            "ข้อเสนอแนะผ่านเวบบอร์ดที่อาจารย์ผู้สอนได้จัดทำเป็นช่องทางการสื่อสารกับนักศึกษา",
        },
        { label: "อื่นๆ (Other)" },
      ],
    },
    { no: 3, en: "3rd year", th: "ชั้นปีที่ 3" ,
      list: [
        { label: "ไม่มี" },
        { label: "แบบประเมินกระบวนวิชา" },
        { label: "การสนทนากลุ่มระหว่างผู้สอนและผู้เรียน" },
        { label: "การสะท้อนคิดจากพฤติกรรมของผู้เรียน" },
        {
          label:
            "ข้อเสนอแนะผ่านเวบบอร์ดที่อาจารย์ผู้สอนได้จัดทำเป็นช่องทางการสื่อสารกับนักศึกษา",
        },
        { label: "อื่นๆ (Other)" },
      ], },
    { no: 4, en: "4th year", th: "ชั้นปีที่ 4" ,
      list: [
        { label: "ไม่มี" },
        { label: "แบบประเมินกระบวนวิชา" },
        { label: "การสนทนากลุ่มระหว่างผู้สอนและผู้เรียน" },
        { label: "การสะท้อนคิดจากพฤติกรรมของผู้เรียน" },
        {
          label:
            "ข้อเสนอแนะผ่านเวบบอร์ดที่อาจารย์ผู้สอนได้จัดทำเป็นช่องทางการสื่อสารกับนักศึกษา",
        },
        { label: "อื่นๆ (Other)" },
      ], },
    { no: 5, en: "5th year", th: "ชั้นปีที่ 5" ,
      list: [
        { label: "ไม่มี" },
        { label: "แบบประเมินกระบวนวิชา" },
        { label: "การสนทนากลุ่มระหว่างผู้สอนและผู้เรียน" },
        { label: "การสะท้อนคิดจากพฤติกรรมของผู้เรียน" },
        {
          label:
            "ข้อเสนอแนะผ่านเวบบอร์ดที่อาจารย์ผู้สอนได้จัดทำเป็นช่องทางการสื่อสารกับนักศึกษา",
        },
        { label: "อื่นๆ (Other)" },
      ], },
    { no: 6, en: "6th year", th: "ชั้นปีที่ 6" ,
      list: [
        { label: "ไม่มี" },
        { label: "แบบประเมินกระบวนวิชา" },
        { label: "การสนทนากลุ่มระหว่างผู้สอนและผู้เรียน" },
        { label: "การสะท้อนคิดจากพฤติกรรมของผู้เรียน" },
        {
          label:
            "ข้อเสนอแนะผ่านเวบบอร์ดที่อาจารย์ผู้สอนได้จัดทำเป็นช่องทางการสื่อสารกับนักศึกษา",
        },
        { label: "อื่นๆ (Other)" },
      ], },
  ];

  const [checkedItem, setCheckedItem] = useState([
    { no: 1, item: [] as string[] },
  ]);
  const [openDrawerPLOdes, setOpenDrawerPLOdes] = useState(false);

  return (
    <>
      <DrawerPLOdes
        opened={openDrawerPLOdes}
        onClose={() => setOpenDrawerPLOdes(false)}
      />

      <div className="flex flex-col w-full max-h-full gap-4 ">
        {/* Topic */}

        <div className="flex text-secondary items-center w-full justify-between">
          <p className="text-[15px] font-semibold">
            หัวข้อการประเมินกระบวนวิชาและกระบวนการปรับปรุง{" "}
            <span className=" font-bold">(Topic)</span>
          </p>
          <Button className="text-center rounded-[8px] text-[12px] w-fit font-semibold h-8 px-4">
            <div className="flex gap-2">
              <Icon IconComponent={AddIcon} />
              Add Topic
            </div>
          </Button>
        </div>
        <div className=" overflow-y-auto">
          {/* Table */}
          {topics.map((topic) => (
            <div className="  w-full h-full max-h-full  flex flex-col   relative">
              <div className="w-full text-secondary flex flex-row gap-4 items-center rounded-lg pl-6 py-3 bg-bgTableHeader">
                <p className="flex flex-col font-medium text-[24px]">
                  {topic.no}.
                </p>
                <p className="flex flex-col  text-[14px]">
                  <span className="font-semibold">{topic.th}</span>
                  <span className="font-bold ">{topic.en}</span>
                </p>
              </div>
              <Checkbox.Group
                value={checkedItem.find((item) => item.no == topic.no)?.item}
                onChange={(event) =>
                  setCheckedItem([
                    ...checkedItem.filter((item) => item.no !== topic.no),
                    { no: topic.no, item: event },
                  ])
                }
              >
                {topic.list?.map((item) => (
                  <div className="border-b-[1px] px-6  py-4 items-center">
                    <Checkbox
                      classNames={{
                        label: "font-medium text-[13px] text-[#333333]",
                      }}
                      size="sm"
                      label={item.label}
                      value={item.label}
                      // checked={item.checked}
                    ></Checkbox>
                    {item.label == "อื่นๆ (Other)" &&
                      checkedItem
                        .find((item) => item.no == topic.no)
                        ?.item.includes(item.label) && (
                        <Textarea
                          className="mt-3"
                          placeholder="Description"
                          classNames={{ input: "h-[100px]" }}
                        />
                      )}
                  </div>
                ))}
              </Checkbox.Group>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}