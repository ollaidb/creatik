-- Script COMPLET pour corriger la table user_notes
-- Ce script fait TOUT : ajoute les colonnes manquantes, corrige les permissions RLS
-- Copiez-collez ce script dans Supabase SQL Editor et exécutez-le

-- ============================================
-- PARTIE 1: AJOUTER LES COLONNES MANQUANTES
-- ============================================

-- Ajouter is_pinned si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_notes' 
    AND column_name = 'is_pinned'
  ) THEN
    ALTER TABLE public.user_notes 
    ADD COLUMN is_pinned BOOLEAN DEFAULT FALSE;
    
    -- Mettre à jour les valeurs existantes
    UPDATE public.user_notes 
    SET is_pinned = FALSE 
    WHERE is_pinned IS NULL;
    
    -- Créer l'index
    CREATE INDEX IF NOT EXISTS idx_user_notes_pinned 
    ON public.user_notes(user_id, is_pinned);
    
    RAISE NOTICE '✅ Colonne is_pinned ajoutée avec succès';
  ELSE
    RAISE NOTICE '✅ Colonne is_pinned existe déjà';
  END IF;
END $$;

-- Ajouter order_index si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_notes' 
    AND column_name = 'order_index'
  ) THEN
    ALTER TABLE public.user_notes 
    ADD COLUMN order_index INTEGER DEFAULT 0;
    
    -- Mettre à jour les valeurs existantes
    UPDATE public.user_notes 
    SET order_index = COALESCE(
      (SELECT MAX(order_index) + 1 FROM public.user_notes WHERE user_id = user_notes.user_id),
      1
    )
    WHERE order_index IS NULL;
    
    -- Créer l'index composite
    CREATE INDEX IF NOT EXISTS idx_user_notes_order 
    ON public.user_notes(user_id, is_pinned DESC, order_index ASC);
    
    RAISE NOTICE '✅ Colonne order_index ajoutée avec succès';
  ELSE
    RAISE NOTICE '✅ Colonne order_index existe déjà';
  END IF;
END $$;

-- ============================================
-- PARTIE 2: CORRIGER LES PERMISSIONS RLS
-- ============================================

-- Activer RLS
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

-- Supprimer toutes les anciennes politiques pour éviter les conflits
DROP POLICY IF EXISTS "Users can view their own notes" ON public.user_notes;
DROP POLICY IF EXISTS "Users can create their own notes" ON public.user_notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.user_notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.user_notes;

-- Créer les politiques RLS correctes

-- Politique pour SELECT (lire ses propres notes)
CREATE POLICY "Users can view their own notes"
  ON public.user_notes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politique pour INSERT (créer ses propres notes)
CREATE POLICY "Users can create their own notes"
  ON public.user_notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique pour UPDATE (modifier ses propres notes)
CREATE POLICY "Users can update their own notes"
  ON public.user_notes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politique pour DELETE (supprimer ses propres notes)
CREATE POLICY "Users can delete their own notes"
  ON public.user_notes
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- PARTIE 3: VÉRIFICATION FINALE
-- ============================================

-- Afficher un résumé
SELECT 
  '=== RÉSUMÉ ===' as info;

SELECT 
  'Colonnes de la table user_notes:' as info,
  COUNT(*) as total_columns
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_notes';

SELECT 
  'Politiques RLS actives:' as info,
  COUNT(*) as total_policies
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'user_notes';

-- Vérifier spécifiquement is_pinned et order_index
SELECT 
  column_name,
  'EXISTE ✅' as status
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_notes'
  AND column_name IN ('is_pinned', 'order_index')
ORDER BY column_name;

-- Message de succès
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Configuration terminée avec succès!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Les colonnes is_pinned et order_index ont été ajoutées.';
  RAISE NOTICE 'Les permissions RLS ont été configurées.';
  RAISE NOTICE 'Vous pouvez maintenant ajouter des notes sans erreur.';
  RAISE NOTICE '';
END $$;

