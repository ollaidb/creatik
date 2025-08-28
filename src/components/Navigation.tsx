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
    (currentPath.startsWith("/challenges") || currentPath.startsWith("/public-challenges")) ? "challenges" :
    currentPath.startsWith("/profile") ? "profile" : "home";

  const tabs = [
    { id: "home", label: "Accueil", icon: "home", path: "/" },
    { id: "categories", label: "Catégories", icon: "categories", path: "/categories" },
    { id: "publish", label: "Publier", icon: "publish", path: "/publish" },
    { id: "challenges", label: "Challenges", icon: "challenges", path: "/public-challenges" },
    { id: "profile", label: "Profil", icon: "profile", path: "/profile" },
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/90 to-background/80 backdrop-blur-md border-t border-border/50 z-30",
      className
    )}>
      <div className="flex justify-around items-center h-14 sm:h-16 max-w-xl mx-auto px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full relative py-0.5 px-1 min-w-0 transition-all duration-300",
              activeTab === tab.id 
                ? "text-primary font-semibold" 
                : "text-muted-foreground/80 hover:text-foreground/90"
            )}
            onClick={() => handleTabClick(tab.path)}
          >
            {/* Icônes avec background transparent et dégradé */}
            {tab.icon === "home" && (
              <div className="p-2 rounded-full bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/20 hover:to-primary/5 transition-all duration-300 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={activeTab === tab.id ? 2.2 : 2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 drop-shadow-sm">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              </div>
            )}
            {tab.icon === "categories" && (
              <div className="p-2 rounded-full bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/20 hover:to-primary/5 transition-all duration-300 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={activeTab === tab.id ? 2.2 : 2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 drop-shadow-sm">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 018.25 18H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 0118 18h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
              </svg>
              </div>
            )}
            {tab.icon === "publish" && (
              <div className="p-2 rounded-full bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/20 hover:to-primary/5 transition-all duration-300 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={activeTab === tab.id ? 2.2 : 2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 drop-shadow-sm">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              </div>
            )}
            {tab.icon === "challenges" && (
              <div className="p-2 rounded-full bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/20 hover:to-primary/5 transition-all duration-300 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={activeTab === tab.id ? 2.2 : 2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 drop-shadow-sm">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
            )}
            {tab.icon === "profile" && (
              <div className="p-2 rounded-full bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/20 hover:to-primary/5 transition-all duration-300 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={activeTab === tab.id ? 2.2 : 2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 drop-shadow-sm">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              </div>
            )}

            {/* Nom de la page en-dessous de l'icône */}
            <span className={cn(
              "text-xs sm:text-sm mt-0.5 truncate leading-tight font-medium drop-shadow-sm",
              activeTab === tab.id 
                ? "text-primary font-semibold" 
                : "text-muted-foreground/80"
            )}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
