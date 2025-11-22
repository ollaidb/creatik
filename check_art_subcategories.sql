SELECT name FROM public.subcategories WHERE category_id = (SELECT id FROM public.categories WHERE name = 'Art' LIMIT 1);
