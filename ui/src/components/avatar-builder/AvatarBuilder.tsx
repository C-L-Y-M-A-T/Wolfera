("use client");

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarConfigType, options } from "@/types/avatar/avatarConfig";
import { adventurer } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Eye,
  Glasses,
  Palette,
  Save,
  Shuffle,
  Smile,
  Sparkles,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";

const colorOptions = {
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
    { value: "9e5622", label: "Dark" },
    { value: "763900", label: "Deeper" },
    { value: "ecad80", label: "Medium" },
    { value: "f2d3b1", label: "Light" },
  ],

  background: [
    { value: "b6e3f4", label: "Blue" },
    { value: "c0aede", label: "Purple" },
    { value: "d1d4f9", label: "Indigo" },
    { value: "ffd5dc", label: "Pink" },
    { value: "ffdfbf", label: "Peach" },
  ],
};

export default function AvatarCustomizer() {
  const [currentOptions, setCurrentOptions] = useState<
    Record<keyof AvatarConfigType, number>
  >(
    Object.fromEntries(Object.keys(options).map((key) => [key, 0])) as Record<
      keyof AvatarConfigType,
      number
    >,
  );
  const [avatarSvg, setAvatarSvg] = useState("");
  const [activeTab, setActiveTab] = useState("face");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const svg = useMemo(() => {
    const params = Object.entries(currentOptions).reduce(
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
  }, [currentOptions]);

  const handleRandomize = () => {
    const randomConfig = Object.fromEntries(
      Object.keys(options).map((key) => {
        const k = key as keyof AvatarConfigType;
        const randomIndex = Math.floor(Math.random() * options[k].length);
        return [key, randomIndex];
      }),
    ) as Record<keyof AvatarConfigType, number>;

    setCurrentOptions(randomConfig);
  };

  const handleSave = () => {
    /*onUpdate(currentOptions);
    onClose();*/
  };

  const updateOption = (key, value) => {
    setCurrentOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Helper function to safely get variant number
  const getVariantNumber = (optionValue, defaultValue = 1) => {
    if (!optionValue) return defaultValue;
    if (optionValue === "none") return 0;

    const match = optionValue.match(/variant(\d+)/);
    return match ? Number.parseInt(match[1], 10) : defaultValue;
  };

  // Handle image error
  const handleImageError = () => {
    console.error("Error loading avatar image");
    setLoadError(true);
    setIsLoading(false);
  };

  // Download avatar as PNG
  const downloadAvatar = async () => {
    try {
      // Create a new Image to load the SVG
      const img = new Image();
      img.crossOrigin = "anonymous";

      // When the image loads, draw it to a canvas and download
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0, 300, 300);

          // Create download link
          const link = document.createElement("a");
          link.download = `avatar-${seed}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      };

      // Set the source to the SVG data URL
      img.src = avatarSvg;
    } catch (error) {
      console.error("Error downloading avatar:", error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-900 rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="flex flex-col md:flex-row h-[80vh] max-h-[800px]">
            {/* Avatar Preview */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-gray-800 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 left-4 text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={handleSave}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <motion.div
                className="w-64 h-64 rounded-full overflow-hidden bg-gray-800 border-4 border-red-500 shadow-lg mb-6 relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", damping: 10, stiffness: 300 }}
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                <div
                  dangerouslySetInnerHTML={{ __html: svg }}
                  className="w-full h-full"
                />
              </motion.div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-950 hover:text-red-300"
                  onClick={handleRandomize}
                >
                  <Shuffle className="mr-2 h-4 w-4" />
                  Randomize
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleSave}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Avatar
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-950 hover:text-red-300"
                  onClick={downloadAvatar}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>

            {/* Customization Options */}
            <div className="w-full md:w-1/2 bg-gray-950 p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold text-red-400 mb-6">
                Customize Your Avatar
              </h2>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-4 bg-gray-900 mb-6">
                  <TabsTrigger
                    value="face"
                    className="flex flex-col items-center py-3"
                  >
                    <User className="h-4 w-4 mb-1" />
                    <span className="text-xs">Face</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="hair"
                    className="flex flex-col items-center py-3"
                  >
                    <Palette className="h-4 w-4 mb-1" />
                    <span className="text-xs">Hair</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="accessories"
                    className="flex flex-col items-center py-3"
                  >
                    <Glasses className="h-4 w-4 mb-1" />
                    <span className="text-xs">Accessories</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="style"
                    className="flex flex-col items-center py-3"
                  >
                    <Sparkles className="h-4 w-4 mb-1" />
                    <span className="text-xs">Style</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="face" className="space-y-6 mt-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center text-sm font-medium">
                        <Eye className="h-4 w-4 mr-2" />
                        Eyes
                      </label>
                      <span className="text-xs text-gray-400">
                        {currentOptions.eyes}
                      </span>
                    </div>
                    <div className="px-2">
                      <Slider
                        min={1}
                        max={26}
                        step={1}
                        value={[currentOptions.eyes]}
                        onValueChange={(value) =>
                          updateOption("eyes", value[0] - 1)
                        }
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center text-sm font-medium">
                        <Smile className="h-4 w-4 mr-2" />
                        Mouth
                      </label>
                      <span className="text-xs text-gray-400">
                        {currentOptions.mouth}
                      </span>
                    </div>
                    <div className="px-2">
                      <Slider
                        min={1}
                        max={30}
                        step={1}
                        value={[currentOptions.mouth]}
                        onValueChange={(value) =>
                          updateOption("mouth", value[0] - 1)
                        }
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center text-sm font-medium">
                        <Eye className="h-4 w-4 mr-2" />
                        Eyebrows
                      </label>
                      <span className="text-xs text-gray-400">
                        {currentOptions.eyebrows}
                      </span>
                    </div>
                    <div className="px-2">
                      <Slider
                        min={1}
                        max={15}
                        step={1}
                        value={[currentOptions.eyebrows]}
                        onValueChange={(value) =>
                          updateOption("eyebrows", value[0] - 1)
                        }
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Skin Color</label>
                    <Select
                      value={[currentOptions.skinColor]}
                      onValueChange={(value) =>
                        updateOption("skinColor", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select skin color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.skin.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            {color.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="hair" className="space-y-6 mt-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center text-sm font-medium">
                        <Palette className="h-4 w-4 mr-2" />
                        Hair Style
                      </label>
                      <span className="text-xs text-gray-400">
                        {currentOptions.hair}
                      </span>
                    </div>
                    <div className="px-2">
                      <Slider
                        min={1}
                        max={45}
                        step={1}
                        value={[getVariantNumber(currentOptions.hair)]}
                        onValueChange={(value) =>
                          updateOption("hair", value[0] - 1)
                        }
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hair Color</label>
                    <Select
                      value={currentOptions.hairColor || "brown"}
                      onValueChange={(value) =>
                        updateOption("hairColor", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select hair color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.hair.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            {color.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="accessories" className="space-y-6 mt-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center text-sm font-medium">
                        <Glasses className="h-4 w-4 mr-2" />
                        Glasses
                      </label>
                      <span className="text-xs text-gray-400">
                        {currentOptions.glasses}
                      </span>
                    </div>
                    <div className="px-2">
                      <Slider
                        min={0}
                        max={5}
                        step={1}
                        value={[
                          currentOptions.glassesProbability === 0
                            ? 0
                            : currentOptions.glasses + 1,
                        ]}
                        onValueChange={(value) => {
                          if (value[0] === 0) {
                            updateOption("glassesProbability", 0);
                          } else {
                            updateOption("glassesProbability", 100);
                            updateOption("glasses", value[0] - 1);
                          }
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      Slide to 0 for no glasses
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center text-sm font-medium">
                        <Glasses className="h-4 w-4 mr-2" />
                        Features
                      </label>
                      <span className="text-xs text-gray-400">
                        {currentOptions.features}
                      </span>
                    </div>
                    <div className="px-2">
                      <Slider
                        min={0}
                        max={4}
                        step={1}
                        value={[
                          currentOptions.featuresProbability === 0
                            ? 0
                            : currentOptions.features + 1,
                        ]}
                        onValueChange={(value) => {
                          if (value[0] === 0) {
                            updateOption("featuresProbability", 0);
                          } else {
                            updateOption("featuresProbability", 100);
                            updateOption("features", value[0] - 1);
                          }
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      Slide to 0 for no features
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center text-sm font-medium">
                        <Glasses className="h-4 w-4 mr-2" />
                        Earrings
                      </label>
                      <span className="text-xs text-gray-400">
                        {currentOptions.earrings}
                      </span>
                    </div>
                    <div className="px-2">
                      <Slider
                        min={0}
                        max={6}
                        step={1}
                        value={[
                          currentOptions.earringsProbability === 0
                            ? 0
                            : currentOptions.earrings + 1,
                        ]}
                        onValueChange={(value) => {
                          if (value[0] === 0) {
                            updateOption("earringsProbability", 0);
                          } else {
                            updateOption("earringsProbability", 100);
                            updateOption("earrings", value[0] - 1);
                          }
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      Slide to 0 for no earrings
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="style" className="space-y-6 mt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Background Color
                    </label>
                    <Select
                      value={currentOptions.backgroundColor || "transparent"}
                      onValueChange={(value) =>
                        updateOption("backgroundColor", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select background color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.background.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            {color.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
