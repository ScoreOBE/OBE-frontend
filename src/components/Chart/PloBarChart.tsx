import { BarChart } from "@mantine/charts";

type Props = {
  data: object[];
  height: any;
  courseCard?: boolean;
};

export default function PloBarChart({
  data,
  height,
  courseCard = false,
}: Props) {
  return (
    <BarChart
      h={height}
      data={data}
      dataKey="name"
      orientation="vertical"
      yAxisProps={{ width: 80 }}
      xAxisLabel="Score"
      series={[{ name: "score", color: "rgba(31, 105, 243, 0.25)" }]}
      style={{
        "--chart-cursor-fill": "#EAEBEB",
      }}
      className="w-full "
      barLabelColor={"red"}
      barChartProps={{
        barGap: 0,
        stackOffset: "none",
        barCategoryGap: 2,
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
            const { score, descTH, descEN, notMap } = payload[0].payload;
            return (
              <div
                className={`bg-gray-900 text-white p-4 rounded-xl shadow-lg max-w-[460px] ${
                  courseCard && "-translate-x-14"
                }`}
              >
                <div className="flex flex-col mb-2">
                  <p className="text-sm font-semibold text-white">
                    {label}
                    <span className="text-b2 ml-1">
                      ( Score:{" "}
                      <span className="font-bold ">
                        {notMap ? "Not mapped" : score}
                      </span>{" "}
                      )
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-0 items-start justify-between pt-2 border-t-[1px] border-[#747575]">
                  <div className="flex flex-col gap-1 text-b3">
                    <div className="flex flex-row ">
                      <li></li>
                      <p>{descTH}</p>
                    </div>
                    <div className="flex flex-row ">
                      <li></li>
                      <p>{descEN}</p>
                    </div>
                  </div>
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
