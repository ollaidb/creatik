import React from 'react';
import { Button } from '@/components/ui/button';

interface SubcategoryTabsProps {
  activeTab: 'titres' | 'comptes' | 'sources' | 'hashtags';
  onTabChange: (tab: 'titres' | 'comptes' | 'sources' | 'hashtags') => void;
  className?: string;
}

const SubcategoryTabs: React.FC<SubcategoryTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  className = "" 
}) => {
  return (
    <div className={`flex gap-2 mb-6 justify-center ${className}`}>
      <Button
        variant={activeTab === 'titres' ? 'default' : 'outline'}
        size="sm"
        className="rounded-full"
        onClick={() => onTabChange('titres')}
      >
        Titres
      </Button>
      <Button
        variant={activeTab === 'comptes' ? 'default' : 'outline'}
        size="sm"
        className="rounded-full"
        onClick={() => onTabChange('comptes')}
      >
        Comptes
      </Button>
      <Button
        variant={activeTab === 'sources' ? 'default' : 'outline'}
        size="sm"
        className="rounded-full"
        onClick={() => onTabChange('sources')}
      >
        Sources
      </Button>
      <Button
        variant={activeTab === 'hashtags' ? 'default' : 'outline'}
        size="sm"
        className="rounded-full"
        onClick={() => onTabChange('hashtags')}
      >
        #
      </Button>
    </div>
  );
};

export default SubcategoryTabs; 