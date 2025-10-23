import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  Move,
  Archive,
  Star,
  StarOff,
  Pin,
  PinOff,
  Eye,
  Download,
  Share2,
  Calendar,
  Clock,
  Hash,
  Filter,
  Search,
  Grid,
  List,
  SortAsc,
  SortDesc,
  BookOpen,
  Lightbulb,
  Target,
  Users,
  TrendingUp,
  Heart,
  MessageSquare,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useDocuments } from '@/hooks/useNotes';
import type { UserDocument, CreateDocumentData, UpdateDocumentData } from '@/types/notes';

interface DocumentManagerProps {
  type: 'content' | 'account_idea';
  folderId?: string;
  selectedDocumentId?: string;
  onDocumentSelect: (document: UserDocument) => void;
  onDocumentEdit: (document: UserDocument) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showArchived?: boolean;
  onShowArchivedChange?: (show: boolean) => void;
}

interface DocumentItemProps {
  document: UserDocument;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: () => void;
  onArchive: () => void;
  onToggleFavorite: () => void;
  onTogglePin: () => void;
  onExport: () => void;
  viewMode: 'grid' | 'list';
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  document,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onMove,
  onArchive,
  onToggleFavorite,
  onTogglePin,
  onExport,
  viewMode
}) => {
  const [showActions, setShowActions] = useState(false);

  const getDocumentIcon = () => {
    if (document.type === 'content') {
      return <FileText className="w-5 h-5" />;
    } else {
      return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getDocumentColor = () => {
    if (document.is_pinned) return '#F59E0B';
    if (document.is_favorite) return '#EF4444';
    return '#3B82F6';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const getStatusIcon = () => {
    if (document.type === 'account_idea' && document.account_settings) {
      switch (document.account_settings.implementation_status) {
        case 'completed':
          return <Target className="w-3 h-3 text-green-500" />;
        case 'in_progress':
          return <TrendingUp className="w-3 h-3 text-blue-500" />;
        case 'planning':
          return <Calendar className="w-3 h-3 text-yellow-500" />;
        case 'on_hold':
          return <Clock className="w-3 h-3 text-gray-500" />;
        default:
          return <Lightbulb className="w-3 h-3 text-purple-500" />;
      }
    }
    return null;
  };

  const getStatusLabel = () => {
    if (document.type === 'account_idea' && document.account_settings) {
      const statusMap = {
        idea: 'Idée',
        planning: 'Planification',
        in_progress: 'En cours',
        completed: 'Terminé',
        on_hold: 'En attente'
      };
      return statusMap[document.account_settings.implementation_status];
    }
    return null;
  };

  const getPriorityColor = () => {
    if (document.type === 'account_idea' && document.account_settings) {
      switch (document.account_settings.priority_level) {
        case 'high':
          return 'bg-red-500';
        case 'medium':
          return 'bg-yellow-500';
        case 'low':
          return 'bg-green-500';
        default:
          return 'bg-gray-500';
      }
    }
    return 'bg-gray-500';
  };

  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative group"
      >
        <Card
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-md",
            isSelected && "ring-2 ring-primary shadow-md",
            document.is_pinned && "border-l-4 border-l-yellow-500"
          )}
          onClick={onSelect}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div 
                className="p-2 rounded-lg text-white"
                style={{ backgroundColor: getDocumentColor() }}
              >
                {getDocumentIcon()}
              </div>
              <div className="flex items-center gap-1">
                {document.is_pinned && (
                  <Pin className="w-3 h-3 text-yellow-500" />
                )}
                {document.is_favorite && (
                  <Star className="w-3 h-3 text-red-500" />
                )}
                <div className={cn(
                  "flex items-center gap-1 transition-opacity",
                  showActions ? "opacity-100" : "opacity-0"
                )}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite();
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Star className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin();
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Pin className="w-3 h-3" />
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="h-6 w-6 p-0"
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48" align="end">
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onEdit}
                          className="w-full justify-start"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onDuplicate}
                          className="w-full justify-start"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Dupliquer
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onMove}
                          className="w-full justify-start"
                        >
                          <Move className="w-4 h-4 mr-2" />
                          Déplacer
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onExport}
                          className="w-full justify-start"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Exporter
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onArchive}
                          className="w-full justify-start"
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Archiver
                        </Button>
                        <Separator />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onDelete}
                          className="w-full justify-start text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-sm truncate">{document.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {document.content.substring(0, 100)}...
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {getStatusIcon()}
                  {getStatusLabel() && (
                    <Badge variant="outline" className="text-xs">
                      {getStatusLabel()}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {document.word_count} mots
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(document.last_edited_at)}
                  </span>
                </div>
              </div>

              {document.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {document.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {document.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{document.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50",
        isSelected && "bg-primary/10 border border-primary/20",
        document.is_pinned && "border-l-4 border-l-yellow-500"
      )}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center gap-2">
        <div 
          className="p-2 rounded-lg text-white"
          style={{ backgroundColor: getDocumentColor() }}
        >
          {getDocumentIcon()}
        </div>
        {document.is_pinned && (
          <Pin className="w-4 h-4 text-yellow-500" />
        )}
        {document.is_favorite && (
          <Star className="w-4 h-4 text-red-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm truncate">{document.title}</h3>
          {getStatusIcon()}
          {getStatusLabel() && (
            <Badge variant="outline" className="text-xs">
              {getStatusLabel()}
            </Badge>
          )}
          {document.is_archived && (
            <Badge variant="outline" className="text-xs">
              Archivé
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {document.content.substring(0, 80)}...
        </p>
        {document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {document.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {document.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{document.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="text-xs font-medium">{document.word_count} mots</div>
          <div className="text-xs text-muted-foreground">
            {formatDate(document.last_edited_at)}
          </div>
        </div>
        
        <div className={cn(
          "flex items-center gap-1 transition-opacity",
          showActions ? "opacity-100" : "opacity-0"
        )}>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="h-6 w-6 p-0"
          >
            <Star className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            className="h-6 w-6 p-0"
          >
            <Pin className="w-3 h-3" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="h-6 w-6 p-0"
              >
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  className="w-full justify-start"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDuplicate}
                  className="w-full justify-start"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Dupliquer
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMove}
                  className="w-full justify-start"
                >
                  <Move className="w-4 h-4 mr-2" />
                  Déplacer
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExport}
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onArchive}
                  className="w-full justify-start"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archiver
                </Button>
                <Separator />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="w-full justify-start text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </motion.div>
  );
};

const DocumentManager: React.FC<DocumentManagerProps> = ({
  type,
  folderId,
  selectedDocumentId,
  onDocumentSelect,
  onDocumentEdit,
  viewMode = 'grid',
  onViewModeChange,
  searchQuery = '',
  onSearchChange,
  showArchived = false,
  onShowArchivedChange
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [movingDocument, setMovingDocument] = useState<UserDocument | null>(null);
  const [sortBy, setSortBy] = useState<'title' | 'created_at' | 'updated_at' | 'word_count'>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<'all' | 'favorites' | 'pinned' | 'recent'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const {
    documents,
    loading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    duplicateDocument,
    moveDocument
  } = useDocuments({
    type,
    folder_id: folderId,
    is_favorite: filterBy === 'favorites' ? true : undefined,
    is_pinned: filterBy === 'pinned' ? true : undefined
  });

  const [newDocument, setNewDocument] = useState<CreateDocumentData>({
    title: '',
    content: '',
    type,
    folder_id: folderId,
    format: 'markdown',
    tags: []
  });

  const handleCreateDocument = useCallback(async () => {
    try {
      const document = await createDocument(newDocument);
      setNewDocument({
        title: '',
        content: '',
        type,
        folder_id: folderId,
        format: 'markdown',
        tags: []
      });
      setShowCreateDialog(false);
      onDocumentSelect(document);
      onDocumentEdit(document);
    } catch (error) {
      console.error('Erreur lors de la création du document:', error);
    }
  }, [createDocument, newDocument, type, folderId, onDocumentSelect, onDocumentEdit]);

  const handleDeleteDocument = useCallback(async (document: UserDocument) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le document "${document.title}" ?`)) {
      try {
        await deleteDocument(document.id);
      } catch (error) {
        console.error('Erreur lors de la suppression du document:', error);
      }
    }
  }, [deleteDocument]);

  const handleDuplicateDocument = useCallback(async (document: UserDocument) => {
    try {
      const duplicated = await duplicateDocument(document.id);
      onDocumentSelect(duplicated);
    } catch (error) {
      console.error('Erreur lors de la duplication du document:', error);
    }
  }, [duplicateDocument, onDocumentSelect]);

  const handleMoveDocument = useCallback(async (document: UserDocument, newFolderId?: string) => {
    try {
      await moveDocument(document.id, newFolderId);
      setShowMoveDialog(false);
      setMovingDocument(null);
    } catch (error) {
      console.error('Erreur lors du déplacement du document:', error);
    }
  }, [moveDocument]);

  const handleArchiveDocument = useCallback(async (document: UserDocument) => {
    try {
      await updateDocument(document.id, { is_archived: !document.is_archived });
    } catch (error) {
      console.error('Erreur lors de l\'archivage du document:', error);
    }
  }, [updateDocument]);

  const handleToggleFavorite = useCallback(async (document: UserDocument) => {
    try {
      await updateDocument(document.id, { is_favorite: !document.is_favorite });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
    }
  }, [updateDocument]);

  const handleTogglePin = useCallback(async (document: UserDocument) => {
    try {
      await updateDocument(document.id, { is_pinned: !document.is_pinned });
    } catch (error) {
      console.error('Erreur lors de l\'épinglage du document:', error);
    }
  }, [updateDocument]);

  const handleExportDocument = useCallback((document: UserDocument) => {
    // TODO: Implémenter l'export
    console.log('Export document:', document);
  }, []);

  const filteredDocuments = documents.filter(doc => {
    if (!showArchived && doc.is_archived) return false;
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !doc.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'updated_at':
        comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        break;
      case 'word_count':
        comparison = a.word_count - b.word_count;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Chargement des documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {type === 'content' ? 'Documents de Contenu' : 'Idées de Compte'}
          </h2>
          <Badge variant="secondary">{sortedDocuments.length}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau document
          </Button>
          
          {onViewModeChange && (
            <div className="flex items-center border border-border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un document..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs value={filterBy} onValueChange={(value) => setFilterBy(value as any)}>
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="favorites">
                <Star className="w-3 h-3 mr-1" />
                Favoris
              </TabsTrigger>
              <TabsTrigger value="pinned">
                <Pin className="w-3 h-3 mr-1" />
                Épinglés
              </TabsTrigger>
              <TabsTrigger value="recent">
                <Clock className="w-3 h-3 mr-1" />
                Récents
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Trier
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Trier par</Label>
                <div className="space-y-1">
                  {[
                    { value: 'title', label: 'Titre' },
                    { value: 'created_at', label: 'Date de création' },
                    { value: 'updated_at', label: 'Dernière modification' },
                    { value: 'word_count', label: 'Nombre de mots' }
                  ].map(option => (
                    <Button
                      key={option.value}
                      variant={sortBy === option.value ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSortBy(option.value as any)}
                      className="w-full justify-start"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                <Separator />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="w-full justify-start"
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4 mr-2" /> : <SortDesc className="w-4 h-4 mr-2" />}
                  {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {onShowArchivedChange && (
            <div className="flex items-center gap-2">
              <Switch
                checked={showArchived}
                onCheckedChange={onShowArchivedChange}
              />
              <Label className="text-sm">Afficher les archivés</Label>
            </div>
          )}
        </div>
      </div>

      {/* Documents List */}
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "space-y-2"
      )}>
        <AnimatePresence>
          {sortedDocuments.map((document) => (
            <DocumentItem
              key={document.id}
              document={document}
              isSelected={selectedDocumentId === document.id}
              onSelect={() => onDocumentSelect(document)}
              onEdit={() => onDocumentEdit(document)}
              onDelete={() => handleDeleteDocument(document)}
              onDuplicate={() => handleDuplicateDocument(document)}
              onMove={() => {
                setMovingDocument(document);
                setShowMoveDialog(true);
              }}
              onArchive={() => handleArchiveDocument(document)}
              onToggleFavorite={() => handleToggleFavorite(document)}
              onTogglePin={() => handleTogglePin(document)}
              onExport={() => handleExportDocument(document)}
              viewMode={viewMode}
            />
          ))}
        </AnimatePresence>
      </div>

      {sortedDocuments.length === 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-muted/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            {type === 'content' ? <FileText className="w-10 h-10 text-muted-foreground" /> : <Lightbulb className="w-10 h-10 text-muted-foreground" />}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Aucun document trouvé
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? 'Aucun document ne correspond à votre recherche'
              : 'Créez votre premier document pour commencer'
            }
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Créer un document
          </Button>
        </div>
      )}

      {/* Create Document Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="document-title">Titre du document</Label>
              <Input
                id="document-title"
                value={newDocument.title}
                onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre du document..."
              />
            </div>
            <div>
              <Label htmlFor="document-content">Contenu (optionnel)</Label>
              <Textarea
                id="document-content"
                value={newDocument.content}
                onChange={(e) => setNewDocument(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Commencez à écrire..."
                rows={6}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateDocument} disabled={!newDocument.title.trim()}>
                Créer
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentManager;
