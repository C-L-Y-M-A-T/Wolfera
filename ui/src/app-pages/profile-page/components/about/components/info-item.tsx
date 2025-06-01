import { useTheme } from "@/components";
import { motion } from "framer-motion";

interface InfoItemProps {  
  icon: React.ReactNode;  
  label: string;  
  value: string;  
}  

export const InfoItem = ({ icon, label, value }: InfoItemProps) => {  
  const theme = useTheme();  
  
  return (  
    <motion.div  
      variants={theme.variants.item}  
      className={theme.gameStyles.cards.infoItem}  
    >  
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />  
      <div className="relative p-4">  
        <div className="flex items-center mb-2">  
          {icon}  
          <h3 className="font-medium text-sm text-gray-400">{label}</h3>  
        </div>  
        <p className={`${theme.typography.fontSize.lg} ${theme.typography.textColor.primary}`}>  
          {value}  
        </p>  
      </div>  
    </motion.div>  
  );  
};  