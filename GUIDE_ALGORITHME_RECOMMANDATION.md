# 📊 Guide d'utilisation du système d'algorithme de recommandation

## Vue d'ensemble

Ce système permet de gérer les recommandations de contenu personnalisées pour Creatik. Toutes les règles sont configurables via la base de données, sans avoir à modifier le code.

## 🗄️ Tables créées

### 1. `content_recommendation_rules`
Stocke les règles configurables pour suggérer du contenu.

**Champs principaux:**
- `rule_name`: Nom unique de la règle
- `rule_type`: Type de règle (`preference_based`, `engagement_based`, `similarity_based`, `trending`, `social_analysis`, `collaborative`)
- `priority`: Ordre d'exécution (1 = priorité max, plus petit = plus prioritaire)
- `weight`: Poids pour calculer le score final (0.0 à 1.0)
- `conditions`: JSONB définissant quand appliquer la règle
- `action`: JSONB définissant la logique de la règle
- `max_results`: Nombre maximum de résultats à retourner
- `is_active`: Activer/désactiver la règle

### 2. `user_engagement_metrics`
Track toutes les interactions utilisateur avec le contenu.

**Types d'interactions:**
- `view`: Vue d'un titre
- `like`: Like d'un titre
- `favorite`: Ajout aux favoris
- `copy`: Copie d'un titre
- `share`: Partage d'un titre
- `skip`: Passage d'un titre
- `dismiss`: Rejet d'un titre

### 3. `content_relevance_scores`
Stocke les scores de pertinence calculés (mise en cache).

**Scores calculés:**
- `preference_score`: Basé sur les préférences utilisateur
- `engagement_score`: Basé sur l'historique d'engagement
- `similarity_score`: Basé sur la similarité
- `trending_score`: Basé sur les tendances
- `final_score`: Score final pondéré

### 4. `content_suggestions_cache`
Cache des suggestions générées pour améliorer les performances.

### 5. `user_social_post_analysis`
Analyse des posts réseaux sociaux de l'utilisateur (fonctionnalité future).

### 6. `user_recommendation_profile`
Profil de recommandation calculé pour chaque utilisateur.

## 📋 Règles par défaut

### Règle 1: Preference Category Priority (Priorité: 1)
- **Type**: `preference_based`
- **Score**: 1.0 (maximum)
- **Description**: Priorise les titres de la catégorie préférée de l'utilisateur
- **Condition**: L'utilisateur doit avoir défini une `preferred_category_id`
- **Résultat**: Jusqu'à 30 titres

### Règle 2: Similar Titles Matching (Priorité: 2)
- **Type**: `similarity_based`
- **Score**: 0.9
- **Description**: Trouve des titres similaires basés sur les titres sélectionnés
- **Condition**: L'utilisateur doit avoir sélectionné des `similar_titles_ids`
- **Résultat**: Jusqu'à 20 titres

### Règle 3: Inspiring Creators Content (Priorité: 3)
- **Type**: `preference_based`
- **Score**: 0.85
- **Description**: Recommandations basées sur les catégories des créateurs inspirants
- **Condition**: L'utilisateur doit avoir sélectionné des `inspiring_creators_ids`
- **Résultat**: Jusqu'à 20 titres

### Règle 4: Liked Categories Content (Priorité: 4)
- **Type**: `engagement_based`
- **Score**: 0.8
- **Description**: Recommandations basées sur les catégories likées
- **Condition**: L'utilisateur doit avoir liké au moins une catégorie
- **Résultat**: Jusqu'à 50 titres

### Règle 5: Search History Based (Priorité: 5)
- **Type**: `engagement_based`
- **Score**: 0.6
- **Description**: Recommandations basées sur l'historique de recherche
- **Condition**: L'utilisateur doit avoir effectué au moins une recherche
- **Résultat**: Jusqu'à 30 titres

### Règle 6: General Engagement Based (Priorité: 6)
- **Type**: `engagement_based`
- **Score**: 0.75
- **Description**: Recommandations basées sur l'historique d'engagement général
- **Condition**: L'utilisateur doit avoir au moins 5 interactions dans les 30 derniers jours
- **Résultat**: Jusqu'à 25 titres

### Règle 7: Trending Content Fallback (Priorité: 10)
- **Type**: `trending`
- **Score**: 0.4
- **Description**: Complète avec du contenu tendance si pas assez de recommandations
- **Condition**: S'applique toujours si nécessaire
- **Résultat**: Jusqu'à 10 titres

### Règles futures (inactives):
- **Règle 8**: Social Media Posts Analysis (Priorité: 7) - Analyse des posts réseaux sociaux
- **Règle 9**: Collaborative Filtering (Priorité: 8) - Filtrage collaboratif

## 🚀 Comment utiliser

### 1. Exécuter le script SQL

```sql
-- Dans votre base de données Supabase
\i create-recommendation-algorithm-system.sql
```

### 2. Enregistrer une interaction utilisateur

Quand un utilisateur interagit avec du contenu, enregistrez l'interaction:

```sql
INSERT INTO public.user_engagement_metrics (
  user_id,
  content_title_id,
  category_id,
  subcategory_id,
  interaction_type,
  interaction_value,
  source,
  context
) VALUES (
  'user-uuid-here',
  'title-uuid-here',
  'category-uuid-here',
  'subcategory-uuid-here',
  'view',
  1,
  'for_you_page',
  '{"position": 3, "time_spent_seconds": 15}'::jsonb
);
```

### 3. Modifier une règle

Pour modifier le poids ou les paramètres d'une règle:

```sql
UPDATE public.content_recommendation_rules
SET 
  weight = 0.95,
  max_results = 40,
  action = '{"type": "filter_by_preferred_category", "include_level2": true}'::jsonb
WHERE rule_name = 'Preference Category Priority';
```

### 4. Désactiver/Activer une règle

```sql
-- Désactiver une règle
UPDATE public.content_recommendation_rules
SET is_active = false
WHERE rule_name = 'Trending Content Fallback';

-- Activer une règle
UPDATE public.content_recommendation_rules
SET is_active = true
WHERE rule_name = 'Social Media Posts Analysis';
```

### 5. Ajouter une nouvelle règle

```sql
INSERT INTO public.content_recommendation_rules (
  rule_name,
  rule_type,
  priority,
  weight,
  conditions,
  action,
  max_results,
  min_relevance_score,
  description
) VALUES (
  'My Custom Rule',
  'preference_based',
  5,
  0.7,
  '{"source": "user_preferences", "field": "creator_type", "operator": "equals", "value": "influenceur"}'::jsonb,
  '{"type": "filter_by_creator_type", "exclude_liked": true}'::jsonb,
  20,
  0.3,
  'Ma règle personnalisée pour les influenceurs'
);
```

### 6. Consulter les règles actives

```sql
SELECT 
  rule_name,
  rule_type,
  priority,
  weight,
  max_results,
  is_active,
  description
FROM public.content_recommendation_rules
WHERE is_active = true
ORDER BY priority ASC;
```

### 7. Voir les métriques d'engagement d'un utilisateur

```sql
SELECT 
  interaction_type,
  COUNT(*) as count,
  AVG(interaction_value) as avg_value
FROM public.user_engagement_metrics
WHERE user_id = 'user-uuid-here'
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY interaction_type
ORDER BY count DESC;
```

### 8. Voir les scores de pertinence d'un utilisateur

```sql
SELECT 
  ct.title,
  crs.final_score,
  crs.preference_score,
  crs.engagement_score,
  crs.similarity_score
FROM public.content_relevance_scores crs
JOIN public.content_titles ct ON ct.id = crs.content_title_id
WHERE crs.user_id = 'user-uuid-here'
ORDER BY crs.final_score DESC
LIMIT 20;
```

## 🔧 Intégration dans le code

### Exemple: Enregistrer une interaction

```typescript
import { supabase } from '@/integrations/supabase/client';

async function trackInteraction(
  userId: string,
  titleId: string,
  categoryId: string,
  subcategoryId: string,
  type: 'view' | 'like' | 'favorite' | 'copy' | 'share' | 'skip' | 'dismiss',
  context?: Record<string, any>
) {
  const { error } = await supabase
    .from('user_engagement_metrics')
    .insert({
      user_id: userId,
      content_title_id: titleId,
      category_id: categoryId,
      subcategory_id: subcategoryId,
      interaction_type: type,
      interaction_value: type === 'like' ? 2 : type === 'favorite' ? 2.5 : type === 'skip' ? -1 : 1,
      source: 'for_you_page',
      context: context || {}
    });
  
  if (error) {
    console.error('Error tracking interaction:', error);
  }
}
```

### Exemple: Charger les règles actives

```typescript
async function getActiveRules() {
  const { data, error } = await supabase
    .from('content_recommendation_rules')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: true });
  
  if (error) {
    console.error('Error loading rules:', error);
    return [];
  }
  
  return data;
}
```

## 📊 Types de règles disponibles

### `preference_based`
Basé sur les préférences explicites de l'utilisateur (catégorie préférée, créateurs inspirants, etc.)

### `engagement_based`
Basé sur l'historique d'interactions de l'utilisateur (likes, vues, recherches, etc.)

### `similarity_based`
Basé sur la similarité avec du contenu que l'utilisateur a sélectionné

### `trending`
Basé sur le contenu tendance actuel

### `social_analysis`
Basé sur l'analyse des posts de l'utilisateur sur les réseaux sociaux (future)

### `collaborative`
Basé sur le filtrage collaboratif (utilisateurs similaires) (future)

## ⚙️ Configuration des conditions

Les conditions sont définies en JSONB avec la structure suivante:

```json
{
  "source": "user_preferences" | "user_favorites" | "user_engagement_metrics" | "search_history" | "system",
  "field": "nom_du_champ",
  "operator": "exists" | "equals" | "array_length_greater" | "has_records" | "min_searches" | "min_interactions",
  "value": "valeur à comparer (optionnel)"
}
```

Exemples:
- `{"source": "user_preferences", "field": "preferred_category_id", "operator": "exists"}`
- `{"source": "user_preferences", "field": "similar_titles_ids", "operator": "array_length_greater", "value": 0}`
- `{"source": "user_engagement_metrics", "min_interactions": 5, "lookback_days": 30}`

## ⚙️ Configuration des actions

Les actions sont définies en JSONB avec la structure suivante:

```json
{
  "type": "filter_by_preferred_category" | "find_similar_by_subcategory" | "filter_by_creator_categories" | "recommend_by_liked_categories" | "recommend_by_search_keywords" | "recommend_by_engagement" | "get_trending",
  "param1": "valeur",
  "param2": "valeur"
}
```

Exemples:
- `{"type": "filter_by_preferred_category", "include_level2": true, "fallback_to_all_subcategories": true, "exclude_liked": true}`
- `{"type": "recommend_by_engagement", "lookback_days": 30, "weight_likes": 2.0, "weight_views": 1.0}`

## 🔄 Mise à jour des règles

Les règles peuvent être modifiées à tout moment sans toucher au code. Voici quelques exemples:

### Changer la priorité d'une règle
```sql
UPDATE public.content_recommendation_rules
SET priority = 2
WHERE rule_name = 'Similar Titles Matching';
```

### Modifier le poids d'une règle
```sql
UPDATE public.content_recommendation_rules
SET weight = 0.95
WHERE rule_name = 'Preference Category Priority';
```

### Modifier les paramètres d'action
```sql
UPDATE public.content_recommendation_rules
SET action = '{"type": "filter_by_preferred_category", "include_level2": false}'::jsonb
WHERE rule_name = 'Preference Category Priority';
```

## 📈 Statistiques et monitoring

### Nombre d'interactions par type
```sql
SELECT 
  interaction_type,
  COUNT(*) as total,
  COUNT(DISTINCT user_id) as unique_users
FROM public.user_engagement_metrics
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY interaction_type;
```

### Règles les plus utilisées
```sql
SELECT 
  rule_name,
  execution_count,
  last_executed_at
FROM public.content_recommendation_rules
WHERE execution_count > 0
ORDER BY execution_count DESC;
```

### Top catégories engagées
```sql
SELECT 
  c.name as category_name,
  COUNT(*) as interaction_count,
  COUNT(DISTINCT uem.user_id) as unique_users
FROM public.user_engagement_metrics uem
JOIN public.categories c ON c.id = uem.category_id
WHERE uem.created_at > NOW() - INTERVAL '30 days'
GROUP BY c.id, c.name
ORDER BY interaction_count DESC
LIMIT 10;
```

## 🚨 Nettoyage et maintenance

### Nettoyer les caches expirés
```sql
SELECT public.cleanup_expired_caches();
```

### Nettoyer les métriques anciennes (optionnel)
```sql
-- Supprimer les métriques de plus de 90 jours
DELETE FROM public.user_engagement_metrics
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Réinitialiser les scores de pertinence
```sql
-- Supprimer tous les scores expirés
DELETE FROM public.content_relevance_scores
WHERE expires_at < NOW();
```

## 🔐 Sécurité (RLS)

Toutes les tables utilisateur ont RLS activé:
- Les utilisateurs ne peuvent voir que leurs propres données
- Les règles de recommandation sont lisibles par tous (mais modifiables seulement par les admins)
- Les métriques d'engagement sont privées par utilisateur

## 📝 Prochaines étapes

1. ✅ Exécuter le script SQL
2. ✅ Tester les règles par défaut
3. ✅ Intégrer l'enregistrement des interactions dans votre code
4. ✅ Adapter les règles selon vos besoins
5. ⏳ Activer les règles "FUTURE" quand les fonctionnalités seront prêtes
6. ⏳ Implémenter la logique de calcul des recommandations basée sur ces règles

## ❓ Questions fréquentes

**Q: Comment changer l'ordre d'exécution des règles?**  
R: Modifiez le champ `priority`. Les règles sont exécutées dans l'ordre croissant de priorité (1 = premier).

**Q: Comment désactiver une règle sans la supprimer?**  
R: Mettez `is_active = false` sur la règle.

**Q: Comment ajouter une nouvelle règle personnalisée?**  
R: Insérez une nouvelle ligne dans `content_recommendation_rules` avec les conditions et actions appropriées.

**Q: Les règles sont-elles appliquées en séquence ou en parallèle?**  
R: Cela dépend de votre implémentation. Les règles sont triées par priorité, mais vous pouvez les exécuter en parallèle si elles ne dépendent pas les unes des autres.

**Q: Comment optimiser les performances?**  
R: Utilisez les caches (`content_suggestions_cache` et `content_relevance_scores`), nettoyez régulièrement les données anciennes, et limitez le nombre de résultats par règle.

