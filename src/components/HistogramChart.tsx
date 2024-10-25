import Icon from "./Icon";
import { useState } from "react";

import { IModelAssignment } from "@/models/ModelSection";
import { BarChart } from "@mantine/charts";
import { mock } from "node:test";
import { color } from "framer-motion";

type Props = {
  data: Partial<IModelAssignment>;
  isQuestions: boolean;
};

// Mock data for demonstration
const chartData = [
  { month: "1", Students: 450 },
  { month: "2", Students: 480 },
  { month: "3", Students: 500 },
  { month: "4", Students: 520 },
  { month: "5", Students: 490 },
  { month: "6", Students: 470 },
  { month: "7", Students: 450 },
  { month: "8", Students: 480 },
  { month: "9", Students: 500 },
  { month: "10", Students: 520 },
  { month: "11", Students: 490 },
  { month: "12", Students: 470 },
  { month: "13", Students: 450 },
  { month: "14", Students: 480 },
  { month: "16", Students: 500 },
  { month: "17", Students: 520 },
  { month: "18", Students: 490 },
  { month: "19", Students: 470 },
];

export default function HistogramChart(data: Props) {
  return (
    <>
      <div className="flex flex-col border-b-2 border-nodata py-2 items-start gap-5 text-start mx-5">
        <p className="text-secondary text-[18px] text-start justify-start font-semibold">
          {data.data.name} - {data.data.weight?.toFixed(2)}
          <span className="text-[#5768d5] text-[18px]"> pts</span>
        </p>

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
      <div className="h-full w-full pl-3 pr-5 ">
        <BarChart
          style={{
            "--chart-cursor-fill": "#E6EAFF",
            "--chart-grid-color": "",
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
            },
          ]}
          legendProps={{ verticalAlign: "bottom" }}
          barChartProps={{
            barGap: 0,
            stackOffset: "none",
            barCategoryGap: 0,
          }}
          classNames={{
            axisLabel: "font-medium text-[12px] border-[#000000]",
            bar: "border border-[#000000]", // Tailwind classes for bar styles
            tooltipBody: "bg-[#E6EAFF] border-[#000000] p-3 rounded-8",
            tooltipItemData: "",
            tooltipItem: "",
            axis: "bg-red-500 hover:bg-red-500",
            grid: "!pl-10 !bg-red-500",
          }}
        />
      </div>
    </>
  );
}
