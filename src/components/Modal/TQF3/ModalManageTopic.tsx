import { validateTextInput } from "@/helpers/functions/validation";
import { IModelTQF3Part6 } from "@/models/ModelTQF3";
import course from "@/store/course";
import {
  Button,
  Checkbox,
  Group,
  Modal,
  Textarea,
  TextInput,
  NumberInput,
  NumberInputHandlers,
  Select,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { log } from "console";
import { upperFirst } from "lodash";
import { useEffect, useRef, useState } from "react";

type actionType = "add" | "edit";

type Props = {
  opened: boolean;
  onClose: () => void;
  type: actionType;
  action: (value?: any, option?: any) => void;
  editData?: Partial<IModelTQF3Part6>;
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
  let options = [
    {
      no: 1,
      th: "กลยุทธ์การประเมินประสิทธิผลของรายวิชาโดยนักศึกษา",
      en: "Test You can provide a way better UX ",
    },
    {
      no: 2,
      th: "กลยุทธ์การประเมินการสอน",
      en: "Test You can provide a way better UX ",
    },
    {
      no: 3,
      th: "อธิบายวิธีการปรับปรุงการสอน",
      en: "Test You can provide a way better UX ",
    },
    {
      no: 4,
      th: "อธิบายกระบวนการที่ใช้ในการทวนสอบมาตรฐานผมสัมฤทธิิ์ของนักศึกษาตามาตรฐานผลการเรียนรู้",
      en: "Test You can provide a way better UX ",
    },
    {
      no: 5,
      th: "อธิบายกระบวนการในการนำข้อมูลที่ได้จากการประเมินข้อ 1 และ 2 มาวางแผนเพื่อปรับปรุงคุณภาพ",
      en: "Test You can provide a way better UX ",
    },
  ];

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
        action(form.getValues(), options);
        onCloseModal();
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onCloseModal}
      closeOnClickOutside={false}
      withCloseButton={false}
      title={`${upperFirst(type)} Topic`}
      size="43vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: `flex flex-col bg-[#F6F7FA] overflow-hidden `,
        body: `overflow-hidden ${type === "add" ? "h-full" : "h-fit"}`,
      }}
    >
      <div
        className={`flex flex-col !gap-5 ${
          type === "add" ? "h-full" : "h-fit"
        } `}
      >
        {/* Input Field */}
        <div className={`flex h-fit mb-5 flex-col gap-4`}>
          {type === "add" ? (
            <Select
              size="xs"
              label="Select Topic"
              placeholder="Topic"
              data={options.map((item) => ({
                value: item.th,
                label: `${item.th}\n${item.en}`,
                disabled: data
                  .slice(5)
                  .some((e: any) => e.topic.includes(item.th)),
              }))}
              classNames={{
                option: "text-[13px] py-2 px-3",
                options: "whitespace-pre-wrap leading-5 overflow-y-auto",
                input: "whitespace-break-spaces flex flex-col flex-wrap",
              }}
              renderOption={(item: any) => (
                <div className="flex w-full justify-between items-center">
                  <p>{item.option.label}</p>
                  {item.option.disabled && (
                    <p className="text-[#615f77] font-semibold">Added</p>
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
                <p>{editData?.topic}</p>
                {options?.find(({ th }) => th === editData?.topic)?.en}
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
                  input: "flex h-[150px] py-2 px-3 text-[13px]",
                  label: "flex pb-1",
                }}
                placeholder="Ex. ใช้แบบสอบถามความพึงพอใจ"
                {...form.getInputProps("detail")}
              />
            </>
          )}
        </div>
      </div>
      {/* Button */}
      <div className="flex gap-2  items-end  justify-end h-fit">
        <Button
          onClick={onCloseModal}
          variant="subtle"
          color="#575757"
          className="rounded-[8px] text-[12px] h-8 w-fit "
        >
          Cancel
        </Button>

        <Button
          onClick={addEditTopic}
          className="rounded-[8px] text-[12px] h-8 w-fit "
        >
          {type === "add" ? "Add" : "Done"}
        </Button>
      </div>
    </Modal>
  );
}
