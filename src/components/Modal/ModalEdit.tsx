import { Button, Modal, TextInput } from "@mantine/core";
import { useEffect } from "react";
import { IModelCourse } from "@/models/ModelCourse";
import { COURSE_TYPE } from "@/helpers/constants/enum";
import { useForm } from "@mantine/form";
import {
  validateCourseNameorTopic,
  validateCourseNo,
} from "@/helpers/functions/validation";
import { updateCourse } from "@/services/course/course.service";
import { showNotifications } from "@/helpers/functions/function";
import { useAppDispatch } from "@/store";
import { editCourse } from "@/store/course";

type Props = {
  opened: boolean;
  onClose: () => void;
  value: Partial<IModelCourse> | undefined;
};

export default function ModalEditCourse({ opened, onClose, value }: Props) {
  const dispatch = useAppDispatch();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {} as Partial<IModelCourse>,
    validate: {
      courseNo: (value) => validateCourseNo(value),
      courseName: (value) => validateCourseNameorTopic(value, "Course Name"),
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if (opened && value) {
      form.setValues(value);
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
      showNotifications("success", "Edit Course", "Edit coures successful");
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={true}
      title="Edit course"
      size="39vw"
      centered
      withCloseButton={false}
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: "",
        content:
          "flex flex-col justify-start   font-medium leading-[24px] text-[14px] item-center  overflow-hidden ",
      }}
    >
      <div className="flex flex-col gap-2">
        <TextInput
          classNames={{ input: "focus:border-primary" }}
          label="Course No."
          size="xs"
          withAsterisk
          placeholder={
            form.getValues().type == COURSE_TYPE.SEL_TOPIC
              ? "Ex. 26X4XX"
              : "Ex. 001102"
          }
          maxLength={6}
          {...form.getInputProps("courseNo")}
        />
        <TextInput
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
        />

        <div className="flex gap-2 mt-3 justify-end">
          <Button
            radius="10px"
            onClick={onClose}
            variant="subtle"
            color="#575757"
            className="text-[14px]"
          >
            Cancel
          </Button>
          <Button
            radius="10px"
            onClick={submit}
            className="text-[14px]"
            color="#5768d5"
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
