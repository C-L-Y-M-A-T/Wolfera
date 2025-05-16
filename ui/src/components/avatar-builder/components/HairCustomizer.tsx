import {
  AvatarConfigKeys,
  AvatarConfigType,
  avatarFeatures,
} from "@/types/avatar-builder/avatarConfig";
import { Eye, Icon } from "lucide-react";
import ColorSelector from "./ColorSelector";
import FeatureSlider from "./FeatureSlider";
import { scissorsHairComb } from "@lucide/lab";

interface FaceCustomizerProps {
  currentOptions: Record<string, number>;
  updateOption: (key: keyof AvatarConfigType, valueIndex: number) => void;
}
export default function FaceCustomizer({
  currentOptions,
  updateOption,
}: FaceCustomizerProps) {
  return (
    <>
      <FeatureSlider
        label="Hair"
        icon={<Icon iconNode={scissorsHairComb} className="h-4 w-4 mr-2" />}
        min={1}
        max={45}
        value={currentOptions.hair + 1}
        onChange={(val) => updateOption("hair", val - 1)}
      />

      <ColorSelector
        feature={
          avatarFeatures.find((f) => f.key === AvatarConfigKeys.hairColor)!
        }
        currentOptions={currentOptions}
        updateOption={updateOption}
      />
    </>
  );
}
