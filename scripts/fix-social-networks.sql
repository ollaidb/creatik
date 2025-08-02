-- Script pour supprimer la colonne is_active de social_networks
ALTER TABLE social_networks DROP COLUMN IF EXISTS is_active;
