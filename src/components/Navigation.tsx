import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
interface NavigationProps {
  className?: string;
}
const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Determine active tab based on current path
  const currentPath = location.pathname;
  const activeTab = 
    currentPath === "/" ? "home" :
    currentPath.startsWith("/categories") ? "categories" :
    currentPath.startsWith("/publish") ? "publish" :
    currentPath.startsWith("/favorites") || currentPath.startsWith("/profile/favorites") ? "favorites" :
    currentPath.startsWith("/profile") ? "profile" : "home";
  const tabs = [
    { id: "home", label: "Accueil", icon: "home", path: "/" },
    { id: "categories", label: "Catégories", icon: "categories", path: "/categories" },
    { id: "publish", label: "Publier", icon: "publish", path: "/publish" },
    { id: "favorites", label: "Favoris", icon: "favorites", path: "/profile/favorites" },
    { id: "profile", label: "Profil", icon: "profile", path: "/profile" },
  ];
  const handleTabClick = (path: string) => {
    navigate(path);
  };
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-white dark:bg-card shadow-lg z-30 border-t",
      className
    )}>
      <div className="flex justify-around items-center h-14 sm:h-16 max-w-xl mx-auto px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full relative py-1 px-1 min-w-0",
              activeTab === tab.id 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleTabClick(tab.path)}
          >
            {/* Icônes - Taille responsive */}
            {tab.icon === "home" && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={activeTab === tab.id ? 1.8 : 1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            )}
            {tab.icon === "categories" && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={activeTab === tab.id ? 1.8 : 1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            )}
            {tab.icon === "publish" && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={activeTab === tab.id ? 1.8 : 1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            )}
            {tab.icon === "favorites" && (
              <svg xmlns="http://www.w3.org/2000/svg" fill={activeTab === tab.id ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={activeTab === tab.id ? 1.8 : 1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            )}
            {tab.icon === "profile" && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={activeTab === tab.id ? 1.8 : 1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            )}
            <span className="text-xs mt-0.5 sm:mt-1 truncate leading-tight">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="navigation-indicator"
                className="absolute bottom-0 w-8 sm:w-12 h-1 bg-primary rounded-t-full"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
export default Navigation;
