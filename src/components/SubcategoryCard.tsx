import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Database } from "@/integrations/supabase/types";
type Subcategory = Database['public']['Tables']['subcategories']['Row'];
interface SubcategoryCardProps {
  subcategory: Subcategory;
  className?: string;
  onClick?: () => void;
}
const SubcategoryCard = ({ subcategory, className, onClick }: SubcategoryCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-gray-800/50 rounded-xl p-4 cursor-pointer",
        "border border-gray-200 dark:border-gray-700",
        "hover:shadow-lg transition-all duration-200",
        "flex flex-col gap-2",
        className
      )}
    >
      <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
        {subcategory.name}
      </h3>
      {subcategory.description && (
        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
          {subcategory.description}
        </p>
      )}
    </motion.div>
  );
};
export default SubcategoryCard;
