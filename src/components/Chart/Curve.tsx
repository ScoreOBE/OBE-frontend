import { generateBellCurveData, getStepSize } from "@/helpers/functions/score";
import annotationPlugin from "chartjs-plugin-annotation";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
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
  scores: number[];
  mean: number;
  median: number;
  sd: number;
  fullScore: number;
  studentScore?: number;
};

export default function Curve({
  scores,
  mean,
  median,
  sd,
  fullScore,
  studentScore,
}: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const statLine: any[] = [
    {
      type: "line",
      scaleID: "x",
      value: mean,
      borderColor: "#1f69f3",
      borderDash: [5, 5],
      borderWidth: 2,
      label: {
        content: "mean",
        display: true,
        position: "start",
        yAdjust: 10,
        xAdjust: 0,
        color: "#1f69f3",
        backgroundColor: "rgb(0,0,0,0)",
        font: {
          size: 14,
          fontFamily: "Manrope",
        },
      },
    },
    {
      type: "line",
      scaleID: "x",
      value: median,
      borderColor: "red",
      borderDash: [5, 5],
      borderWidth: 2,
      label: {
        content: "median",
        display: true,
        position: "start",
        yAdjust: 30,
        xAdjust: 0,
        color: "red",
        backgroundColor: "rgb(0,0,0,0)",
      },
      font: {
        size: 14,
        fontFamily: "Manrope",
      },
    },
  ];

  if (studentScore != undefined) {
    statLine.push({
      type: "line",
      scaleID: "x",
      value: studentScore,
      borderColor: "#32a83a",
      borderDash: [5, 5],
      borderWidth: 2,
      label: {
        content: "Your Score",
        display: true,
        position: "start",
        yAdjust: -10,
        xAdjust: 0,
        color: "#32a83a",
        backgroundColor: "rgb(0,0,0,0)",
        font: {
          size: 14,
          fontFamily: "Manrope",
        },
      },
    });
  }

  useEffect(() => {
    const resizeChart = () => {
      chartInstanceRef.current?.resize();
    };

    window.addEventListener("resize", resizeChart);
    return () => window.removeEventListener("resize", resizeChart);
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      if (ctx) {
        const bellCurveData = generateBellCurveData(
          scores,
          mean,
          sd,
          fullScore
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
            // animation: false,
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
                  stepSize: getStepSize(fullScore),
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
  }, [mean, median, sd, fullScore]);

  return <canvas ref={chartRef} id="myChart"></canvas>;
}
