import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { motion, AnimatePresence } from 'framer-motion';

const TodayEventsSection: React.FC = () => {
  const { getEventsForDate, loading, error } = useEvents();
  const [open, setOpen] = useState(true);

  // Formater la date d'aujourd'hui
  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const todayEvents = getEventsForDate(today);

  const handleEventClick = (eventId: string) => {
    window.location.href = `/events?event=${eventId}`;
  };

  const handleSectionClick = () => {
    window.location.href = '/events';
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(v => !v);
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-900 rounded-xl sm:rounded-2xl py-4 sm:py-6 px-3 sm:px-4">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex-1">
            Quoi poster aujourd'hui - {formattedDate}
          </h2>
        </div>
        <div className="animate-pulse space-y-2 sm:space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 sm:h-12 bg-neutral-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gray-900 rounded-xl sm:rounded-2xl py-4 sm:py-6 px-3 sm:px-4">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex-1">
            Quoi poster aujourd'hui - {formattedDate}
          </h2>
        </div>
        <p className="text-sm text-gray-200">Erreur lors du chargement</p>
      </div>
    );
  }

  return (
    <div 
      className="w-full bg-gray-900 rounded-xl sm:rounded-2xl py-4 sm:py-6 px-3 sm:px-4 cursor-pointer transition-colors duration-200"
      onClick={handleSectionClick}
    >
      <div className="flex items-center gap-2 mb-3 sm:mb-4 select-none">
        <Calendar className="h-4 w-4 sm:h-5 sm:w-6 text-white flex-shrink-0" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex-1 min-w-0">
          Quoi poster aujourd'hui - {formattedDate}
        </h2>
        <button
          onClick={handleToggleClick}
          className="text-gray-400 hover:text-white transition-colors p-1"
          aria-label={open ? "Masquer les événements" : "Afficher les événements"}
        >
          {open ? <ChevronUp className="h-4 w-4 sm:h-5 sm:w-6" /> : <ChevronDown className="h-4 w-4 sm:h-5 sm:w-6" />}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="events-list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {todayEvents.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-base sm:text-lg text-gray-200">Aucun événement aujourd'hui</p>
                <p className="text-xs text-gray-400 mt-1">Cliquez pour voir tous les événements</p>
              </div>
            ) : (
              <div className="space-y-1 sm:space-y-2">
                {todayEvents.slice(0, 5).map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="relative"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                  >
                    {/* Séparateur visuel */}
                    {index > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ 
                          delay: index * 0.1 + 0.1,
                          duration: 0.3
                        }}
                        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent"
                      />
                    )}
                    
                    <motion.button
                      className="w-full text-left p-3 sm:p-4 rounded-lg font-bold text-white text-sm sm:text-base md:text-lg border border-transparent hover:text-blue-300 hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-none transition-all duration-200 cursor-pointer shadow-sm leading-tight"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event.id);
                      }}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -2,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                      }}
                      whileTap={{ 
                        scale: 0.98, 
                        y: 0,
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)"
                      }}
                    >
                      {event.title}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TodayEventsSection; 