import { COURSE_TYPE, TEACHING_METHOD } from "@/helpers/constants/enum";
import {
  Radio,
  Checkbox,
  TextInput,
  Textarea,
  Button,
  Alert,
  Table,
  Group,
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
      en: "Strategies for evaluating course effectiveness by students",
      th: "กลยุทธ์การประเมินประสิทธิผลของกระบวนวิชาโดยนักศึกษา",
      list: [
        { label: "ไม่มี (None)" },
        { label: "แบบประเมินกระบวนวิชา \n(Course assessment form)" },
        { label: "การสนทนากลุ่มระหว่างผู้สอนและผู้เรียน \n(Instructor-student group discussion)" },
        { label: "การสะท้อนคิดจากพฤติกรรมของผู้เรียน \n(Student behavior reflection)" },
        {
          label:
            "ข้อเสนอแนะผ่านเวบบอร์ดที่อาจารย์ผู้สอนได้จัดทำเป็นช่องทางการสื่อสารกับนักศึกษา \n(Suggestions through the instructor's webboard for student communication.)",
        },
        { label: "อื่นๆ (Other)" },
      ],
    },
    {
      no: 2,
      en: "Strategies for teaching assessment",
      th: "กลยุทธ์การประเมินการสอน",
      list: [
        { label: "ไม่มี (None)" },
        { label: "แบบประเมินผู้สอน \n(Instructor evaluation form)" },
        { label: "ผลการสอบ \n(Examination results)" },
        { label: "การทวนสอบผลประเมินการเรียนรู้ \n(Review of assessment results)" },
        {
          label:
            "การประเมินโดยคณะกรรมการประเมินข้อสอบ \n(Evaluation by the Exam Committee)",
        }, {
          label:
            "การสังเกตการณ์สอนของผู้ร่วมทีมการสอน \n(Teaching observation by Co-Instructor)",
        },
        { label: "อื่นๆ (Other)" },
      ],
    },
    {
      no: 3,
      en: "Examination improvement ",
      th: "กลไกการปรับปรับปรุงการสอบ",
      list: [
        { label: "ไม่มี (None)" },
        { label: "สัมมนาการจัดการเรียนการสอน \n(Teaching Management Seminar)" },
        { label: "การวิจัยในและนอกชั้นเรียน \n(Research in and out of the classroom)" },
       
        { label: "อื่นๆ (Other)" },
      ],
    },
    {
      no: 4,
      en: "The process of reviewing the standards of student course achievement",
      th: "กระบวนการทวนสอบมาตรฐานผลสัมฤทธิ์กระบวนวิชาของนักศึกษา",
      list: [
        { label: "มีการตั้งคณะกรรมการในสาขาวิชา ตรวจสอบผลการประเมินการเรียนรู้ของนักศึกษา โดยตรวจสอบข้อรายงาน วิธีการการให้คะแนนสอบ และการให้คะแนนพฤติกรรม \n(A department-specific committee reviews student assessments, reports, scoring methods and behavioral evaluations.)" },
        { label: "การทวนสอบการให้คะแนนการตรวจผลงานของนักศึกษาโดยกรรมการวิชาการประจำภาควิชาและคณะ \n(Department and faculty committees review student grading.)" },
        { label: "การทวนสอบการให้คะแนนจาก การสุ่มตรวจผลงานของนักศึกษาโดยอาจารย์ หรือผู้ทรงคุณวุฒิอื่นๆ \n(Random grading checks by teachers or qualified reviewers.)" },
        { label: "อื่นๆ (Other)" },
      ],
    },
    {
      no: 5,
      en: "Reviewing and planning to enhance course effectiveness",
      th: "การดำเนินการทบทวนและการวางแผนปรับปรุงประสิทธิผลของกระบวนวิชา",
      list: [
        { label: "ไม่มี (None)" },
        { label: "ปรับปรุงกระบวนวิชาในแต่ละปี ตามข้อเสนอแนะและผลการทวนสอบมาตรฐานผลสัมฤทธิ์ตามข้อ 4 \n(Improve the course annually based on recommendations and No.4 - The standard of student course achievement )" },
        { label: "ปรับปรุงกระบวนวิชาในแต่ละปี ตามผลการประเมินผู้สอนโดยนักศึกษา \n(Improve the course annually based on instructor evaluations from students.)" },
        { label: "ปรับปรุงกระบวนวิชาช่วงเวลาการปรับปรุงหลักสูตร \n(Improving the course during the curriculum improvement period)" },
        { label: "อื่นๆ (Other)" },
      ],
    },
  ];

  const [checkedItem, setCheckedItem] = useState([
    { no: 1, item: [] as string[] },
    { no: 2, item: [] as string[] },
    { no: 3, item: [] as string[] },
    { no: 4, item: [] as string[] },
    { no: 5, item: [] as string[] },
    { no: 6, item: [] as string[] },
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
        <div className=" overflow-y-auto pb-6">
          {/* Table */}
          {topics.map((topic) => (
            <div
              key={topic.no}
              className="  w-full h-full max-h-full  flex flex-col   relative"
            >
              <div className="w-full text-secondary flex flex-row gap-4 items-center pl-6 py-4 bg-[#eaecf6]">
                <p className="flex flex-col font-medium text-[28px]">
                  {topic.no}.
                </p>
                <p className="flex flex-col gap-1  text-[14px]">
                  <span className="font-semibold">{topic.th}</span>
                  <span className="font-bold ">{topic.en}</span>
                </p>
              </div>
              <Checkbox.Group
                value={checkedItem.find((item) =>item.no == topic.no)?.item}
                onChange={(event) =>
                  setCheckedItem([
                    ...checkedItem.filter((item) => item.no !== topic.no),
                    { no: topic.no, item: event },
                  ])
                }
                className="items-center"
              >
                <Group className="flex items-center flex-col gap-0">
                  {topic.list?.map((item, index) => (
                    <div
                      key={index}
                      className="border-b-[1px] py-4 px-6 w-full"
                    >
                      <Checkbox
                        classNames={{
                          label: "font-medium text-[14px] leading-6 text-[#333333]",
                          body: "flex flex-row gap-2 items-center ",
                        }}
                        className=" whitespace-break-spaces items-center"
                        size="sm"
                        label={item.label}
                        value={item.label}
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
                </Group>
              </Checkbox.Group>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
