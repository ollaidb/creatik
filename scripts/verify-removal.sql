-- Script de vérification pour s'assurer que le système de publications en attente a été complètement supprimé

-- 1. Vérifier que la table user_publications n'existe plus
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_publications' AND table_schema = 'public') 
        THEN '❌ ERREUR: La table user_publications existe encore'
        ELSE '✅ SUCCÈS: La table user_publications a été supprimée'
    END as table_status;

-- 2. Vérifier que les fonctions liées n'existent plus
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'process_user_publications') 
        THEN '❌ ERREUR: La fonction process_user_publications existe encore'
        ELSE '✅ SUCCÈS: La fonction process_user_publications a été supprimée'
    END as function_status;

-- 3. Vérifier que les triggers n'existent plus
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name LIKE '%user_publications%') 
        THEN '❌ ERREUR: Des triggers liés aux user_publications existent encore'
        ELSE '✅ SUCCÈS: Tous les triggers liés aux user_publications ont été supprimés'
    END as trigger_status;

-- 4. Vérifier que les politiques RLS n'existent plus
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_publications') 
        THEN '❌ ERREUR: Des politiques RLS pour user_publications existent encore'
        ELSE '✅ SUCCÈS: Toutes les politiques RLS pour user_publications ont été supprimées'
    END as rls_status;

-- 5. Vérifier qu'il n'y a plus de références dans les contraintes
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name LIKE '%user_publications%'
        ) 
        THEN '❌ ERREUR: Des contraintes liées aux user_publications existent encore'
        ELSE '✅ SUCCÈS: Toutes les contraintes liées aux user_publications ont été supprimées'
    END as constraint_status;

-- 6. Vérifier qu'il n'y a plus de références dans les vues
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.views 
            WHERE view_definition LIKE '%user_publications%'
        ) 
        THEN '❌ ERREUR: Des vues référencent encore user_publications'
        ELSE '✅ SUCCÈS: Aucune vue ne référence user_publications'
    END as view_status;

-- 7. Résumé final
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== VÉRIFICATION TERMINÉE ===';
    RAISE NOTICE 'Si tous les messages ci-dessus affichent "SUCCÈS", alors le système de publications en attente a été complètement supprimé.';
    RAISE NOTICE 'Si vous voyez des "ERREUR", vous devez exécuter à nouveau le script de suppression.';
    RAISE NOTICE '';
END $$; 