-- Correction de la contrainte de couleur pour les catégories
-- Date: 2025-01-28

-- 1. DIAGNOSTIC : Vérifier la contrainte actuelle
SELECT 
  'DIAGNOSTIC CONTRAINTE COULEUR' as step,
  constraint_name,
  check_clause
FROM information_schema.check_constraints 
WHERE constraint_name LIKE '%categories%color%';

-- 2. DIAGNOSTIC : Vérifier les couleurs existantes dans la table
SELECT 
  'DIAGNOSTIC COULEURS EXISTANTES' as step,
  DISTINCT color,
  COUNT(*) as count
FROM public.categories 
GROUP BY color
ORDER BY color;

-- 3. CORRECTION : Supprimer l'ancienne contrainte
ALTER TABLE public.categories 
DROP CONSTRAINT IF EXISTS categories_color_check;

-- 4. CORRECTION : Créer la nouvelle contrainte avec toutes les couleurs supportées
ALTER TABLE public.categories 
ADD CONSTRAINT categories_color_check 
CHECK (color IN (
  'primary', 'orange', 'green', 'pink', 'blue', 'purple', 'red', 'yellow', 
  'gray', 'indigo', 'teal', 'cyan', 'emerald', 'violet', 'amber', 'lime', 
  'rose', 'slate', 'zinc', 'neutral', 'stone', 'fuchsia', 'sky', 'mint'
));

-- 5. TEST : Vérifier que la contrainte fonctionne
DO $$
BEGIN
  -- Test avec une couleur valide
  BEGIN
    INSERT INTO public.categories (name, description, color) 
    VALUES ('Test Category', 'Test Description', 'rose')
    ON CONFLICT DO NOTHING;
    RAISE NOTICE '✅ Test avec couleur "rose" : SUCCÈS';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Test avec couleur "rose" : ÉCHEC - %', SQLERRM;
  END;
  
  -- Test avec une couleur invalide
  BEGIN
    INSERT INTO public.categories (name, description, color) 
    VALUES ('Test Invalid', 'Test Description', 'invalid_color');
    RAISE NOTICE '❌ Test avec couleur invalide : DEVRAIT ÉCHOUER';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '✅ Test avec couleur invalide : ÉCHEC ATTENDU - %', SQLERRM;
  END;
END $$;

-- 6. NETTOYAGE : Supprimer les entrées de test
DELETE FROM public.categories WHERE name LIKE 'Test%';

-- 7. VÉRIFICATION FINALE
SELECT 
  'VÉRIFICATION FINALE' as step,
  'Contrainte de couleur corrigée et testée' as status;
