-- Corriger le problème de la couleur "rose" non autorisée
-- Date: 2025-01-27

-- 1. VÉRIFIER LA CONTRAINTE ACTUELLE
SELECT 
  '=== CONTRAINTE ACTUELLE ===' as info;

SELECT 
  cc.constraint_name,
  cc.check_clause
FROM information_schema.check_constraints cc
JOIN information_schema.table_constraints tc ON cc.constraint_name = tc.constraint_name
WHERE tc.table_name = 'categories' AND cc.constraint_name LIKE '%color%';

-- 2. TESTER LA COULEUR "ROSE" SPÉCIFiquement
SELECT 
  '=== TEST COULEUR ROSE ===' as info;

DO $$
DECLARE
  test_id UUID;
  error_message TEXT;
BEGIN
  BEGIN
    INSERT INTO categories (name, description, color) 
    VALUES ('Test rose', 'Test couleur rose', 'rose')
    RETURNING id INTO test_id;
    
    RAISE NOTICE '✅ Couleur "rose" fonctionne';
    
    -- Nettoyer
    DELETE FROM categories WHERE id = test_id;
    RAISE NOTICE 'Test supprimé';
    
  EXCEPTION WHEN OTHERS THEN
    error_message := SQLERRM;
    RAISE NOTICE '❌ Couleur "rose" échoue: %', error_message;
  END;
END $$;

-- 3. CORRIGER LA CONTRAINTE POUR INCLURE "ROSE"
SELECT 
  '=== CORRECTION DE LA CONTRAINTE ===' as info;

-- Supprimer l'ancienne contrainte
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

-- Créer une nouvelle contrainte avec "rose" inclus
ALTER TABLE categories 
ADD CONSTRAINT categories_color_check 
CHECK (color IN ('primary', 'orange', 'green', 'pink', 'blue', 'purple', 'red', 'yellow', 'gray', 'indigo', 'teal', 'cyan', 'emerald', 'violet', 'amber', 'lime', 'rose', 'slate'));

-- 4. TESTER APRÈS CORRECTION
SELECT 
  '=== TEST APRÈS CORRECTION ===' as info;

DO $$
DECLARE
  test_id UUID;
BEGIN
  INSERT INTO categories (name, description, color) 
  VALUES ('Test rose corrigé', 'Test après correction', 'rose')
  RETURNING id INTO test_id;
  
  RAISE NOTICE '✅ Couleur "rose" fonctionne maintenant avec ID: %', test_id;
  
  -- Nettoyer
  DELETE FROM categories WHERE id = test_id;
  RAISE NOTICE 'Test supprimé';
END $$;

-- 5. VÉRIFIER LA NOUVELLE CONTRAINTE
SELECT 
  '=== NOUVELLE CONTRAINTE ===' as info;

SELECT 
  cc.constraint_name,
  cc.check_clause
FROM information_schema.check_constraints cc
JOIN information_schema.table_constraints tc ON cc.constraint_name = tc.constraint_name
WHERE tc.table_name = 'categories' AND cc.constraint_name LIKE '%color%';

-- 6. RÉSUMÉ FINAL
SELECT 
  'CORRECTION TERMINÉE' as status,
  'La couleur "rose" est maintenant autorisée' as message; 