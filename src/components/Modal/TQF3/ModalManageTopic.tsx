import { IModelTQF3Part6 } from "@/models/ModelTQF3";
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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowRight,
  IconMinus,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { log } from "console";
import { upperFirst } from "lodash";
import { useEffect, useRef, useState } from "react";

type actionType = "add" | "edit";

type Props = {
  opened: boolean;
  onClose: () => void;
  type: actionType;
  action: (value?: any, option?: any) => void;
};
export default function ModalManageTopic({
  opened,
  onClose,
  type,
  action,
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
    initialValues: {} as Partial<IModelTQF3Part6>,
    validate: {},
  });

  const onCloseModal = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onCloseModal}
      closeOnClickOutside={false}
      title={`${upperFirst(type)} Topic TQF3 Part 6 261405`}
      size="40vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
        body: `${
          type === "add" ? "h-full" : "h-fit"
        } flex flex-col overflow-hidden max-h-full h-fit`,
      }}
    >
      <div
        className={`flex flex-col !gap-8 ${
          type === "add" ? "h-full" : "h-fit"
        } `}
      >
        {/* Input Field */}
        <div className={`flex flex-col h-fit mb-6`}>
          <Select
            size="xs"
            label="Select Topic"
            placeholder="Topic"
            data={options.map((item) => ({
              value: item.th,
              label: `${" "}${item.th}\n${" "}${item.en}`,
            }))}
            classNames={{
              option: "text-[13px] py-2 px-2",
              options: "whitespace-break-spaces leading-5",
              input: "whitespace-break-spaces flex flex-col flex-wrap",
            }}
            {...form.getInputProps("topic")}
          />

          {form.getValues().topic && (
            <Textarea
              autoFocus={false}
              label={
                <p className="font-semibold flex gap-1">
                  Description
                  <span className=" text-error">*</span>
                </p>
              }
              className="w-full border-none mt-3 rounded-r-none"
              classNames={{
                input: "flex h-[150px] py-2 px-3 text-[13px]",
                label: "flex pb-1",
              }}
              placeholder="Ex. ใช้แบบสอบถามความพึงพอใจ"
              onChange={(event) => {
                form.setFieldValue("detail", [event.target.value]);
              }}
            />
          )}
        </div>
      </div>
      {/* Button */}
      <div className="flex justify-end w-full">
        <Group className="flex w-full h-fit items-end justify-end">
          <div>
            <Button
              onClick={onCloseModal}
              color="#575757"
              variant="subtle"
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
            >
              Cancel
            </Button>
          </div>
          <Button
            onClick={() => {
              action(form.getValues(), options);
              onClose();
            }}
            leftSection={
              <IconPlus
                color="#ffffff"
                className="size-5 items-center"
                stroke={2}
                size={20}
              />
            }
            className="rounded-[8px] border-none text-[12px] h-[32px] w-fit"
          >
            Add
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
