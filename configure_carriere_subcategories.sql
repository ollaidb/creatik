-- Configuration des sous-catégories Carrière pour le niveau 2
INSERT INTO public.subcategory_hierarchy_config (subcategory_id, has_level2)
SELECT id, true FROM public.subcategories 
WHERE category_id = (SELECT id FROM public.categories WHERE name = 'Carrière' LIMIT 1);
