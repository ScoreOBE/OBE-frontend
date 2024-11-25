import { Modal } from "@mantine/core";
import ChartContainer from "../Chart/ChartContainer";
import { IModelStudentAssignment } from "@/models/ModelEnrollCourse";
import { IModelScore } from "@/models/ModelCourse";
import { IModelUser } from "@/models/ModelUser";

type Props = {
  opened: boolean;
  onClose: () => void;
  question: {
    name: string;
    fullScore: number;
    students?: {
      student: IModelUser;
      scores: IModelScore[];
    }[];
    scores?: number[];
    assignment: IModelStudentAssignment;
    studentScore: number;
  };
};

export default function ModalQuestionChart({
  opened,
  onClose,
  question,
}: Props) {
  return (
    <Modal opened={opened} onClose={onClose} centered>
      <div className="flex justify-between px-20 pb-6 pt-0">
        <p className="text-secondary text-[16px] font-semibold">
          {question?.name} - {question?.fullScore} Points
        </p>
        <p className="text-secondary text-[16px] font-semibold">
          {question?.scores?.length} Students
        </p>
      </div>
      <ChartContainer
        type="curve"
        data={question?.assignment}
        students={question.students}
        questionName={question?.name}
        studentScore={question?.studentScore}
      />
    </Modal>
  );
}
