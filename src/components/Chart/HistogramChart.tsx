import { BarChart } from "@mantine/charts";

type Props = {
  scoresData: {
    range: string;
    start: number;
    end: number;
    Students: number;
  }[];
};

export default function HistogramChart({ scoresData }: Props) {
  return (
    <BarChart
      className="mt-4"
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
  );
}
