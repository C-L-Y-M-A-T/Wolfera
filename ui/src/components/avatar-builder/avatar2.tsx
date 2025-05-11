"use client";

import type React from "react";
import { adventurer } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Avatar configuration moved directly into this file
export type AvatarConfigType = {
  features: string[];
  glasses: string[];
  hair: string[];
  eyes: string[];
  eyebrows: string[];
  mouth: string[];
  skinColor: string[];
  hairColor: string[];
  earrings: string[];
  backgroundColor: string[];
  glassesProbability: number[];
  featuresProbability: number[];
  earringsProbability: number[];
};

export enum AvatarConfigKeys {
  features = "features",
  glasses = "glasses",
  hair = "hair",
  eyes = "eyes",
  eyebrows = "eyebrows",
  mouth = "mouth",
  skinColor = "skinColor",
  hairColor = "hairColor",
  earrings = "earrings",
  backgroundColor = "backgroundColor",
  glassesProbability = "glassesProbability",
  featuresProbability = "featuresProbability",
  earringsProbability = "earringsProbability",
}

export const options: Record<keyof AvatarConfigType, string[] | number[]> = {
  features: ["birthmark", "blush", "freckles", "mustache"],
  glasses: ["variant01", "variant02", "variant03", "variant04", "variant05"],
  hair: [
    "long01",
    "long02",
    "long03",
    "long04",
    "long05",
    "long06",
    "long07",
    "long08",
    "long09",
    "long10",
    "long11",
    "long12",
    "long13",
    "long14",
    "long15",
    "long16",
    "long17",
    "long18",
    "long19",
    "long20",
    "long21",
    "long22",
    "long23",
    "long24",
    "long25",
    "long26",
    "short01",
    "short02",
    "short03",
    "short04",
    "short05",
    "short06",
    "short07",
    "short08",
    "short09",
    "short10",
    "short11",
    "short12",
    "short13",
    "short14",
    "short15",
    "short16",
    "short17",
    "short18",
    "short19",
  ],
  eyes: [
    "variant01",
    "variant02",
    "variant03",
    "variant04",
    "variant05",
    "variant06",
    "variant07",
    "variant08",
    "variant09",
    "variant10",
    "variant11",
    "variant12",
    "variant13",
    "variant14",
    "variant15",
    "variant16",
    "variant17",
    "variant18",
    "variant19",
    "variant20",
    "variant21",
    "variant22",
    "variant23",
    "variant24",
    "variant25",
    "variant26",
  ],
  eyebrows: [
    "variant01",
    "variant02",
    "variant03",
    "variant04",
    "variant05",
    "variant06",
    "variant07",
    "variant08",
    "variant09",
    "variant10",
    "variant11",
    "variant12",
    "variant13",
    "variant14",
    "variant15",
  ],
  mouth: [
    "variant01",
    "variant02",
    "variant03",
    "variant04",
    "variant05",
    "variant06",
    "variant07",
    "variant08",
    "variant09",
    "variant10",
    "variant11",
    "variant12",
    "variant13",
    "variant14",
    "variant15",
    "variant16",
    "variant17",
    "variant18",
    "variant19",
    "variant20",
    "variant21",
    "variant22",
    "variant23",
    "variant24",
    "variant25",
    "variant26",
    "variant27",
    "variant28",
    "variant29",
    "variant30",
  ],
  skinColor: ["9e5622", "763900", "ecad80", "f2d3b1"],
  hairColor: [
    "0e0e0e",
    "3eac2c",
    "6a4e35",
    "85c2c6",
    "796a45",
    "562306",
    "592454",
    "ab2a18",
    "ac6511",
    "afafaf",
    "b9a05f",
    "cb6820",
    "dba3be",
    "e5d7a3",
  ],
  earrings: [
    "variant01",
    "variant02",
    "variant03",
    "variant04",
    "variant05",
    "variant06",
  ],
  backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
  glassesProbability: [0, 100],
  featuresProbability: [0, 100],
  earringsProbability: [0, 100],
};

const AvatarBuilder: React.FC = () => {
  // Create a properly typed initial state
  const initialState = Object.fromEntries(
    Object.keys(options).map((key) => [key, 0]),
  ) as Record<keyof AvatarConfigType, number>;

  const [avatarConfig, setAvatarConfig] =
    useState<Record<keyof AvatarConfigType, number>>(initialState);
  const [isCreating, setIsCreating] = useState(false);
  const [activeColorPicker, setActiveColorPicker] =
    useState<AvatarConfigKeys | null>(null);

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
    setActiveColorPicker(null); // Close color picker after selection
  };

  const toggleColorPicker = (key: AvatarConfigKeys) => {
    if (activeColorPicker === key) {
      setActiveColorPicker(null);
    } else {
      setActiveColorPicker(key);
    }
  };

  const svg = useMemo(() => {
    const params = Object.entries(avatarConfig).reduce(
      (acc, [key, index]) => {
        const k = key as keyof AvatarConfigType;

        // Handle probability toggles - if off (0), don't include the feature
        if (k === "glassesProbability" && index === 0) {
          // Don't include glasses
          return acc;
        }
        if (k === "featuresProbability" && index === 0) {
          // Don't include features
          return acc;
        }
        if (k === "earringsProbability" && index === 0) {
          // Don't include earrings
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

  const handleCreateCharacter = () => {
    setIsCreating(true);
    // Simulate creation process
    setTimeout(() => {
      setIsCreating(false);
      // Here you would typically save the character or do something with it
    }, 1500);
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

  // Feature selector with arrows
  const FeatureSelector = ({
    feature,
    label,
    bgColor = "",
  }: {
    feature: AvatarConfigKeys;
    label: string;
    bgColor?: string;
  }) => {
    return (
      <div
        className={`rounded-md border border-gray-700 flex items-center justify-between h-10 ${bgColor}`}
        onClick={() => {
          if (
            feature === AvatarConfigKeys.backgroundColor ||
            feature === AvatarConfigKeys.skinColor ||
            feature === AvatarConfigKeys.hairColor
          ) {
            toggleColorPicker(feature);
          }
        }}
      >
        <button
          className="px-2 h-full"
          onClick={(e) => {
            e.stopPropagation();
            changeOption(feature, -1);
          }}
        >
          <ChevronLeft className="h-5 w-5 text-gray-300" />
        </button>

        <span className="text-gray-200 font-medium px-2">{label}</span>

        <button
          className="px-2 h-full"
          onClick={(e) => {
            e.stopPropagation();
            changeOption(feature, 1);
          }}
        >
          <ChevronRight className="h-5 w-5 text-gray-300" />
        </button>
      </div>
    );
  };

  // Toggle switch
  const ToggleSwitch = ({ toggleKey }: { toggleKey: AvatarConfigKeys }) => {
    const isOn = avatarConfig[toggleKey] === 1;

    return (
      <div
        className={`w-16 h-8 rounded-full border border-gray-700 flex items-center justify-center cursor-pointer ${isOn ? "bg-gray-700" : "bg-gray-800"}`}
        onClick={() => toggleFeature(toggleKey)}
      >
        <span className="text-gray-200 text-sm">{isOn ? "on" : "off"}</span>
      </div>
    );
  };

  // Color picker
  const ColorPicker = ({ colorKey }: { colorKey: AvatarConfigKeys }) => {
    return (
      <div
        className={`absolute z-10 bg-gray-800 border border-gray-700 rounded-md p-2 shadow-lg ${activeColorPicker === colorKey ? "block" : "hidden"}`}
      >
        <div className="flex flex-wrap gap-2">
          {(options[colorKey] as string[]).map((color, index) => (
            <button
              key={color}
              onClick={() => setSpecificOption(colorKey, index)}
              className={`w-8 h-8 rounded-full ${avatarConfig[colorKey] === index ? "ring-2 ring-red-500" : ""}`}
              style={{ backgroundColor: `#${color}` }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-xl max-w-4xl w-full mx-auto overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-12 gap-4">
            {/* Logo */}
            <div className="col-span-2">
              <div className="w-20 h-20 rounded-full border border-gray-700 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-300">Logo</span>
              </div>
            </div>

            {/* Empty space */}
            <div className="col-span-10"></div>

            {/* First row of controls */}
            <div className="col-span-3">
              <FeatureSelector feature={AvatarConfigKeys.eyes} label="eyes" />
            </div>
            <div className="col-span-3">
              <FeatureSelector
                feature={AvatarConfigKeys.eyebrows}
                label="eyebrows"
              />
            </div>
            <div className="col-span-6 row-span-5 relative">
              {/* Avatar Preview */}
              <div className="flex flex-col items-center">
                <div
                  className="relative w-64 h-64 bg-gray-800 rounded-full overflow-hidden mb-6"
                  style={{
                    backgroundColor: `#${options.backgroundColor[avatarConfig.backgroundColor]}`,
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: svg }}
                    className="w-full h-full"
                  />

                  {isCreating && (
                    <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-red-400 font-medium">Creating...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Second row of controls */}
            <div className="col-span-3">
              <FeatureSelector
                feature={AvatarConfigKeys.hair}
                label="hair"
                bgColor="bg-pink-950/30"
              />
            </div>
            <div className="col-span-3">
              <FeatureSelector feature={AvatarConfigKeys.mouth} label="mouth" />
            </div>

            {/* Third row of controls */}
            <div className="col-span-3 relative">
              <FeatureSelector
                feature={AvatarConfigKeys.backgroundColor}
                label="background"
                bgColor="bg-blue-950/30"
              />
              <ColorPicker colorKey={AvatarConfigKeys.backgroundColor} />
            </div>
            <div className="col-span-3 relative">
              <FeatureSelector
                feature={AvatarConfigKeys.skinColor}
                label="skin color"
                bgColor="bg-yellow-950/30"
              />
              <ColorPicker colorKey={AvatarConfigKeys.skinColor} />
            </div>

            {/* Color palette */}
            <div className="col-span-6 flex items-center justify-center">
              <div className="bg-gray-800 border border-gray-700 rounded-md p-3 flex gap-2">
                <button
                  className="w-10 h-10 rounded-full bg-pink-300"
                  onClick={() =>
                    setSpecificOption(AvatarConfigKeys.hairColor, 12)
                  } // Pink hair
                />
                <button
                  className="w-10 h-10 rounded-full bg-blue-300"
                  onClick={() =>
                    setSpecificOption(AvatarConfigKeys.backgroundColor, 0)
                  } // Blue background
                />
                <button
                  className="w-10 h-10 rounded-full bg-yellow-300 ring-2 ring-white"
                  onClick={() =>
                    setSpecificOption(AvatarConfigKeys.skinColor, 2)
                  } // Light skin
                />
                <button
                  className="w-10 h-10 rounded-full bg-green-300"
                  onClick={() =>
                    setSpecificOption(AvatarConfigKeys.hairColor, 1)
                  } // Green hair
                />
              </div>
            </div>

            {/* Fourth row of controls */}
            <div className="col-span-3">
              <FeatureSelector
                feature={AvatarConfigKeys.earrings}
                label="earrings"
              />
            </div>
            <div className="col-span-3">
              <ToggleSwitch toggleKey={AvatarConfigKeys.earringsProbability} />
            </div>

            {/* Fifth row of controls */}
            <div className="col-span-3">
              <FeatureSelector
                feature={AvatarConfigKeys.glasses}
                label="glasses"
              />
            </div>
            <div className="col-span-3">
              <ToggleSwitch toggleKey={AvatarConfigKeys.glassesProbability} />
            </div>

            {/* Create character button */}
            <div className="col-span-6 flex justify-center">
              <button
                className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-md font-bold text-lg"
                onClick={handleCreateCharacter}
                disabled={isCreating}
              >
                create character
              </button>
            </div>

            {/* Sixth row of controls */}
            <div className="col-span-3">
              <FeatureSelector
                feature={AvatarConfigKeys.features}
                label="features"
              />
            </div>
            <div className="col-span-3">
              <ToggleSwitch toggleKey={AvatarConfigKeys.featuresProbability} />
            </div>

            {/* Hair color picker */}
            <div className="col-span-6 relative">
              <ColorPicker colorKey={AvatarConfigKeys.hairColor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarBuilder;
