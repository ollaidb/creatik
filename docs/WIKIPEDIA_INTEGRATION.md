# Intégration Wikipédia - Guide d'utilisation

Ce guide explique comment configurer et utiliser le système d'intégration Wikipédia pour récupérer automatiquement les événements historiques, anniversaires et célébrations.

## 🚀 Configuration rapide

### 1. Mettre à jour la base de données

Exécutez le script SQL pour ajouter les colonnes Wikipédia :

```sql
-- Dans votre client Supabase ou psql
\i scripts/update-events-with-wikipedia.sql
```

### 2. Installer les dépendances

```bash
npm install node-fetch
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env` dans le dossier `scripts/` :

```bash
# Copier l'exemple
cp scripts/env.example scripts/.env

# Éditer avec vos vraies valeurs
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Tester la configuration

```bash
# Test de l'API Wikipédia
node scripts/test-wikipedia-service.js

# Synchronisation complète
node scripts/sync-wikipedia-events.js
```

## 📊 Fonctionnalités

### Types d'événements supportés

- **🎂 Anniversaires** : Naissances de personnalités célèbres
- **⚰️ Décès** : Mort de personnalités importantes
- **📜 Événements historiques** : Dates marquantes de l'histoire
- **🎉 Fériés** : Jours fériés et célébrations
- **🌍 Journées internationales** : Journées de sensibilisation

### Données récupérées

- **Titre** : Nom de l'événement
- **Description** : Extrait de l'article Wikipédia
- **Année** : Date de l'événement
- **Personne** : Nom de la personnalité (si applicable)
- **Profession** : Métier/activité (si applicable)
- **URL Wikipédia** : Lien vers l'article complet
- **Catégorie** : Classification automatique

## 🔧 Utilisation dans l'application

### Hook React

```typescript
import useWikipediaEvents from '@/hooks/useWikipediaEvents';

const { events, loading, error, refreshEvents } = useWikipediaEvents();
```

### Service direct

```typescript
import wikipediaService from '@/services/wikipediaService';

// Récupérer les événements du jour
const todayEvents = await wikipediaService.getTodayEvents();

// Récupérer pour une date spécifique
const dateEvents = await wikipediaService.getEventsForDate(new Date('2024-01-15'));

// Récupérer les détails d'un événement
const details = await wikipediaService.getEventDetails('Mick Jagger');
```

## 🗄️ Structure de la base de données

### Nouvelles colonnes ajoutées

```sql
ALTER TABLE daily_events ADD COLUMN:
- wikipedia_title VARCHAR(500)     -- Titre de l'article Wikipédia
- wikipedia_url TEXT               -- URL de l'article
- wikipedia_extract TEXT           -- Extrait du contenu
- wikipedia_page_id VARCHAR(50)    -- ID de la page Wikipédia
- is_from_wikipedia BOOLEAN        -- Indique si l'événement vient de Wikipédia
- last_wikipedia_update TIMESTAMP  -- Date de dernière mise à jour
```

### Fonctions SQL créées

- `update_event_with_wikipedia()` : Met à jour un événement avec les données Wikipédia
- `get_events_with_wikipedia()` : Récupère les événements avec données Wikipédia
- `sync_events_with_wikipedia()` : Fonction de synchronisation

### Vues créées

- `popular_wikipedia_events` : Événements populaires avec données Wikipédia

## 🔄 Synchronisation automatique

### Script de synchronisation

Le script `sync-wikipedia-events.js` :

1. **Récupère** les événements du jour depuis Wikipédia
2. **Parse** et classe automatiquement les événements
3. **Vérifie** les doublons dans la base de données
4. **Insère** les nouveaux événements
5. **Récupère** les détails complets pour chaque événement

### Planification

Pour une synchronisation automatique quotidienne :

```bash
# Ajouter à votre crontab
0 6 * * * cd /path/to/creatik && node scripts/sync-wikipedia-events.js
```

## 🧪 Tests et débogage

### Test de l'API Wikipédia

```bash
node scripts/test-wikipedia-service.js
```

Ce script teste :
- ✅ Connexion à l'API Wikipédia
- ✅ Recherche d'événements
- ✅ Connexion à Supabase (si configuré)

### Logs de synchronisation

Le script de synchronisation affiche :
- 🔄 Début de synchronisation
- 📅 Nombre d'événements trouvés
- ✅ Événements ajoutés
- ❌ Erreurs rencontrées

## 🔒 Sécurité et limitations

### Rate limiting

- **Pause de 1 seconde** entre chaque requête Wikipédia
- **Limite de 20 événements** par synchronisation
- **Gestion des erreurs** pour éviter les blocages

### Variables d'environnement

- `SUPABASE_URL` : URL de votre projet Supabase
- `SUPABASE_SERVICE_ROLE_KEY` : Clé de service (accès complet)

⚠️ **Important** : Utilisez la clé de service, pas la clé anon !

## 🚨 Dépannage

### Erreurs courantes

1. **"require is not defined"** : Le projet utilise ES modules
   - Solution : Utilisez `import` au lieu de `require`

2. **"Variables d'environnement non définies"**
   - Solution : Créez le fichier `.env` avec vos clés Supabase

3. **"Erreur de connexion Supabase"**
   - Vérifiez vos clés d'API
   - Vérifiez que la table `daily_events` existe

4. **"Aucun événement trouvé"**
   - L'API Wikipédia peut être temporairement indisponible
   - Réessayez plus tard

### Support

Pour toute question ou problème :
1. Vérifiez les logs de synchronisation
2. Testez avec le script de test
3. Vérifiez la configuration des variables d'environnement

## 📈 Améliorations futures

- [ ] Synchronisation multi-langues
- [ ] Cache des événements populaires
- [ ] Interface d'administration pour la synchronisation
- [ ] Notifications en cas d'échec
- [ ] Métriques de performance 