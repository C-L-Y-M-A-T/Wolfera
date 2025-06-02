import { AvatarConfigType, options } from "@/types/avatar-builder/avatarConfig";
import { adventurer } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo } from "react";
interface AvatarPreviewProps {
  currentOptions: Record<keyof AvatarConfigType, number>;
  className?: string; // Optional
}
export default function AvatarPreview({
  currentOptions,
  className,
}: AvatarPreviewProps) {
  // currentOptions = initialState; //only for testing, remove later
  const svg = useMemo(() => {
    const params = Object.entries(currentOptions).reduce(
      (acc, [key, index]) => {
        const k = key as keyof AvatarConfigType;

        // DiceBear v5 expects arrays!
        acc[k] = [options[k][index]];
        return acc;
      },
      {} as Record<string, string[]>,
    );

    const avatar = createAvatar(adventurer, params);
    console.log(avatar.toDataUri());

    return avatar.toString();
  }, [currentOptions]);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      className={`w-full h-full ${className ?? ""}`}
    />
  );
}
