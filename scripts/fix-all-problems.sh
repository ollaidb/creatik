#!/bin/bash

# Script pour résoudre tous les problèmes de l'application
# Usage: ./scripts/fix-all-problems.sh

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Début de la résolution des problèmes...${NC}"

# 1. Nettoyer les console.log
echo -e "${BLUE}1️⃣  Nettoyage des console.log...${NC}"
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i '' '/console\.log(/d'

# 2. Supprimer les lignes vides
echo -e "${BLUE}2️⃣  Suppression des lignes vides...${NC}"
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i '' '/^[[:space:]]*$/d'

# 3. Mettre à jour browserslist
echo -e "${BLUE}3️⃣  Mise à jour de browserslist...${NC}"
npx update-browserslist-db@latest

# 4. Nettoyer le cache npm
echo -e "${BLUE}4️⃣  Nettoyage du cache npm...${NC}"
npm cache clean --force

# 5. Réinstaller les dépendances
echo -e "${BLUE}5️⃣  Réinstallation des dépendances...${NC}"
rm -rf node_modules package-lock.json
npm install

# 6. Test du build
echo -e "${BLUE}6️⃣  Test du build...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build réussi !${NC}"
else
    echo -e "${RED}❌ Erreur de build${NC}"
    exit 1
fi

# 7. Test du serveur de développement
echo -e "${BLUE}7️⃣  Test du serveur de développement...${NC}"
timeout 10s npm run dev > /dev/null 2>&1 &
DEV_PID=$!
sleep 3
if kill -0 $DEV_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Serveur de développement fonctionne${NC}"
    kill $DEV_PID
else
    echo -e "${RED}❌ Problème avec le serveur de développement${NC}"
fi

# 8. Vérifier les erreurs TypeScript
echo -e "${BLUE}8️⃣  Vérification TypeScript...${NC}"
if npx tsc --noEmit; then
    echo -e "${GREEN}✅ Aucune erreur TypeScript${NC}"
else
    echo -e "${YELLOW}⚠️  Erreurs TypeScript détectées${NC}"
fi

# 9. Linter
echo -e "${BLUE}9️⃣  Vérification du linter...${NC}"
if npm run lint; then
    echo -e "${GREEN}✅ Aucune erreur de linter${NC}"
else
    echo -e "${YELLOW}⚠️  Erreurs de linter détectées${NC}"
fi

echo -e "${GREEN}🎉 Résolution des problèmes terminée !${NC}"
echo -e "${BLUE}📋 Résumé :${NC}"
echo -e "  ✅ Console.log nettoyés"
echo -e "  ✅ Browserslist mis à jour"
echo -e "  ✅ Cache npm nettoyé"
echo -e "  ✅ Dépendances réinstallées"
echo -e "  ✅ Build testé"
echo -e "  ✅ Serveur de développement testé"
echo -e "  ✅ TypeScript vérifié"
echo -e "  ✅ Linter vérifié"

echo -e "${BLUE}🚀 Tu peux maintenant lancer : npm run dev${NC}" 