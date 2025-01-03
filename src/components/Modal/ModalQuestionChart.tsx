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
      title={
        <div>
          <p>
            Chart - {question?.name} ({question?.fullScore?.toFixed(2)} Points)
          </p>

          <p className="text-[#3f4474]/80 font-semibold sm:max-macair133:text-b2 text-b2 acerSwift:max-macair133:!size-b2 mt-2">
            {question?.studentScore
              ? `Your Score: ${question?.studentScore}`
              : `${question?.scores?.filter((e) => e >= 0).length} Students`}
          </p>
        </div>
      }
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit",
        body: "flex flex-col items-center gap-4 overflow-hidden max-h-full h-fit",
        title: "acerSwift:max-macair133:!text-b1",
      }}
    >
      {/* <div className="flex justify-end">
        <p className="text-secondary text-b1 acerSwift:max-macair133:text-b2 font-semibold">
          {question?.scores?.filter((e) => e >= 0).length} Students
        </p>
      </div> */}

      <ChartContainer
        type="curve"
        data={question?.assignment}
        students={question?.students}
        questionName={question?.name}
        studentScore={question?.studentScore}
      />

      <p className=" text-b6 translate-x-6 -mt-1">
        Score distribution powered by Andrew C. Myers (Cornell University)
      </p>
    </Modal>
  );
}
