# 📚 Guide d'utilisation des APIs Creatik

## 🚀 **Comment utiliser les APIs dans votre application**

### **1. Tendances Sociales (`/trending`)**

#### **Fonctionnalités :**
- ✅ Récupère les tendances de Reddit (gratuit)
- ✅ Simulation Twitter (nécessite API key)
- ✅ Filtrage par plateforme et catégorie
- ✅ Tri par engagement
- ✅ Intégration directe vers la création de contenu

#### **Comment l'utiliser :**
```javascript
// Dans un composant React
import { useSocialTrends } from '@/hooks/useSocialTrends';

const MyComponent = () => {
  const { trends, loading, error, filterByPlatform } = useSocialTrends();
  
  // Filtrer par plateforme
  const twitterTrends = filterByPlatform('twitter');
  
  // Utiliser les données
  return (
    <div>
      {trends.map(trend => (
        <div key={trend.id}>
          <h3>{trend.title}</h3>
          <p>{trend.description}</p>
          <span>Engagement: {trend.engagement}</span>
        </div>
      ))}
    </div>
  );
};
```

#### **URLs d'accès :**
- **Page web :** `http://localhost:8082/trending`
- **API directe :** `socialTrendsService.getAllTrends()`

---

### **2. Événements du jour (`/what-to-post`)**

#### **Fonctionnalités :**
- ✅ Événements Wikipedia (gratuit)
- ✅ Fêtes françaises
- ✅ Anniversaires célèbres
- ✅ Filtrage par type d'événement
- ✅ Intégration vers création de contenu

#### **Comment l'utiliser :**
```javascript
// Dans un composant React
import { useTodayEvents } from '@/hooks/useTodayEvents';

const MyComponent = () => {
  const { events, getHolidays, getBirthdays } = useTodayEvents();
  
  // Obtenir les fêtes
  const holidays = getHolidays();
  
  // Utiliser les données
  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <span>Type: {event.type}</span>
        </div>
      ))}
    </div>
  );
};
```

#### **URLs d'accès :**
- **Page web :** `http://localhost:8082/what-to-post`
- **API directe :** `eventsService.getTodayEvents()`

---

### **3. Créateurs de contenu (légal)**

#### **Fonctionnalités :**
- ✅ Affichage des profils publics
- ✅ Informations légales
- ✅ Redirection vers profils officiels
- ✅ Respect du RGPD

#### **Comment l'utiliser :**
```javascript
// Dans un composant React
import CreatorCard from '@/components/CreatorCard';

const MyComponent = () => {
  const creator = {
    id: '1',
    name: 'Nom du créateur',
    username: '@username',
    bio: 'Description du créateur',
    avatar: 'url_avatar',
    platform: 'instagram',
    followers: 100000,
    category: 'lifestyle',
    isPublic: true,
    profileUrl: 'https://instagram.com/username'
  };
  
  return (
    <CreatorCard 
      creator={creator}
      onFollow={(creatorId) => console.log('Suivre:', creatorId)}
    />
  );
};
```

---

## 🔧 **Configuration des APIs**

### **APIs Gratuites (déjà configurées) :**

#### **1. Reddit API**
```javascript
// URL: https://www.reddit.com/r/popular.json
// Limite: Aucune
// Statut: ✅ Fonctionnel
```

#### **2. Wikipedia API**
```javascript
// URL: https://fr.wikipedia.org/api/rest_v1/feed/onthisday/all/
// Limite: Aucune
// Statut: ✅ Fonctionnel
```

### **APIs Payantes (à configurer) :**

#### **1. Twitter API**
```javascript
// Coût: Gratuit avec limitations
// Configuration: Nécessite une clé API
// Statut: ⚠️ À configurer
```

#### **2. Instagram Basic Display**
```javascript
// Coût: Gratuit
// Configuration: Nécessite une demande d'accès
// Statut: ⚠️ À configurer
```

---

## 📊 **Exemples d'utilisation avancée**

### **1. Combiner plusieurs APIs**
```javascript
import { useSocialTrends } from '@/hooks/useSocialTrends';
import { useTodayEvents } from '@/hooks/useTodayEvents';

const Dashboard = () => {
  const { trends } = useSocialTrends();
  const { events } = useTodayEvents();
  
  // Combiner les données pour des suggestions
  const suggestions = [
    ...trends.slice(0, 5),
    ...events.slice(0, 3)
  ];
  
  return (
    <div>
      <h2>Suggestions du jour</h2>
      {suggestions.map(item => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};
```

### **2. Créer des filtres personnalisés**
```javascript
const CustomFilters = () => {
  const { trends, filterByCategory } = useSocialTrends();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredTrends = selectedCategory === 'all' 
    ? trends 
    : filterByCategory(selectedCategory);
  
  return (
    <div>
      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="all">Toutes les catégories</option>
        <option value="technology">Technologie</option>
        <option value="lifestyle">Lifestyle</option>
      </select>
      
      {filteredTrends.map(trend => (
        <div key={trend.id}>{trend.title}</div>
      ))}
    </div>
  );
};
```

---

## 🎯 **Intégration dans vos pages existantes**

### **1. Ajouter des tendances à la page d'accueil**
```javascript
// Dans src/pages/Index.tsx
import { useSocialTrends } from '@/hooks/useSocialTrends';

const Index = () => {
  const { getTopTrends } = useSocialTrends();
  const topTrends = getTopTrends(3);
  
  return (
    <div>
      {/* Contenu existant */}
      
      <section className="mt-8">
        <h2>Tendances du moment</h2>
        {topTrends.map(trend => (
          <div key={trend.id}>
            <h3>{trend.title}</h3>
            <p>{trend.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};
```

### **2. Ajouter des événements à la page de création**
```javascript
// Dans src/pages/Publish.tsx
import { useTodayEvents } from '@/hooks/useTodayEvents';

const Publish = () => {
  const { events } = useTodayEvents();
  
  return (
    <div>
      {/* Formulaire de création existant */}
      
      <aside className="mt-4">
        <h3>Événements du jour</h3>
        {events.slice(0, 3).map(event => (
          <button 
            key={event.id}
            onClick={() => setTitle(event.title)}
          >
            {event.title}
          </button>
        ))}
      </aside>
    </div>
  );
};
```

---

## ⚠️ **Points importants**

### **1. Légalité**
- ✅ **Profils publics** : Affichage autorisé
- ✅ **Informations publiques** : Utilisation autorisée
- ❌ **Contenu privé** : Nécessite autorisation
- ❌ **Données personnelles** : Interdit sans consentement

### **2. Performance**
- 🔄 **Cache** : Les données sont mises en cache
- ⚡ **Optimisation** : Chargement asynchrone
- 📱 **Mobile-first** : Interface responsive

### **3. Maintenance**
- 🔧 **APIs gratuites** : Pas de maintenance requise
- 💰 **APIs payantes** : Surveiller les quotas
- 📊 **Monitoring** : Vérifier les erreurs

---

## 🚀 **Prochaines étapes**

1. **Tester les APIs** : Visitez `/trending` et `/what-to-post`
2. **Intégrer dans vos pages** : Ajoutez les hooks aux pages existantes
3. **Configurer les APIs payantes** : Si nécessaire
4. **Personnaliser les filtres** : Adaptez à vos besoins

**Vos APIs sont maintenant prêtes à être utilisées ! 🎉** 