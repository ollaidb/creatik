-- Script pour supprimer complètement la table ai_generation_history
-- Cette table n'est pas utilisée dans l'application et n'a que des accès admin

-- 1. Supprimer les politiques RLS liées à ai_generation_history
DROP POLICY IF EXISTS "Admins can view ai_generation_history" ON public.ai_generation_history;

-- 2. Supprimer complètement la table ai_generation_history
DROP TABLE IF EXISTS public.ai_generation_history CASCADE;

-- 3. Vérifier qu'il n'y a pas de contraintes de clés étrangères restantes
-- (CASCADE devrait les supprimer automatiquement)

-- 4. Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Table ai_generation_history supprimée avec succès';
    RAISE NOTICE 'Cette table n''était pas utilisée dans l''application';
    RAISE NOTICE 'L''historique de génération IA n''est plus stocké';
END $$; 