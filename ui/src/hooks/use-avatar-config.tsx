"use client";

import { useState, useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";

import { options } from "@/config/avatar-options";
import {
  AvatarConfigKeys,
  AvatarConfigType,
} from "@/types/avatar/avatarConfig";

export const useAvatarConfig = () => {
  // Create initial state with all options set to 0
  const initialState = Object.fromEntries(
    Object.keys(options).map((key) => [key, 0]),
  ) as Record<keyof AvatarConfigType, number>;

  const [avatarConfig, setAvatarConfig] =
    useState<Record<keyof AvatarConfigType, number>>(initialState);

  // Toggle features on/off
  const toggleFeature = (key: AvatarConfigKeys) => {
    setAvatarConfig((prev) => ({
      ...prev,
      [key]: prev[key] === 0 ? 1 : 0,
    }));
  };

  const changeOption = (key: AvatarConfigKeys, direction: number) => {
    const length = options[key].length;
    const index = avatarConfig[key];
    const newIndex = (index + direction + length) % length;
    setAvatarConfig({ ...avatarConfig, [key]: newIndex });
  };

  const setSpecificOption = (key: AvatarConfigKeys, index: number) => {
    setAvatarConfig({ ...avatarConfig, [key]: index });
  };

  const randomizeAvatar = () => {
    const randomConfig = Object.fromEntries(
      Object.keys(options).map((key) => {
        const k = key as keyof AvatarConfigType;
        const randomIndex = Math.floor(Math.random() * options[k].length);
        return [key, randomIndex];
      }),
    ) as Record<keyof AvatarConfigType, number>;

    setAvatarConfig(randomConfig);
  };

  // Generate avatar SVG using DiceBear
  const svgString = useMemo(() => {
    const params = Object.entries(avatarConfig).reduce(
      (acc, [key, index]) => {
        const k = key as keyof AvatarConfigType;

        // Handle probability toggles - if off (0), don't include the feature
        if (k === "glassesProbability" && index === 0) {
          return acc;
        }
        if (k === "featuresProbability" && index === 0) {
          return acc;
        }
        if (k === "earringsProbability" && index === 0) {
          return acc;
        }

        // DiceBear v5 expects arrays!
        acc[k] = [options[k][index]];
        return acc;
      },
      {} as Record<string, string[]>,
    );

    const avatar = createAvatar(adventurer, params);
    return avatar.toString();
  }, [avatarConfig]);

  return {
    avatarConfig,
    setAvatarConfig,
    toggleFeature,
    changeOption,
    setSpecificOption,
    randomizeAvatar,
    svgString,
  };
};
