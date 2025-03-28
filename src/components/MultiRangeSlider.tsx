import { useState } from "react";

interface MultiRangeSliderProps {
  min: number;
  max: number;
  step: number;
  defaultValues: number[];
  onChange?: (values: number[]) => void;
}

export default function MultiRangeSlider({
  min,
  max,
  step,
  defaultValues,
  onChange,
}: MultiRangeSliderProps) {
  const [values, setValues] = useState<number[]>([...defaultValues, max]);

  const handleChange = (index: number, newValue: number) => {
    const newValues = [...values];
    newValue = Math.max(min, Math.min(newValue, max));

    if (index > 0 && newValue <= newValues[index - 1]) {
      newValue = newValues[index - 1] + step;
    }
    if (index < newValues.length - 1 && newValue >= newValues[index + 1]) {
      newValue = newValues[index + 1] - step;
    }

    newValues[index] = newValue;
    setValues(newValues);
    if (onChange) {
      onChange(newValues);
    }
  };

  const handlePointerDown = (index: number, sliderRect: DOMRect) => {
    const handlePointerMove = (eventClientX: number) => {
      let newPercentage =
        ((eventClientX - sliderRect.left) / sliderRect.width) * (max - min) +
        min;
      newPercentage = Math.max(min, Math.min(newPercentage, max));
      handleChange(index, Math.round(newPercentage / step) * step);
    };

    const handleMouseMove = (event: MouseEvent) => {
      handlePointerMove(event.clientX);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        handlePointerMove(event.touches[0].clientX);
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handlePointerUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handlePointerUp);
  };

  const colors = ["#FF5E57", "#FFA502", "#FFE81D", "#2ED573", "#1E90FF"];
  
  const generateColorRanges = () => {
    const stops = [min, ...values, max];
    const colorRanges = [];

    for (let i = 0; i < stops.length - 1; i++) {
      const startPercent = ((stops[i] - min) / (max - min)) * 100;
      const endPercent = ((stops[i + 1] - min) / (max - min)) * 100;
      colorRanges.push(
        `${colors[i % colors.length]} ${startPercent}%, ${
          colors[i % colors.length]
        } ${endPercent}%`
      );
    }

    return colorRanges.join(", ");
  };

  return (
    <div className="relative w-full p-5 px-16">
      <div
        className={`relative rounded-lg mt-12 h-3 border border-noData`}
        style={{
          background: `linear-gradient(to right, ${generateColorRanges()})`,
        }}
      >
        {values.map((value, index) => (
          <div key={index}>
            <div
              className={`absolute items-center -translate-y-8 w-[120px] flex flex-col select-none text-default text-b4 rounded-full -top-5 -translate-x-1/2`}
              style={{
                left: `${((value - min) / (max - min)) * 100}%`,
              }}
            >
              <p
                className={`font-bold ${
                  index === 0
                    ? "text-[#FF5E57]"
                    : index === 1
                    ? "text-[#e8a934]"
                    : index === 2
                    ? "text-[#90851f]"
                    : index === 3
                    ? "text-[#21a457]"
                    : "text-[#1E90FF]"
                }`}
              >
                Score {index}
              </p>

              <p>
                Range:{" "}
                {index === 0
                  ? `${min} - ${value.toFixed(2)}`
                  : `${values[index - 1].toFixed(2)} - ${value.toFixed(2)}`}
              </p>
            </div>
            <div
              className={`absolute size-4 border-2 rounded-full -top-1 -translate-x-1/2 bg-white ${
                index != 4 && "cursor-pointer"
              }`}
              style={{
                left: `${((value - min) / (max - min)) * 100}%`,
                borderColor: colors[index],
              }}
              onMouseDown={(e) => {
                if (index === 4) return;
                const sliderRect =
                  e.currentTarget.parentElement!.getBoundingClientRect();
                handlePointerDown(index, sliderRect);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                if (index === 4) return;
                const sliderRect =
                  e.currentTarget.parentElement!.getBoundingClientRect();
                handlePointerDown(index, sliderRect);
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
