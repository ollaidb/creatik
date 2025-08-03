-- Vérifier la structure de social_networks
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'social_networks' ORDER BY ordinal_position;
