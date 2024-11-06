import { IModelAssignment } from "@/models/ModelSection";
import { BarChart } from "@mantine/charts";

type Props = {
  data: Partial<IModelAssignment>;
  isQuestions: boolean;
};

export default function HistogramChart({ data, isQuestions }: Props) {
  // Mock data for demonstration
  const chartData = Array.from({ length: 10 }, (_, index) => ({
    month: `${index + 1} - ${index + 2}`,
    Students: 5 * (index + 1),
  }));
  return (
    <>
      {!isQuestions && (
        <div className="flex flex-col border-b-2 border-nodata py-2 items-start gap-6 text-start mx-5">
          <div className="flex flex-row text-secondary text-[20px] w-full justify-between font-semibold">
            <div className="flex justify-between !w-full items-center mb-1">
              <div className="flex flex-col">
                <p className="text-[#3f4474] mb-1 text-[16px]">{data.name}</p>
                <p>
                  {data.weight?.toFixed(2)}{" "}
                  <span className="text-[16px]">pts.</span>
                </p>
              </div>
              <p className="text-[#3f4474] mb-1 text-[16px]">{120} Students</p>
            </div>
          </div>

          <div className="flex px-8 flex-row justify-between w-full">
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Mean</p>
              <p className="font-bold text-[28px] text-default">2.0</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">SD</p>
              <p className="font-bold text-[28px] text-default">2.15</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Median</p>
              <p className="font-bold text-[28px] text-default">1.5</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Max</p>
              <p className="font-bold text-[28px] text-default">4.5</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Min</p>
              <p className="font-bold text-[28px] text-default">0</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Q3</p>
              <p className="font-bold text-[28px] text-default">3.75</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[16px] text-[#777777]">Q1</p>
              <p className="font-bold text-[28px] text-default">1.75</p>
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
          data={chartData}
          dataKey="month"
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
