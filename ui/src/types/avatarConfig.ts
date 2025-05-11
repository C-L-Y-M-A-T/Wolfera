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

// For easier categorization of avatar features
export enum FeatureCategory {
  Face = "face",
  Color = "color",
  Accessories = "accessories",
}

export interface AvatarFeature {
  key: AvatarConfigKeys;
  label: string;
  category: FeatureCategory;
  showToggle?: boolean;
  toggleKey?: AvatarConfigKeys;
  isColor?: boolean;
}

export const featureCategories = [
  { id: FeatureCategory.Face, label: "Face" },
  { id: FeatureCategory.Color, label: "Colors" },
  { id: FeatureCategory.Accessories, label: "Accessories" },
];

export const avatarFeatures: AvatarFeature[] = [
  { key: AvatarConfigKeys.eyes, label: "Eyes", category: FeatureCategory.Face },
  {
    key: AvatarConfigKeys.eyebrows,
    label: "Eyebrows",
    category: FeatureCategory.Face,
  },
  {
    key: AvatarConfigKeys.mouth,
    label: "Mouth",
    category: FeatureCategory.Face,
  },
  { key: AvatarConfigKeys.hair, label: "Hair", category: FeatureCategory.Face },
  {
    key: AvatarConfigKeys.features,
    label: "Features",
    category: FeatureCategory.Face,
    showToggle: true,
    toggleKey: AvatarConfigKeys.featuresProbability,
  },

  {
    key: AvatarConfigKeys.skinColor,
    label: "Skin",
    category: FeatureCategory.Color,
    isColor: true,
  },
  {
    key: AvatarConfigKeys.hairColor,
    label: "Hair Color",
    category: FeatureCategory.Color,
    isColor: true,
  },
  {
    key: AvatarConfigKeys.backgroundColor,
    label: "Background",
    category: FeatureCategory.Color,
    isColor: true,
  },

  {
    key: AvatarConfigKeys.glasses,
    label: "Glasses",
    category: FeatureCategory.Accessories,
    showToggle: true,
    toggleKey: AvatarConfigKeys.glassesProbability,
  },
  {
    key: AvatarConfigKeys.earrings,
    label: "Earrings",
    category: FeatureCategory.Accessories,
    showToggle: true,
    toggleKey: AvatarConfigKeys.earringsProbability,
  },
];
