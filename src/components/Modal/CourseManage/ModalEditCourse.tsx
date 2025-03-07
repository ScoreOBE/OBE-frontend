import {
  Button,
  FocusTrapInitialFocus,
  Modal,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useEffect } from "react";
import { IModelCourse } from "@/models/ModelCourse";
import { COURSE_TYPE, NOTI_TYPE } from "@/helpers/constants/enum";
import { useForm } from "@mantine/form";
import {
  validateTextInput,
  validateCourseNo,
} from "@/helpers/functions/validation";
import {
  getExistsCourseData,
  updateCourse,
} from "@/services/course/course.service";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { useAppDispatch, useAppSelector } from "@/store";
import { editCourse } from "@/store/course";
import { updateCourseManagement } from "@/services/courseManagement/courseManagement.service";
import { editCourseManagement } from "@/store/courseManagement";
import { setLoadingOverlay } from "@/store/loading";

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
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const dispatch = useAppDispatch();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {} as Partial<IModelCourse> & Record<string, any>,
    validate: {
      courseNo: (value) => validateCourseNo(value),
      courseName: (value) => validateTextInput(value, "Course Name", 100),
      descTH: (value) =>
        validateTextInput(value, "Description Thai", 1600, false),
      descEN: (value) =>
        validateTextInput(value, "Description English", 1600, false),
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if (opened && value) {
      form.setValues(value);
      getCourseData(value.courseNo!);
    } else {
      form.reset();
    }
  }, [opened, value]);

  const getCourseData = async (courseNo: string) => {
    const res = await getExistsCourseData(courseNo, {
      academicyear: academicYear.year,
      academicterm: academicYear.semester,
    });
    form.setFieldValue("courseName", res.name);
    form.setFieldValue("descTH", res.descTH);
    form.setFieldValue("descEN", res.descEN);
  };

  const submit = async () => {
    if (form.validate().hasErrors) return;
    dispatch(setLoadingOverlay(true));
    let payload = form.getValues();
    const id = payload.id || "";
    delete payload.id;
    let res;
    if (isCourseManage) {
      payload.year = academicYear.year;
      payload.semester = academicYear.semester;
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
        "Course Edited Successfully",
        `The course has been successfully updated.`
      );
    }
    dispatch(setLoadingOverlay(false));
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit course"
      size="39vw"
      centered
      closeOnClickOutside={false}
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: "",
        content:
          "flex flex-col justify-start   font-medium leading-[24px] text-[14px] item-center  overflow-hidden ",
      }}
    >
      <FocusTrapInitialFocus />
      <div className="flex flex-col mt-2 gap-3">
        <TextInput
          classNames={{ input: "focus:border-primary" }}
          label="Course No."
          size="xs"
          withAsterisk
          placeholder={
            form.getValues().type == COURSE_TYPE.SEL_TOPIC.en
              ? "26X4XX"
              : "001102"
          }
          maxLength={6}
          disabled={!value?.addFirstTime}
          {...form.getInputProps("courseNo")}
        />
        <TextInput
          label="Course Name"
          withAsterisk
          size="xs"
          classNames={{ input: "focus:border-primary" }}
          placeholder={
            form.getValues().type == COURSE_TYPE.SEL_TOPIC.en
              ? "Select Topic in Comp Engr"
              : "English 2"
          }
          {...form.getInputProps("courseName")}
        />
        <Textarea
          withAsterisk={true}
          autoFocus={false}
          label={
            <p className="font-semibold flex gap-1 h-full">
              Description <span className="text-secondary">Thai</span>
            </p>
          }
          size="xs"
          className="w-full border-none rounded-r-none"
          classNames={{
            input:
              "focus:border-primary acerSwift:max-macair133:!text-b5 macair133:h-[120px] sm:h-[75px] ipad11:h-[95px]",
            label: "flex pb-1 gap-1 acerSwift:max-macair133:!text-b4",
          }}
          placeholder=""
          {...form.getInputProps("descTH")}
        />
        <Textarea
          withAsterisk={true}
          autoFocus={false}
          label={
            <p className="font-semibold flex gap-1 h-full">
              Description <span className="text-secondary">English</span>
            </p>
          }
          size="xs"
          className="w-full border-none rounded-r-none"
          classNames={{
            input:
              "focus:border-primary acerSwift:max-macair133:!text-b5 macair133:h-[120px] sm:h-[75px] ipad11:h-[95px]",
            label: "flex pb-1 gap-1 acerSwift:max-macair133:!text-b4",
          }}
          placeholder=""
          {...form.getInputProps("descEN")}
        />
        <div className="flex gap-2 mt-3 justify-end">
          <Button onClick={onClose} variant="subtle" loading={loading}>
            Cancel
          </Button>
          <Button onClick={submit} loading={loading}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
