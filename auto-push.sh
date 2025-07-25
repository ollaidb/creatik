#!/bin/bash

# Script d'enregistrement automatique sur GitHub
# Usage: ./auto-push.sh [message de commit]

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Message de commit par défaut
COMMIT_MESSAGE=${1:-"Auto-save: $(date '+%Y-%m-%d %H:%M:%S')"}

echo -e "${BLUE}🚀 Début de l'enregistrement automatique...${NC}"

# Vérifier si git est initialisé
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Erreur: Ce répertoire n'est pas un dépôt Git${NC}"
    echo -e "${YELLOW}💡 Initialisation du dépôt Git...${NC}"
    git init
fi

# Vérifier si un remote existe
if ! git remote get-url origin > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Aucun remote 'origin' configuré${NC}"
    echo -e "${BLUE}📝 Veuillez configurer votre remote GitHub:${NC}"
    echo -e "${GREEN}   git remote add origin https://github.com/votre-username/creatik.git${NC}"
    echo -e "${BLUE}   ou${NC}"
    echo -e "${GREEN}   git remote add origin git@github.com:votre-username/creatik.git${NC}"
    exit 1
fi

# Ajouter tous les fichiers
echo -e "${BLUE}📁 Ajout des fichiers...${NC}"
git add .

# Vérifier s'il y a des changements
if git diff --cached --quiet; then
    echo -e "${YELLOW}ℹ️  Aucun changement à commiter${NC}"
    exit 0
fi

# Faire le commit
echo -e "${BLUE}💾 Création du commit...${NC}"
git commit -m "$COMMIT_MESSAGE"

# Push vers GitHub
echo -e "${BLUE}⬆️  Envoi vers GitHub...${NC}"
if git push origin main; then
    echo -e "${GREEN}✅ Enregistrement réussi !${NC}"
    echo -e "${BLUE}📝 Commit: $COMMIT_MESSAGE${NC}"
    echo -e "${BLUE}🌐 Vérifiez sur GitHub: $(git remote get-url origin | sed 's/\.git$//')${NC}"
else
    echo -e "${RED}❌ Erreur lors de l'envoi vers GitHub${NC}"
    echo -e "${YELLOW}💡 Vérifiez que:${NC}"
    echo -e "${YELLOW}   - Votre remote est correctement configuré${NC}"
    echo -e "${YELLOW}   - Vous avez les permissions sur le dépôt${NC}"
    echo -e "${YELLOW}   - Votre branche principale s'appelle 'main'${NC}"
    exit 1
fi 