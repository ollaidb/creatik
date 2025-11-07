# Guide : Insertion automatique des pseudos

## 🚀 Méthode 1 : Script Node.js (Recommandé)

### Prérequis
- Node.js installé
- Variables d'environnement Supabase configurées dans `.env.local`

### Étapes

1. **Installer les dépendances** (si pas déjà fait)
   ```bash
   npm install
   ```

2. **Vérifier votre fichier `.env.local`**
   Assurez-vous d'avoir :
   ```env
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_cle_anon
   ```

3. **Exécuter le script**
   ```bash
   node scripts/insert-username-ideas.js
   ```

4. **Résultat attendu**
   ```
   🚀 Début de l'insertion des pseudos...
   ✅ Utilisateur connecté: votre@email.com
   📡 10 réseaux sociaux trouvés
   📝 Insertion pour TikTok...
     ✅ creativetok
     ✅ vibesonly
     ...
   ✅ Terminé!
   📊 Total: 100 pseudos insérés
   ```

## 🚀 Méthode 2 : Via Supabase Dashboard (Manuel)

1. Ouvrez **Supabase Dashboard** → **SQL Editor**
2. Copiez le contenu de `insert_username_ideas_simple.sql`
3. **IMPORTANT** : Connectez-vous d'abord dans l'application pour que `auth.uid()` fonctionne
4. Collez et exécutez le script

## 🔧 Dépannage

### Erreur : "Variables d'environnement manquantes"
- Vérifiez que votre fichier `.env.local` existe
- Vérifiez que les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont présentes

### Erreur : "Vous devez être authentifié"
- Option 1 : Connectez-vous via l'application web, puis exécutez le script
- Option 2 : Utilisez `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local` (plus sécurisé pour les scripts)

### Erreur : "Table username_ideas n'existe pas"
- Exécutez d'abord `create_username_ideas_table.sql` dans Supabase Dashboard

## 📝 Note importante

Le script vérifie automatiquement si un pseudo existe déjà avant de l'insérer, donc vous pouvez l'exécuter plusieurs fois sans créer de doublons.

