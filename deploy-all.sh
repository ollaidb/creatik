#!/bin/bash

# Script complet : Enregistrement GitHub + Déploiement Vercel
# Usage: ./deploy-all.sh [message]

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Message par défaut
MESSAGE=${1:-"Mise à jour automatique: $(date '+%Y-%m-%d %H:%M:%S')"}

echo -e "${PURPLE}🚀 Début du processus complet...${NC}"
echo -e "${BLUE}📝 Message: $MESSAGE${NC}"
echo ""

# Étape 1: Enregistrement GitHub
echo -e "${BLUE}📁 Étape 1: Enregistrement sur GitHub${NC}"
if ./auto-push.sh "$MESSAGE"; then
    echo -e "${GREEN}✅ Enregistrement GitHub réussi${NC}"
else
    echo -e "${YELLOW}⚠️  Enregistrement GitHub échoué ou pas de changements${NC}"
fi

echo ""

# Étape 2: Déploiement Vercel
echo -e "${BLUE}🌐 Étape 2: Déploiement sur Vercel${NC}"
if ./deploy-vercel.sh "$MESSAGE"; then
    echo -e "${GREEN}✅ Déploiement Vercel réussi${NC}"
else
    echo -e "${RED}❌ Déploiement Vercel échoué${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Processus terminé avec succès !${NC}"
echo -e "${BLUE}📋 Résumé:${NC}"
echo -e "${BLUE}   ✅ Code enregistré sur GitHub${NC}"
echo -e "${BLUE}   ✅ Application déployée sur Vercel${NC}"
echo -e "${BLUE}   📝 Message: $MESSAGE${NC}" 