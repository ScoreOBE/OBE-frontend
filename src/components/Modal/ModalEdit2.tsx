import { Button, Modal, TextInput } from "@mantine/core";
import { useEffect } from "react";
import { IModelCourse } from "@/models/ModelCourse";
import { COURSE_TYPE } from "@/helpers/constants/enum";
import { useForm } from "@mantine/form";
import {
  validateCourseNameorTopic,
  validateCourseNo,
  validateSectionNo,
} from "@/helpers/functions/validation";
import { updateCourse } from "@/services/course/course.service";
import { getSectionNo, showNotifications } from "@/helpers/functions/function";
import { useAppDispatch } from "@/store";
import { editCourse } from "@/store/course";
import { IModelSection } from "@/models/ModelSection";

type Props = {
  opened: boolean;
  onClose: () => void;
  value: Partial<IModelSection> & Record <string, any> | undefined;
};

export default function ModalEditSec({ opened, onClose, value }: Props) {
  const dispatch = useAppDispatch();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {} as Partial<IModelSection> & Record <string, any>,
    validate: {
      sectionNo: (value) => validateSectionNo(value),
      courseNo: (value) => validateCourseNo(value),
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if (opened && value) {
      form.setValues(value);
    } else {
      form.reset();
    }
  }, [opened, value]);

  const submit = async () => {
    let payload = form.getValues();
    const id = payload.id || "";
    delete payload.id;
    const res = await updateCourse(id, payload);
    if (res) {
      onClose();
      dispatch(editCourse({ id, ...payload }));
      showNotifications("success", "Edit Section", "Edit section successful");
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit section"
      size="30vw"
      centered
      withCloseButton={false}
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: "",
        content:
          "flex flex-col justify-start   font-medium leading-[24px] text-[14px] item-center  overflow-hidden ",
      }}
    >
      <div className="flex flex-col gap-3">
        <TextInput
          classNames={{ input: "focus:border-primary" }}
          label="Section No."
          size="xs"
          withAsterisk
          placeholder={
            form.getValues().sectionNo
              ? "Ex. 26X4XX"
              : "Ex. 001102"
          }
          maxLength={3}
          value={getSectionNo(form.getValues().sectionNo)}
          {...form.getInputProps("sectionNo")}
        />
        {/* <TextInput
          label="Course Name"
          withAsterisk
          size="xs"
          classNames={{ input: "focus:border-primary" }}
          placeholder={
            form.getValues().type == COURSE_TYPE.SEL_TOPIC
              ? "Ex. Select Topic in Comp Engr"
              : "Ex. English 2"
          }
          {...form.getInputProps("courseName")}
        /> */}

        <div className="flex gap-2 mt-3 justify-end">
          <Button
            onClick={onClose}
            variant="subtle"
            color="#575757"
            className="rounded-[8px] text-[12px] h-[32px] w-fit "
          >
            Cancel
          </Button>
          <Button
            onClick={submit}
            className="rounded-[8px] text-[12px] h-[32px] w-fit "
            color="#5768d5"
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
