import { NOTI_TYPE } from "@/helpers/constants/enum";
import {
  Checkbox,
  Textarea,
  Button,
  Group,
  Tooltip,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconEdit,
  IconExclamationCircle,
  IconTrash,
} from "@tabler/icons-react";
import AddIcon from "@/assets/icons/plus.svg?react";
import Icon from "../Icon";
import { useEffect, useState } from "react";
import ModalManageTopic, {
  optionsTopicPart6,
} from "../Modal/TQF3/ModalManageTopic";
import { IModelTQF3Part6 } from "@/models/ModelTQF3";
import MainPopup from "../Popup/MainPopup";
import { showNotifications } from "@/helpers/functions/function";
import unplug from "@/assets/image/unplug.png";
import { useAppDispatch, useAppSelector } from "@/store";
import { updatePartTQF3 } from "@/store/tqf3";
import { cloneDeep, isEqual } from "lodash";
import { useSearchParams } from "react-router-dom";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function Part6TQF3({ setForm }: Props) {
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [params, setParams] = useSearchParams({});
  const disabled =
    parseInt(params.get("year") || "") !== academicYear.year &&
    parseInt(params.get("semester") || "") !== academicYear.semester;
  const tqf3 = useAppSelector((state) => state.tqf3);
  const dispatch = useAppDispatch();
  const [formEdit, setFormEdit] =
    useState<Partial<IModelTQF3Part6 & { index: number }>>();
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
        { label: "ไม่มี (None)" },
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
  const [openPopupDelAddTopic, setOpenPopupDelAddTopic] = useState(false);
  const [openModalSelectTopic, setOpenModalSelectTopic] = useState(false);
  const [openModalEditSelectTopic, setOpenModalEditSelectTopic] =
    useState(false);
  const [deleteIndex, setDeleteIndex] = useState(0);
  const [openedTooltip, setOpenedTooltip] = useState(false);
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
    validate: {
      data: {
        detail: (value) => !value.length && "Select at least one",
        other: (value, values, path) =>
          values.data[parseInt(path.split(".")[1])].detail.includes(
            "อื่นๆ (Other)"
          ) &&
          !value?.length &&
          "This field is required",
      },
    },
    onValuesChange(values, previous) {
      if (!isEqual(values, previous)) {
        dispatch(
          updatePartTQF3({ part: "part6", data: cloneDeep(form.getValues()) })
        );
        setForm(form);
      }
    },
  });

  useEffect(() => {
    if (tqf3.part6) {
      form.setValues(cloneDeep(tqf3.part6));
    }
  }, []);

  const addTopic = (value: any) => {
    form.insertListItem("data", value);
  };

  const editTopic = (value: any) => {
    form.setFieldValue(`data.${formEdit?.index}`, value);
  };

  const onClickDeleteAddiTopic = () => {
    form.removeListItem("data", deleteIndex);
    setOpenPopupDelAddTopic(false);
    showNotifications(
      NOTI_TYPE.SUCCESS,
      "Delete Topic Success",
      `Topic ${deleteIndex + 1} is deleted`
    );
  };

  return (
    <>
      <MainPopup
        opened={openPopupDelAddTopic}
        onClose={() => setOpenPopupDelAddTopic(false)}
        action={onClickDeleteAddiTopic}
        type="delete"
        labelButtonRight={`Delete Topic ${deleteIndex + 1}`}
        title={`Delete Addition Topic ${deleteIndex + 1}`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title={
                <p>
                  This action cannot be undone. After you delete this Topic,{" "}
                  <br /> it will be permanently deleted from this course.
                </p>
              }
              icon={<IconExclamationCircle />}
              classNames={{ icon: "size-6" }}
            ></Alert>
            <div className="flex flex-col mt-3 ">
              <p className="text-b3  text-[#808080]">Topic Description</p>
              <p className=" -translate-y-[2px] text-b1">{`mffmmf`}</p>
            </div>
          </>
        }
      />
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

      {tqf3.part5?.updatedAt ? (
        <div className="flex flex-col w-full  max-h-full gap-4">
          {/* Topic */}
          <div className="flex text-secondary  items-center -mt-1 w-full justify-between">
            <p className="text-[15px] font-semibold">
              หัวข้อการประเมินกระบวนวิชาและกระบวนการปรับปรุง{" "}
              <span className=" font-bold">(Topic)</span>
            </p>
            {!disabled && (
              <Button
                onClick={() => setOpenModalSelectTopic(true)}
                onMouseOver={() => setOpenedTooltip(true)}
                onMouseLeave={() => setOpenedTooltip(false)}
                className="text-center px-4"
              >
                <div className="flex gap-2">
                  <Icon IconComponent={AddIcon} />
                  Add Topic
                </div>
              </Button>
            )}
            {/* </Tooltip> */}
          </div>
          <div
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            className=" rounded-md border-[1px] overflow-y-auto mb-4 border-secondary"
          >
            {/* Table */}
            {form.getValues().data.map((topic, index) => {
              const option = optionsTopicPart6.find(
                (e: any) => e.th === topic.topic
              )!;
              return topics[index] ? (
                <div
                  key={index}
                  className="w-full h-full max-h-full flex flex-col"
                >
                  <div className="w-full sticky top-0 z-10 text-secondary flex flex-row gap-4 items-center pl-6 py-4 bg-bgTableHeader">
                    <p className="flex flex-col font-medium text-[28px]">
                      {index + 1}.
                    </p>
                    <p className="flex flex-col gap-1 text-[14px]">
                      <span className="font-semibold">
                        {topics[index].th}{" "}
                        <span className="text-red-500">*</span>
                      </span>
                      <span className="font-bold ">{topics[index].en}</span>
                      <p className="error-text">
                        {form.getInputProps(`data.${index}.detail`).error}
                      </p>
                    </p>
                  </div>
                  <Checkbox.Group
                    {...form.getInputProps(`data.${index}.detail`)}
                    className="items-center"
                    error={<></>}
                    onChange={(event) => {
                      if (event.includes("ไม่มี (None)")) {
                        form.setFieldValue(`data.${index}.detail`, [
                          "ไม่มี (None)",
                        ]);
                        form.setFieldValue(`data.${index}.other`, "");
                      } else {
                        form.setFieldValue(`data.${index}.detail`, event);
                      }
                    }}
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
                            disabled={
                              disabled ||
                              (form
                                .getValues()
                                .data[index]?.detail.includes("ไม่มี (None)") &&
                                item.label !== "ไม่มี (None)")
                            }
                          ></Checkbox>
                          {item.label == "อื่นๆ (Other)" &&
                            form
                              .getValues()
                              .data[index]?.detail.includes(item.label) && (
                              <Textarea
                                className="mt-2 pl-10"
                                placeholder="(Required)"
                                classNames={{
                                  input: `text-[13px] text-[#333333] h-[100px] ${
                                    disabled && "!cursor-default"
                                  }`,
                                }}
                                disabled={disabled}
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
                  <div className="w-full sticky top-0 z-10 text-[#228BE6] flex flex-row gap-4 items-center pl-6 py-4 bg-[#E8F3FC]">
                    <p className="flex flex-col font-medium text-[28px]">
                      {index + 1}.
                    </p>
                    <p className="flex flex-col gap-1 text-[14px]">
                      <span className="font-semibold">{option.th}</span>
                      <span className="font-bold ">{option.en}</span>
                    </p>
                  </div>
                  <div className="text-default border-b-[1px] last:border-none py-4 px-6  w-full text-[13px] font-medium">
                    <div className="flex justify-between items-center whitespace-pre-wrap gap-8">
                      <div className="pl-10">{topic.detail}</div>
                      {!disabled && (
                        <div className="flex justify-start gap-4 items-center">
                          <div
                            className="flex justify-center items-center bg-transparent border-[1px] border-[#F39D4E] text-[#F39D4E] size-8 bg-none rounded-full cursor-pointer hover:bg-[#F39D4E]/10"
                            onClick={() => {
                              setDeleteIndex(index),
                                setFormEdit({
                                  ...form.getValues().data[index],
                                  index: index,
                                });
                              setOpenModalEditSelectTopic(true);
                            }}
                          >
                            <IconEdit className="size-4" stroke={1.5} />
                          </div>
                          <div
                            className="flex justify-center items-center bg-transparent border-[1px] size-8 bg-none rounded-full cursor-pointer border-[#FF4747] text-[#FF4747] hover:bg-[#FF4747]/10"
                            onClick={() => {
                              setDeleteIndex(index);
                              setOpenPopupDelAddTopic(true);
                            }}
                          >
                            <IconTrash className="size-4" stroke={1.5} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex px-16  flex-row items-center justify-between h-full">
          <div className="flex justify-center  h-full items-start gap-2 flex-col">
            <p className="   text-secondary font-semibold text-[22px]">
              Complete TQF3 Part 5 First
            </p>
            <p className=" text-[#333333] leading-6 font-medium text-[14px]">
              To start TQF3 Part 6, please complete and save TQF3 Part 5. <br />{" "}
              Once done, you can continue to do it.
            </p>
          </div>
          <img
            className=" z-50  w-[580px] h-[300px] "
            src={unplug}
            alt="loginImage"
          />
        </div>
      )}
    </>
  );
}
