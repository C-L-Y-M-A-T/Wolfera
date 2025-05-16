"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Edit,
  Trophy,
  Users,
  Camera,
  Moon,
  Skull,
  Eye,
  Heart,
  Calendar,
  Mail,
  User,
  MessageSquare,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

// Mock user data
const userData = {
  username: "WolfHunter",
  email: "wolf.hunter@example.com",
  bio: "I love playing as the Seer and uncovering the truth!",
  joinDate: "January 2023",
  avatar: "/placeholder.svg?height=128&width=128",
  avatarData: {}, // This would store the avatar builder data
  level: 24,
  xp: 75, // percentage to next level
  stats: {
    gamesPlayed: 87,
    wins: 52,
    winRate: "59.8%",
    favoriteRole: "Seer",
    killCount: 34,
    survivedNights: 156,
  },
  achievements: [
    {
      id: 1,
      name: "First Blood",
      description: "Win your first game",
      unlocked: true,
      date: "Jan 15, 2023",
    },
    {
      id: 2,
      name: "Pack Leader",
      description: "Win 5 games as a Werewolf",
      unlocked: true,
      date: "Feb 3, 2023",
    },
    {
      id: 3,
      name: "Village Elder",
      description: "Win 10 games as a Villager",
      unlocked: true,
      date: "Mar 12, 2023",
    },
    {
      id: 4,
      name: "Psychic",
      description: "Correctly identify 3 Werewolves in a single game as Seer",
      unlocked: false,
    },
    {
      id: 5,
      name: "Survivor",
      description: "Win 20 games in a row",
      unlocked: false,
    },
    {
      id: 6,
      name: "Blood Moon",
      description: "Play during a full moon event",
      unlocked: true,
      date: "Apr 25, 2023",
    },
    {
      id: 7,
      name: "Lone Wolf",
      description: "Win as the last werewolf standing",
      unlocked: true,
      date: "May 10, 2023",
    },
  ],
  recentGames: [
    {
      id: "g1",
      date: "2 hours ago",
      result: "Win",
      role: "Villager",
      players: 12,
    },
    {
      id: "g2",
      date: "Yesterday",
      result: "Loss",
      role: "Werewolf",
      players: 8,
    },
    { id: "g3", date: "3 days ago", result: "Win", role: "Seer", players: 15 },
    { id: "g4", date: "Last week", result: "Win", role: "Hunter", players: 10 },
  ],
  friends: [
    {
      id: "f1",
      username: "MoonHowler",
      status: "online",
      avatar: "/placeholder.svg?height=40&width=40&text=MH",
    },
    {
      id: "f2",
      username: "VillageProtector",
      status: "offline",
      avatar: "/placeholder.svg?height=40&width=40&text=VP",
    },
    {
      id: "f3",
      username: "NightStalker",
      status: "in-game",
      avatar: "/placeholder.svg?height=40&width=40&text=NS",
    },
  ],
};

// Role icons mapping
const roleIcons = {
  Villager: <Users className="h-4 w-4" />,
  Werewolf: <Skull className="h-4 w-4" />,
  Seer: <Eye className="h-4 w-4" />,
  Hunter: <Trophy className="h-4 w-4" />,
};

// Role colors mapping
const roleColors = {
  Villager: "text-blue-400 bg-blue-950/50",
  Werewolf: "text-red-400 bg-red-950/50",
  Seer: "text-purple-400 bg-purple-950/50",
  Hunter: "text-yellow-400 bg-yellow-950/50",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: userData.username,
    bio: userData.bio,
    email: userData.email,
  });
  const [avatarBuilderOpen, setAvatarBuilderOpen] = useState(false);
  const [avatarData, setAvatarData] = useState(userData.avatarData);
  const [avatarUrl, setAvatarUrl] = useState(userData.avatar);
  const [activeTab, setActiveTab] = useState("about");
  const [showAchievementDetails, setShowAchievementDetails] = useState<
    number | null
  >(null);

  const handleSaveProfile = () => {
    // In a real app, this would save the profile to the server
    console.log("Saving profile:", profile);
    setIsEditing(false);
  };

  const handleSaveAvatar = (newAvatarData: any) => {
    // In a real app, this would save the avatar data to the server
    console.log("Saving avatar:", newAvatarData);
    setAvatarData(newAvatarData);

    // In a real implementation, the server would generate an avatar image
    // For now, we'll just keep using the placeholder
    setAvatarUrl(`/placeholder.svg?height=128&width=128&text=Custom`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-gradient-to-b from-gray-900/95 to-gray-800/95 py-12">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative mb-8 overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-purple-900/30 mix-blend-multiply" />
            <div
              className="h-48 w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('/placeholder.svg?height=400&width=1200')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

            <div className="relative -mt-20 flex flex-col md:flex-row items-center md:items-end px-6 pb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-red-500 to-purple-600 opacity-75 blur-sm group-hover:opacity-100 transition duration-300"></div>
                <img
                  src={avatarUrl || "/placeholder.svg"}
                  alt={userData.username}
                  className="relative rounded-full w-32 h-32 border-2 border-gray-800 shadow-lg z-10"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full bg-gray-800 border-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  onClick={() => setAvatarBuilderOpen(true)}
                >
                  <Camera className="h-4 w-4 text-red-500" />
                </Button>

                {/* Level indicator */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-900 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full border border-red-500 z-20">
                  LVL {userData.level}
                </div>
              </motion.div>

              <div className="mt-6 md:mt-0 md:ml-6 text-center md:text-left">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: "var(--font-creepster)" }}
                >
                  {userData.username}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2"
                >
                  <Badge
                    variant="outline"
                    className="bg-gray-800/50 text-gray-300 border-gray-700"
                  >
                    <Calendar className="h-3 w-3 mr-1" /> Joined{" "}
                    {userData.joinDate}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-gray-800/50 text-gray-300 border-gray-700"
                  >
                    <Trophy className="h-3 w-3 mr-1" /> {userData.stats.wins}{" "}
                    Wins
                  </Badge>
                  <Badge className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 border-none">
                    <Skull className="h-3 w-3 mr-1" />{" "}
                    {userData.stats.killCount} Kills
                  </Badge>
                </motion.div>
              </div>

              <div className="mt-4 md:mt-0 md:ml-auto">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-300"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-red-400">
                        Edit Profile
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="username">Username</label>
                        <Input
                          id="username"
                          value={profile.username}
                          onChange={(e) =>
                            setProfile({ ...profile, username: e.target.value })
                          }
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email">Email</label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="bio">Bio</label>
                        <Textarea
                          id="bio"
                          rows={4}
                          value={profile.bio}
                          onChange={(e) =>
                            setProfile({ ...profile, bio: e.target.value })
                          }
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 border-none"
                      >
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* XP Progress bar */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">Level {userData.level}</span>
                <span className="text-gray-400">
                  Level {userData.level + 1}
                </span>
              </div>
              <div className="relative h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${userData.xp}%` }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  className="absolute h-full bg-gradient-to-r from-red-600 to-purple-600"
                />
              </div>
              <div className="text-center text-xs text-gray-400 mt-1">
                {userData.xp}% to next level
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-6"
            >
              {/* Stats Card */}
              <motion.div variants={cardVariants}>
                <Card className="border-gray-700 bg-gray-900/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-red-400 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                      Player Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-2 gap-4"
                      >
                        {/* Stats grid */}
                        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors duration-300">
                          <div className="text-xs text-gray-500 mb-1">
                            Games Played
                          </div>
                          <div className="text-xl font-bold">
                            {userData.stats.gamesPlayed}
                          </div>
                        </div>

                        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors duration-300">
                          <div className="text-xs text-gray-500 mb-1">
                            Win Rate
                          </div>
                          <div className="text-xl font-bold text-green-400">
                            {userData.stats.winRate}
                          </div>
                        </div>

                        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors duration-300">
                          <div className="text-xs text-gray-500 mb-1">
                            Kills
                          </div>
                          <div className="text-xl font-bold text-red-400">
                            {userData.stats.killCount}
                          </div>
                        </div>

                        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors duration-300">
                          <div className="text-xs text-gray-500 mb-1">
                            Nights Survived
                          </div>
                          <div className="text-xl font-bold text-blue-400">
                            {userData.stats.survivedNights}
                          </div>
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <div className="mt-4">
                          <div className="text-sm text-gray-400 mb-2">
                            Favorite Role
                          </div>
                          <div className="flex items-center p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                            <div className="bg-purple-500/20 p-2 rounded-full mr-3">
                              <Eye className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                              <div className="font-bold text-purple-400">
                                {userData.stats.favoriteRole}
                              </div>
                              <div className="text-xs text-gray-400">
                                Most played role
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Games Card */}
              <motion.div variants={cardVariants}>
                <Card className="border-gray-700 bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-red-400 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-500" />
                      Recent Games
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-3"
                    >
                      {userData.recentGames.map((game, index) => (
                        <motion.div
                          key={game.id}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02 }}
                          className={`relative overflow-hidden rounded-lg border border-gray-700 transition-all duration-300 hover:border-${
                            game.result === "Win" ? "green" : "red"
                          }-500/50`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-800/50" />
                          <div className="relative p-3 flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className={`p-2 rounded-full mr-3 ${roleColors[game.role as keyof typeof roleColors] || "bg-gray-800 text-gray-400"}`}
                              >
                                {roleIcons[
                                  game.role as keyof typeof roleIcons
                                ] || <User className="h-4 w-4" />}
                              </div>
                              <div>
                                <div className="font-medium flex items-center">
                                  {game.role}
                                  <span className="text-xs text-gray-500 ml-2">
                                    {game.players} players
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400">
                                  {game.date}
                                </div>
                              </div>
                            </div>
                            <Badge
                              variant={
                                game.result === "Win" ? "default" : "outline"
                              }
                              className={
                                game.result === "Win"
                                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 border-none"
                                  : "text-red-400 border-red-400"
                              }
                            >
                              {game.result}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    <Button
                      variant="ghost"
                      className="w-full mt-4 text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      View All Games
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Friends Card */}
              <motion.div variants={cardVariants}>
                <Card className="border-gray-700 bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl text-red-400 flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-red-500" />
                        Friends
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-3"
                    >
                      {userData.friends.map((friend, index) => (
                        <motion.div
                          key={friend.id}
                          variants={itemVariants}
                          whileHover={{ x: 5 }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300 cursor-pointer"
                        >
                          <div className="flex items-center">
                            <div className="relative">
                              <img
                                src={friend.avatar || "/placeholder.svg"}
                                alt={friend.username}
                                className="w-10 h-10 rounded-full border border-gray-700"
                              />
                              <div
                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-gray-900 ${
                                  friend.status === "online"
                                    ? "bg-green-500"
                                    : friend.status === "in-game"
                                      ? "bg-yellow-500"
                                      : "bg-gray-500"
                                }`}
                              />
                            </div>
                            <div className="ml-3">
                              <div className="font-medium">
                                {friend.username}
                              </div>
                              <div className="text-xs capitalize text-gray-400">
                                {friend.status}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
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
                <TabsList className="grid grid-cols-3 bg-gray-800/50 border border-gray-700 p-1 rounded-lg">
                  <TabsTrigger
                    value="about"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-900/80 data-[state=active]:to-red-700/80 data-[state=active]:text-white rounded-md transition-all duration-300"
                  >
                    <User className="h-4 w-4 mr-2" />
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="achievements"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-900/80 data-[state=active]:to-yellow-700/80 data-[state=active]:text-white rounded-md transition-all duration-300"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Achievements
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-900/80 data-[state=active]:to-blue-700/80 data-[state=active]:text-white rounded-md transition-all duration-300"
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
                      <Card className="border-gray-700 bg-gray-900/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-2xl text-red-400">
                            About Me
                          </CardTitle>
                          <CardDescription>
                            Your profile information
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                          >
                            <motion.div
                              variants={itemVariants}
                              className="relative overflow-hidden rounded-lg border border-gray-700 group hover:border-red-500/50 transition-all duration-300"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative p-4">
                                <div className="flex items-center mb-2">
                                  <User className="h-4 w-4 text-red-400 mr-2" />
                                  <h3 className="font-medium text-sm text-gray-400">
                                    Username
                                  </h3>
                                </div>
                                <p className="text-lg">{userData.username}</p>
                              </div>
                            </motion.div>

                            <motion.div
                              variants={itemVariants}
                              className="relative overflow-hidden rounded-lg border border-gray-700 group hover:border-red-500/50 transition-all duration-300"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative p-4">
                                <div className="flex items-center mb-2">
                                  <Mail className="h-4 w-4 text-red-400 mr-2" />
                                  <h3 className="font-medium text-sm text-gray-400">
                                    Email
                                  </h3>
                                </div>
                                <p className="text-lg">{userData.email}</p>
                              </div>
                            </motion.div>

                            <motion.div
                              variants={itemVariants}
                              className="relative overflow-hidden rounded-lg border border-gray-700 group hover:border-red-500/50 transition-all duration-300"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative p-4">
                                <div className="flex items-center mb-2">
                                  <MessageSquare className="h-4 w-4 text-red-400 mr-2" />
                                  <h3 className="font-medium text-sm text-gray-400">
                                    Bio
                                  </h3>
                                </div>
                                <p className="text-lg">{userData.bio}</p>
                              </div>
                            </motion.div>

                            <motion.div
                              variants={itemVariants}
                              className="relative overflow-hidden rounded-lg border border-gray-700 group hover:border-red-500/50 transition-all duration-300"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative p-4">
                                <div className="flex items-center mb-2">
                                  <Calendar className="h-4 w-4 text-red-400 mr-2" />
                                  <h3 className="font-medium text-sm text-gray-400">
                                    Member Since
                                  </h3>
                                </div>
                                <p className="text-lg">{userData.joinDate}</p>
                              </div>
                            </motion.div>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="achievements" className="mt-6">
                      <Card className="border-gray-700 bg-gray-900/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-2xl text-yellow-400">
                            Achievements
                          </CardTitle>
                          <CardDescription>
                            You've unlocked{" "}
                            {
                              userData.achievements.filter((a) => a.unlocked)
                                .length
                            }{" "}
                            out of {userData.achievements.length} achievements
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <Progress
                              value={
                                (userData.achievements.filter((a) => a.unlocked)
                                  .length /
                                  userData.achievements.length) *
                                100
                              }
                              className="h-2 bg-gray-800"
                            />
                          </div>

                          <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid gap-4 sm:grid-cols-2"
                          >
                            {userData.achievements.map((achievement) => (
                              <motion.div
                                key={achievement.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                onClick={() =>
                                  achievement.unlocked &&
                                  setShowAchievementDetails(achievement.id)
                                }
                                className={`relative overflow-hidden rounded-lg border ${
                                  achievement.unlocked
                                    ? "border-yellow-500/50 bg-yellow-500/5 cursor-pointer"
                                    : "border-gray-700 opacity-60"
                                } transition-all duration-300`}
                              >
                                {achievement.unlocked && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/20 to-transparent" />
                                )}
                                <div className="relative p-4 flex items-start">
                                  <div className="mr-4 flex-shrink-0">
                                    <div
                                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        achievement.unlocked
                                          ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-black"
                                          : "bg-gray-700"
                                      } shadow-lg ${achievement.unlocked ? "shadow-yellow-500/20" : ""}`}
                                    >
                                      <Trophy className="h-6 w-6" />
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {achievement.name}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                      {achievement.description}
                                    </p>
                                    {achievement.unlocked &&
                                      achievement.date && (
                                        <p className="text-xs text-yellow-400 mt-1">
                                          Unlocked: {achievement.date}
                                        </p>
                                      )}
                                  </div>
                                  {achievement.unlocked && (
                                    <ArrowUpRight className="h-4 w-4 text-yellow-400 absolute top-4 right-4" />
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        </CardContent>
                      </Card>

                      {/* Achievement Details Dialog */}
                      {showAchievementDetails && (
                        <Dialog
                          open={!!showAchievementDetails}
                          onOpenChange={() => setShowAchievementDetails(null)}
                        >
                          <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-yellow-400">
                                {
                                  userData.achievements.find(
                                    (a) => a.id === showAchievementDetails,
                                  )?.name
                                }
                              </DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="flex justify-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                  <Trophy className="h-12 w-12 text-black" />
                                </div>
                              </div>

                              <p className="text-center mb-4">
                                {
                                  userData.achievements.find(
                                    (a) => a.id === showAchievementDetails,
                                  )?.description
                                }
                              </p>

                              <div className="text-center text-sm text-yellow-400">
                                Unlocked on{" "}
                                {
                                  userData.achievements.find(
                                    (a) => a.id === showAchievementDetails,
                                  )?.date
                                }
                              </div>

                              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                <h4 className="font-medium mb-2">
                                  Achievement Rarity
                                </h4>
                                <p className="text-sm text-gray-400">
                                  Only 15% of players have unlocked this
                                  achievement.
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TabsContent>

                    <TabsContent value="history" className="mt-6">
                      <Card className="border-gray-700 bg-gray-900/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-2xl text-blue-400">
                            Game History
                          </CardTitle>
                          <CardDescription>
                            Your journey through Miller's Hollow
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />

                            <motion.div
                              variants={containerVariants}
                              initial="hidden"
                              animate="visible"
                              className="space-y-6 relative"
                            >
                              {userData.recentGames.map((game, index) => (
                                <motion.div
                                  key={game.id}
                                  variants={itemVariants}
                                  className="relative pl-10"
                                >
                                  {/* Timeline dot */}
                                  <div
                                    className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                      game.result === "Win"
                                        ? "bg-gradient-to-br from-green-500 to-green-600"
                                        : "bg-gradient-to-br from-red-500 to-red-600"
                                    } shadow-lg`}
                                  >
                                    {roleIcons[
                                      game.role as keyof typeof roleIcons
                                    ] || <User className="h-4 w-4" />}
                                  </div>

                                  <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 hover:border-blue-500/30 transition-colors duration-300">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <h3 className="font-medium text-lg">
                                          {game.role} - {game.result}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                          {game.date}
                                        </p>
                                      </div>
                                      <Badge
                                        variant={
                                          game.result === "Win"
                                            ? "default"
                                            : "outline"
                                        }
                                        className={
                                          game.result === "Win"
                                            ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 border-none"
                                            : "text-red-400 border-red-400"
                                        }
                                      >
                                        {game.result}
                                      </Badge>
                                    </div>

                                    <div className="text-sm">
                                      <div className="flex justify-between py-1 border-b border-gray-700">
                                        <span className="text-gray-400">
                                          Players
                                        </span>
                                        <span>{game.players}</span>
                                      </div>
                                      <div className="flex justify-between py-1 border-b border-gray-700">
                                        <span className="text-gray-400">
                                          Game Duration
                                        </span>
                                        <span>
                                          {Math.floor(Math.random() * 20) + 10}{" "}
                                          minutes
                                        </span>
                                      </div>
                                      <div className="flex justify-between py-1">
                                        <span className="text-gray-400">
                                          Survived
                                        </span>
                                        <span>
                                          {game.result === "Win" ? "Yes" : "No"}
                                        </span>
                                      </div>
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full mt-3 text-xs text-gray-400 hover:text-white"
                                    >
                                      View Game Details
                                    </Button>
                                  </div>
                                </motion.div>
                              ))}

                              <div className="relative pl-10">
                                <div className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-700">
                                  <ChevronRight className="h-4 w-4" />
                                </div>
                                <Button
                                  variant="outline"
                                  className="w-full border-dashed"
                                >
                                  Load More Games
                                </Button>
                              </div>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Avatar Builder Modal
      <AvatarBuilderModal
        open={avatarBuilderOpen}
        onOpenChange={setAvatarBuilderOpen}
        onSave={handleSaveAvatar}
        initialAvatar={avatarData}
      /> */}
    </div>
  );
}
