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
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="80vw"
      title={`Chart - ${question?.name} (${question?.fullScore} Points)`}
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
        body: "flex flex-col gap-4 overflow-hidden max-h-full h-fit",
      }}
    >
      <div className="flex justify-end">
        <p className="text-secondary text-[16px] font-semibold">
          {question?.scores?.length} Students
        </p>
      </div>
      <ChartContainer
        type="curve"
        data={question?.assignment}
        students={question?.students}
        questionName={question?.name}
        studentScore={question?.studentScore}
      />
    </Modal>
  );
}
