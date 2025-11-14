import React, { useState, useEffect, useCallback } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { useSwipeable } from 'react-swipeable';
import { 
  ArrowLeft, 
  Plus, 
  Pin, 
  PinOff, 
  Edit, 
  Trash2, 
  GripVertical,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { UserNotesService, UserNote, CreateNoteData } from '@/services/userNotesService';

const Notes = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<UserNote | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Charger les notes
  const loadNotes = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await UserNotesService.getNotes(user.id);
      
      // Séparer les notes épinglées et non épinglées
      const pinned = data.filter(n => n.is_pinned).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      const unpinned = data.filter(n => !n.is_pinned).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      
      setNotes([...pinned, ...unpinned]);
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Ajouter une note
  const handleAddNote = async () => {
    if (!user?.id || !noteTitle.trim()) return;

    try {
      await UserNotesService.createNote(user.id, {
        title: noteTitle.trim(),
        content: noteContent.trim()
      });
      
      toast({
        title: "Note ajoutée",
        description: "Votre note a été créée avec succès.",
      });
      
      setNoteTitle('');
      setNoteContent('');
      setIsAddDialogOpen(false);
      loadNotes();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la note.",
        variant: "destructive",
      });
    }
  };

  // Modifier une note
  const handleEditNote = async () => {
    if (!editingNote || !noteTitle.trim()) return;

    try {
      await UserNotesService.updateNote(editingNote.id, {
        title: noteTitle.trim(),
        content: noteContent.trim()
      });
      
      toast({
        title: "Note modifiée",
        description: "Votre note a été mise à jour.",
      });
      
      setEditingNote(null);
      setNoteTitle('');
      setNoteContent('');
      setIsEditDialogOpen(false);
      loadNotes();
    } catch (error) {
      console.error('Erreur lors de la modification de la note:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la note.",
        variant: "destructive",
      });
    }
  };

  // Supprimer une note
  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return;

    try {
      await UserNotesService.deleteNote(noteId);
      toast({
        title: "Note supprimée",
        description: "La note a été supprimée.",
      });
      loadNotes();
    } catch (error) {
      console.error('Erreur lors de la suppression de la note:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la note.",
        variant: "destructive",
      });
    }
  };

  // Épingler/désépingler une note
  const handleTogglePin = async (noteId: string, currentPinned: boolean) => {
    try {
      await UserNotesService.togglePin(noteId, !currentPinned);
      loadNotes();
    } catch (error) {
      console.error('Erreur lors de l\'épinglage de la note:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'épinglage de la note.",
        variant: "destructive",
      });
    }
  };

  // Ouvrir le dialogue d'édition
  const openEditDialog = (note: UserNote) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content || '');
    setIsEditDialogOpen(true);
  };

  // Réorganiser les notes
  const handleReorder = async (newOrder: UserNote[]) => {
    setNotes(newOrder);
    
    // Mettre à jour l'ordre en base de données
    try {
      const updates = newOrder.map((note, index) => ({
        id: note.id,
        order_index: index + 1,
        is_pinned: note.is_pinned || false
      }));

      await UserNotesService.reorderNotes(user?.id || '', updates);
    } catch (error) {
      console.error('Erreur lors de la réorganisation:', error);
      // Recharger les notes en cas d'erreur
      loadNotes();
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'ordre des notes.",
        variant: "destructive",
      });
    }
  };

  // Swipe handlers pour mobile - composant séparé pour respecter les règles des hooks
  const SwipeableNote: React.FC<{ note: UserNote; children: React.ReactNode }> = ({ note, children }) => {
    const handlers = useSwipeable({
      onSwipedLeft: () => {
        // Swipe gauche → Supprimer
        handleDeleteNote(note.id);
      },
      onSwipedRight: () => {
        // Swipe droite → Épingler/Désépingler
        handleTogglePin(note.id, note.is_pinned || false);
      },
      trackMouse: true, // Permet aussi le swipe avec la souris pour le développement
      preventScrollOnSwipe: true,
      delta: 50 // Distance minimale pour déclencher le swipe
    });
    return <div {...handlers}>{children}</div>;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={navigateBack}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Notes</h1>
                  <p className="text-sm text-muted-foreground">
                    Connectez-vous pour accéder à vos notes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Connectez-vous pour créer et gérer vos notes.</p>
            </CardContent>
          </Card>
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={navigateBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Notes</h1>
                <p className="text-sm text-muted-foreground">
                  Organisez vos idées et notes
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                setNoteTitle('');
                setNoteContent('');
                setIsAddDialogOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">Aucune note pour le moment</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Créer votre première note
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Reorder.Group
            axis="y"
            values={notes}
            onReorder={handleReorder}
            className="space-y-3"
          >
            {notes.map((note) => (
              <Reorder.Item
                key={note.id}
                value={note}
                className="cursor-grab active:cursor-grabbing"
              >
                <SwipeableNote note={note}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <GripVertical className="w-5 h-5 text-muted-foreground mt-1 cursor-grab" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              {note.is_pinned && (
                                <Pin className="w-4 h-4 text-primary inline mr-1" />
                              )}
                              <h3 className="font-semibold text-lg inline">{note.title}</h3>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleTogglePin(note.id, note.is_pinned || false)}
                                title={note.is_pinned ? "Désépingler" : "Épingler"}
                              >
                                {note.is_pinned ? (
                                  <Pin className="w-4 h-4" />
                                ) : (
                                  <PinOff className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => openEditDialog(note)}
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteNote(note.id)}
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {note.content && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {note.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SwipeableNote>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </main>

      {/* Dialog pour ajouter une note */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une note</DialogTitle>
            <DialogDescription>
              Créez une nouvelle note pour organiser vos idées.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="note-title">Titre</Label>
              <Input
                id="note-title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Titre de la note"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleAddNote();
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="note-content">Contenu</Label>
              <Textarea
                id="note-content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Contenu de la note..."
                rows={6}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setNoteTitle('');
                  setNoteContent('');
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddNote}
                disabled={!noteTitle.trim()}
              >
                Ajouter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour modifier une note */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la note</DialogTitle>
            <DialogDescription>
              Modifiez le titre et le contenu de votre note.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-note-title">Titre</Label>
              <Input
                id="edit-note-title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Titre de la note"
              />
            </div>
            <div>
              <Label htmlFor="edit-note-content">Contenu</Label>
              <Textarea
                id="edit-note-content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Contenu de la note..."
                rows={6}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingNote(null);
                  setNoteTitle('');
                  setNoteContent('');
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleEditNote}
                disabled={!noteTitle.trim()}
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Navigation />
    </div>
  );
};

export default Notes;
