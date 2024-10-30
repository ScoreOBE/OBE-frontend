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
const chartData = Array.from({ length: 10 }, (_, index) => ({
  month: `${index + 1} - ${index + 2}`,
  Students: 450 * (index + 1),
}));

export default function HistogramChart(data: Props) {
  return (
    <>
      <div className="flex flex-col border-b-2 border-nodata py-2 items-start gap-5 text-start mx-5">
        <div className="text-secondary text-[28px]  text-start justify-start font-semibold">
          <p className="text-[#3f4474] text-[18px]">{data.data.name}</p>
          <p>
            {data.data.weight?.toFixed(2)}{" "}
            <span className="text-[18px]">pts</span>
          </p>
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
      <div className="h-full w-full pl-3 pr-5">
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
              color: "#E0DEFF",
            },
          ]}
          barChartProps={{
            barGap: 0,
            stackOffset: "none",
            barCategoryGap: 0,
          }}
          barProps={{
            stroke: "#696CA3",
            strokeWidth: 1,
            radius: 2,
            strokeOpacity: 1,
          }}
          tooltipProps={{
            content: ({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].value;
                return (
                  // <div className="bg-gray-900 text-white p-4 rounded-xl shadow-lg min-w-[160px]">
                  //   <p className="text-sm font-semibold mb-2">Score: {label}</p>
                  //   <div className="flex gap-1 items-center justify-between mb-1">
                  //     <span className="text-[#AAB1B4]">Students: </span>
                  //     <span className="font-bold">{data}</span>
                  //   </div>
                  // </div>

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
