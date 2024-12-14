import { validateTextInput } from "@/helpers/functions/validation";
import { IModelTQF3Part6 } from "@/models/ModelTQF3";
import { Button, Group, Modal, Textarea, Select, Alert } from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst } from "lodash";
import { useEffect } from "react";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import Icon from "@/components/Icon";

export const optionsTopicPart6 = [
  {
    no: 1,
    th: "กลยุทธ์การประเมินประสิทธิผลของรายวิชาโดยนักศึกษา",
    en: "Strategies for evaluating course effectiveness by students",
  },
  {
    no: 2,
    th: "กลยุทธ์การประเมินการสอน",
    en: "Strategies for teaching assessment",
  },
  {
    no: 3,
    th: "อธิบายวิธีการปรับปรุงการสอน",
    en: "Describe teaching improvement ",
  },
  {
    no: 4,
    th: "อธิบายกระบวนการที่ใช้ในการทวนสอบมาตรฐานผมสัมฤทธิิ์ของนักศึกษาตามมาตรฐานผลการเรียนรู้",
    en: "Describe the process used to verify student achievement standards based on course learning outcomes (CLO).",
  },
  {
    no: 5,
    th: "อธิบายกระบวนการในการนำข้อมูลที่ได้จากการประเมินข้อ 1 และ 2 มาวางแผนเพื่อปรับปรุงคุณภาพ",
    en: "Describe the process of using the information obtained from Topic 1 and 2 to plan for quality improvement.",
  },
];

type actionType = "add" | "edit";

type Props = {
  opened: boolean;
  onClose: () => void;
  type: actionType;
  action: (value?: any) => void;
  editData?: Partial<IModelTQF3Part6 & { index: number }>;
  data?: any;
};
export default function ModalManageTopic({
  opened,
  onClose,
  type,
  action,
  editData,
  data,
}: Props) {
  const form = useForm({
    mode: "controlled",
    initialValues: {} as any,
    validate: {
      topic: (value) => !value?.length && "Topic is required",
      detail: (value) => validateTextInput(value, "Description", 1000, false),
    },
  });

  const onCloseModal = () => {
    onClose();
    setTimeout(() => {
      form.reset();
    }, 300);
  };

  useEffect(() => {
    if (editData) {
      form.setValues(editData);
    }
  }, [editData]);

  const addEditTopic = () => {
    if (!form.validateField("topic").hasError) {
      if (!form.validateField("detail").hasError) {
        action(form.getValues());
        onCloseModal();
        if (type === "add") {
          showNotifications(
            NOTI_TYPE.SUCCESS,
            "Topic Added successfully",
            `The Additional topic has been added to your TQF`
          );
        } else {
          showNotifications(
            NOTI_TYPE.SUCCESS,
            "Topic Edited Successfully",
            `Topic ${editData?.index! + 1} has been updated`
          );
        }
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onCloseModal}
      closeOnEscape={false}
      closeOnClickOutside={false}
      title={`${upperFirst(type)} Topic TQF 3 Part 6`}
      size={type === "add" ? "45vw" : "40vw"}
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
        body: `${
          type === "add" ? "h-full" : "h-fit"
        } flex flex-col overflow-hidden max-h-full h-fit`,
      }}
    >
      {optionsTopicPart6.every((e) =>
        data
          ?.slice(5)
          .map((item: any) => item.topic)
          .includes(e.th)
      ) && (
        <Alert
          radius="md"
          variant="light"
          color="blue"
          className="mb-2"
          classNames={{
            body: " flex justify-center",
          }}
          title={
            <div className="flex items-center  gap-2">
              <Icon IconComponent={IconInfo2} />
              <p>
                You've already added 10 topics for course evaluation and
                improvement process.
              </p>
            </div>
          }
        ></Alert>
      )}
      <div
        className={`flex flex-col !gap-8 ${
          type === "add" ? "h-full" : "h-fit"
        } `}
      >
        {/* Input Field */}
        <div className={`flex h-fit mb-6 flex-col gap-4`}>
          {type === "add" ? (
            <Select
              size="sm"
              disabled={optionsTopicPart6.every((e) =>
                data
                  ?.slice(5)
                  .map((item: any) => item.topic)
                  .includes(e.th)
              )}
              label="Select Topic (If any)"
              placeholder="Topic"
              className="mt-1 mb-2 "
              data={optionsTopicPart6.map((item) => ({
                value: item.th,
                label: `${item.th} \n ${item.en}`,
                th: item.th,
                en: item.en,
                disabled: data
                  .slice(5)
                  .some((e: any) => e.topic.includes(item.th)),
              }))}
              classNames={{
                option: "text-[13px] py-2 px-3",
                options: "whitespace-pre-wrap leading-5 overflow-y-auto",
                input: "whitespace-break-spaces  flex flex-col flex-wrap",
              }}
              renderOption={(item: any) => (
                <div className="flex w-full justify-between items-center gap-1">
                  <div className="w-fit">
                    <div className="flex gap-1 w-[90%]">
                      <p>-</p>
                      <p>{item.option.th}</p>
                    </div>
                    <div className="flex gap-1">
                      <p>-</p>
                      <p>{item.option.en}</p>
                    </div>
                  </div>
                  {item.option.disabled && (
                    <p className="text-[#615f77] font-semibold text-end w-[15%]">
                      Added
                    </p>
                  )}
                </div>
              )}
              {...form.getInputProps("topic")}
            />
          ) : (
            <div>
              <label className="font-semibold text-label text-[13px]">
                Topic
              </label>

              <div className="flex flex-col text-[13px] font-medium text-secondary">
                <div className="flex gap-1 ">
                  <p>-</p>
                  <p>{editData?.topic}</p>
                </div>
                <div className="flex gap-1 ">
                  <p>-</p>
                  <p>
                    {
                      optionsTopicPart6?.find(
                        ({ th }) => th === editData?.topic
                      )?.en
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {(form.getValues().topic || type === "edit") && (
            <>
              <Textarea
                autoFocus={false}
                label={
                  <p className="font-semibold flex gap-1">
                    Description
                    <span className=" text-error">*</span>
                  </p>
                }
                className="w-full border-none rounded-r-none"
                classNames={{
                  input: "flex h-[200px] py-2 px-3 text-[13px]",
                  label: "flex pb-1",
                }}
                placeholder="Ex. แบบสอบถามความพึงพอใจให้นักศึกษาประเมิน (Student satisfaction questionnaire)"
                {...form.getInputProps("detail")}
              />
            </>
          )}
        </div>
      </div>
      {/* Button */}
      <div className="flex justify-end w-full">
        <Group className="flex w-full h-fit items-end justify-end">
          <div>
            <Button variant="subtle" onClick={onCloseModal}>
              Cancel
            </Button>
          </div>
          <Button
            onClick={addEditTopic}
            className="pl-4"
            disabled={optionsTopicPart6.every((e) =>
              data
                ?.slice(5)
                .map((item: any) => item.topic)
                .includes(e.th)
            )}
          >
            {type === "add" ? "Save" : "Done"}
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
