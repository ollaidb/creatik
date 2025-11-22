-- Migration: Update user_notes table to support reordering and pinning
-- Description: Add is_pinned and order_index columns for drag & drop functionality

-- Ajouter les colonnes nécessaires
ALTER TABLE public.user_notes 
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Créer un index pour améliorer les performances du tri
CREATE INDEX IF NOT EXISTS idx_user_notes_order ON public.user_notes(user_id, is_pinned DESC, order_index ASC);

-- Mettre à jour l'index existant pour inclure les nouvelles colonnes dans le tri
-- L'index existant idx_user_notes_updated_at reste pour la recherche par date

-- Fonction pour mettre à jour automatiquement l'ordre lors de la création
CREATE OR REPLACE FUNCTION set_default_order_index()
RETURNS TRIGGER AS $$
BEGIN
    -- Si order_index n'est pas spécifié, le définir à la valeur maximale + 1
    IF NEW.order_index IS NULL OR NEW.order_index = 0 THEN
        SELECT COALESCE(MAX(order_index), 0) + 1
        INTO NEW.order_index
        FROM public.user_notes
        WHERE user_id = NEW.user_id AND is_pinned = NEW.is_pinned;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour définir l'ordre par défaut
DROP TRIGGER IF EXISTS trigger_set_default_order_index ON public.user_notes;
CREATE TRIGGER trigger_set_default_order_index
    BEFORE INSERT ON public.user_notes
    FOR EACH ROW
    EXECUTE FUNCTION set_default_order_index();

-- Commentaires sur les nouvelles colonnes
COMMENT ON COLUMN public.user_notes.is_pinned IS 'Indique si la note est épinglée en haut de la liste';
COMMENT ON COLUMN public.user_notes.order_index IS 'Index pour l''ordre d''affichage (drag & drop)';

