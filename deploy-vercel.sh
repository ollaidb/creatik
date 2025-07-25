#!/bin/bash

# Script de déploiement automatique sur Vercel
# Usage: ./deploy-vercel.sh [message de déploiement]

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Message de déploiement par défaut
DEPLOY_MESSAGE=${1:-"Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"}

echo -e "${BLUE}🚀 Début du déploiement Vercel...${NC}"

# Vérifier si le projet est lié à Vercel
if [ ! -f ".vercel/project.json" ]; then
    echo -e "${RED}❌ Erreur: Projet non lié à Vercel${NC}"
    echo -e "${YELLOW}💡 Exécutez: vercel link${NC}"
    exit 1
fi

# Build du projet
echo -e "${BLUE}🔨 Build du projet...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build réussi${NC}"
else
    echo -e "${RED}❌ Erreur lors du build${NC}"
    exit 1
fi

# Déployer sur Vercel
echo -e "${BLUE}⬆️  Déploiement sur Vercel...${NC}"
if vercel --prod --yes; then
    echo -e "${GREEN}✅ Déploiement réussi !${NC}"
    echo -e "${BLUE}📝 Message: $DEPLOY_MESSAGE${NC}"
    
    # Récupérer l'URL de déploiement depuis le fichier de configuration
    if [ -f ".vercel/project.json" ]; then
        PROJECT_NAME=$(cat .vercel/project.json | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
        if [ ! -z "$PROJECT_NAME" ]; then
            echo -e "${BLUE}🌐 URL: https://$PROJECT_NAME.vercel.app${NC}"
        fi
    fi
else
    echo -e "${RED}❌ Erreur lors du déploiement${NC}"
    exit 1
fi 