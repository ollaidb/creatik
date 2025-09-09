-- Vérifier et corriger les couleurs autorisées pour les catégories
-- Date: 2025-01-27

-- 1. VÉRIFIER LA CONTRAINTE DE COULEUR
SELECT 
  '=== CONTRAINTE DE COULEUR CATEGORIES ===' as info;

SELECT 
  cc.constraint_name,
  cc.check_clause
FROM information_schema.check_constraints cc
JOIN information_schema.table_constraints tc ON cc.constraint_name = tc.constraint_name
WHERE tc.table_name = 'categories' AND cc.constraint_name LIKE '%color%';

-- 2. VÉRIFIER LES COULEURS ACTUELLES DANS LA TABLE
SELECT 
  '=== COULEURS ACTUELLES ===' as info;

SELECT 
  color,
  COUNT(*) as nombre
FROM categories 
GROUP BY color 
ORDER BY nombre DESC;

-- 3. VÉRIFIER LA STRUCTURE DE LA TABLE CATEGORIES
SELECT 
  '=== STRUCTURE TABLE CATEGORIES ===' as info;

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'categories' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. TESTER L'INSERTION AVEC DIFFÉRENTES COULEURS
SELECT 
  '=== TEST D''INSERTION AVEC COULEURS ===' as info;

DO $$
DECLARE
  test_colors TEXT[] := ARRAY['primary', 'orange', 'green', 'pink', 'blue', 'purple', 'red', 'yellow', 'gray', 'indigo', 'teal', 'cyan', 'emerald', 'violet', 'amber', 'lime', 'rose', 'slate'];
  test_color TEXT;
  test_id UUID;
  error_message TEXT;
BEGIN
  FOREACH test_color IN ARRAY test_colors
  LOOP
    BEGIN
      INSERT INTO categories (name, description, color) 
      VALUES ('Test couleur ' || test_color, 'Test', test_color)
      RETURNING id INTO test_id;
      
      RAISE NOTICE '✅ Couleur "%" fonctionne', test_color;
      
      -- Nettoyer
      DELETE FROM categories WHERE id = test_id;
      
    EXCEPTION WHEN OTHERS THEN
      error_message := SQLERRM;
      RAISE NOTICE '❌ Couleur "%" échoue: %', test_color, error_message;
    END;
  END LOOP;
END $$;

-- 5. VÉRIFIER LES COULEURS AUTORISÉES DANS LA CONTRAINTE
SELECT 
  '=== COULEURS AUTORISÉES ===' as info;

-- Extraire les couleurs de la contrainte CHECK
WITH color_constraint AS (
  SELECT check_clause 
  FROM information_schema.check_constraints cc
  JOIN information_schema.table_constraints tc ON cc.constraint_name = tc.constraint_name
  WHERE tc.table_name = 'categories' AND cc.constraint_name LIKE '%color%'
)
SELECT 
  'Contrainte actuelle:' as info,
  check_clause as contrainte
FROM color_constraint;

-- 6. CORRIGER LA CONTRAINTE SI NÉCESSAIRE
SELECT 
  '=== CORRECTION DE LA CONTRAINTE ===' as info;

-- Supprimer l'ancienne contrainte si elle existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'categories' AND constraint_name LIKE '%color%'
  ) THEN
    ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_color_check;
    RAISE NOTICE 'Ancienne contrainte supprimée';
  END IF;
END $$;

-- Créer une nouvelle contrainte avec toutes les couleurs valides
ALTER TABLE categories 
ADD CONSTRAINT categories_color_check 
CHECK (color IN ('primary', 'orange', 'green', 'pink', 'blue', 'purple', 'red', 'yellow', 'gray', 'indigo', 'teal', 'cyan', 'emerald', 'violet', 'amber', 'lime', 'rose', 'slate'));

-- 7. TESTER L'INSERTION APRÈS CORRECTION
SELECT 
  '=== TEST APRÈS CORRECTION ===' as info;

DO $$
DECLARE
  test_id UUID;
BEGIN
  INSERT INTO categories (name, description, color) 
  VALUES ('Test après correction', 'Test', 'primary')
  RETURNING id INTO test_id;
  
  RAISE NOTICE '✅ Insertion réussie avec ID: %', test_id;
  
  -- Nettoyer
  DELETE FROM categories WHERE id = test_id;
  RAISE NOTICE 'Test supprimé';
END $$;

-- 8. RÉSUMÉ FINAL
SELECT 
  'CORRECTION TERMINÉE' as status,
  'La contrainte de couleur a été corrigée' as message; 