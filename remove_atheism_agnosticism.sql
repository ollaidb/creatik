-- Suppression de l'athéisme et l'agnosticisme de la catégorie Religion
-- Date: 2025-08-03

-- Supprimer l'athéisme
DELETE FROM public.subcategories 
WHERE name = 'Athéisme' 
AND category_id = (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1);

-- Supprimer l'agnosticisme
DELETE FROM public.subcategories 
WHERE name = 'Agnosticisme' 
AND category_id = (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1); 