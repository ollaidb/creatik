
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ExternalLink, AtSign } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type ExemplaryAccount = Database['public']['Tables']['exemplary_accounts']['Row'];

interface ExemplaryAccountCardProps {
  account: ExemplaryAccount;
  className?: string;
}

const ExemplaryAccountCard = ({ account, className }: ExemplaryAccountCardProps) => {
  const handleOpenLink = () => {
    if (account.account_url) {
      window.open(account.account_url, '_blank');
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
        <div className="flex items-center gap-2 flex-1">
          <AtSign size={16} className="text-creatik-primary" />
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
            {account.account_name}
          </h3>
        </div>
        
        <button
          onClick={handleOpenLink}
          className="p-1 text-gray-500 hover:text-creatik-primary transition-colors"
        >
          <ExternalLink size={16} />
        </button>
      </div>

      {account.description && (
        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
          {account.description}
        </p>
      )}

      <div className="flex justify-end">
        <span className="px-2 py-1 bg-creatik-primary/10 text-creatik-primary rounded-full text-xs font-medium">
          {account.platform}
        </span>
      </div>
    </motion.div>
  );
};

export default ExemplaryAccountCard;
