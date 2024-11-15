import { calStat, generateBellCurveData } from "@/helpers/functions/score";
import { IModelAssignment, IModelScore } from "@/models/ModelCourse";
import { IModelUser } from "@/models/ModelUser";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
} from "chart.js";
import { useEffect, useRef } from "react";
import { CategoryScale } from "chart.js";
import "chart.js/auto";
Chart.register(CategoryScale);

Chart.register(LineController, LineElement, PointElement, LinearScale, Title);

type Props = {
  data: Partial<IModelAssignment>;
  students: { student: IModelUser; scores: IModelScore[] }[];
  isQuestions: boolean;
};

export default function Curve({ data, students, isQuestions }: Props) {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
  const fullScore =
    data.questions?.reduce((a, { fullScore }) => a + fullScore, 0) || 0;
  const scores = students
    .map(({ scores }) =>
      scores
        .find(({ assignmentName }) => assignmentName === data.name)
        ?.questions?.reduce((sum, { score }) => sum + score, 0)
    )
    .filter((item): item is number => item !== undefined)
    .sort((a, b) => a - b);

  const totalStudent = students.length;
  const { mean, sd, median, maxScore, minScore, q1, q3 } = calStat(
    scores,
    totalStudent
  );

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      if (ctx) {
        const bellCurveData = generateBellCurveData(
          scores,
          fullScore,
          totalStudent
        );
        chartInstanceRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: bellCurveData.map((point) => point.x.toFixed(2)),
            datasets: [
              {
                data: bellCurveData.map((point) => point.y),
                borderColor: "rgba(31, 105, 243, 1)",
                backgroundColor: "rgba(31, 105, 243, 0.1)",
                borderWidth: 2,
                fill: true,
                pointRadius: 0,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Score",
                },
                type: "linear",
                min: 0,
                max: fullScore,
                ticks: {
                  stepSize: 1,
                  autoSkip: false,
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Density",
                },
              },
            },
          },
        });
      }
    }
  }, [mean, sd, minScore, maxScore]);

  return (
    <>
      {!isQuestions && (
        <div className="flex flex-col border-b-2 border-nodata py-2 items-start gap-5 text-start mx-5">
        <div className="flex flex-row text-secondary text-[20px] w-full justify-between font-semibold">
          <div className="flex justify-between !w-full items-center mb-1">
            <div className="flex flex-col">
              <p className="text-[#3f4474]  text-[16px]">{data.name}</p>
              <p >
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
            <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">{mean?.toFixed(2)}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-[16px] text-[#777777]">SD</p>
            <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">{sd?.toFixed(2)}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-[16px] text-[#777777]">Median</p>
            <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">{median?.toFixed(2)}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-[16px] text-[#777777]">Max</p>
            <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">{maxScore?.toFixed(2)}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-[16px] text-[#777777]">Min</p>
            <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">{minScore?.toFixed(2)}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-[16px] text-[#777777]">Q3</p>
            <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">{q3?.toFixed(2)}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-[16px] text-[#777777]">Q1</p>
            <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">{q1?.toFixed(2)}</p>
          </div>
        </div>
      </div>
      )}
      <div
        className={`h-full bg w-full ${
          isQuestions ? "px-20 pb-6" : "pl-3 pr-5"
        }`}
      >
        <canvas ref={chartRef} id="myChart"></canvas>
      </div>
    </>
  );
}
