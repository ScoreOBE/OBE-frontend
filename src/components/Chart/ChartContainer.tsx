import { calStat } from "@/helpers/functions/score";
import { IModelAssignment, IModelScore } from "@/models/ModelCourse";
import { IModelUser } from "@/models/ModelUser";
import Curve from "./Curve";
import HistogramChart from "./HistogramChart";

type Props = {
  data: Partial<IModelAssignment>;
  students: { student: IModelUser; scores: IModelScore[] }[];
  questionName?: string;
  type: "histogram" | "curve";
};

export default function ChartContainer({
  data,
  students,
  questionName,
  type,
}: Props) {
  const fullScore =
    (questionName
      ? data.questions?.find(({ name }) => name == questionName)?.fullScore
      : data.questions?.reduce((a, { fullScore }) => a + fullScore, 0)) || 0;

  const getScores = (studentScores: IModelScore[]) => {
    const assignment = studentScores.find(
      ({ assignmentName }) => assignmentName === data.name
    );
    if (!assignment) return undefined;
    if (questionName) {
      return assignment.questions?.find(({ name }) => name === questionName)
        ?.score;
    }
    return assignment.questions?.reduce((sum, { score }) => sum + score, 0);
  };

  const scores = students
    .map(({ scores }) => getScores(scores))
    .filter((score) => score !== undefined)
    .sort((a, b) => a - b);

  const totalStudent = students.filter(({ scores }) => {
    const assignment = scores.find(
      ({ assignmentName }) => assignmentName === data.name
    );
    return (
      assignment &&
      (questionName
        ? assignment.questions.some(({ name }) => name === questionName)
        : true)
    );
  }).length;

  const { mean, sd, median, maxScore, minScore, q1, q3 } = calStat(
    scores,
    totalStudent
  );
  const k = Math.log2(totalStudent) + 1;
  const binWidth = (maxScore - minScore) / k;
  const scoresData = Array.from({ length: k }, (_, index) => {
    const start = minScore + index * binWidth;
    const end = start + binWidth;
    return {
      range: `${start.toFixed(2)} - ${end.toFixed(2)}`,
      start,
      end,
      Students: 0,
    };
  });
  scores.forEach((score) => {
    const binIndex = scoresData.findIndex(
      (item) => item.start <= score && item.end >= score
    );
    if (binIndex !== -1) {
      scoresData[binIndex].Students += 1;
    }
  });

  return (
    <>
      {!questionName && (
        <div className="flex flex-col border-b-2 border-nodata py-2 items-start gap-5 text-start mx-5">
          <div className="flex flex-row text-secondary text-[20px] w-full justify-between font-semibold">
            <div className="flex justify-between !w-full items-center mb-1">
              <div className="flex flex-col">
                <p className="text-[#3f4474]  text-[16px]">{data.name}</p>
                <p>
                  {fullScore?.toFixed(2)}{" "}
                  <span className="text-[16px]">pts.</span>
                </p>
              </div>
              <p className="text-[#3f4474] mb-1 sm:max-macair133:text-[14px] text-[16px]">
                {totalStudent} Students
              </p>
            </div>
          </div>

          <div className="flex  flex-row justify-between w-full">
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Mean</p>
              <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                {mean?.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">SD</p>
              <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                {sd?.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Median</p>
              <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                {median?.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Max</p>
              <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                {maxScore?.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Min</p>
              <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                {minScore?.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Q3</p>
              <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                {q3?.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Q1</p>
              <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                {q1?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
      <div
        className={`h-full w-full  ${
          questionName ? "px-20 pb-6" : "pl-3 pr-5"
        }`}
      >
        {type == "histogram" ? (
          <HistogramChart scoresData={scoresData} />
        ) : (
          <Curve mean={mean} sd={sd} fullScore={fullScore} />
        )}
      </div>
    </>
  );
}
