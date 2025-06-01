"use client";

import AvatarBuilder from "@/components/avatar-builder/AvatarBuilder";
import { Dialog } from "@/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import userData from "@/data/profile/user-data.mock.json";
import { useTheme } from "@/providers/theme-provider";
import {
  AvatarConfigType,
  initialState,
} from "@/types/avatar-builder/avatarConfig";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Trophy, User } from "lucide-react";
import { useState } from "react";
import {
  AboutTab,
  AchievementsTab,
  EditProfileDialog,
  FriendsCard,
  GameHistoryTab,
  ProfileHeader,
  RecentGamesCard,
  StatsCard,
} from "./components";

export default function ProfilePage() {
  const theme = useTheme();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [avatarBuilderOpen, setAvatarBuilderOpen] = useState(false);
  const [profile, setProfile] = useState({
    username: userData.username,
    bio: userData.bio,
    email: userData.email,
  });
  const [activeTab, setActiveTab] = useState("about");
  const [avatarOptions, setAvatarOptions] = useState(initialState);

  const handleAvatarSave = (
    newAvatarOptions: Record<keyof AvatarConfigType, number>,
  ) => {
    setAvatarOptions(newAvatarOptions);

    // Call the parent callback if provided (e.g., to save to database)
    /* if (onAvatarUpdate) {
      onAvatarUpdate(newAvatarOptions);
    }*/
  };
  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    // In a real app, this would save the profile to the server
    try {
      console.log("Saving profile:", profile);
      // Replace with actual API call
      // e.g., await saveProfileToAPI(profile);
      setEditProfileOpen(false);
      // Consider showing a success notification
    } catch (error) {
      console.error("Error saving profile:", error);
      // Show error notification or handle gracefully
    }
  };

  return (
    <div className={theme.gameStyles.backgrounds.page}>
      <div className={theme.gameStyles.backgrounds.overlay}>
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <ProfileHeader
            userData={userData}
            onEditProfile={() => setEditProfileOpen(true)}
            onEditAvatar={() => setAvatarBuilderOpen(true)}
            avatarOptions={avatarOptions}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={theme.variants.container}
              className="space-y-6"
            >
              {/* Stats Card */}
              <StatsCard stats={userData.stats} />

              {/* Recent Games Card */}
              <RecentGamesCard games={userData.recentGames} />

              {/* Friends Card */}
              <FriendsCard friends={userData.friends} />
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Tabs
                defaultValue="about"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className={theme.gameStyles.tabs.list}>
                  <TabsTrigger
                    value="about"
                    className={`${theme.gameStyles.tabs.trigger.base} ${theme.gameStyles.tabs.trigger.active.about}`}
                  >
                    <User className="h-4 w-4 mr-2" />
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="achievements"
                    className={`${theme.gameStyles.tabs.trigger.base} ${theme.gameStyles.tabs.trigger.active.achievements}`}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Achievements
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className={`${theme.gameStyles.tabs.trigger.base} ${theme.gameStyles.tabs.trigger.active.history}`}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Game History
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="about" className="mt-6">
                      <AboutTab userData={userData} />
                    </TabsContent>

                    <TabsContent value="achievements" className="mt-6">
                      <AchievementsTab achievements={userData.achievements} />
                    </TabsContent>

                    <TabsContent value="history" className="mt-6">
                      <GameHistoryTab games={userData.recentGames} />
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        profile={profile}
        onProfileChange={handleProfileChange}
        onSave={handleSaveProfile}
      />

      {/* Avatar Builder Modal would go here */}
      {avatarBuilderOpen && (
        // i want when click away from the avatar builder modal, it closes
        <Dialog open={avatarBuilderOpen} onOpenChange={setAvatarBuilderOpen}>
          <AvatarBuilder
            avatarOptions={avatarOptions}
            onAvatarSave={handleAvatarSave}
            onClose={() => setAvatarBuilderOpen(false)}
            setAvatarOptions={setAvatarOptions}
          />
        </Dialog>
      )}
    </div>
  );
}
