import { useState, useEffect } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import type { Theme, ThemeMode } from '@/types/theme';

// Fonction pour obtenir le thème effectif basé sur le mode
const getEffectiveTheme = (mode: ThemeMode): Theme => {
  if (mode === 'system') {
    if (typeof window !== 'undefined') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPrefersDark ? 'dark' : 'light';
    }
    return 'light';
  }
  return mode;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Mode de thème (light, dark, ou system)
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode') as ThemeMode;
      if (savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system')) {
        return savedMode;
      }
      // Si pas de mode sauvegardé, vérifier l'ancien système
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }
    }
    return 'system';
  });

  // Thème effectif (light ou dark) calculé à partir du mode
  const [theme, setTheme] = useState<Theme>(() => getEffectiveTheme(themeMode));

  // Fonction pour définir le mode de thème
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeMode', mode);
      // Supprimer l'ancienne clé pour compatibilité
      if (mode !== 'system') {
        localStorage.setItem('theme', mode);
      } else {
        localStorage.removeItem('theme');
      }
    }
  };

  // Appliquer le thème effectif au document
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme(themeMode);
    setTheme(effectiveTheme);
    
    const root = document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  // Écouter les changements de préférence système quand le mode est 'system'
  useEffect(() => {
    if (themeMode !== 'system' || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const effectiveTheme = e.matches ? 'dark' : 'light';
      setTheme(effectiveTheme);
      
      const root = document.documentElement;
      if (effectiveTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  const toggleTheme = () => {
    // Si on est en mode system, basculer vers light ou dark selon le thème actuel
    if (themeMode === 'system') {
      const newMode = theme === 'dark' ? 'light' : 'dark';
      setThemeMode(newMode);
    } else {
      // Sinon, basculer entre light et dark
      const newMode = themeMode === 'light' ? 'dark' : 'light';
      setThemeMode(newMode);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 