import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FolderOpen,
  Plus,
  MoreHorizontal,
  Edit3,
  Trash2,
  Move,
  Archive,
  Star,
  StarOff,
  ChevronRight,
  ChevronDown,
  FileText,
  Lightbulb,
  Settings,
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useFolders } from '@/hooks/useNotes';
import type { UserFolder, CreateFolderData } from '@/types/notes';

interface FolderManagerProps {
  type: 'content' | 'account_ideas';
  selectedFolderId?: string;
  onFolderSelect: (folder: UserFolder) => void;
  onDocumentCreate: (folderId?: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showArchived?: boolean;
  onShowArchivedChange?: (show: boolean) => void;
}

interface FolderItemProps {
  folder: UserFolder;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMove: () => void;
  onArchive: () => void;
  onToggleFavorite: () => void;
  viewMode: 'grid' | 'list';
  level?: number;
}

const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  isSelected,
  isExpanded,
  onSelect,
  onToggle,
  onEdit,
  onDelete,
  onMove,
  onArchive,
  onToggleFavorite,
  viewMode,
  level = 0
}) => {
  const [showActions, setShowActions] = useState(false);

  const getFolderIcon = () => {
    if (folder.type === 'content') {
      return isExpanded ? <FolderOpen className="w-5 h-5" /> : <Folder className="w-5 h-5" />;
    } else {
      return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getFolderColor = () => {
    return folder.color || '#3B82F6';
  };

  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative"
        style={{ marginLeft: level * 20 }}
      >
        <Card
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-md",
            isSelected && "ring-2 ring-primary shadow-md",
            "group"
          )}
          onClick={onSelect}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div 
                className="p-2 rounded-lg text-white"
                style={{ backgroundColor: getFolderColor() }}
              >
                {getFolderIcon()}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                        onClick={onMove}
                        className="w-full justify-start"
                      >
                        <Move className="w-4 h-4 mr-2" />
                        Déplacer
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
            
            <div className="space-y-2">
              <h3 className="font-semibold text-sm truncate">{folder.name}</h3>
              {folder.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {folder.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {folder.documents?.length || 0} documents
                </Badge>
                {folder.sub_folders && folder.sub_folders.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle();
                    }}
                    className="h-6 w-6 p-0"
                  >
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </Button>
                )}
              </div>
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
        isSelected && "bg-primary/10 border border-primary/20"
      )}
      style={{ marginLeft: level * 20 }}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center gap-2">
        {folder.sub_folders && folder.sub_folders.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        )}
        <div 
          className="p-2 rounded-lg text-white"
          style={{ backgroundColor: getFolderColor() }}
        >
          {getFolderIcon()}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm truncate">{folder.name}</h3>
          {folder.is_archived && (
            <Badge variant="outline" className="text-xs">
              Archivé
            </Badge>
          )}
        </div>
        {folder.description && (
          <p className="text-xs text-muted-foreground truncate">
            {folder.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {folder.documents?.length || 0}
        </Badge>
        
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
                  onClick={onMove}
                  className="w-full justify-start"
                >
                  <Move className="w-4 h-4 mr-2" />
                  Déplacer
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

const FolderManager: React.FC<FolderManagerProps> = ({
  type,
  selectedFolderId,
  onFolderSelect,
  onDocumentCreate,
  viewMode = 'grid',
  onViewModeChange,
  searchQuery = '',
  onSearchChange,
  showArchived = false,
  onShowArchivedChange
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingFolder, setEditingFolder] = useState<UserFolder | null>(null);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [movingFolder, setMovingFolder] = useState<UserFolder | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'updated_at'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const {
    folders,
    loading,
    error,
    createFolder,
    updateFolder,
    deleteFolder,
    moveFolder
  } = useFolders({
    type,
    include_subfolders: true,
    include_documents: true
  });

  const [newFolder, setNewFolder] = useState<CreateFolderData>({
    name: '',
    description: '',
    type,
    color: '#3B82F6',
    icon: 'folder'
  });

  const toggleFolderExpansion = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  const handleCreateFolder = useCallback(async () => {
    try {
      await createFolder(newFolder);
      setNewFolder({
        name: '',
        description: '',
        type,
        color: '#3B82F6',
        icon: 'folder'
      });
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Erreur lors de la création du dossier:', error);
    }
  }, [createFolder, newFolder, type]);

  const handleEditFolder = useCallback(async (updates: Partial<UserFolder>) => {
    if (!editingFolder) return;

    try {
      await updateFolder(editingFolder.id, updates);
      setShowEditDialog(false);
      setEditingFolder(null);
    } catch (error) {
      console.error('Erreur lors de la modification du dossier:', error);
    }
  }, [updateFolder, editingFolder]);

  const handleDeleteFolder = useCallback(async (folder: UserFolder) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le dossier "${folder.name}" ?`)) {
      try {
        await deleteFolder(folder.id);
      } catch (error) {
        console.error('Erreur lors de la suppression du dossier:', error);
      }
    }
  }, [deleteFolder]);

  const handleMoveFolder = useCallback(async (folder: UserFolder, newParentId?: string) => {
    try {
      await moveFolder(folder.id, newParentId);
      setShowMoveDialog(false);
      setMovingFolder(null);
    } catch (error) {
      console.error('Erreur lors du déplacement du dossier:', error);
    }
  }, [moveFolder]);

  const handleArchiveFolder = useCallback(async (folder: UserFolder) => {
    try {
      await updateFolder(folder.id, { is_archived: !folder.is_archived });
    } catch (error) {
      console.error('Erreur lors de l\'archivage du dossier:', error);
    }
  }, [updateFolder]);

  const filteredFolders = folders.filter(folder => {
    if (!showArchived && folder.is_archived) return false;
    if (searchQuery && !folder.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedFolders = [...filteredFolders].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'updated_at':
        comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const renderFolderTree = (folders: UserFolder[], parentId?: string, level = 0) => {
    return folders
      .filter(folder => folder.parent_folder_id === parentId)
      .map(folder => (
        <div key={folder.id}>
          <FolderItem
            folder={folder}
            isSelected={selectedFolderId === folder.id}
            isExpanded={expandedFolders.has(folder.id)}
            onSelect={() => onFolderSelect(folder)}
            onToggle={() => toggleFolderExpansion(folder.id)}
            onEdit={() => {
              setEditingFolder(folder);
              setShowEditDialog(true);
            }}
            onDelete={() => handleDeleteFolder(folder)}
            onMove={() => {
              setMovingFolder(folder);
              setShowMoveDialog(true);
            }}
            onArchive={() => handleArchiveFolder(folder)}
            onToggleFavorite={() => {
              // TODO: Implémenter les favoris
            }}
            viewMode={viewMode}
            level={level}
          />
          {expandedFolders.has(folder.id) && (
            <div className="ml-4">
              {renderFolderTree(folders, folder.id, level + 1)}
            </div>
          )}
        </div>
      ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Chargement des dossiers...</div>
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
            {type === 'content' ? 'Dossiers de Contenu' : 'Dossiers d\'Idées de Compte'}
          </h2>
          <Badge variant="secondary">{sortedFolders.length}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau dossier
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
            placeholder="Rechercher un dossier..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Popover>
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
                  { value: 'name', label: 'Nom' },
                  { value: 'created_at', label: 'Date de création' },
                  { value: 'updated_at', label: 'Dernière modification' }
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

      {/* Folders List */}
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "space-y-2"
      )}>
        <AnimatePresence>
          {renderFolderTree(sortedFolders)}
        </AnimatePresence>
      </div>

      {sortedFolders.length === 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-muted/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            {type === 'content' ? <FileText className="w-10 h-10 text-muted-foreground" /> : <Lightbulb className="w-10 h-10 text-muted-foreground" />}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Aucun dossier trouvé
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? 'Aucun dossier ne correspond à votre recherche'
              : 'Créez votre premier dossier pour organiser vos documents'
            }
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Créer un dossier
          </Button>
        </div>
      )}

      {/* Create Folder Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau dossier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folder-name">Nom du dossier</Label>
              <Input
                id="folder-name"
                value={newFolder.name}
                onChange={(e) => setNewFolder(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom du dossier..."
              />
            </div>
            <div>
              <Label htmlFor="folder-description">Description (optionnel)</Label>
              <Textarea
                id="folder-description"
                value={newFolder.description}
                onChange={(e) => setNewFolder(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du dossier..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateFolder} disabled={!newFolder.name.trim()}>
                Créer
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Folder Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le dossier</DialogTitle>
          </DialogHeader>
          {editingFolder && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-folder-name">Nom du dossier</Label>
                <Input
                  id="edit-folder-name"
                  value={editingFolder.name}
                  onChange={(e) => setEditingFolder(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-folder-description">Description</Label>
                <Textarea
                  id="edit-folder-description"
                  value={editingFolder.description || ''}
                  onChange={(e) => setEditingFolder(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEditFolder({})}>
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FolderManager;
