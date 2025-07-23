
import React from 'react';
import { useThemes } from '@/hooks/useThemes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ThemeSelectorProps {
  selectedTheme?: string;
  onThemeChange: (themeId: string) => void;
}

const ThemeSelector = ({ selectedTheme, onThemeChange }: ThemeSelectorProps) => {
  const { data: themes, isLoading } = useThemes();

  if (isLoading) {
    return (
      <div className="w-48 h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
    );
  }

  return (
    <Select value={selectedTheme || 'all'} onValueChange={onThemeChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Sélectionner un thème" />
      </SelectTrigger>
      <SelectContent>
        {themes?.map((theme) => (
          <SelectItem key={theme.id} value={theme.name === 'Tout' ? 'all' : theme.id}>
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ThemeSelector;
