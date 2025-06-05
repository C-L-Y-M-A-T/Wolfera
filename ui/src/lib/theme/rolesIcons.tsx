import { Axe, Eye, FlaskRound, Shield, Skull, Users } from "lucide-react";

export const roleIcons = {
  villager: <Users className="h-4 w-4" />,
  werewolf: <Skull className="h-4 w-4" />,
  seer: <Eye className="h-4 w-4" />,
  doctor: <Shield className="h-4 w-4" />,
  hunter: <Axe className="h-4 w-4" />,
  witch: <FlaskRound className="h-4 w-4" />,
};

export const getRoleIcon = (role: string): React.ReactNode => {
  return (
    roleIcons[role.toLowerCase() as keyof typeof roleIcons] || (
      <Users className="h-4 w-4" />
    )
  );
};
