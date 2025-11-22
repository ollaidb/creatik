-- Script automatique pour ajouter les sous-catégories de l'activisme
-- Date: 2025-01-28

-- 1. TROUVER L'ID DE LA CATÉGORIE ACTIVISME
DO $$
DECLARE
  activisme_category_id UUID;
  subcategory_count INTEGER;
BEGIN
  -- Chercher la catégorie Activisme (avec différentes variantes)
  SELECT id INTO activisme_category_id 
  FROM public.categories 
  WHERE LOWER(name) LIKE '%activisme%' 
     OR LOWER(name) LIKE '%activiste%'
     OR LOWER(name) LIKE '%activisme%'
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF activisme_category_id IS NULL THEN
    RAISE NOTICE '❌ Catégorie "Activisme" non trouvée. Vérifiez le nom exact.';
    RETURN;
  END IF;
  
  RAISE NOTICE '✅ Catégorie "Activisme" trouvée avec ID: %', activisme_category_id;
  
  -- Compter les sous-catégories existantes
  SELECT COUNT(*) INTO subcategory_count 
  FROM public.subcategories 
  WHERE category_id = activisme_category_id;
  
  RAISE NOTICE '📊 Nombre de sous-catégories existantes: %', subcategory_count;
  
  -- 2. AJOUTER LES SOUS-CATÉGORIES (une par une pour éviter les conflits)
  INSERT INTO public.subcategories (name, description, category_id) VALUES
  ('Panafricanisme', 'Unité africaine, identité panafricaine, solidarité entre pays africains', activisme_category_id)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.subcategories (name, description, category_id) VALUES
  ('Droits des femmes', 'Féminisme, égalité des genres, droits des femmes dans la société', activisme_category_id)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.subcategories (name, description, category_id) VALUES
  ('Droits des enfants', 'Protection des enfants, éducation, droits fondamentaux des mineurs', activisme_category_id)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.subcategories (name, description, category_id) VALUES
  ('Droits des minorités', 'LGBTQ+, minorités ethniques, religieuses, protection des groupes vulnérables', activisme_category_id)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.subcategories (name, description, category_id) VALUES
  ('Migrations', 'Réfugiés, immigration, droits des migrants, accueil et intégration', activisme_category_id)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.subcategories (name, description, category_id) VALUES
  ('Climat', 'Réchauffement climatique, COP, actions pour le climat, transition écologique', activisme_category_id)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.subcategories (name, description, category_id) VALUES
  ('Biodiversité', 'Protection des espèces, écosystèmes, conservation de la nature', activisme_category_id)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.subcategories (name, description, category_id) VALUES
  ('Pollution', 'Pollution de l''air, de l''eau, des sols, lutte contre le plastique', activisme_category_id)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.subcategories (name, description, category_id) VALUES
  ('Politique nationale', 'Gouvernement, élections, démocratie, institutions politiques', activisme_category_id)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.subcategories (name, description, category_id) VALUES
  ('Dénonciation', 'Corruption, injustices, abus de pouvoir, transparence', activisme_category_id)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.subcategories (name, description, category_id) VALUES
  ('Démocratie', 'Liberté d''expression, transparence, participation citoyenne', activisme_category_id)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.subcategories (name, description, category_id) VALUES
  ('Justice économique', 'Pauvreté, inégalités sociales, redistribution des richesses', activisme_category_id)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO public.subcategories (name, description, category_id) VALUES
  ('Droits du travail', 'Syndicats, conditions de travail, protection des travailleurs', activisme_category_id)
  ON CONFLICT DO NOTHING;
  
  -- Compter les nouvelles sous-catégories
  SELECT COUNT(*) INTO subcategory_count 
  FROM public.subcategories 
  WHERE category_id = activisme_category_id;
  
  RAISE NOTICE '✅ Sous-catégories ajoutées avec succès!';
  RAISE NOTICE '📊 Nombre total de sous-catégories: %', subcategory_count;
  
END $$;

-- 3. AFFICHAGE DES RÉSULTATS
SELECT 
  'RÉSULTATS FINAUX' as section,
  s.id,
  s.name as subcategory_name,
  s.description,
  c.name as category_name,
  s.created_at
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
WHERE c.name ILIKE '%activisme%'
ORDER BY s.name;

-- 4. STATISTIQUES FINALES
SELECT 
  'STATISTIQUES FINALES' as section,
  c.name as category_name,
  COUNT(s.id) as nombre_sous_categories,
  'Sous-catégories créées avec succès' as status
FROM public.categories c
LEFT JOIN public.subcategories s ON c.id = s.category_id
WHERE c.name ILIKE '%activisme%'
GROUP BY c.id, c.name;
