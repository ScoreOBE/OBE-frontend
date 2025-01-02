import { Modal, Tabs } from "@mantine/core";
import { useParams } from "react-router-dom";
import ChartContainer from "@/components/Chart/ChartContainer";
import { useAppSelector } from "@/store";
import { IModelAssignment, IModelScore } from "@/models/ModelCourse";
import { IModelUser } from "@/models/ModelUser";

type Props = {
  opened: boolean;
  onClose: () => void;
  fullScore: number;
  totalStudent: number;
  assignment: IModelAssignment;
  students?: { student: IModelUser; scores: IModelScore[] }[];
  studentScore?: number;
  isAllsec?: boolean;
  isStudent?: boolean;
};

export default function ModalQuestionChart({
  opened,
  onClose,
  fullScore,
  totalStudent,
  assignment,
  students,
  studentScore,
  isAllsec,
  isStudent,
}: Props) {
  const { name } = useParams();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="80vw"
      title={
        <div className="acerSwift:max-macair133:!text-b1">
          <p>
            Chart - {name} ({fullScore?.toFixed(2)} Points)
          </p>
          <p className="text-[#3f4474]/80 font-semibold sm:max-macair133:text-b3 text-b2 acerSwift:max-macair133:!size-b2 mt-2">
            {totalStudent} Students {isAllsec && "(All Sections)"}
          </p>
        </div>
      }
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: "flex flex-col overflow-hidden pb-2 max-h-full h-fit py-1",
        body: "flex flex-col gap-4 overflow-hidden max-h-full  h-fit",
        title: "acerSwift:max-macair133:!text-b1",
      }}
    >
      <div className="-mt-2">
        <Tabs
          classNames={{
            root: "overflow-hidden mt-1 mx-3 flex flex-col max-h-full",
          }}
          defaultValue="bellCurve"
        >
          <Tabs.List className="mb-2">
            <Tabs.Tab value="bellCurve" className="custom-tab-class">
              Distribution
            </Tabs.Tab>
            <Tabs.Tab value="histogram" className="custom-tab-class">
              Histogram
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel className="flex flex-col gap-1" value="histogram">
            {assignment ? (
              <div className="acerSwift:max-macair133:h-[470px]">
                {isStudent ? (
                  <ChartContainer
                    type="histogram"
                    data={assignment}
                    inEval={true}
                    studentScore={studentScore}
                  />
                ) : (
                  <ChartContainer
                    type="histogram"
                    data={assignment}
                    inEval={true}
                    students={students}
                  />
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">No data available</p>
            )}
          </Tabs.Panel>
          <Tabs.Panel
            className="flex flex-col justify-center items-center acerSwift:max-macair133:ml-12 mb-2"
            value="bellCurve"
          >
            {assignment ? (
              <>
                <div className="acerSwift:max-macair133:h-[61vh] w-full mt-4 !ml-20">
                  <ChartContainer
                    type="curve"
                    data={assignment}
                    inEval={true}
                    students={students}
                    studentScore={studentScore}
                  />
                </div>
                <p className="text-b6 mb-4">
                  Score distribution powered by Andrew C. Myers (Cornell
                  University)
                </p>
              </>
            ) : (
              <p className="text-center text-gray-500">No data available</p>
            )}
          </Tabs.Panel>
        </Tabs>
      </div>
    </Modal>
  );
}
