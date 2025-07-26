import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface EventsCalendarProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  events?: Array<{ date: string }>;
}

const EventsCalendar: React.FC<EventsCalendarProps> = ({ 
  selectedDate, 
  onSelect, 
  events = [] 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const hasEvents = (date: Date) => {
    return getEventsForDate(date).length > 0;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const renderCalendarDays = () => {
    const days = [];
    
    // Jours vides au début
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 sm:h-10" />);
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      
      days.push(
        <motion.button
          key={day}
          onClick={() => onSelect(date)}
          className={`
            relative h-8 w-8 sm:h-10 sm:w-10 rounded-full text-xs sm:text-sm font-medium transition-all duration-200
            ${isToday(date) 
              ? 'bg-blue-600 text-white' 
              : isSelected(date)
              ? 'bg-blue-500 text-white'
              : hasEvents(date)
              ? 'bg-neutral-700 text-white hover:bg-neutral-600'
              : 'text-gray-300 hover:bg-neutral-800 hover:text-white'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {day}
          {hasEvents(date) && (
            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full" />
          )}
        </motion.button>
      );
    }

    return days;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 sm:p-4 shadow-lg w-80 sm:w-96"
    >
      {/* Header du calendrier */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={previousMonth}
          className="text-gray-400 hover:text-white p-1"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        
        <h3 className="text-sm sm:text-lg font-semibold text-white text-center flex-1">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          className="text-gray-400 hover:text-white p-1"
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-6 sm:h-8 flex items-center justify-center text-xs font-medium text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {renderCalendarDays()}
      </div>

      {/* Légende */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-neutral-700">
        <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-600 rounded-full" />
            <span className="text-xs">Aujourd'hui</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full" />
            <span className="text-xs">Événements</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventsCalendar; 