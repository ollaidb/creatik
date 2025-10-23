import React from 'react';
import { Button } from '@/components/ui/button';

type TabType = 'titres' | 'comptes' | 'sources' | 'hashtags' | 'hooks' | 'blog' | 'article' | 'mots-cles' | 'exemple' | 'idees' | 'podcast';

interface SubcategoryTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
  showHooks?: boolean;
  selectedNetwork?: string;
}

const SubcategoryTabs: React.FC<SubcategoryTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  className = "",
  showHooks = true,
  selectedNetwork = 'all'
}) => {
  // Déterminer quels onglets afficher selon le réseau
  const getVisibleTabs = (network: string): TabType[] => {
    switch (network.toLowerCase()) {
      case 'blog':
        return ['titres', 'sources', 'blog', 'mots-cles'];
      case 'article':
        return ['titres', 'sources', 'article', 'mots-cles'];
      case 'twitter':
        return ['exemple', 'comptes', 'sources', 'hashtags'];
      case 'instagram':
        return ['titres', 'comptes', 'sources', 'idees', 'hashtags'];
      case 'youtube':
        return ['titres', 'comptes', 'sources', 'hashtags', 'hooks'];
      case 'podcasts':
        return ['titres', 'sources', 'podcast', 'mots-cles'];
      case 'twitch':
        return ['titres', 'comptes', 'idees'];
      default:
        return ['titres', 'comptes', 'sources', 'hashtags'];
    }
  };

  const visibleTabs = getVisibleTabs(selectedNetwork);

  const getTabLabel = (tab: TabType): string => {
    switch (tab) {
      case 'titres': return 'Titres';
      case 'comptes': return 'Comptes';
      case 'sources': return 'Sources';
      case 'hashtags': return '#';
      case 'hooks': return 'Hooks';
      case 'blog': return 'Blog';
      case 'article': return 'Article';
      case 'mots-cles': return 'Mots-clés';
      case 'exemple': return 'Exemple';
      case 'idees': return 'Idées';
      case 'podcast': return 'Podcast';
      default: return tab;
    }
  };

  return (
    <div className={`flex gap-1 mb-4 justify-center overflow-x-auto scrollbar-hide ${className}`}>
      {visibleTabs.map((tab) => (
        <Button
          key={tab}
          variant={activeTab === tab ? 'default' : 'outline'}
          size="sm"
          className="rounded-full min-w-[60px] h-8 px-2 text-xs flex items-center justify-center"
          onClick={() => onTabChange(tab)}
        >
          {getTabLabel(tab)}
        </Button>
      ))}
    </div>
  );
};

export default SubcategoryTabs; 