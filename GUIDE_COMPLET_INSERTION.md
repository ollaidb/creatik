# Guide Complet : Insérer les Pseudos dans la Base de Données

## 🚨 Problème Actuel
La page affiche "0 idée" car les données ne sont pas encore dans la base de données.

## ✅ Solution en 3 Étapes

### ÉTAPE 1 : Vérifier l'état actuel (Optionnel)

Exécutez `check_username_ideas.sql` dans Supabase Dashboard pour voir l'état actuel :
- Si la table existe
- Combien de pseudos sont présents
- L'état des politiques RLS

### ÉTAPE 2 : Exécuter le script complet (RECOMMANDÉ)

**Le plus simple :** Exécutez `fix_and_insert_username_ideas.sql` qui fait tout en une fois :

1. **Ouvrez Supabase Dashboard**
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet

2. **Ouvrez SQL Editor**
   - Cliquez sur "SQL Editor" dans le menu de gauche
   - Cliquez sur "New query"

3. **Copiez-collez le script**
   - Ouvrez le fichier `fix_and_insert_username_ideas.sql`
   - Copiez **TOUT** le contenu
   - Collez dans l'éditeur SQL

4. **Exécutez**
   - Cliquez sur "Run" ou `Ctrl+Enter` / `Cmd+Enter`

5. **Vérifiez le résultat**
   - Vous devriez voir : `✅ Script terminé!` avec le nombre de pseudos insérés

### ÉTAPE 3 : Recharger la page

Après l'exécution du script :
1. Rechargez la page `/community/usernames` dans votre navigateur
2. Vous devriez voir les pseudos s'afficher

## 📊 Résultat Attendu

Après l'exécution, vous devriez avoir :
- **100 pseudos** au total (10 par réseau social)
- **10 réseaux sociaux** avec des pseudos :
  - TikTok
  - YouTube
  - Instagram
  - Facebook
  - Twitter
  - Twitch
  - LinkedIn
  - Blog
  - Article
  - Podcasts

## 🔧 Dépannage

### Erreur : "relation username_ideas does not exist"
→ Exécutez d'abord `create_username_ideas_table.sql`

### Erreur : "permission denied"
→ Vérifiez que vous êtes connecté en tant qu'administrateur

### Toujours "0 idée" après l'insertion
→ Vérifiez dans Supabase Dashboard → Table Editor → username_ideas
→ Vérifiez que les données sont bien là

## 📝 Note

Le script `fix_and_insert_username_ideas.sql` :
- ✅ Rend `user_id` nullable (pour les données automatiques)
- ✅ Met à jour les politiques RLS
- ✅ Insère 100 pseudos (10 par réseau)
- ✅ Évite les doublons (peut être exécuté plusieurs fois)

