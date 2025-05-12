import { Slider } from "@/components/ui/slider";
import React from "react";

interface FeatureSliderProps {
  label: string;
  icon: React.ReactNode;
  min: number;
  max: number;
  value: number;
  onChange: (newValue: number) => void;
}

export default function FeatureSlider({
  label,
  icon,
  min,
  max,
  value,
  onChange,
}: FeatureSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm font-medium">
          {icon}
          {label}
        </label>
        <span className="text-xs text-gray-400">{value}</span>
      </div>
      <div className="px-2">
        <Slider
          min={min}
          max={max}
          step={1}
          value={[value]}
          onValueChange={(val) => onChange(val[0])}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
