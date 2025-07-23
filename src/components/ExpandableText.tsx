
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ExpandableTextProps {
  text: string;
  maxSentences?: number;
  className?: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ 
  text, 
  maxSentences = 3, 
  className = "" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  // Diviser le texte en phrases
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  
  if (sentences.length <= maxSentences) {
    return <p className={className}>{text}</p>;
  }

  const truncatedText = sentences.slice(0, maxSentences).join(' ');
  const displayText = isExpanded ? text : truncatedText;

  return (
    <div className={className}>
      <p className="mb-2">{displayText}</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-creatik-primary hover:text-creatik-primary/80 p-0 h-auto font-medium"
      >
        {isExpanded ? 'Voir moins' : 'Voir plus'}
      </Button>
    </div>
  );
};

export default ExpandableText;
