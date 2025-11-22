# Diagnostic de l'authentification par email

## Problème
L'authentification par email simple ne fonctionne pas.

## Étapes de diagnostic

### 1. Vérifier la configuration Supabase

**Dans le dashboard Supabase :**
1. Allez dans **Authentication** → **Settings**
2. Vérifiez que **Email Auth** est activé
3. Vérifiez que **Confirm email** est configuré selon vos besoins
4. Vérifiez que **Secure email change** est activé si nécessaire

### 2. Vérifier les variables d'environnement

**Dans votre application :**
- `VITE_SUPABASE_URL` : `https://eiuhcgvvexoshuopvska.supabase.co`
- `VITE_SUPABASE_ANON_KEY` : Votre clé anonyme

### 3. Tester l'authentification

**Exécutez ces scripts SQL :**

```sql
-- Vérifier si l'utilisateur existe
SELECT * FROM auth.users WHERE email = 'collabbinta@gmail.com';

-- Vérifier les tentatives de connexion
SELECT * FROM auth.audit_log_entries 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'collabbinta@gmail.com')
ORDER BY created_at DESC LIMIT 10;
```

### 4. Vérifier les logs de l'application

**Ouvrez la console du navigateur et essayez de vous connecter :**
1. Ouvrez les **Outils de développement** (F12)
2. Allez dans l'onglet **Console**
3. Essayez de vous connecter avec email/mot de passe
4. Regardez les logs qui apparaissent

### 5. Problèmes courants

**A. Email non confirmé :**
- Vérifiez votre boîte email pour le lien de confirmation
- Vérifiez les spams

**B. Mot de passe incorrect :**
- Essayez de réinitialiser le mot de passe
- Vérifiez que le mot de passe respecte les règles de sécurité

**C. Configuration Supabase :**
- Vérifiez que l'authentification par email est activée
- Vérifiez les paramètres de sécurité

**D. Variables d'environnement :**
- Vérifiez que les variables sont bien définies
- Vérifiez que l'URL de redirection est correcte

### 6. Test de connexion

**Essayez de créer un nouveau compte :**
1. Utilisez une nouvelle adresse email
2. Créez un mot de passe fort (8+ caractères, majuscules, minuscules, chiffres)
3. Vérifiez que vous recevez l'email de confirmation

### 7. Logs à surveiller

**Dans la console du navigateur, vous devriez voir :**
```
Tentative de connexion pour: collabbinta@gmail.com
Résultat connexion: { error: null } // ou un message d'erreur
```

**Si vous voyez une erreur, notez-la et partagez-la.**

### 8. Solutions possibles

**A. Réinitialiser le mot de passe :**
- Utilisez la fonction "Mot de passe oublié"
- Vérifiez votre email pour le lien de réinitialisation

**B. Créer un nouveau compte :**
- Utilisez une nouvelle adresse email
- Suivez le processus d'inscription complet

**C. Vérifier la configuration :**
- Contactez le support Supabase si nécessaire
- Vérifiez les paramètres de sécurité

## Prochaines étapes

1. **Exécutez les scripts de diagnostic**
2. **Vérifiez les logs dans la console**
3. **Testez avec une nouvelle adresse email**
4. **Partagez les erreurs spécifiques** que vous voyez 