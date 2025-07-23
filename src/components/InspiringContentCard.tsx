
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ExternalLink, Heart, Eye } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type InspiringContent = Database['public']['Tables']['inspiring_content']['Row'];

interface InspiringContentCardProps {
  content: InspiringContent;
  className?: string;
}

const InspiringContentCard = ({ content, className }: InspiringContentCardProps) => {
  const handleOpenLink = () => {
    if (content.video_url) {
      window.open(content.video_url, '_blank');
    } else if (content.account_url) {
      window.open(content.account_url, '_blank');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white dark:bg-creatik-dark/50 rounded-xl p-4",
        "border border-gray-200 dark:border-gray-700",
        "hover:shadow-lg transition-all duration-200",
        "flex flex-col gap-3",
        className
      )}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight flex-1">
          {content.title}
        </h3>
        
        {(content.video_url || content.account_url) && (
          <button
            onClick={handleOpenLink}
            className="p-1 text-gray-500 hover:text-creatik-primary transition-colors"
          >
            <ExternalLink size={16} />
          </button>
        )}
      </div>

      {content.hook && (
        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
          <span className="font-medium">Hook:</span> {content.hook}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          {content.platform && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              {content.platform}
            </span>
          )}
          
          {content.format && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              {content.format}
            </span>
          )}
        </div>

        {content.popularity_score && (
          <div className="flex items-center gap-1">
            <Eye size={12} />
            <span>{content.popularity_score}</span>
          </div>
        )}
      </div>

      {content.hashtags && content.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {content.hashtags.slice(0, 3).map((hashtag, index) => (
            <span
              key={index}
              className="text-xs text-creatik-primary bg-creatik-primary/10 px-2 py-1 rounded-full"
            >
              #{hashtag}
            </span>
          ))}
          {content.hashtags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{content.hashtags.length - 3}
            </span>
          )}
        </div>
      )}

      {content.account_example && (
        <p className="text-xs text-gray-600 dark:text-gray-300">
          <span className="font-medium">Exemple:</span> {content.account_example}
        </p>
      )}
    </motion.div>
  );
};

export default InspiringContentCard;
