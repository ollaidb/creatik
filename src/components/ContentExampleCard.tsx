import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ExternalLink, User } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
type ContentExample = Database['public']['Tables']['content_examples']['Row'];
interface ContentExampleCardProps {
  example: ContentExample;
  className?: string;
}
const ContentExampleCard = ({ example, className }: ContentExampleCardProps) => {
  const handleOpenLink = () => {
    if (example.content_url) {
      window.open(example.content_url, '_blank');
    }
  };
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white dark:bg-gray-800/50 rounded-xl p-4",
        "border border-gray-200 dark:border-gray-700",
        "hover:shadow-lg transition-all duration-200",
        "flex flex-col gap-3",
        className
      )}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight flex-1">
          {example.title}
        </h3>
        <button
          onClick={handleOpenLink}
          className="p-1 text-gray-500 hover:text-primary transition-colors"
        >
          <ExternalLink size={16} />
        </button>
      </div>
      {example.description && (
        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
          {example.description}
        </p>
      )}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <User size={12} />
          <span>{example.creator_name}</span>
        </div>
        <div className="flex items-center gap-2">
          {example.platform && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
              {example.platform}
            </span>
          )}
          {example.format && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
              {example.format}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default ContentExampleCard;
