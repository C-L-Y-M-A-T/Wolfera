export type AvatarConfigType = {
  hair: string[];
  eyes: string[];
  eyebrows: string[];
  mouth: string[];
  skinColor: string[];
  hairColor: string[];
  backgroundColor: string[];
};

export enum AvatarConfigKeys {
  hair = "hair",
  eyes = "eyes",
  eyebrows = "eyebrows",
  mouth = "mouth",
  skinColor = "skinColor",
  hairColor = "hairColor",
  backgroundColor = "backgroundColor",
}

export const options: Record<keyof AvatarConfigType, string[]> = {
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

  backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
};

export const colorOptions = {
  hair: [
    { value: "0e0e0e", label: "Black" },
    { value: "3eac2c", label: "Green" },
    { value: "6a4e35", label: "Brown" },
    { value: "85c2c6", label: "Blue" },
    { value: "796a45", label: "Olive" },
    { value: "562306", label: "Dark Brown" },
    { value: "592454", label: "Purple" },
    { value: "ab2a18", label: "Red" },
    { value: "ac6511", label: "Orange" },
    { value: "afafaf", label: "Gray" },
    { value: "b9a05f", label: "Blonde" },
    { value: "cb6820", label: "Light Brown" },
    { value: "dba3be", label: "Pink" },
    { value: "e5d7a3", label: "Beige" },
  ],

  skin: [
    { value: "9e5622", label: "Olive" },
    { value: "763900", label: "Dark Brown" },
    { value: "ecad80", label: "Medium white" },
    { value: "f2d3b1", label: "Pale" },
  ],

  background: [
    { value: "b6e3f4", label: "Blue" },
    { value: "c0aede", label: "Purple" },
    { value: "d1d4f9", label: "Indigo" },
    { value: "ffd5dc", label: "Pink" },
    { value: "ffdfbf", label: "Peach" },
  ],
};

export interface AvatarFeature {
  key: AvatarConfigKeys;
  label: string;
  showToggle?: boolean;
  toggleKey?: AvatarConfigKeys;
  isColor?: boolean;
}

export const avatarFeatures: AvatarFeature[] = [
  { key: AvatarConfigKeys.eyes, label: "Eyes" },
  {
    key: AvatarConfigKeys.eyebrows,
    label: "Eyebrows",
  },
  {
    key: AvatarConfigKeys.mouth,
    label: "Mouth",
  },
  { key: AvatarConfigKeys.hair, label: "Hair" },

  {
    key: AvatarConfigKeys.skinColor,
    label: "Skin",
    isColor: true,
  },
  {
    key: AvatarConfigKeys.hairColor,
    label: "Hair Color",
    isColor: true,
  },
  {
    key: AvatarConfigKeys.backgroundColor,
    label: "Background",
    isColor: true,
  },
];
export const initialState = Object.fromEntries(
  Object.keys(options).map((key) => [key, 0]),
) as Record<keyof AvatarConfigType, number>;
