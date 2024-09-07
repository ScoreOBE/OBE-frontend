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
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { log } from "console";
import { upperFirst } from "lodash";
import { useEffect, useRef, useState } from "react";

type actionType = "add" | "edit";

type Props = {
  opened: boolean;
  onClose: () => void;
  type: actionType;
  action: (value?: any) => void;
};
export default function ModalManageTopic({
  opened,
  onClose,
  type,
  action,
}: Props) {
  let options = [
    { no: 1, label: "กลยุทธ์การประเมินประสิทธิผลของรายวิชาโดยนักศึกษา" },
    { no: 2, label: "กลยุทธ์การประเมินการสอน" },
    { no: 3, label: "อธิบายวิธีการปรับปรุงการสอน" },
    {
      no: 4,
      label:
        "อธิบายกระบวนการที่ใช้ในการทวนสอบมาตรฐานผมสัมฤทธิิ์ของนักศึกษาตามาตรฐานผลการเรียนรู้",
    },
    {
      no: 5,
      label:
        "อธิบายกระบวนการในการนำข้อมูลที่ได้จากการประเมินข้อ 1 และ 2 มาวางแผนเพื่อปรับปรุงคุณภาพ",
    },
  ];

  const form = useForm({
    mode: "uncontrolled",
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
      withCloseButton={false}
      title={`${upperFirst(type)} Topic 261405`}
      size="40vw"
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
          <Select
            size="sm"
            label="Select Topic"
            placeholder="Topic"
            data={options.map((item) => `${item.no}. ${item.label}`)}
            classNames={{
              option: "text-[13px] py-1.5 px-2",
              options: "",
            }}
            {...form.getInputProps("topic")}
          />

          {form.getValues().topic && (
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
                onChange={(event) => {
                  form.setFieldValue("detail", [event.target.value]);
                }}
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
          onClick={() => action(form.getValues())}
          className="rounded-[8px] text-[12px] h-8 w-fit "
        >
          Done
        </Button>
      </div>
    </Modal>
  );
}
