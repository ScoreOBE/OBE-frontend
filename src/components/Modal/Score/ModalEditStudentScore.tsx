import { NOTI_TYPE } from "@/helpers/constants/enum";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { IModelAssignment, IModelCourse } from "@/models/ModelCourse";
import { IModelUser } from "@/models/ModelUser";
import { updateStudentScore } from "@/services/score/score.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateStudentList } from "@/store/course";
import { setLoadingOverlay } from "@/store/loading";
import { Button, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { isEqual } from "lodash";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

type formData = {
  student: IModelUser;
  questions: { name: string; score: number | string }[];
};

type Props = {
  opened: boolean;
  onClose: () => void;
  course: IModelCourse;
  section: number;
  assignment: IModelAssignment;
  data: formData;
};

export default function ModalEditStudentScore({
  opened,
  onClose,
  course,
  section,
  assignment,
  data,
}: Props) {
  const { name } = useParams();
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const dispatch = useAppDispatch();
  const form = useForm({
    mode: "controlled",
    initialValues: {} as formData,
    validate: {
      questions: {
        score: (value, values, path) => {
          if (typeof value !== "number")
            return (
              !value.length ||
              (!parseFloat(value) && value != "0" && "Please enter valid score")
            );
          const fullScore =
            assignment?.questions?.find(
              (ques) =>
                ques.name ==
                values.questions[parseFloat(path.split(".")[1])].name
            )?.fullScore || 0;
          return value > fullScore
            ? `Please enter score <= ${fullScore}`
            : null;
        },
      },
    },
    validateInputOnBlur: true,
    onValuesChange: (values) => {
      values.questions?.forEach((item) => {
        if (
          typeof item.score != "number" &&
          !item.score.endsWith(".") &&
          !isNaN(parseFloat(item.score))
        ) {
          item.score = parseFloat(item.score);
        }
      });
    },
  });

  useEffect(() => {
    if (opened) {
      form.setValues({ ...data });
    }
  }, [opened]);

  const onSaveEditScore = async () => {
    if (!form.validate().hasErrors) {
      dispatch(setLoadingOverlay(true));
      const studentId = form.getValues().student.studentId;
      const res = await updateStudentScore({
        course: course?.id,
        sectionNo: section,
        student: form.getValues().student.id,
        assignmentName: name,
        questions: [...form.getValues().questions],
      });
      if (res) {
        dispatch(updateStudentList({ id: course?.id, sections: res }));
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "Score Edited Successfully",
          `Score of ${studentId} has been successfully updated`
        );
        onClose();
      }
      dispatch(setLoadingOverlay(false));
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Edit Score ${form.getValues().student?.studentId}`}
      size="35vw"
      centered
      closeOnClickOutside={false}
      transitionProps={{ transition: "pop" }}
      className="flex items-center justify-center"
      classNames={{
        content:
          "flex flex-col justify-center w-full font-medium leading-[24px] text-[14px] item-center  overflow-hidden ",
      }}
    >
      <div className="flex flex-col gap-5 w-full">
        <div className="flex flex-col gap-5 w-full max-h-[300px] sm:max-macair133:max-h-[350px] overflow-y-auto ipad11:gap-5">
          {!!form.getValues().questions?.length &&
            form.getValues().questions?.map((ques, index) => (
              <div
                key={index}
                className="flex flex-col gap-1 w-full text-start justify-start "
              >
                <p>{ques.name}</p>
                <div className="flex text-center items-center gap-3">
                  <TextInput
                    size="xs"
                    withAsterisk={true}
                    classNames={{
                      input:
                        "focus:border-primary text-[16px] w-20  text-center text-default ",
                    }}
                    {...form.getInputProps(`questions.${index}.score`)}
                  />
                  <p className=" text-[18px]">
                    / {assignment?.questions[index].fullScore}
                  </p>
                </div>
              </div>
            ))}
        </div>

        <div className="flex gap-2  items-end  justify-end h-fit">
          <Button
            onClick={() => {
              onClose();
              form.reset();
            }}
            loading={loading}
            variant="subtle"
          >
            Cancel
          </Button>
          <Button
            onClick={onSaveEditScore}
            loading={loading}
            disabled={isEqual(data?.questions, form.getValues().questions)}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
