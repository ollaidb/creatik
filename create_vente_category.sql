-- Ajout de la catégorie "Vente" si elle n'existe pas
-- Date: 2025-08-03

INSERT INTO public.categories (name, color, description) 
VALUES ('Vente', 'green', 'Vente de produits et services')
ON CONFLICT (name) DO NOTHING; 