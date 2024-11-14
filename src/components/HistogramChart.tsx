import { calStat } from "@/helpers/functions/score";
import { IModelAssignment, IModelScore } from "@/models/ModelCourse";
import { IModelUser } from "@/models/ModelUser";
import { BarChart } from "@mantine/charts";

type Props = {
  data: Partial<IModelAssignment>;
  students: { student: IModelUser; scores: IModelScore[] }[];
  isQuestions: boolean;
};

export default function HistogramChart({ data, students, isQuestions }: Props) {
  const fullScore =
    data.questions?.reduce((a, { fullScore }) => a + fullScore, 0) || 0;
  const scores = students
    .map(({ scores }) =>
      scores
        .find(({ assignmentName }) => assignmentName == data.name)
        ?.questions?.reduce((sum, { score }) => sum + score, 0)
    )
    .filter((item) => item != undefined)
    .sort((a, b) => a - b) || [0];
  const totalStudent = students.length;
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
      {!isQuestions && (
        <div className="flex flex-col border-b-2 border-nodata py-2 items-start gap-6 text-start mx-5">
          <div className="flex flex-row text-secondary text-[20px] w-full justify-between font-semibold">
            <div className="flex justify-between !w-full items-center mb-1">
              <div className="flex flex-col">
                <p className="text-[#3f4474] mb-1 text-[16px]">{data.name}</p>
                <p>
                  {fullScore?.toFixed(2)}{" "}
                  <span className="text-[16px]">pts.</span>
                </p>
              </div>
              <p className="text-[#3f4474] mb-1 text-[16px]">
                {totalStudent} Students
              </p>
            </div>
          </div>

          <div className="flex px-8 flex-row justify-between w-full">
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Mean</p>
              <p className="font-bold text-[28px] text-default">{mean}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">SD</p>
              <p className="font-bold text-[28px] text-default">{sd}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Median</p>
              <p className="font-bold text-[28px] text-default">{median}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Max</p>
              <p className="font-bold text-[28px] text-default">{maxScore}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Min</p>
              <p className="font-bold text-[28px] text-default">{minScore}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Q3</p>
              <p className="font-bold text-[28px] text-default">{q3}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Q1</p>
              <p className="font-bold text-[28px] text-default">{q1}</p>
            </div>
          </div>
        </div>
      )}
      <div
        className={`h-full w-full  ${isQuestions ? "px-20 pb-6" : "pl-3 pr-5"}`}
      >
        <BarChart
          style={{
            "--chart-cursor-fill": "#EAEBEB",
          }}
          h={420}
          tickLine="x"
          xAxisLabel="Score"
          yAxisLabel="Number of Students"
          data={scoresData}
          dataKey="range"
          series={[
            {
              name: "Students",
              color: "rgba(31, 105, 243, 0.25)",
            },
          ]}
          barChartProps={{
            barGap: 0,
            stackOffset: "none",
            barCategoryGap: 0,
          }}
          barProps={{
            stroke: "#9A9AE3",
            strokeWidth: 1,
            radius: 2,
            strokeOpacity: 1,
          }}
          tooltipProps={{
            content: ({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].value;
                return (
                  <div className="bg-gray-900 text-white p-4 rounded-xl shadow-lg min-w-[180px]">
                    <p className="text-sm font-semibold mb-2">Score: {label}</p>
                    <div className="flex flex-col gap-0 items-start justify-between pt-2 border-t-[1px] border-[#747575]">
                      <span className=" text-[#AAB1B4] text-[14px]">
                        Number of Students
                      </span>
                      <span className="font-bold text-[22px]">{data}</span>
                    </div>
                  </div>
                );
              }
              return null;
            },
          }}
        />
      </div>
    </>
  );
}
