
import React, { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface InspirationCardProps {
  color: string;
  quote: string;
  path: string;
  index: number;
  currentIndex: number;
  dragConstraints: React.RefObject<HTMLDivElement>;
}

const inspirationCards = [
  {
    color: "from-violet-500 to-purple-700",
    quote: "Tu as une idée ? Fais-la vivre.",
    path: "/ideas/trending"
  },
  {
    color: "from-blue-500 to-indigo-600",
    quote: "Crée pour être vu, pas pour être parfait.",
    path: "/challenges"
  },
  {
    color: "from-emerald-500 to-teal-700",
    quote: "L'inspiration est partout. Ouvre les yeux.",
    path: "/categories/explore"
  },
  {
    color: "from-amber-500 to-orange-600",
    quote: "Ton prochain contenu viral t'attend ici.",
    path: "/ideas/create"
  },
  {
    color: "from-pink-500 to-rose-700",
    quote: "Innove aujourd'hui, inspire demain.",
    path: "/profile/creations"
  }
];

const InspirationCard: React.FC<InspirationCardProps> = ({
  color,
  quote,
  path,
  index,
  currentIndex,
  dragConstraints
}) => {
  const navigate = useNavigate();
  const isActive = index === currentIndex;
  
  const handleCardClick = () => {
    if (isActive) {
      navigate(path);
    }
  };
  
  return (
    <motion.div
      layout
      className={cn(
        "absolute inset-x-0 mx-auto bg-gradient-to-br w-full h-full max-w-xl rounded-xl shadow-lg cursor-pointer",
        `${color}`
      )}
      style={{
        zIndex: inspirationCards.length - Math.abs(index - currentIndex),
        y: (index - currentIndex) * 40, // Reduced distance between cards
        scale: 1 - Math.abs(index - currentIndex) * 0.05,
        opacity: 1 - Math.abs(index - currentIndex) * 0.2,
      }}
      animate={{
        y: (index - currentIndex) * 40, // Consistent with initial position
        scale: 1 - Math.abs(index - currentIndex) * 0.05,
        opacity: 1 - Math.abs(index - currentIndex) * 0.2,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-center h-full p-6">
        <h3 className="text-center text-2xl md:text-3xl font-bold text-white">{quote}</h3>
      </div>
    </motion.div>
  );
};

const InspirationCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const constraintsRef = React.useRef<HTMLDivElement>(null);
  let dragStartY = 0;
  
  const handleDragStart = (e: MouseEvent | TouchEvent | PointerEvent) => {
    if ('clientY' in e) {
      dragStartY = e.clientY;
    }
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if ('clientY' in e) {
      const dragEndY = e.clientY;
      const dragDistance = dragStartY - dragEndY;
      
      // If dragged down, go to previous card
      if (dragDistance < -50 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
      // If dragged up, go to next card
      else if (dragDistance > 50 && currentIndex < inspirationCards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };
  
  return (
    <div className="py-6 overflow-hidden">
      <motion.div 
        ref={constraintsRef}
        className="relative h-[70vh] flex items-center justify-center"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {inspirationCards.map((card, index) => (
          <InspirationCard
            key={index}
            {...card}
            index={index}
            currentIndex={currentIndex}
            dragConstraints={constraintsRef}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default InspirationCarousel;
