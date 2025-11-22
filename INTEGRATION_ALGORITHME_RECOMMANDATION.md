# 🚀 Intégration de l'algorithme de recommandation

## Vue d'ensemble

Votre algorithme de recommandation est maintenant configuré avec **11 règles actives** basées sur :
- ✅ Les likes (titres, catégories, sous-catégories, créateurs)
- ✅ La personnalisation sauvegardée (page Personalization.tsx)
- ✅ Les sous-catégories proches des titres likés
- ✅ Les créateurs likés
- ✅ Les recherches de l'utilisateur
- ✅ Les défis notés/sélectionnés

## 📋 Règles implémentées

### Priorité Maximale (Score: 1.0)
1. **Preference Category Priority** - Catégorie préférée depuis la personnalisation

### Priorité Haute (Scores: 0.85-0.95)
2. **Similar Content from Liked Titles** - Contenu similaire aux titres likés dans des sous-catégories proches
3. **Similar Titles from Personalization** - Titres similaires sélectionnés dans la personnalisation
4. **Content from Liked Creators** - Contenu selon les créateurs likés
5. **Inspiring Creators Content** - Créateurs inspirants depuis la personnalisation
6. **Liked Categories Content** - Catégories likées
7. **Liked Subcategories Similar Content** - Sous-catégories similaires aux sous-catégories likées

### Priorité Moyenne (Scores: 0.65-0.75)
8. **Search History Based** - Recherches de l'utilisateur
9. **User Challenges Based** - Défis notés/sélectionnés
10. **General Engagement Based** - Engagement général

### Fallback (Score: 0.4)
11. **Trending Content Fallback** - Contenu tendance si besoin

## 🔧 Étape 1: Exécuter le script SQL

```sql
-- Dans Supabase SQL Editor ou via psql
\i create-recommendation-algorithm-system.sql
```

## 🔧 Étape 2: Créer un hook pour charger les règles

Créez un nouveau hook `useRecommendationRules.ts` :

```typescript
// src/hooks/useRecommendationRules.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RecommendationRule {
  id: string;
  rule_name: string;
  rule_type: string;
  priority: number;
  weight: number;
  conditions: Record<string, any>;
  action: Record<string, any>;
  max_results: number;
  min_relevance_score: number;
  is_active: boolean;
  description: string;
}

export const useRecommendationRules = () => {
  return useQuery({
    queryKey: ['recommendation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_recommendation_rules')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true });

      if (error) throw error;
      return data as RecommendationRule[];
    },
    staleTime: 5 * 60 * 1000, // Cache 5 minutes
  });
};
```

## 🔧 Étape 3: Enregistrer les interactions utilisateur

Créez un hook pour tracker les interactions :

```typescript
// src/hooks/useTrackInteraction.ts
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type InteractionType = 
  | 'view' 
  | 'like' 
  | 'favorite' 
  | 'copy' 
  | 'share' 
  | 'skip' 
  | 'dismiss' 
  | 'click' 
  | 'save';

interface TrackInteractionParams {
  titleId: string;
  categoryId?: string;
  subcategoryId?: string;
  type: InteractionType;
  source?: string;
  context?: Record<string, any>;
}

export const useTrackInteraction = () => {
  const { user } = useAuth();

  const trackInteraction = async ({
    titleId,
    categoryId,
    subcategoryId,
    type,
    source = 'unknown',
    context = {},
  }: TrackInteractionParams) => {
    if (!user) return;

    const interactionValue = 
      type === 'like' ? 2 :
      type === 'favorite' ? 2.5 :
      type === 'skip' || type === 'dismiss' ? -1 :
      1;

    const { error } = await supabase
      .from('user_engagement_metrics')
      .insert({
        user_id: user.id,
        content_title_id: titleId,
        category_id: categoryId || null,
        subcategory_id: subcategoryId || null,
        interaction_type: type,
        interaction_value,
        source,
        context,
      });

    if (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  return { trackInteraction };
};
```

## 🔧 Étape 4: Mettre à jour usePersonalizedRecommendations

Modifiez votre hook existant pour utiliser les règles :

```typescript
// src/hooks/usePersonalizedRecommendations.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useSearchHistory } from './useSearchHistory';
import { useRecommendationRules } from './useRecommendationRules';
import { useTrackInteraction } from './useTrackInteraction';

export interface RecommendedTitle {
  id: string;
  title: string;
  category_id?: string;
  subcategory_id?: string;
  category_name?: string;
  subcategory_name?: string;
  relevance_score: number;
}

export const usePersonalizedRecommendations = (
  initialPage: number = 0, 
  pageSize: number = 10
) => {
  const { user } = useAuth();
  const { history } = useSearchHistory();
  const { data: rules } = useRecommendationRules();
  const { trackInteraction } = useTrackInteraction();
  
  const [recommendations, setRecommendations] = useState<RecommendedTitle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const loadedIdsRef = useRef<Set<string>>(new Set());
  const currentPageRef = useRef(0);

  // Fonction pour appliquer une règle spécifique
  const applyRule = useCallback(async (
    rule: any,
    likedTitleIds: string[],
    userPreferences: any,
    allRecommendedTitles: RecommendedTitle[]
  ): Promise<RecommendedTitle[]> => {
    const excludeIds = [...likedTitleIds, ...allRecommendedTitles.map(t => t.id)];

    switch (rule.rule_name) {
      case 'Preference Category Priority':
        // Implémenter la logique pour la catégorie préférée
        if (userPreferences?.preferred_category_id) {
          // Votre logique existante...
        }
        break;

      case 'Similar Content from Liked Titles':
        // Implémenter la logique pour les titres likés similaires
        // ...
        break;

      // Ajouter les autres règles...
    }

    return [];
  }, []);

  const loadRecommendations = useCallback(async (append: boolean = false) => {
    if (!user || !rules) {
      setRecommendations([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Récupérer les favoris
      const { data: likedTitles } = await supabase
        .from('user_favorites')
        .select('item_id')
        .eq('user_id', user.id)
        .eq('item_type', 'title');

      const likedTitleIds = likedTitles?.map(t => t.item_id) || [];

      // 2. Charger les préférences utilisateur
      const { data: userPreferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      let allRecommendedTitles: RecommendedTitle[] = [];

      // 3. Appliquer les règles par ordre de priorité
      for (const rule of rules) {
        if (allRecommendedTitles.length >= pageSize * 2) break;

        const ruleResults = await applyRule(rule, likedTitleIds, userPreferences, allRecommendedTitles);
        allRecommendedTitles = [...allRecommendedTitles, ...ruleResults];
      }

      // 4. Trier par score et dédupliquer
      allRecommendedTitles = allRecommendedTitles
        .filter((title, index, self) => 
          index === self.findIndex(t => t.id === title.id)
        )
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .filter(t => !loadedIdsRef.current.has(t.id))
        .slice(0, pageSize);

      // 5. Mettre à jour les IDs chargés
      allRecommendedTitles.forEach(t => loadedIdsRef.current.add(t.id));

      if (append) {
        setRecommendations(prev => [...prev, ...allRecommendedTitles]);
      } else {
        setRecommendations(allRecommendedTitles);
        loadedIdsRef.current.clear();
        allRecommendedTitles.forEach(t => loadedIdsRef.current.add(t.id));
      }

      setHasMore(allRecommendedTitles.length === pageSize);
      currentPageRef.current += 1;

      // 6. Enregistrer les vues (tracking)
      allRecommendedTitles.forEach((title, index) => {
        trackInteraction({
          titleId: title.id,
          categoryId: title.category_id,
          subcategoryId: title.subcategory_id,
          type: 'view',
          source: 'for_you_page',
          context: { position: index + 1 },
        });
      });

    } catch (err) {
      console.error('Erreur lors du chargement des recommandations:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [user, rules, pageSize, applyRule, trackInteraction]);

  useEffect(() => {
    if (initialPage === 0) {
      loadedIdsRef.current.clear();
      setRecommendations([]);
      currentPageRef.current = 0;
    }
    loadRecommendations(initialPage > 0);
  }, [initialPage, loadRecommendations]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadRecommendations(true);
    }
  }, [loading, hasMore, loadRecommendations]);

  return {
    recommendations,
    loading,
    error,
    hasMore,
    loadMore,
    refreshRecommendations: () => {
      loadedIdsRef.current.clear();
      setRecommendations([]);
      currentPageRef.current = 0;
      loadRecommendations(false);
    }
  };
};
```

## 🔧 Étape 5: Utiliser dans les composants

### Dans la page d'accueil (Section "Pour toi")

```typescript
// src/pages/Index.tsx ou votre page d'accueil
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { useTrackInteraction } from '@/hooks/useTrackInteraction';

const ForYouSection = () => {
  const { recommendations, loading, loadMore } = usePersonalizedRecommendations(0, 10);
  const { trackInteraction } = useTrackInteraction();

  const handleLike = async (titleId: string, categoryId?: string, subcategoryId?: string) => {
    await trackInteraction({
      titleId,
      categoryId,
      subcategoryId,
      type: 'like',
      source: 'for_you_page',
    });
    // Votre logique de like...
  };

  // Votre rendu...
};
```

### Dans la page des titres (Premiers titres à afficher)

```typescript
// src/pages/Titles.tsx
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';

const Titles = () => {
  // Pour les premiers titres personnalisés
  const { recommendations: personalizedTitles } = usePersonalizedRecommendations(0, 20);
  
  // Ensuite charger tous les autres titres normalement...

  // Afficher d'abord les titres personnalisés, puis les autres
};
```

## 📊 Exemples d'utilisation des règles

### Modifier le poids d'une règle

```sql
UPDATE public.content_recommendation_rules
SET weight = 0.98
WHERE rule_name = 'Preference Category Priority';
```

### Désactiver une règle

```sql
UPDATE public.content_recommendation_rules
SET is_active = false
WHERE rule_name = 'Trending Content Fallback';
```

### Voir les règles actives

```sql
SELECT rule_name, priority, weight, max_results, description
FROM public.content_recommendation_rules
WHERE is_active = true
ORDER BY priority;
```

## 🎯 Priorités d'implémentation

1. ✅ **Exécuter le script SQL** pour créer les tables
2. ✅ **Créer les hooks** pour charger les règles et tracker les interactions
3. ✅ **Intégrer le tracking** dans vos composants existants
4. ✅ **Modifier usePersonalizedRecommendations** pour utiliser les règles
5. ✅ **Tester** et ajuster les règles selon les résultats

## 📝 Notes importantes

- Les règles sont exécutées par ordre de priorité (1 = premier)
- Chaque règle peut retourner jusqu'à `max_results` titres
- Les titres déjà likés sont automatiquement exclus
- Les scores de pertinence sont mis en cache dans `content_relevance_scores`
- Les suggestions peuvent être mises en cache dans `content_suggestions_cache`

## 🔍 Dépannage

### Les recommandations ne changent pas

Vérifiez que les interactions sont bien enregistrées :
```sql
SELECT * FROM public.user_engagement_metrics 
WHERE user_id = 'your-user-id' 
ORDER BY created_at DESC 
LIMIT 10;
```

### Ajuster les règles

Modifiez les règles directement en SQL ou créez une interface admin pour les gérer.

## 🚀 Prochaines étapes

1. Implémenter la logique complète pour chaque règle dans `applyRule`
2. Optimiser les performances avec la mise en cache
3. Ajouter des statistiques pour monitorer l'efficacité des règles
4. Créer une interface admin pour gérer les règles

