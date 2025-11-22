#!/bin/bash

# Script pour supprimer tous les fichiers frontend liés aux publications en attente d'approbation

echo "Suppression des fichiers frontend liés aux publications en attente..."

# 1. Supprimer les types TypeScript
echo "Suppression des types TypeScript..."
rm -f src/types/pending-publications.ts

# 2. Supprimer les hooks liés aux publications en attente
echo "Suppression des hooks..."
rm -f src/hooks/usePendingPublish.tsx
rm -f src/hooks/useAdminPublications.tsx

# 3. Supprimer les pages d'administration des publications
echo "Suppression des pages d'administration..."
rm -f src/pages/admin/Publications.tsx

# 4. Supprimer les migrations SQL liées aux publications en attente
echo "Suppression des migrations SQL..."
rm -f supabase/migrations/*process-user-publications.sql
rm -f supabase/migrations/*user-publications*.sql
rm -f migrations/auto_approve_publications.sql
rm -f migrations/fix_auto_approval.sql
rm -f migrations/auto_publish_direct_simple.sql

# 5. Supprimer les scripts SQL liés
echo "Suppression des scripts SQL..."
rm -f scripts/fix-publication-system.sql
rm -f scripts/fix-publication-system-complete.sql
rm -f scripts/complete-setup-all-tables.sql
rm -f scripts/apply-migrations.sql
rm -f scripts/complete-fix-all-tables.sql
rm -f scripts/final-setup-activism-content.sql

# 6. Nettoyer les références dans les types Supabase
echo "Nettoyage des types Supabase..."
# Note: Il faudra éditer manuellement src/types/supabase.ts pour supprimer les références à user_publications

# 7. Vérifier s'il y a d'autres références dans le code
echo "Recherche d'autres références..."
grep -r "user_publications" src/ || echo "Aucune autre référence trouvée"
grep -r "pending" src/ | grep -E "(publication|approval)" || echo "Aucune référence pending trouvée"

echo "Suppression terminée !"
echo ""
echo "⚠️  ATTENTION: Vous devez encore :"
echo "1. Exécuter le script SQL remove-pending-publications-system.sql dans votre base de données"
echo "2. Éditer manuellement src/types/supabase.ts pour supprimer les références à user_publications"
echo "3. Vérifier et supprimer les routes dans votre application React"
echo "4. Supprimer les liens de navigation vers les pages d'administration des publications" 