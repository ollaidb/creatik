import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Challenge } from "@/types";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
interface ChallengeCardProps {
  challenge: Challenge;
  onAccept?: (id: string) => void;
}
const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onAccept }) => {
  const { theme } = useTheme();
  // Function to get icon based on challenge category
  const getChallengeIcon = () => {
    switch (challenge.category) {
      case "education":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
          </svg>
        );
      case "entertainment":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="m15 5 4 4-4 4"></path><path d="M5 9h14"></path>
            <path d="m9 19-4-4 4-4"></path><path d="M5 15h14"></path>
          </svg>
        );
      case "business":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="m5 8 6 6"></path><path d="m4 14 10-10 6 6-10 10-6-6Z"></path>
            <path d="M14 4v4h4"></path><path d="M10 14v4h4"></path><path d="m5 8 4 4"></path>
          </svg>
        );
    }
  };
  // Get background color based on difficulty
  const getBgColor = () => {
    if (theme === "dark") {
      switch (challenge.difficulty) {
        case "easy":
          return "bg-gradient-to-r from-green-500/30 to-green-500/20";
        case "medium":
          return "bg-gradient-to-r from-orange-500/30 to-orange-500/20";
        case "hard":
          return "bg-gradient-to-r from-red-500/30 to-red-500/20";
        default:
          return "bg-gradient-to-r from-primary/30 to-primary/20";
      }
    } else {
      switch (challenge.difficulty) {
        case "easy":
          return "bg-gradient-to-r from-green-500/20 to-green-500/10";
        case "medium":
          return "bg-gradient-to-r from-orange-500/20 to-orange-500/10";
        case "hard":
          return "bg-gradient-to-r from-red-500/20 to-red-500/10";
        default:
          return "bg-gradient-to-r from-primary/20 to-primary/10";
      }
    }
  };
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className={`${getBgColor()} border-none shadow-sm hover:shadow-md transition-shadow h-full`}>
        <div className="flex items-center p-4 gap-3 h-full">
          <div className="flex-shrink-0 bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-50 rounded-md p-2">
            {getChallengeIcon()}
          </div>
          <div className="flex-grow">
            <h3 className="font-medium">{challenge.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{challenge.description}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-shrink-0"
            onClick={() => onAccept && onAccept(challenge.id)}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
export default ChallengeCard;
