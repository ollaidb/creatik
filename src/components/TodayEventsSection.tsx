import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useTodayEvents } from '@/hooks/useTodayEvents';

const TodayEventsSection: React.FC = () => {
  const [open, setOpen] = useState(true);
  const { events: todayEvents, loading, error, fetchTodayEvents } = useTodayEvents();

  // Formater la date d'aujourd'hui avec useMemo
  const today = useMemo(() => new Date(), []);
  const formattedDate = today.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Charger les événements d'aujourd'hui
  useEffect(() => {
    fetchTodayEvents();
  }, [fetchTodayEvents]);

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
                <p className="text-gray-400 text-sm">Aucun événement aujourd'hui</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {todayEvents.slice(0, 5).map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-neutral-800 rounded-lg p-3 sm:p-4 hover:bg-neutral-700 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event.id);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          event.type === 'holiday' ? 'bg-blue-500' :
                          event.type === 'birthday' ? 'bg-pink-500' :
                          event.type === 'anniversary' ? 'bg-purple-500' :
                          event.type === 'cultural' ? 'bg-green-500' :
                          'bg-gray-500'
                        }`}>
                          {event.type === 'holiday' ? '🎉' :
                           event.type === 'birthday' ? '🎂' :
                           event.type === 'anniversary' ? '🎊' :
                           event.type === 'cultural' ? '🎭' :
                           '📅'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-sm sm:text-base line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mt-1">
                          {event.description}
                        </p>
                        {event.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {event.hashtags.slice(0, 3).map((hashtag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-neutral-700 text-gray-300 px-2 py-1 rounded-full"
                              >
                                {hashtag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {todayEvents.length > 5 && (
                  <div className="text-center pt-2">
                    <p className="text-gray-400 text-sm">
                      +{todayEvents.length - 5} autres événements
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TodayEventsSection; 