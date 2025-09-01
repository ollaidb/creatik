-- Script pour supprimer complètement le système de publications en attente d'approbation
-- Ce script supprime toutes les tables, fonctions, triggers et politiques RLS liées aux publications en attente

-- 1. Supprimer toutes les fonctions liées aux publications en attente
DROP FUNCTION IF EXISTS process_user_publications() CASCADE;
DROP FUNCTION IF EXISTS approve_publication(UUID) CASCADE;
DROP FUNCTION IF EXISTS reject_publication(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS get_pending_publications() CASCADE;
DROP FUNCTION IF EXISTS auto_insert_approved_content() CASCADE;
DROP FUNCTION IF EXISTS check_for_duplicates(TEXT, TEXT, UUID, UUID) CASCADE;

-- 2. Supprimer tous les triggers liés aux publications en attente
DROP TRIGGER IF EXISTS auto_insert_approved_content_insert_trigger ON user_publications;
DROP TRIGGER IF EXISTS auto_insert_published_content_trigger ON user_publications;

-- 3. Supprimer toutes les politiques RLS liées à user_publications
DROP POLICY IF EXISTS "Users can view their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can create their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can update their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Users can delete their own publications" ON public.user_publications;
DROP POLICY IF EXISTS "Admins can view all publications" ON public.user_publications;
DROP POLICY IF EXISTS "Admins can update all publications" ON public.user_publications;

-- 4. Supprimer complètement la table user_publications
DROP TABLE IF EXISTS public.user_publications CASCADE;

-- 5. Supprimer les contraintes de clés étrangères si elles existent
-- (Ces contraintes seront automatiquement supprimées avec la table, mais on les supprime explicitement pour être sûr)

-- 6. Vérifier et supprimer les fonctions RPC si elles existent
-- (Ces fonctions sont généralement créées via Supabase RPC)
-- Note: Les fonctions RPC sont généralement supprimées automatiquement avec les fonctions PostgreSQL

-- 7. Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Système de publications en attente supprimé avec succès';
    RAISE NOTICE 'Toutes les tables, fonctions, triggers et politiques RLS ont été supprimés';
    RAISE NOTICE 'La fonctionnalité de publications en attente d''approbation est maintenant complètement désactivée';
END $$; 