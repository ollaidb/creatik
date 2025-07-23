
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FunctionalSearchBar from "./FunctionalSearchBar";

interface StickyHeaderProps {
  showSearchBar?: boolean;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({ showSearchBar = true }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (window.location.pathname === '/') {
      // Si on est déjà sur la page d'accueil, remonter en haut
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Sinon, naviguer vers l'accueil
      navigate('/');
    }
  };

  const handleSearch = (query: string) => {
    // Naviguer vers la page d'accueil avec la recherche
    navigate(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] dark:from-creatik-dark dark:to-[#2C2C54]/80 shadow-sm">
      <div className="creatik-container py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo cliquable avec animation */}
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-creatik-primary to-creatik-secondary bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity select-none"
            onClick={handleLogoClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ 
              scale: 0.95,
              rotate: [0, -5, 5, -3, 3, 0],
              transition: { duration: 0.5 }
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            CréaTik
          </motion.h1>
          
          {/* SearchBar */}
          {showSearchBar && (
            <div className="flex-1 max-w-2xl">
              <FunctionalSearchBar onSearch={handleSearch} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickyHeader;
