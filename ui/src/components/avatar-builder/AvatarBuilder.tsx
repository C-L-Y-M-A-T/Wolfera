"use client";

import { Button } from "@/components/ui/button";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  AvatarConfigKeys,
  AvatarConfigType,
  avatarFeatures,
  options,
} from "@/types/avatar-builder/avatarConfig";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Download, Save, Shuffle } from "lucide-react";
import { useState } from "react";
import AvatarPreview from "./components/AvatarPreview";
import ColorSelector from "./components/ColorSelector";
import FaceCustomizer from "./components/FaceCustomizer";
import HairCustomizer from "./components/HairCustomizer";
import TabSection from "./components/TabSection";

export default function AvatarCustomizer() {
  const initialState = Object.fromEntries(
    Object.keys(options).map((key) => [key, 0]),
  ) as Record<keyof AvatarConfigType, number>;
  const [currentOptions, setCurrentOptions] = useState(initialState);
  const [avatarSvg, setAvatarSvg] = useState("");
  const [activeTab, setActiveTab] = useState("face");

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

  const updateOption = (key: keyof AvatarConfigType, value: number) => {
    setCurrentOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
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

              <AvatarPreview currentOptions={currentOptions} />

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
            <div className="w-full md:w-1/2 bg-gray-950 p-6 overflow-y-auto shadow-lg">
              <h2 className="text-2xl font-bold text-red-400 mb-6">
                Customize Your Avatar
              </h2>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabSection />

                <TabsContent value="face" className="space-y-6 mt-4">
                  <FaceCustomizer
                    currentOptions={currentOptions}
                    updateOption={updateOption}
                  />
                </TabsContent>

                <TabsContent value="hair" className="space-y-6 mt-4">
                  <HairCustomizer
                    currentOptions={currentOptions}
                    updateOption={updateOption}
                  />
                </TabsContent>

                <TabsContent value="style" className="space-y-6 mt-4">
                  <ColorSelector
                    feature={
                      avatarFeatures.find(
                        (f) => f.key === AvatarConfigKeys.backgroundColor,
                      )!
                    }
                    currentOptions={currentOptions}
                    updateOption={updateOption}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
