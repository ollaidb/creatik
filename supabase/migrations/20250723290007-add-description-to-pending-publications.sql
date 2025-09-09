-- Ajouter la colonne description à la table pending_publications pour supporter les challenges
ALTER TABLE public.pending_publications 
ADD COLUMN IF NOT EXISTS description TEXT; 