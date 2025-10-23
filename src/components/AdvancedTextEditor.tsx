import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Type,
  Save,
  Undo,
  Redo,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Hash,
  AtSign,
  Smile,
  Calendar,
  Clock,
  Target,
  Users,
  TrendingUp,
  Heart,
  MessageSquare,
  Share2,
  Zap,
  Star,
  Bookmark,
  Tag,
  Filter,
  Search,
  Plus,
  Minus,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Folder,
  FileText,
  Lightbulb,
  Settings,
  Download,
  Upload,
  Copy,
  Trash2,
  Edit3,
  Lock,
  Unlock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface AdvancedTextEditorProps {
  initialContent?: string;
  initialTitle?: string;
  documentType: 'content' | 'account_idea';
  onSave: (title: string, content: string, metadata: any) => void;
  onAutoSave?: (title: string, content: string) => void;
  className?: string;
  placeholder?: string;
  showToolbar?: boolean;
  showSidebar?: boolean;
  showPreview?: boolean;
  maxLength?: number;
  socialNetwork?: string;
  accountArea?: string;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  tooltip?: string;
  shortcut?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  onClick,
  isActive = false,
  disabled = false,
  tooltip,
  shortcut
}) => (
  <Button
    variant={isActive ? "default" : "ghost"}
    size="sm"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "h-8 w-8 p-0",
      isActive && "bg-primary text-primary-foreground",
      disabled && "opacity-50 cursor-not-allowed"
    )}
    title={tooltip}
  >
    {icon}
  </Button>
);

const AdvancedTextEditor: React.FC<AdvancedTextEditorProps> = ({
  initialContent = '',
  initialTitle = '',
  documentType,
  onSave,
  onAutoSave,
  className,
  placeholder = 'Commencez à écrire...',
  showToolbar = true,
  showSidebar = true,
  showPreview = true,
  maxLength = 10000,
  socialNetwork,
  accountArea
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreviewMode, setShowPreviewMode] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showSocialSettings, setShowSocialSettings] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Métadonnées pour les paramètres de réseaux sociaux
  const [socialSettings, setSocialSettings] = useState({
    targetAudience: '',
    contentGoals: [] as string[],
    hashtags: [] as string[],
    postingTimeSuggestion: null as Date | null,
    engagementStrategy: '',
    callToAction: '',
    visualRequirements: ''
  });

  // Métadonnées pour les paramètres de compte
  const [accountSettings, setAccountSettings] = useState({
    accountArea: accountArea || '',
    priorityLevel: 'medium' as 'low' | 'medium' | 'high',
    implementationStatus: 'idea' as 'idea' | 'planning' | 'in_progress' | 'completed' | 'on_hold',
    targetDate: null as Date | null,
    resourcesNeeded: [] as string[],
    successMetrics: [] as string[],
    notes: ''
  });

  // Templates prédéfinis
  const contentTemplates = {
    instagram: {
      'Post Carrousel': '📸 **Titre accrocheur**\n\n[Votre contenu principal]\n\n#hashtag1 #hashtag2 #hashtag3\n\n💬 Qu\'en pensez-vous ?',
      'Story': '✨ **Titre court**\n\n[Contenu de votre story]\n\n👆 Swipe up pour en savoir plus !',
      'Reel': '🎬 **Titre viral**\n\n[Description de votre reel]\n\n#reel #viral #trending'
    },
    tiktok: {
      'Vidéo Trend': '🔥 **Titre tendance**\n\n[Description de votre vidéo]\n\n#fyp #viral #trending #foryou',
      'Tutoriel': '📚 **Comment faire...**\n\n[Étapes de votre tutoriel]\n\n#tutorial #howto #tips'
    },
    twitter: {
      'Tweet': '[Votre tweet - max 280 caractères]',
      'Thread': '1/ [Premier tweet]\n\n2/ [Deuxième tweet]\n\n3/ [Troisième tweet]'
    },
    linkedin: {
      'Article': '# [Titre de votre article]\n\n## Introduction\n\n[Votre contenu]\n\n## Conclusion\n\n[Votre conclusion]',
      'Post': '[Votre post professionnel]\n\n#linkedin #professional #networking'
    }
  };

  const accountTemplates = {
    bio: '## Bio Optimisée\n\n**Version actuelle :**\n[Votre bio actuelle]\n\n**Améliorations suggérées :**\n- [Point 1]\n- [Point 2]\n- [Point 3]\n\n**Nouvelle version :**\n[Votre nouvelle bio]',
    strategy: '## Stratégie de Compte\n\n**Objectifs :**\n- [Objectif 1]\n- [Objectif 2]\n\n**Actions à mettre en place :**\n1. [Action 1]\n2. [Action 2]\n\n**Métriques de succès :**\n- [Métrique 1]\n- [Métrique 2]',
    growth: '## Plan de Croissance\n\n**Audience cible :**\n[Description de votre audience]\n\n**Stratégies :**\n- [Stratégie 1]\n- [Stratégie 2]\n\n**Timeline :**\n- Semaine 1 : [Action]\n- Semaine 2 : [Action]'
  };

  // Calculer le nombre de mots et le temps de lecture
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setReadingTime(Math.max(1, Math.ceil(words.length / 200))); // 200 mots par minute
  }, [content]);

  // Auto-save
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    if (hasUnsavedChanges && onAutoSave) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        onAutoSave(title, content);
        setLastAutoSave(new Date());
        setHasUnsavedChanges(false);
      }, 2000); // Auto-save après 2 secondes d'inactivité
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [title, content, hasUnsavedChanges, onAutoSave]);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'b':
            e.preventDefault();
            applyFormatting('bold');
            break;
          case 'i':
            e.preventDefault();
            applyFormatting('italic');
            break;
          case 'u':
            e.preventDefault();
            applyFormatting('underline');
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              // Redo
            } else {
              // Undo
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSave = useCallback(() => {
    const metadata = {
      wordCount,
      readingTime,
      socialSettings: documentType === 'content' ? socialSettings : undefined,
      accountSettings: documentType === 'account_idea' ? accountSettings : undefined,
      lastEdited: new Date()
    };

    onSave(title, content, metadata);
    setHasUnsavedChanges(false);
  }, [title, content, wordCount, readingTime, socialSettings, accountSettings, documentType, onSave]);

  const applyFormatting = (format: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newText = '';
    let newStart = start;
    let newEnd = end;

    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        newStart = start + 2;
        newEnd = end + 2;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        newStart = start + 1;
        newEnd = end + 1;
        break;
      case 'underline':
        newText = `<u>${selectedText}</u>`;
        newStart = start + 3;
        newEnd = end + 3;
        break;
      case 'strikethrough':
        newText = `~~${selectedText}~~`;
        newStart = start + 2;
        newEnd = end + 2;
        break;
      case 'code':
        newText = `\`${selectedText}\``;
        newStart = start + 1;
        newEnd = end + 1;
        break;
      case 'quote':
        newText = `> ${selectedText}`;
        newStart = start + 2;
        newEnd = end + 2;
        break;
      case 'link':
        setLinkText(selectedText);
        setShowLinkDialog(true);
        return;
      case 'image':
        setShowImageDialog(true);
        return;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
    setHasUnsavedChanges(true);

    // Restaurer la sélection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  const insertLink = () => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const linkMarkdown = `[${linkText || 'lien'}](${linkUrl})`;

    const newContent = content.substring(0, start) + linkMarkdown + content.substring(end);
    setContent(newContent);
    setHasUnsavedChanges(true);

    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkText('');
  };

  const insertImage = () => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const imageMarkdown = `![Image](${imageUrl})`;

    const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
    setContent(newContent);
    setHasUnsavedChanges(true);

    setShowImageDialog(false);
    setImageUrl('');
  };

  const insertTemplate = (template: string) => {
    setContent(template);
    setHasUnsavedChanges(true);
    setShowTemplatePicker(false);
  };

  const insertEmoji = (emoji: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newContent = content.substring(0, start) + emoji + content.substring(start);
    setContent(newContent);
    setHasUnsavedChanges(true);

    setShowEmojiPicker(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasUnsavedChanges(true);
  };

  const renderPreview = () => {
    // Simple markdown renderer (vous pouvez utiliser une bibliothèque comme react-markdown)
    const renderMarkdown = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/~~(.*?)~~/g, '<del>$1</del>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
        .replace(/\n/g, '<br>');
    };

    return (
      <div 
        className="prose prose-sm max-w-none p-4"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
    );
  };

  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

  return (
    <div className={cn(
      "flex flex-col h-full bg-background",
      isFullscreen && "fixed inset-0 z-50",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Input
            value={title}
            onChange={handleTitleChange}
            placeholder="Titre du document..."
            className="text-lg font-semibold border-none shadow-none focus-visible:ring-0"
          />
          {hasUnsavedChanges && (
            <Badge variant="secondary" className="text-xs">
              Modifications non sauvegardées
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {wordCount} mots • {readingTime} min de lecture
          </div>
          {lastAutoSave && (
            <div className="text-xs text-muted-foreground">
              Sauvegardé à {lastAutoSave.toLocaleTimeString()}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreviewMode(!showPreviewMode)}
          >
            {showPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 border-r border-border bg-muted/10 p-4 overflow-y-auto">
            <Tabs defaultValue="settings" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
                <TabsTrigger value="templates">Modèles</TabsTrigger>
              </TabsList>
              
              <TabsContent value="settings" className="space-y-4">
                {documentType === 'content' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Paramètres Réseaux Sociaux</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs">Réseau social</Label>
                        <Input
                          value={socialNetwork || ''}
                          placeholder="Instagram, TikTok, Twitter..."
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Audience cible</Label>
                        <Textarea
                          value={socialSettings.targetAudience}
                          onChange={(e) => setSocialSettings(prev => ({ ...prev, targetAudience: e.target.value }))}
                          placeholder="Décrivez votre audience..."
                          className="text-sm min-h-[60px]"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Hashtags</Label>
                        <Input
                          placeholder="#hashtag1 #hashtag2"
                          className="text-sm"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {documentType === 'account_idea' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Paramètres Compte</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs">Zone du compte</Label>
                        <Input
                          value={accountSettings.accountArea}
                          onChange={(e) => setAccountSettings(prev => ({ ...prev, accountArea: e.target.value }))}
                          placeholder="Bio, Stratégie, Croissance..."
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Priorité</Label>
                        <select
                          value={accountSettings.priorityLevel}
                          onChange={(e) => setAccountSettings(prev => ({ ...prev, priorityLevel: e.target.value as any }))}
                          className="w-full p-2 border border-border rounded-md bg-background text-sm"
                        >
                          <option value="low">Faible</option>
                          <option value="medium">Moyenne</option>
                          <option value="high">Élevée</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">Statut</Label>
                        <select
                          value={accountSettings.implementationStatus}
                          onChange={(e) => setAccountSettings(prev => ({ ...prev, implementationStatus: e.target.value as any }))}
                          className="w-full p-2 border border-border rounded-md bg-background text-sm"
                        >
                          <option value="idea">Idée</option>
                          <option value="planning">Planification</option>
                          <option value="in_progress">En cours</option>
                          <option value="completed">Terminé</option>
                          <option value="on_hold">En attente</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mots</span>
                      <span className="font-medium">{wordCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Temps de lecture</span>
                      <span className="font-medium">{readingTime} min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Caractères</span>
                      <span className="font-medium">{content.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Modèles de contenu</Label>
                  {documentType === 'content' && socialNetwork && contentTemplates[socialNetwork as keyof typeof contentTemplates] && (
                    <div className="space-y-2">
                      {Object.entries(contentTemplates[socialNetwork as keyof typeof contentTemplates]).map(([name, template]) => (
                        <Button
                          key={name}
                          variant="outline"
                          size="sm"
                          onClick={() => insertTemplate(template)}
                          className="w-full justify-start text-xs"
                        >
                          <FileText className="w-3 h-3 mr-2" />
                          {name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Modèles de compte</Label>
                  {documentType === 'account_idea' && (
                    <div className="space-y-2">
                      {Object.entries(accountTemplates).map(([name, template]) => (
                        <Button
                          key={name}
                          variant="outline"
                          size="sm"
                          onClick={() => insertTemplate(template)}
                          className="w-full justify-start text-xs"
                        >
                          <Lightbulb className="w-3 h-3 mr-2" />
                          {name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          {showToolbar && (
            <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/5">
              <div className="flex items-center gap-1">
                <ToolbarButton
                  icon={<Bold className="w-4 h-4" />}
                  onClick={() => applyFormatting('bold')}
                  tooltip="Gras (Ctrl+B)"
                  shortcut="Ctrl+B"
                />
                <ToolbarButton
                  icon={<Italic className="w-4 h-4" />}
                  onClick={() => applyFormatting('italic')}
                  tooltip="Italique (Ctrl+I)"
                  shortcut="Ctrl+I"
                />
                <ToolbarButton
                  icon={<Underline className="w-4 h-4" />}
                  onClick={() => applyFormatting('underline')}
                  tooltip="Souligné (Ctrl+U)"
                  shortcut="Ctrl+U"
                />
                <ToolbarButton
                  icon={<Strikethrough className="w-4 h-4" />}
                  onClick={() => applyFormatting('strikethrough')}
                  tooltip="Barré"
                />
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-1">
                <ToolbarButton
                  icon={<List className="w-4 h-4" />}
                  onClick={() => applyFormatting('list')}
                  tooltip="Liste à puces"
                />
                <ToolbarButton
                  icon={<ListOrdered className="w-4 h-4" />}
                  onClick={() => applyFormatting('ordered-list')}
                  tooltip="Liste numérotée"
                />
                <ToolbarButton
                  icon={<Quote className="w-4 h-4" />}
                  onClick={() => applyFormatting('quote')}
                  tooltip="Citation"
                />
                <ToolbarButton
                  icon={<Code className="w-4 h-4" />}
                  onClick={() => applyFormatting('code')}
                  tooltip="Code"
                />
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-1">
                <ToolbarButton
                  icon={<Link className="w-4 h-4" />}
                  onClick={() => applyFormatting('link')}
                  tooltip="Lien"
                />
                <ToolbarButton
                  icon={<Image className="w-4 h-4" />}
                  onClick={() => applyFormatting('image')}
                  tooltip="Image"
                />
                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid grid-cols-8 gap-1">
                      {emojis.map((emoji, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => insertEmoji(emoji)}
                          className="h-8 w-8 p-0 text-lg"
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-1">
                <Popover open={showTemplatePicker} onOpenChange={setShowTemplatePicker}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Modèles</Label>
                      {documentType === 'content' && socialNetwork && contentTemplates[socialNetwork as keyof typeof contentTemplates] && (
                        <div className="space-y-1">
                          {Object.entries(contentTemplates[socialNetwork as keyof typeof contentTemplates]).map(([name, template]) => (
                            <Button
                              key={name}
                              variant="ghost"
                              size="sm"
                              onClick={() => insertTemplate(template)}
                              className="w-full justify-start text-xs"
                            >
                              {name}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Editor/Preview */}
          <div className="flex-1 flex">
            {showPreviewMode ? (
              <div className="flex-1 overflow-y-auto">
                {renderPreview()}
              </div>
            ) : (
              <Textarea
                ref={editorRef}
                value={content}
                onChange={handleContentChange}
                placeholder={placeholder}
                className="flex-1 border-none shadow-none resize-none focus-visible:ring-0 text-sm leading-relaxed"
                style={{ minHeight: '400px' }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AnimatePresence>
        {showLinkDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <Card className="w-96">
              <CardHeader>
                <CardTitle>Insérer un lien</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Texte du lien</Label>
                  <Input
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Texte à afficher"
                  />
                </div>
                <div>
                  <Label>URL</Label>
                  <Input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://exemple.com"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={insertLink}>Insérer</Button>
                  <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {showImageDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <Card className="w-96">
              <CardHeader>
                <CardTitle>Insérer une image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>URL de l'image</Label>
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://exemple.com/image.jpg"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={insertImage}>Insérer</Button>
                  <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedTextEditor;
