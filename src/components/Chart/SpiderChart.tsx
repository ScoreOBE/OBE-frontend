import { RadarChart } from "@mantine/charts";
import { Radar, Tooltip, Legend } from "recharts";

type Props = {
  data: object[];
  height: any;
};

export default function SpiderChart({ data, height }: Props) {
  return (
    <RadarChart
      h={height}
      data={data}
      dataKey="name"
      series={[
        {
          name: "score",
          color: "#6EB4F1",
          strokeColor: "#6EB4F1",
        },
      ]}
      gridColor="#C5C5DA"
      withPolarAngleAxis
      withPolarRadiusAxis
      withLegend
      legendProps={{
        align: "center",
        content: ({ payload }: any) => (
          <ul className="flex justify-center gap-4 mt-4">
            {payload.map((entry: any, index: number) => (
              <li
                key={index}
                className="flex items-center gap-2 text-default text-sm font-medium  -mt-4"
              >
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></span>
                Score
              </li>
            ))}
          </ul>
        ),
      }}
      polarAngleAxisProps={{
        className: "text-b3 font-medium ",
        style: { height: 10 },
        dy: 3,
      }}
      polarRadiusAxisProps={{
        angle: 90,
        className: "text-b4 font-medium ",
        style: { fill: "#A1A1B2" },
        dx: -12,
        dy: 18,
      }}
      className="w-full"
    >
      <Tooltip
        content={({ active, payload, label }) => {
          if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
              <div className="bg-gray-900 text-white p-4 py-4 rounded-xl shadow-lg min-w-[150px]">
                <p className="text-sm font-semibold mb-3">{label}</p>
                <div className="flex justify-between gap-0 items-start pt-2 border-t-[1px] border-[#747575]">
                  <div className="flex flex-col items-center w-full py-1">
                    <span className="font-bold text-[22px]">{data.score}</span>
                    <span className="text-white text-b3 font-medium">
                      {data.score == "-"
                        ? "-"
                        : data.score < 1
                        ? "Poor"
                        : data.score < 2
                        ? "Fair"
                        : data.score < 3
                        ? "Good"
                        : data.score < 4
                        ? "Very Good"
                        : "Excellent"}
                    </span>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        }}
      />
    </RadarChart>
  );
}
