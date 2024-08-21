import { Button, Modal, TextInput } from "@mantine/core";
import { useEffect } from "react";
import { IModelCourse } from "@/models/ModelCourse";
import { COURSE_TYPE, NOTI_TYPE } from "@/helpers/constants/enum";
import { useForm } from "@mantine/form";
import {
  validateCourseNameorTopic,
  validateCourseNo,
} from "@/helpers/functions/validation";
import { updateCourse } from "@/services/course/course.service";
import { showNotifications } from "@/helpers/functions/function";
import { useAppDispatch, useAppSelector } from "@/store";
import { editCourse } from "@/store/course";
import { updateCourseManagement } from "@/services/courseManagement/courseManagement.service";
import { editCourseManagement } from "@/store/courseManagement";

type Props = {
  opened: boolean;
  onClose: () => void;
  isCourseManage?: boolean;
  value: (Partial<IModelCourse> & Record<string, any>) | undefined;
};

export default function ModalEditCourse({
  opened,
  onClose,
  isCourseManage = false,
  value,
}: Props) {
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const dispatch = useAppDispatch();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {} as Partial<IModelCourse> & Record<string, any>,
    validate: {
      courseNo: (value) => validateCourseNo(value),
      courseName: (value) => validateCourseNameorTopic(value, "Course Name"),
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
    let res;
    if (isCourseManage) {
      payload.academicYear = academicYear.id;
      res = await updateCourseManagement(id, payload);
      if (res) {
        dispatch(editCourseManagement(res));
        dispatch(editCourse({ ...res, id: res.courseId }));
      }
    } else {
      res = await updateCourse(id, payload);
      if (res) {
        dispatch(editCourse(res));
      }
    }
    if (res) {
      onClose();
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Edit success",
        `Course no. or Course name is edited`
      );
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
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
      <div className="flex flex-col mt-2 gap-3">
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
