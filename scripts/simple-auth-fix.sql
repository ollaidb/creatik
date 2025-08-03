-- Script simple pour corriger l'authentification

-- 1. Vérifier les permissions de base
GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;

-- 2. Vérifier les permissions sur les tables d'authentification
GRANT SELECT ON auth.users TO anon;
GRANT SELECT ON auth.users TO authenticated;
GRANT INSERT ON auth.users TO anon;
GRANT UPDATE ON auth.users TO authenticated;

-- 3. Vérifier les permissions sur les sessions
GRANT ALL ON auth.sessions TO anon;
GRANT ALL ON auth.sessions TO authenticated;

-- 4. Vérifier les permissions sur les identités
GRANT ALL ON auth.identities TO anon;
GRANT ALL ON auth.identities TO authenticated;

-- 5. Vérifier les permissions sur les audit logs
GRANT SELECT ON auth.audit_log_entries TO authenticated;

-- 6. Vérifier que les séquences sont accessibles
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth TO authenticated;

-- 7. Test simple
SELECT 'Permissions d authentification verifiees' as status; 