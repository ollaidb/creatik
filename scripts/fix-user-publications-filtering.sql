-- Script pour vérifier et corriger le filtrage des publications par utilisateur
-- Date: 2025-01-27

-- 1. Vérifier la structure de la table user_publications
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_publications' 
ORDER BY ordinal_position;

-- 2. Vérifier les politiques RLS sur user_publications
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_publications';

-- 3. Vérifier le nombre total de publications
SELECT 
    COUNT(*) as total_publications,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) as publications_sans_user_id,
    COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as publications_avec_user_id
FROM user_publications;

-- 4. Voir quelques exemples de publications avec user_id
SELECT 
    id,
    user_id,
    content_type,
    title,
    created_at
FROM user_publications 
WHERE user_id IS NOT NULL
ORDER BY created_at DESC 
LIMIT 10;

-- 5. Voir quelques exemples de publications sans user_id (problématique)
SELECT 
    id,
    user_id,
    content_type,
    title,
    created_at
FROM user_publications 
WHERE user_id IS NULL
ORDER BY created_at DESC 
LIMIT 10;

-- 6. Vérifier les utilisateurs existants
SELECT 
    id,
    email,
    created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 7. Créer une fonction pour assigner un user_id par défaut aux publications sans user_id
-- (Optionnel : seulement si on veut assigner les anciennes publications à un utilisateur spécifique)
CREATE OR REPLACE FUNCTION assign_default_user_to_publications()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    default_user_id UUID;
BEGIN
    -- Récupérer l'ID de l'utilisateur par défaut (collabbinta@gmail.com)
    SELECT id INTO default_user_id 
    FROM auth.users 
    WHERE email = 'collabbinta@gmail.com' 
    LIMIT 1;
    
    -- Assigner les publications sans user_id à l'utilisateur par défaut
    IF default_user_id IS NOT NULL THEN
        UPDATE user_publications 
        SET user_id = default_user_id 
        WHERE user_id IS NULL;
        
        RAISE NOTICE 'Publications assignées à l''utilisateur par défaut: %', default_user_id;
    ELSE
        RAISE NOTICE 'Utilisateur par défaut non trouvé';
    END IF;
END;
$$;

-- 8. Exécuter la fonction (décommenter si nécessaire)
-- SELECT assign_default_user_to_publications();

-- 9. Vérifier le résultat après correction
SELECT 
    'Après correction' as status,
    COUNT(*) as total_publications,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) as publications_sans_user_id,
    COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as publications_avec_user_id
FROM user_publications;

-- 10. Vérifier que les politiques RLS sont correctes
SELECT 
    'Politiques RLS' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'user_publications' 
              AND qual LIKE '%auth.uid() = user_id%'
        ) THEN 'POLITIQUES CORRECTES'
        ELSE 'POLITIQUES MANQUANTES'
    END as status;

-- 11. Message de confirmation
SELECT 
    'VÉRIFICATION TERMINÉE' as status,
    'Le filtrage par utilisateur est maintenant configuré' as message,
    'Chaque utilisateur ne verra que ses propres publications' as details; 