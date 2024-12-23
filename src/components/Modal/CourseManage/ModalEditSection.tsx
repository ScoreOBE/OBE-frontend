import {
  Button,
  Chip,
  FocusTrapInitialFocus,
  Group,
  Modal,
  Select,
  Switch,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  validateTextInput,
  validateSectionNo,
} from "@/helpers/functions/validation";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { useAppDispatch, useAppSelector } from "@/store";
import { IModelSection } from "@/models/ModelCourse";
import { updateSection } from "@/services/section/section.service";
import { IModelSectionManagement } from "@/models/ModelCourseManagement";
import { COURSE_TYPE, NOTI_TYPE, SEMESTER } from "@/helpers/constants/enum";
import {
  getOneCourseManagement,
  updateSectionManagement,
} from "@/services/courseManagement/courseManagement.service";
import { editSectionManagement } from "@/store/courseManagement";
import { editCourse, editSection } from "@/store/course";
import { getOneCourse } from "@/services/course/course.service";
import { setLoadingOverlay } from "@/store/loading";
import { getSectionNo } from "@/helpers/functions/function";

type Props = {
  opened: boolean;
  onClose: () => void;
  isCourseManage?: boolean;
  title?: string;
  value:
    | (Partial<IModelSection | IModelSectionManagement> & Record<string, any>)
    | undefined;
  fetchOneCourse?: () => void;
};

export default function ModalEditSection({
  opened,
  onClose,
  isCourseManage = false,
  title,
  value,
  fetchOneCourse = () => {},
}: Props) {
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const curriculum = useAppSelector(
    (state) => state.faculty.faculty.curriculum
  );
  const dispatch = useAppDispatch();
  const [openThisTerm, setOpenThisTerm] = useState(false);
  const [semester, setSemester] = useState<string[]>([]);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {} as Partial<IModelSection | IModelSectionManagement> &
      Record<string, any>,
    validate: {
      topic: (value) => validateTextInput(value, "Topic"),
      sectionNo: (value) => validateSectionNo(value),
    },
    validateInputOnBlur: true,
  });

  const fetchOneCourseManagement = async () => {
    const res = await getOneCourseManagement(value?.courseNo);
    if (res && value) {
      setSemester(
        res.sections
          .find((sec: any) => sec.sectionNo == value?.oldSectionNo)
          .semester.map((sec: any) => sec.toString())
      );
    }
  };

  useEffect(() => {
    if (opened && value) {
      setOpenThisTerm(false);
      setSemester([]);
      form.setValues(value.data);
      setOpenThisTerm(value.isActive!);
      if (value.data.semester) setSemester(value.data.semester as string[]);
      if (!isCourseManage) fetchOneCourseManagement();
    } else {
      form.reset();
    }
  }, [opened, value]);

  const submit = async () => {
    dispatch(setLoadingOverlay(true));
    let payload: any = {
      ...value,
      year: academicYear.year,
      semester: academicYear.semester,
      data: {},
    };
    if (value?.type == COURSE_TYPE.SEL_TOPIC.en) {
      payload.data.topic = form.getValues().topic;
    }
    payload.data.sectionNo = parseInt(form.getValues().sectionNo?.toString()!);
    payload.data.semester = semester.map((term) => parseInt(term));
    if (form.getValues().curriculum?.length) {
      payload.data.curriculum = form.getValues().curriculum;
    }
    const id = payload.id;
    delete payload.id;
    let res;
    const data = { ...payload.data, isActive: openThisTerm };
    if (isCourseManage) {
      const secId = payload.secId;
      payload.openThisTerm = openThisTerm;
      delete payload.secId;
      delete payload.isActive;
      res = await updateSectionManagement(id!, secId, payload);
      if (res) {
        dispatch(editSectionManagement({ id: id, secId: secId, data }));
        if (openThisTerm) {
          const resCourse = await getOneCourse({
            year: academicYear.year,
            semester: academicYear.semester,
            courseNo: value?.courseNo,
          });
          if (resCourse) {
            dispatch(editCourse(resCourse));
          }
        } else {
          dispatch(editSection({ id: res.courseId, secId: res.secId, data }));
        }
      }
    } else {
      payload.data.isActive = openThisTerm;
      res = await updateSection(id!, payload);
      if (res) {
        fetchOneCourse();
      }
    }
    if (res) {
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Section Edited Successfully",
        `The section has been successfully updated.`
      );
      onClose();
      setOpenThisTerm(false);
      setSemester([]);
    }
    dispatch(setLoadingOverlay(false));
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      title={title ?? "Edit section"}
      size="35vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: "acerSwift:max-macair133:!text-b1",
        content:
          "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center  overflow-hidden ",
      }}
    >
      <FocusTrapInitialFocus />
      <div className="flex flex-col mt-2 gap-5">
        {value?.type === COURSE_TYPE.SEL_TOPIC.en && (
          <TextInput
            label="Topic"
            withAsterisk
            size="xs"
            classNames={{ input: "focus:border-primary" }}
            {...form.getInputProps("topic")}
          />
        )}
        <TextInput
          label="Section No."
          withAsterisk
          size="xs"
          placeholder="001 or 1"
          maxLength={3}
          classNames={{
            input: "focus:border-primary acerSwift:max-macair133:!text-b4",
            label: "acerSwift:max-macair133:!text-b4",
          }}
          {...form.getInputProps("sectionNo")}
        />
        <Select
          label="Curriculum"
          size="xs"
          data={curriculum?.map(({ code }) => code)}
          classNames={{
            input: "focus:border-primary acerSwift:max-macair133:!text-b4",
            label: "acerSwift:max-macair133:!text-b4",
          }}
          className="acerSwift:max-macair133:-mt-2"
          value={form.getValues().curriculum}
          {...form.getInputProps("curriculum")}
        />
        <div
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
          className={`w-full pl-5 pr-[18px] py-[18px] bg-white  rounded-md gap-2 flex flex-col`}
        >
          <div className={`flex flex-row justify-between items-center`}>
            <div className="gap-3 flex flex-col">
              <span className="font-semibold text-b3 acerSwift:max-macair133:text-b4 ">
                Repeat on semester
              </span>
            </div>
            <Chip.Group
              value={semester}
              onChange={(event) => setSemester(event.sort())}
              multiple
            >
              <Group className="flex flex-row gap-4 justify-end">
                {SEMESTER.map((item) => (
                  <Chip
                    icon={<></>}
                    key={item}
                    classNames={{
                      input:
                        "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                      iconWrapper: "w-0",
                      label:
                        "text-b4 acerSwift:max-macair133:!text-b5 font-medium px-4 cursor-pointer",
                    }}
                    size="xs"
                    value={item.toString()}
                    disabled={
                      semester.length == 1 && semester.includes(item.toString())
                    }
                  >
                    {item}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
          </div>
        </div>
        <div
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
          className={`w-full pl-5 pr-[18px] py-4 bg-white mb-3 rounded-md gap-2 flex flex-col`}
        >
          <div className={`flex flex-row justify-between items-center`}>
            <div className="gap-3 flex flex-col">
              <span className="font-semibold text-b3 acerSwift:max-macair133:text-b4 ">
                Open in {academicYear?.semester}/{academicYear?.year}
              </span>
            </div>
            <Switch
              size="lg"
              onLabel="ON"
              offLabel="OFF"
              checked={openThisTerm}
              onChange={(event) => setOpenThisTerm(event.target.checked)}
            ></Switch>
          </div>
        </div>

        <div className="flex gap-2 justify-end w-full">
          <Button
            variant="subtle"
            onClick={onClose}
            loading={loading}
            className="acerSwift:max-macair133:!text-b5"
          >
            Cancel
          </Button>
          <Button
            onClick={submit}
            loading={loading}
            className="acerSwift:max-macair133:!text-b5"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
