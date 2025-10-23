-- Ajout des sous-catégories pour la catégorie "Religion"
-- Date: 2025-08-03

-- Religions monothéistes
INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT * FROM (VALUES
    ('Christianisme', 'Catholicisme, Protestantisme, Orthodoxie', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Islam', 'Sunnisme, Chiisme, Soufisme', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Judaïsme', 'Orthodoxe, Réformé, Conservateur', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Sikhisme', 'Religion monothéiste fondée au Punjab', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Bahaïsme', 'Religion monothéiste moderne', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now())
) AS v(name, description, category_id, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories 
    WHERE name = v.name AND category_id = v.category_id
);

-- Religions d'Asie
INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT * FROM (VALUES
    ('Hindouisme', 'Religion majoritaire en Inde', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Bouddhisme', 'Theravada, Mahayana, Vajrayana', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Taoïsme', 'Philosophie religieuse chinoise', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Confucianisme', 'Système philosophique chinois', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Shintoïsme', 'Religion traditionnelle du Japon', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Jaïnisme', 'Religion indienne non-violente', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Zoroastrisme', 'Une des plus anciennes religions monothéistes', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now())
) AS v(name, description, category_id, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories 
    WHERE name = v.name AND category_id = v.category_id
);

-- Religions africaines
INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT * FROM (VALUES
    ('Yoruba', 'Religion traditionnelle d''Afrique de l''Ouest', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Vaudou', 'Religion afro-caribéenne', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Animisme africain', 'Croyances en esprits de la nature', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Culte des ancêtres', 'Vénération des ancêtres défunts', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now())
) AS v(name, description, category_id, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories 
    WHERE name = v.name AND category_id = v.category_id
);

-- Religions amérindiennes
INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT * FROM (VALUES
    ('Chamanisme', 'Pratiques spirituelles traditionnelles', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Totémisme', 'Croyances en animaux totems', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Culte de la nature', 'Vénération des forces naturelles', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now())
) AS v(name, description, category_id, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories 
    WHERE name = v.name AND category_id = v.category_id
);

-- Religions modernes
INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT * FROM (VALUES
    ('Mormonisme', 'Église de Jésus-Christ des Saints des Derniers Jours', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Témoins de Jéhovah', 'Mouvement religieux chrétien', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Scientologie', 'Mouvement religieux fondé par L. Ron Hubbard', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Raëlisme', 'Mouvement ufologique religieux', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now())
) AS v(name, description, category_id, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories 
    WHERE name = v.name AND category_id = v.category_id
);

-- Mouvements spirituels modernes
INSERT INTO public.subcategories (name, description, category_id, created_at, updated_at) 
SELECT * FROM (VALUES
    ('Humanisme séculier', 'Philosophie centrée sur l''humain', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Paganisme moderne', 'Mouvements néo-païens contemporains', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now()),
    ('Wicca', 'Religion néo-païenne moderne', (SELECT id FROM public.categories WHERE name = 'Religion' LIMIT 1), now(), now())
) AS v(name, description, category_id, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1 FROM public.subcategories 
    WHERE name = v.name AND category_id = v.category_id
); 