# Configuration de l'authentification Supabase

## 1. Configuration des variables d'environnement

Le fichier `.env` a été créé avec les variables nécessaires :
```
VITE_SUPABASE_URL=https://eiuhcgvvexoshuopvska.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI
```

## 2. Configuration des providers OAuth dans Supabase

### Étape 1 : Accéder au dashboard Supabase
1. Allez sur https://supabase.com/dashboard
2. Connectez-vous à votre compte
3. Sélectionnez votre projet

### Étape 2 : Configurer Google OAuth
1. Dans le dashboard, allez dans **Authentication** > **Providers**
2. Trouvez **Google** et cliquez sur **Enable**
3. Configurez les paramètres :
   - **Client ID** : Votre Google Client ID
   - **Client Secret** : Votre Google Client Secret
   - **Redirect URL** : `https://eiuhcgvvexoshuopvska.supabase.co/auth/v1/callback`

### Étape 3 : Configurer Apple OAuth
1. Dans le dashboard, allez dans **Authentication** > **Providers**
2. Trouvez **Apple** et cliquez sur **Enable**
3. Configurez les paramètres :
   - **Client ID** : Votre Apple Client ID
   - **Client Secret** : Votre Apple Client Secret
   - **Redirect URL** : `https://eiuhcgvvexoshuopvska.supabase.co/auth/v1/callback`

## 3. Configuration des URLs de redirection

### Dans Supabase Dashboard :
1. Allez dans **Authentication** > **URL Configuration**
2. Configurez les URLs suivantes :
   - **Site URL** : `http://localhost:5173` (pour le développement)
   - **Redirect URLs** : 
     - `http://localhost:5173/auth/callback`
     - `https://votre-domaine.com/auth/callback` (pour la production)

## 4. Configuration Google OAuth

### Créer un projet Google Cloud :
1. Allez sur https://console.cloud.google.com/
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ API
4. Allez dans **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. Configurez :
   - **Application type** : Web application
   - **Authorized redirect URIs** : `https://eiuhcgvvexoshuopvska.supabase.co/auth/v1/callback`
6. Copiez le **Client ID** et **Client Secret**

## 5. Configuration Apple OAuth

### Créer un App ID dans Apple Developer :
1. Allez sur https://developer.apple.com/account/
2. Créez un nouvel **App ID**
3. Activez **Sign In with Apple**
4. Configurez les **Domains and Subdomains** :
   - `eiuhcgvvexoshuopvska.supabase.co`
5. Créez un **Service ID** pour Sign in with Apple
6. Copiez le **Client ID** et **Client Secret**

## 6. Test de l'authentification

### Test local :
1. Redémarrez votre serveur de développement : `npm run dev`
2. Testez la connexion avec email/mot de passe
3. Testez la connexion avec Google
4. Testez la connexion avec Apple

### Fonctionnalités ajoutées :
- ✅ Bouton pour voir/masquer le mot de passe
- ✅ Gestion des erreurs améliorée
- ✅ Page de callback pour OAuth
- ✅ Variables d'environnement configurées
- ✅ Logs de débogage pour l'authentification

## 7. Dépannage

### Problèmes courants :

1. **Erreur "Supabase non configuré"**
   - Vérifiez que le fichier `.env` existe
   - Vérifiez que les variables sont correctes

2. **Erreur OAuth "redirect_uri_mismatch"**
   - Vérifiez les URLs de redirection dans Google/Apple
   - Vérifiez la configuration dans Supabase

3. **Erreur "Invalid client"**
   - Vérifiez que les providers sont activés dans Supabase
   - Vérifiez les Client ID et Client Secret

### Commandes utiles :
```bash
# Redémarrer le serveur de développement
npm run dev

# Vérifier les variables d'environnement
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

## 8. Production

Pour la production, n'oubliez pas de :
1. Configurer les URLs de production dans Supabase
2. Configurer les URLs de production dans Google/Apple
3. Utiliser HTTPS pour toutes les URLs
4. Configurer les variables d'environnement sur votre plateforme de déploiement 