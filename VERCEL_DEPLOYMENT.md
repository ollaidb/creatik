# 🚀 Déploiement Vercel pour Creatik

## ✅ Configuration terminée

Ton projet est maintenant lié à ton projet Vercel existant ! Voici comment utiliser les scripts de déploiement :

## 📋 Scripts disponibles

### 1. Déploiement Vercel uniquement
```bash
# Déploiement avec message par défaut
./deploy-vercel.sh

# Déploiement avec message personnalisé
./deploy-vercel.sh "Nouvelle fonctionnalité ajoutée"
```

### 2. Enregistrement GitHub uniquement
```bash
# Enregistrement avec message par défaut
./auto-push.sh

# Enregistrement avec message personnalisé
./auto-push.sh "Correction des bugs"
```

### 3. Processus complet (Recommandé)
```bash
# Enregistrement GitHub + Déploiement Vercel
./deploy-all.sh "Mise à jour complète"
```

## 🔄 Déploiement automatique

### Option 1: Déploiement manuel
```bash
# Après chaque modification importante
./deploy-all.sh "Description des changements"
```

### Option 2: Déploiement automatique (cron)
```bash
# Éditer le crontab
crontab -e

# Ajouter pour un déploiement toutes les heures
0 * * * * cd /Users/binta/Downloads/creatik && ./deploy-all.sh "Auto-deploy"

# Ou toutes les 30 minutes
*/30 * * * * cd /Users/binta/Downloads/creatik && ./deploy-all.sh "Auto-deploy"
```

## 🌐 URLs importantes

### Ton projet Vercel
- **URL de production** : https://creatik-gz8myasm8-binta22116-gmailcoms-projects.vercel.app
- **Dashboard Vercel** : https://vercel.com/binta22116-gmailcoms-projects/creatik

### Ton projet GitHub
- **Dépôt GitHub** : https://github.com/ollaidb/creatik
- **Actions GitHub** : https://github.com/ollaidb/creatik/actions

## 🛠️ Commandes utiles

```bash
# Voir le statut du projet Vercel
vercel ls

# Voir les logs de déploiement
vercel logs

# Ouvrir le dashboard Vercel
vercel

# Déployer en preview (pas en production)
vercel

# Voir la configuration Vercel
cat .vercel/project.json
```

## 🔧 Configuration Vercel

Ton projet est configuré avec :
- **Framework** : Vite/React
- **Build Command** : `npm run build`
- **Output Directory** : `dist`
- **Install Command** : `npm install`

## 📱 Déploiement mobile

### PWA (Progressive Web App)
Ton app est déjà configurée comme PWA et peut être installée sur mobile !

### Pour les stores :
1. **Google Play Store** : Utilise [PWA Builder](https://www.pwabuilder.com/)
2. **App Store** : Utilise [Capacitor](https://capacitorjs.com/)

## 🆘 Dépannage

### Erreur "Project not linked"
```bash
vercel link
```

### Erreur de build
```bash
npm run build
# Vérifiez les erreurs dans la console
```

### Erreur de déploiement
```bash
vercel --debug
# Vérifiez les logs détaillés
```

### Vérifier les variables d'environnement
```bash
vercel env ls
```

## 🎯 Workflow recommandé

1. **Développement local** : `npm run dev`
2. **Test des changements** : Vérifiez sur localhost
3. **Déploiement** : `./deploy-all.sh "Description"`
4. **Vérification** : Testez sur l'URL Vercel

## 📊 Monitoring

- **Vercel Analytics** : Intégré automatiquement
- **Performance** : Surveillé par Vercel
- **Erreurs** : Logs automatiques dans le dashboard

---

**🎉 Félicitations !** Ton app Creatik est maintenant configurée pour un déploiement automatique sur Vercel ! 