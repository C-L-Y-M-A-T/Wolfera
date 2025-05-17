"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/providers/theme-provider";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    username: string;
    email: string;
    bio: string;
  };
  onProfileChange: (field: string, value: string) => void;
  onSave: () => void;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  profile,
  onProfileChange,
  onSave,
}: EditProfileDialogProps) {
  const theme = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={"sm:max-w-[425px] bg-gray-900 border-gray-700"}>
        <DialogHeader>
          <DialogTitle className="text-red-400">Edit Profile</DialogTitle>
        </DialogHeader>
        <div
          className={` ${theme.typography.textColor.primary} space-y-4 py-4`}
        >
          <div className="space-y-2">
            <label htmlFor="username">Username</label>
            <Input
              id="username"
              value={profile.username}
              onChange={(e) => onProfileChange("username", e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => onProfileChange("email", e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="bio">Bio</label>
            <Textarea
              id="bio"
              rows={4}
              value={profile.bio}
              onChange={(e) => onProfileChange("bio", e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onSave}
            className={`bg-gradient-to-r ${theme.colors.gradients.redToRed} border-none`}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
