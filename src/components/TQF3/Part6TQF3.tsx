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
  Modal,
  Select,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowRight,
  IconEdit,
  IconInfoCircle,
  IconTrash,
} from "@tabler/icons-react";
import AddIcon from "@/assets/icons/plus.svg?react";
import Icon from "../Icon";
import IconPLO from "@/assets/icons/PLOdescription.svg?react";
import DrawerPLOdes from "@/components/DrawerPLO";
import { useEffect, useState } from "react";
import ModalManageTopic from "../Modal/TQF3/ModalManageTopic";
import { IModelCourse } from "@/models/ModelCourse";
import { log } from "console";
import { IModelTQF3Part6 } from "@/models/ModelTQF3";

type Props = {
  data: IModelCourse;
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part6TQF3({ data, setForm }: Props) {
  const [formEdit, setFormEdit] = useState<
    Partial<IModelTQF3Part6> & Record<string, any>
  >();
  let topics = [
    {
      no: 1,
      en: "Strategies for evaluating course effectiveness by students",
      th: "กลยุทธ์การประเมินประสิทธิผลของกระบวนวิชาโดยนักศึกษา",
      list: [
        { label: "ไม่มี (None)" },
        { label: "แบบประเมินกระบวนวิชา \n(Course assessment form)" },
        {
          label:
            "การสนทนากลุ่มระหว่างผู้สอนและผู้เรียน \n(Instructor-student group discussion)",
        },
        {
          label:
            "การสะท้อนคิดจากพฤติกรรมของผู้เรียน \n(Student behavior reflection)",
        },
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
        {
          label:
            "การทวนสอบผลประเมินการเรียนรู้ \n(Review of assessment results)",
        },
        {
          label:
            "การประเมินโดยคณะกรรมการประเมินข้อสอบ \n(Evaluation by the Exam Committee)",
        },
        {
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
        {
          label:
            "การวิจัยในและนอกชั้นเรียน \n(Research in and out of the classroom)",
        },

        { label: "อื่นๆ (Other)" },
      ],
    },
    {
      no: 4,
      en: "The process of reviewing the standards of student course achievement",
      th: "กระบวนการทวนสอบมาตรฐานผลสัมฤทธิ์กระบวนวิชาของนักศึกษา",
      list: [
        {
          label:
            "มีการตั้งคณะกรรมการในสาขาวิชา ตรวจสอบผลการประเมินการเรียนรู้ของนักศึกษา โดยตรวจสอบข้อรายงาน วิธีการการให้คะแนนสอบ และการให้คะแนนพฤติกรรม \n(A department-specific committee reviews student assessments, reports, scoring methods and behavioral evaluations.)",
        },
        {
          label:
            "การทวนสอบการให้คะแนนการตรวจผลงานของนักศึกษาโดยกรรมการวิชาการประจำภาควิชาและคณะ \n(Department and faculty committees review student grading.)",
        },
        {
          label:
            "การทวนสอบการให้คะแนนจาก การสุ่มตรวจผลงานของนักศึกษาโดยอาจารย์ หรือผู้ทรงคุณวุฒิอื่นๆ \n(Random grading checks by teachers or qualified reviewers.)",
        },
        { label: "อื่นๆ (Other)" },
      ],
    },
    {
      no: 5,
      en: "Reviewing and planning to enhance course effectiveness",
      th: "การดำเนินการทบทวนและการวางแผนปรับปรุงประสิทธิผลของกระบวนวิชา",
      list: [
        { label: "ไม่มี (None)" },
        {
          label:
            "ปรับปรุงกระบวนวิชาในแต่ละปี ตามข้อเสนอแนะและผลการทวนสอบมาตรฐานผลสัมฤทธิ์ตามข้อ 4 \n(Improve the course annually based on recommendations and No.4 - The standard of student course achievement )",
        },
        {
          label:
            "ปรับปรุงกระบวนวิชาในแต่ละปี ตามผลการประเมินผู้สอนโดยนักศึกษา \n(Improve the course annually based on instructor evaluations from students.)",
        },
        {
          label:
            "ปรับปรุงกระบวนวิชาช่วงเวลาการปรับปรุงหลักสูตร \n(Improving the course during the curriculum improvement period)",
        },
        { label: "อื่นๆ (Other)" },
      ],
    },
  ];
  const [options, setOptions] = useState([]);
  const form = useForm({
    mode: "controlled",
    initialValues: {
      data: [
        ...topics.map(({ th }) => ({
          topic: th,
          detail: [],
          other: "",
        })),
      ],
    } as { data: IModelTQF3Part6[] },
    validate: {},
  });

  const [openModalSelectTopic, setOpenModalSelectTopic] = useState(false);
  const [openModalEditSelectTopic, setOpenModalEditSelectTopic] =
    useState(false);

  const addTopic = (value: any, option: any) => {
    if (!options.length) {
      setOptions(option);
    }
    form.insertListItem("data", value);
  };

  const editTopic = (value: any) => {
    form.setFieldValue(`data.${formEdit?.index}`, value);
  };

  return (
    <>
      <ModalManageTopic
        opened={openModalSelectTopic}
        onClose={() => setOpenModalSelectTopic(false)}
        data={form.getValues().data}
        type="add"
        action={addTopic}
      />
      <ModalManageTopic
        opened={openModalEditSelectTopic}
        onClose={() => {
          setOpenModalEditSelectTopic(false);
          setFormEdit({});
        }}
        type="edit"
        action={editTopic}
        editData={formEdit}
      />

      <div className="flex flex-col w-full max-h-full gap-4">
        {/* Topic */}

        <div className="flex text-secondary items-center w-full justify-between">
          <p className="text-[15px] font-semibold">
            หัวข้อการประเมินกระบวนวิชาและกระบวนการปรับปรุง{" "}
            <span className=" font-bold">(Topic)</span>
          </p>
          {form.getValues().data.length === 10 ? (
            <Tooltip
              withArrow
              arrowPosition="side"
              arrowOffset={15}
              arrowSize={7}
              position="bottom-end"
              label={
                <div className="text-default text-[13px] p-2 flex flex-col gap-2">
                  <p className="font-medium">
                    <span className="text-secondary font-bold">
                      Add Topic (Disabled)
                    </span>{" "}
                    <br />
                    All topics have already been added. To make any changes,
                    please edit the topics below.
                  </p>
                </div>
              }
              color="#FCFCFC"
            >
              <Button
                disabled={form.getValues().data.length === 10}
                className="text-center rounded-[8px] text-[12px] w-fit font-semibold h-8 px-4"
              >
                <div className="flex gap-2">
                  <Icon IconComponent={AddIcon} />
                  Add Topic
                </div>
              </Button>
            </Tooltip>
          ) : (
            <Button
              onClick={() => setOpenModalSelectTopic(true)}
              className="text-center rounded-[8px] text-[12px] w-fit font-semibold h-8 px-4"
            >
              <div className="flex gap-2">
                <Icon IconComponent={AddIcon} />
                Add Topic
              </div>
            </Button>
          )}
        </div>
        <div className="pb-6">
          {/* Table */}
          {form.getValues().data.map((topic, index) => {
            const option: any =
              options.find((e: any) => e.th === topic.topic) || {};
            return topics[index] ? (
              <div
                key={index}
                className="  w-full h-full max-h-full  flex flex-col "
              >
                <div className="w-full sticky top-0 z-10 text-secondary flex flex-row gap-4 items-center pl-6 py-4 bg-bgTableHeader rounded-md">
                  <p className="flex flex-col font-medium text-[28px]">
                    {index + 1}.
                  </p>
                  <p className="flex flex-col gap-1  text-[14px]">
                    <span className="font-semibold">{topics[index].th}</span>
                    <span className="font-bold ">{topics[index].en}</span>
                  </p>
                </div>
                <Checkbox.Group
                  {...form.getInputProps(`data.${index}.detail`)}
                  className="items-center"
                >
                  <Group className="flex items-center flex-col gap-0">
                    {topics[index].list?.map((item, checkIndex) => (
                      <div
                        key={checkIndex}
                        className="border-b-[1px] last:border-none py-4 px-6 w-full"
                      >
                        <Checkbox
                          classNames={{
                            label:
                              "font-medium text-[13px] leading-6 text-[#333333]",
                            body: "flex flex-row gap-2 items-center ",
                          }}
                          className=" whitespace-break-spaces items-center"
                          size="sm"
                          label={item.label}
                          value={item.label}
                        ></Checkbox>
                        {item.label == "อื่นๆ (Other)" &&
                          form
                            .getValues()
                            .data[index]?.detail.includes(item.label) && (
                            <Textarea
                              className="mt-2 pl-10"
                              placeholder="(Required)"
                              classNames={{
                                input: "text-[13px] text-[#333333] h-[100px]",
                              }}
                              {...form.getInputProps(`data.${index}.other`)}
                            />
                          )}
                      </div>
                    ))}
                  </Group>
                </Checkbox.Group>
              </div>
            ) : (
              <div
                key={index}
                className="  w-full h-full max-h-full  flex flex-col "
              >
                <div className="w-full sticky top-0 z-10 text-[#228BE6] flex flex-row gap-4 items-center pl-6 py-4 bg-[#E8F3FC] rounded-md">
                  <p className="flex flex-col font-medium text-[28px]">
                    {index + 1}.
                  </p>
                  <p className="flex flex-col gap-1  text-[14px]">
                    <span className="font-semibold">
                      {option.th}{" "}
                      <span className="text-[#228BE6]">(Additional Topic)</span>
                    </span>
                    <span className="font-bold ">{option.en}</span>
                  </p>
                </div>
                <div className="text-default border-b-[1px] last:border-none py-4 px-6  w-full">
                  <div className="flex justify-between items-center whitespace-pre-wrap gap-8">
                    {topic.detail}
                    <div className="flex justify-start gap-4 items-center">
                      <div
                        className="flex justify-center items-center bg-transparent border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full cursor-pointer hover:bg-[#F39D4E]/10"
                        onClick={() => {
                          setFormEdit({
                            ...form.getValues().data[index],
                            index,
                          });
                          setOpenModalEditSelectTopic(true);
                        }}
                      >
                        <IconEdit className="size-4" stroke={1.5} />
                      </div>
                      <div
                        className="flex justify-center items-center bg-transparent border-[1px] size-8 bg-none rounded-full cursor-pointer border-[#FF4747] text-[#FF4747] hover:bg-[#FF4747]/10"
                        onClick={() => form.removeListItem("data", index)}
                      >
                        <IconTrash className="size-4" stroke={1.5} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
