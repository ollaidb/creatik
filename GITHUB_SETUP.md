# 🚀 Configuration GitHub pour Creatik

## 📋 Prérequis

1. **Compte GitHub** : Créez un compte sur [GitHub](https://github.com)
2. **Git installé** : Vérifiez avec `git --version`
3. **Clé SSH** (optionnel) : Pour une connexion sécurisée

## 🔧 Configuration initiale

### 1. Créer un nouveau dépôt sur GitHub

1. Allez sur [GitHub.com](https://github.com)
2. Cliquez sur "New repository"
3. Nommez-le `creatik`
4. Laissez-le **public** ou **privé** selon vos préférences
5. **Ne cochez pas** "Initialize this repository with a README"
6. Cliquez sur "Create repository"

### 2. Configurer votre dépôt local

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter votre remote GitHub
git remote add origin https://github.com/VOTRE_USERNAME/creatik.git

# Ou avec SSH (recommandé)
git remote add origin git@github.com:VOTRE_USERNAME/creatik.git

# Configurer votre identité
git config user.name "Votre Nom"
git config user.email "votre-email@example.com"
```

### 3. Premier commit et push

```bash
# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: Creatik app"

# Pousser vers GitHub
git push -u origin main
```

## 🔄 Enregistrement automatique

### Utiliser le script automatique

```bash
# Enregistrement avec message par défaut
./auto-push.sh

# Enregistrement avec message personnalisé
./auto-push.sh "Correction des couleurs et amélioration de l'UI"
```

### Configuration automatique (optionnel)

Pour un enregistrement automatique toutes les 5 minutes :

```bash
# Sur macOS/Linux
crontab -e

# Ajouter cette ligne :
*/5 * * * * cd /Users/binta/Downloads/creatik && ./auto-push.sh
```

## 🌐 Déploiement automatique

### Option 1: Vercel (Recommandé)

1. **Connecter à Vercel** :
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec GitHub
   - Importez votre dépôt `creatik`
   - Vercel détectera automatiquement que c'est un projet Vite/React

2. **Configuration automatique** :
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Option 2: Netlify

1. **Connecter à Netlify** :
   - Allez sur [netlify.com](https://netlify.com)
   - Connectez-vous avec GitHub
   - Importez votre dépôt `creatik`

2. **Configuration** :
   - Build command: `npm run build`
   - Publish directory: `dist`

### Option 3: GitHub Pages

1. **Activer GitHub Pages** :
   - Allez dans Settings > Pages
   - Source: "GitHub Actions"
   - Le workflow `.github/workflows/deploy.yml` s'occupera du reste

## 🔐 Variables d'environnement

Pour le déploiement automatique, configurez ces secrets dans GitHub :

1. Allez dans votre dépôt GitHub
2. Settings > Secrets and variables > Actions
3. Ajoutez ces secrets :

### Pour Vercel :
- `VERCEL_TOKEN` : Token d'API Vercel
- `VERCEL_ORG_ID` : ID de votre organisation Vercel
- `VERCEL_PROJECT_ID` : ID de votre projet Vercel

### Pour Netlify :
- `NETLIFY_AUTH_TOKEN` : Token d'API Netlify
- `NETLIFY_SITE_ID` : ID de votre site Netlify

## 📱 Application mobile (Futur)

### PWA (Progressive Web App)
Votre app est déjà configurée comme PWA. Pour la publier :

1. **Google Play Store** :
   - Utilisez [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)
   - Ou [PWA Builder](https://www.pwabuilder.com/)

2. **App Store** :
   - Utilisez [Capacitor](https://capacitorjs.com/)
   - Ou [React Native](https://reactnative.dev/)

## 🚀 Commandes utiles

```bash
# Vérifier le statut Git
git status

# Voir les remotes configurés
git remote -v

# Voir l'historique des commits
git log --oneline

# Annuler le dernier commit (si erreur)
git reset --soft HEAD~1

# Forcer le push (attention !)
git push --force-with-lease origin main
```

## 🆘 Dépannage

### Erreur "Permission denied"
```bash
# Générer une clé SSH
ssh-keygen -t ed25519 -C "votre-email@example.com"

# Ajouter la clé à GitHub
cat ~/.ssh/id_ed25519.pub
# Copiez le contenu dans GitHub > Settings > SSH and GPG keys
```

### Erreur "Branch main doesn't exist"
```bash
# Créer la branche main
git branch -M main
git push -u origin main
```

### Erreur "Remote origin already exists"
```bash
# Supprimer et recréer le remote
git remote remove origin
git remote add origin https://github.com/VOTRE_USERNAME/creatik.git
```

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que Git est bien configuré
2. Assurez-vous d'avoir les permissions sur le dépôt GitHub
3. Consultez les logs d'erreur dans GitHub Actions

---

**🎉 Félicitations !** Votre app Creatik est maintenant configurée pour un enregistrement et déploiement automatiques sur GitHub ! 