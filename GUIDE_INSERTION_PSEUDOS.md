# Guide : Insérer des pseudos dans la base de données

## 📋 Étapes pour insérer les pseudos

### 1. Récupérer votre User ID

Avant d'exécuter le script, vous devez récupérer votre `user_id` :

**Option A : Via Supabase Dashboard**
1. Allez dans **"Authentication"** → **"Users"**
2. Trouvez votre utilisateur
3. Copiez l'**UUID** (ex: `123e4567-e89b-12d3-a456-426614174000`)

**Option B : Via SQL**
Exécutez cette requête dans l'éditeur SQL :
```sql
SELECT id, email 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;
```

### 2. Modifier le script

1. Ouvrez le fichier `insert_username_ideas_examples.sql`
2. Remplacez **TOUTES** les occurrences de `'VOTRE_USER_ID'` par votre vrai UUID
3. Exemple :
   ```sql
   -- Avant
   'VOTRE_USER_ID'::uuid
   
   -- Après (avec votre UUID)
   '123e4567-e89b-12d3-a456-426614174000'::uuid
   ```

### 3. Exécuter le script

1. Ouvrez **Supabase Dashboard** → **SQL Editor**
2. Copiez-collez le contenu du fichier `insert_username_ideas_examples.sql` (après avoir remplacé l'UUID)
3. Cliquez sur **"Run"**

### 4. Vérifier l'insertion

Le script affiche automatiquement :
- Le nombre de pseudos par réseau social
- La liste complète des pseudos insérés

## 📊 Résultat attendu

Vous devriez avoir **100 pseudos** au total :
- 10 pour TikTok
- 10 pour YouTube
- 10 pour Instagram
- 10 pour Facebook
- 10 pour Twitter
- 10 pour Twitch
- 10 pour LinkedIn
- 10 pour Blog
- 10 pour Article
- 10 pour Podcasts

## ⚠️ Notes importantes

- Le script utilise `WHERE NOT EXISTS` pour éviter les doublons
- Si un pseudo existe déjà, il ne sera pas réinséré
- Vous pouvez exécuter le script plusieurs fois sans problème
- Les pseudos sont associés à votre user_id

## 🔧 Alternative : Script avec votre User ID automatique

Si vous êtes connecté en tant qu'utilisateur authentifié, vous pouvez utiliser cette version qui récupère automatiquement votre user_id :

```sql
-- Version automatique (nécessite d'être authentifié)
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT 
  'creativetok',
  (SELECT id FROM public.social_networks WHERE name = 'tiktok' LIMIT 1),
  auth.uid()
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = 'creativetok' 
  AND social_network_id = (SELECT id FROM public.social_networks WHERE name = 'tiktok' LIMIT 1)
);
```

## ✅ Vérification rapide

Pour voir tous vos pseudos :
```sql
SELECT 
  ui.pseudo,
  sn.display_name as reseau,
  ui.created_at
FROM public.username_ideas ui
JOIN public.social_networks sn ON ui.social_network_id = sn.id
WHERE ui.user_id = 'VOTRE_USER_ID'  -- Remplacez par votre UUID
ORDER BY sn.display_name, ui.pseudo;
```

