
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentIdea } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Heart, ExternalLink, Tag } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface ContentCardProps {
  idea: ContentIdea;
  onFavorite?: (id: string) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ idea, onFavorite }) => {
  const { theme } = useTheme();
  
  // Get platform icon
  const getPlatformIcon = () => {
    switch (idea.platform) {
      case "tiktok":
        return "TikTok";
      case "instagram":
        return "IG";
      case "youtube":
        return "YT";
      case "all":
      default:
        return "All";
    }
  };

  // Get background color based on theme
  const getBgColor = () => {
    if (theme === 'dark') {
      return "bg-gradient-to-br from-gray-900 to-black";
    }
    return "bg-gradient-to-br from-white to-slate-50";
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className={`h-full overflow-hidden ${getBgColor()} border shadow-md`}>
        {/* Image/Header section */}
        <div className="h-36 bg-gradient-to-r from-primary/30 to-secondary/30 relative">
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onFavorite && onFavorite(idea.id)}
              className={cn(
                "h-8 w-8 rounded-full bg-black/10 backdrop-blur-sm",
                idea.isFavorite ? "text-pink-500" : "text-white"
              )}
            >
              <Heart className="h-4 w-4" fill={idea.isFavorite ? "currentColor" : "none"} />
            </Button>
          </div>
          
          <div className="absolute bottom-2 left-2 flex gap-1">
            <span className="inline-flex items-center rounded-full bg-black/20 backdrop-blur-sm px-2 py-1 text-xs font-medium text-white">
              {getPlatformIcon()}
            </span>
            <span className="inline-flex items-center rounded-full bg-black/20 backdrop-blur-sm px-2 py-1 text-xs font-medium text-white">
              {idea.type}
            </span>
          </div>
        </div>
        
        {/* Content section */}
        <CardContent className="p-4">
          <h3 className="text-base font-semibold mb-1 line-clamp-1">{idea.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{idea.description}</p>
          
          <div className="flex justify-between items-center">
            <div className="text-xs flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span className="text-muted-foreground">
                Popularité: {idea.popularity}%
              </span>
            </div>
            <Button size="sm" variant="outline" className="text-xs gap-1 h-7 px-2">
              Voir plus
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContentCard;
