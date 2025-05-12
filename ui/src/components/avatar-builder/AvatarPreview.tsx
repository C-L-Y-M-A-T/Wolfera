import { AvatarConfigType, options } from "@/types/avatarConfig";
import { adventurer } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { motion } from "framer-motion";
import { useMemo } from "react";
interface AvatarPreviewProps {
  currentOptions: Record<string, number>;
}
export default function AvatarPreview({ currentOptions }: AvatarPreviewProps) {
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
    <motion.div
      className="w-64 h-64 rounded-full overflow-hidden bg-gray-800 border-4 border-red-500 shadow-lg mb-6 relative"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", damping: 10, stiffness: 300 }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: svg }}
        className="w-full h-full"
      />
    </motion.div>
  );
}
