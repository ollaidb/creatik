#!/bin/bash

# Script pour nettoyer les console.log et console.error
# Usage: ./scripts/cleanup-console.sh

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 Nettoyage des console.log et console.error...${NC}"

# Compter les console.log et console.error
TOTAL_LOGS=$(grep -r "console\.log\|console\.error\|console\.warn" src/ --include="*.tsx" --include="*.ts" | wc -l)
echo -e "${YELLOW}📊 Nombre total de console.* trouvés: $TOTAL_LOGS${NC}"

# Supprimer les console.log et console.error (garder console.error pour les erreurs critiques)
echo -e "${BLUE}🗑️  Suppression des console.log...${NC}"

# Supprimer console.log
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i '' '/console\.log(/d'

# Supprimer les lignes vides qui pourraient rester
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i '' '/^[[:space:]]*$/d'

echo -e "${GREEN}✅ Nettoyage terminé !${NC}"

# Vérifier le build
echo -e "${BLUE}🔨 Test du build...${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build réussi après nettoyage${NC}"
else
    echo -e "${RED}❌ Erreur de build après nettoyage${NC}"
    echo -e "${YELLOW}💡 Vérifiez les erreurs et corrigez manuellement${NC}"
fi 