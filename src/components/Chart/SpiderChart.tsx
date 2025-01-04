import { RadarChart } from "@mantine/charts";

type Props = {
  data: object[];
  height: any;
};

export default function SpiderChart({ data, height }: Props) {
  return (
    <RadarChart
      h={height}
      data={data}
      dataKey="product"
      series={[
        {
          name: "ผลการประเมินเฉลี่ยรวม",
          color: "#6EB4F1",
          strokeColor: "#6EB4F1",
        },
      ]}
      gridColor="#C5C5DA"
      withPolarAngleAxis
      withPolarRadiusAxis
      legendProps={{ align: "center" }}
      polarAngleAxisProps={{
        className: "text-b3 font-medium ",
        style: {
          height: 10,
        },
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
    />
  );
}
