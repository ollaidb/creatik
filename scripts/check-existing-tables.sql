-- Script pour vérifier les tables existantes
-- Date: 2025-08-04

-- 1. LISTER TOUTES LES TABLES PUBLIQUES
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity = true THEN '✅ RLS ACTIVÉ'
        ELSE '❌ RLS DÉSACTIVÉ (UNRESTRICTED)'
    END as status
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename NOT LIKE 'pg_%'
  AND tablename NOT LIKE 'information_schema%'
ORDER BY tablename;

-- 2. VÉRIFIER SPÉCIFIQUEMENT LES TABLES "UNRESTRICTED"
SELECT 
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity = true THEN '✅ SÉCURISÉ'
        ELSE '❌ NON SÉCURISÉ (UNRESTRICTED)'
    END as status
FROM pg_tables 
WHERE schemaname = 'public'
  AND rowsecurity = false
  AND tablename NOT LIKE 'pg_%'
ORDER BY tablename;

-- 3. VÉRIFIER LES POLITIQUES RLS EXISTANTES
SELECT 
    tablename,
    COUNT(*) as policy_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ AUCUNE POLITIQUE'
        WHEN COUNT(*) < 3 THEN '⚠️ POLITIQUES INCOMPLÈTES'
        ELSE '✅ POLITIQUES COMPLÈTES'
    END as status
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename; 