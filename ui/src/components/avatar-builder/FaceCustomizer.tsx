import {
  AvatarConfigKeys,
  AvatarConfigType,
  avatarFeatures,
} from "@/types/avatarConfig";
import { Eye, Smile } from "lucide-react";
import ColorSelector from "./ColorSelector";
import FeatureSlider from "./FeatureSlider";

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
        label="Eyes"
        icon={<Eye className="h-4 w-4 mr-2" />}
        min={1}
        max={26}
        value={currentOptions.eyes + 1}
        onChange={(val) => updateOption("eyes", val - 1)}
      />
      <FeatureSlider
        label="Mouth"
        icon={<Smile className="h-4 w-4 mr-2" />}
        min={1}
        max={30}
        value={currentOptions.mouth + 1}
        onChange={(val) => updateOption("mouth", val - 1)}
      />

      <FeatureSlider
        label="Eyebrows"
        icon={<Eye className="h-4 w-4 mr-2" />}
        min={1}
        max={15}
        value={currentOptions.eyebrows + 1}
        onChange={(val) => updateOption("eyebrows", val - 1)}
      />

      <ColorSelector
        feature={
          avatarFeatures.find((f) => f.key === AvatarConfigKeys.skinColor)!
        }
        currentOptions={currentOptions}
        updateOption={updateOption}
      />
    </>
  );
}
