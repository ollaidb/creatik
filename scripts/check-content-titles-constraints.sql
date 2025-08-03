-- Vérifier les contraintes de la table content_titles
SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'content_titles'::regclass;
