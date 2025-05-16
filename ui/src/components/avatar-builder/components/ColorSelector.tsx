import { Button } from "@/components/ui/button";
import {
  AvatarConfigKeys,
  AvatarConfigType,
  AvatarFeature,
  colorOptions,
  options,
} from "@/types/avatar-builder/avatarConfig";
import { Palette } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

interface ColorSelectorProps {
  feature: AvatarFeature;
  currentOptions: Record<string, number>;
  updateOption: (key: keyof AvatarConfigType, valueIndex: number) => void;
}

const getColorLabel = (featureKey: AvatarConfigKeys, value: string): string => {
  const colorCategory =
    featureKey === AvatarConfigKeys.skinColor
      ? "skin"
      : featureKey === AvatarConfigKeys.backgroundColor
        ? "background"
        : featureKey === AvatarConfigKeys.hairColor
          ? "hair"
          : null;

  const colorList = colorCategory ? colorOptions[colorCategory] : [];
  const match = colorList.find((c) => c.value === value);
  return match?.label ?? value;
};

export default function ColorSelector({
  feature,
  currentOptions,
  updateOption,
}: ColorSelectorProps) {
  const featureKey = feature.key;
  const selectedValue = options[featureKey][currentOptions[featureKey]];

  const colorCategory =
    featureKey === AvatarConfigKeys.skinColor
      ? "skin"
      : featureKey === AvatarConfigKeys.backgroundColor
        ? "background"
        : featureKey === AvatarConfigKeys.hairColor
          ? "hair"
          : null;

  const availableColors = colorCategory ? colorOptions[colorCategory] : [];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{feature.label}</label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between border-gray-700 bg-gray-800 hover:bg-gray-700"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full border border-gray-600"
                style={{
                  backgroundColor: `#${selectedValue}`,
                }}
              />
              <span>{getColorLabel(featureKey, selectedValue as string)}</span>
            </div>
            <Palette className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-4 bg-gray-800 border-gray-700">
          <div className="grid grid-cols-2 gap-2 max-h-[500px]">
            {availableColors.map((color) => {
              const isSelected = selectedValue === color.value;

              return (
                <Button
                  key={color.value}
                  variant="outline"
                  className={`relative flex items-center gap-2 justify-start transition-all ${
                    isSelected
                      ? "ring-2 ring-red-500 border border-transparent"
                      : "border border-gray-700 hover:bg-gray-700"
                  }`}
                  onClick={() =>
                    updateOption(
                      featureKey,
                      (options[featureKey] as string[]).findIndex(
                        (v) => v === color.value,
                      ),
                    )
                  }
                >
                  <div
                    className="w-5 h-5 rounded-full border border-gray-600"
                    style={{ backgroundColor: `#${color.value}` }}
                  />
                  <span>{color.label}</span>
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
