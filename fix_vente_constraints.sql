-- Ajout des contraintes UNIQUE manquantes
-- Date: 2025-08-03

-- 1. Ajouter la contrainte UNIQUE sur category_hierarchy_config
ALTER TABLE public.category_hierarchy_config 
ADD CONSTRAINT category_hierarchy_config_category_id_key UNIQUE (category_id);

-- 2. Ajouter la contrainte UNIQUE sur subcategory_hierarchy_config
ALTER TABLE public.subcategory_hierarchy_config 
ADD CONSTRAINT subcategory_hierarchy_config_subcategory_id_key UNIQUE (subcategory_id); 