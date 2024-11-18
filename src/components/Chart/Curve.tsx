import { calStat, generateBellCurveData } from "@/helpers/functions/score";
import { IModelAssignment, IModelScore } from "@/models/ModelCourse";
import { IModelUser } from "@/models/ModelUser";
import annotationPlugin from "chartjs-plugin-annotation";
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

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  annotationPlugin
);

type Props = {
  mean: number;
  median: number;
  sd: number;
  fullScore: number;
};

export default function Curve({ mean, median, sd, fullScore }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const statLine: any[] = [
    {
      type: "line",
      label: {
        content: "mean",
        display: true,
        position: "start",
        yAdjust: 5,
        xAdjust: 0,
        // rotation: i === 0 ? 90 : 0,
        color: "#1f69f3",
        backgroundColor: "rgb(0,0,0,0)",
      font: {
        size: 14,
        fontFamily: "Manrope",
      },
      },
      value: mean,
      borderColor: "#1f69f3",
      borderDash: [5,5],
      borderWidth: 2,
      scaleID: "x",
    },
    {
      type: "line",
      label: {
        content: "median",
        display: true,
        position: "start",
        yAdjust: 30,
        xAdjust: 0,
        // rotation: i === 0 ? 90 : 0,
        color: "red",
        backgroundColor: "rgb(0,0,0,0)",
      },
      value: median,
      borderColor: "red",
      borderDash: [5,5],
      borderWidth: 2,
      scaleID: "x",
      font: {
        size: 14,
        fontFamily: "Manrope",
      },
    },
  ];

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      if (ctx) {
        const bellCurveData = generateBellCurveData(mean, sd, fullScore);
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
              annotation: {
                clip: false,
                annotations: statLine,
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
            elements: {
              point: {
                radius: 0,
              },
              line: {
                borderWidth: 1,
              },
            },
            events: [],
          },
        });
      }
    }
  }, [mean, sd]);

  return <canvas ref={chartRef} id="myChart"></canvas>;
}
