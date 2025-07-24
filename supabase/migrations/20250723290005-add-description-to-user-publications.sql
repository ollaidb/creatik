-- Ajouter la colonne description à la table user_publications pour supporter les challenges
ALTER TABLE public.user_publications 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Mettre à jour les RLS policies si nécessaire
-- (Les policies existantes devraient déjà couvrir cette colonne) 