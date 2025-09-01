#!/bin/bash

# Script pour nettoyer toutes les références restantes aux publications en attente

echo "Nettoyage des références restantes..."

# 1. Nettoyer les références dans src/types/supabase.ts
echo "Nettoyage de src/types/supabase.ts..."

# Supprimer les références à user_publications
sed -i '' '/user_publications:/,/},/d' src/types/supabase.ts
sed -i '' '/process_user_publications:/,/},/d' src/types/supabase.ts

# Supprimer les références à pending_publications
sed -i '' '/pending_publications:/,/},/d' src/types/supabase.ts
sed -i '' '/process_pending_publications:/,/},/d' src/types/supabase.ts

# 2. Nettoyer les références dans src/integrations/supabase/types.ts
echo "Nettoyage de src/integrations/supabase/types.ts..."
sed -i '' '/user_publications:/,/},/d' src/integrations/supabase/types.ts

# 3. Nettoyer les références dans src/hooks/usePublications.tsx
echo "Nettoyage de src/hooks/usePublications.tsx..."

# Supprimer les lignes qui utilisent user_publications
sed -i '' '/\.from.*user_publications/d' src/hooks/usePublications.tsx
sed -i '' '/user_publications/d' src/hooks/usePublications.tsx

# 4. Vérifier s'il reste des références
echo "Vérification des références restantes..."
echo "Références à user_publications:"
grep -r "user_publications" src/ || echo "Aucune référence trouvée"

echo "Références à pending_publications:"
grep -r "pending_publications" src/ || echo "Aucune référence trouvée"

echo "Références à pending:"
grep -r "pending" src/ | grep -E "(publication|approval)" || echo "Aucune référence pending trouvée"

echo "Nettoyage terminé !" 