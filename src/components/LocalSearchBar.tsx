import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LocalSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const LocalSearchBar: React.FC<LocalSearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Rechercher...",
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
};

export default LocalSearchBar; 