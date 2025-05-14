import { Icon, Sparkles, User } from "lucide-react";
import { TabsList, TabsTrigger } from "../../ui/tabs";
import { scissorsHairComb } from "@lucide/lab";

export default function TabSection() {
  return (
    <TabsList className="w-full bg-gray-800 rounded-xl mb-10 p-0 flex overflow-hidden h-auto">
      {[
        {
          value: "face",
          icon: <User className="h-5 w-5" />,
          label: "Face",
        },
        {
          value: "hair",
          icon: <Icon iconNode={scissorsHairComb} className="h-5 w-5" />,
          label: "Hair",
        },
        {
          value: "style",
          icon: <Sparkles className="h-5 w-5" />,
          label: "Style",
        },
      ].map(({ value, icon, label }) => (
        <TabsTrigger
          key={value}
          value={value}
          className="flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all 
          text-gray-400 rounded-none border-0 min-h-[60px]
          data-[state=active]:bg-gray-900 
          data-[state=active]:text-red-400 
          data-[state=active]:shadow-none
          data-[state=active]:border-b-2
          data-[state=active]:border-red-500
          hover:bg-gray-700/50"
        >
          <div className="mb-1">{icon}</div>
          <span className="text-sm font-medium">{label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
