# Guide de la Fonctionnalité de Filtrage

## 🎯 **Objectif**
Permettre aux utilisateurs de filtrer les publications, défis et playlists selon le réseau social et la playlist sélectionnés.

## 🔧 **Fonctionnalités Implémentées**

### **1. Hook de Filtrage (`useProfileFiltering`)**
- **Fichier** : `src/hooks/useProfileFiltering.ts`
- **Fonction** : Gère la logique de filtrage centralisée
- **États** : Sélection de réseau social, playlist, données filtrées

### **2. Filtrage Automatique**
- **Publications** : Filtrées par réseau social + playlist sélectionnés
- **Playlists** : Filtrées par réseau social sélectionné
- **Défis** : Filtrés par réseau social + playlist sélectionnés
- **Paramètres** : Chargés automatiquement pour le réseau sélectionné

### **3. Interface Utilisateur**
- **Sélection de réseau** : Boutons cliquables dans "Mes Réseaux Sociaux"
- **Sélection de playlist** : Boutons cliquables dans "Playlists"
- **Affichage dynamique** : Le contenu change automatiquement selon la sélection

## 🔄 **Comment ça fonctionne**

### **Étape 1 : Sélection du Réseau Social**
```typescript
// Quand l'utilisateur clique sur un réseau social
selectSocialNetwork(accountId)

// Résultat :
// - Les playlists se filtrent automatiquement
// - Les publications se filtrent automatiquement
// - Les défis se filtrent automatiquement
// - Les paramètres de programmation se chargent
```

### **Étape 2 : Sélection de la Playlist**
```typescript
// Quand l'utilisateur clique sur une playlist
selectPlaylist(playlistId)

// Résultat :
// - Les publications se filtrent pour cette playlist
// - Les défis se filtrent pour cette playlist
// - L'option "Tout" est disponible (playlistId = '')
```

### **Étape 3 : Affichage Dynamique**
```typescript
// Les données sont automatiquement filtrées
const filteredPosts = useMemo(() => {
  // Filtre par réseau social
  let posts = socialPosts.filter(post => 
    post.social_account_id === selectedSocialNetworkId
  );
  
  // Filtre par playlist si sélectionnée
  if (selectedPlaylistId) {
    posts = posts.filter(post => 
      post.playlist_id === selectedPlaylistId
    );
  }
  
  return posts;
}, [socialPosts, selectedSocialNetworkId, selectedPlaylistId]);
```

## 📊 **Données Filtrées**

### **Publications (`filteredPosts`)**
- **Sans sélection** : Toutes les publications
- **Avec réseau** : Publications du réseau sélectionné
- **Avec playlist** : Publications de la playlist sélectionnée

### **Playlists (`filteredPlaylists`)**
- **Sans sélection** : Toutes les playlists
- **Avec réseau** : Playlists du réseau sélectionné

### **Défis (`filteredChallenges`)**
- **Sans sélection** : Tous les défis
- **Avec réseau** : Défis du réseau sélectionné
- **Avec playlist** : Défis de la playlist sélectionnée

## 🎨 **Interface Utilisateur**

### **Section "Mes Réseaux Sociaux"**
```jsx
{socialAccounts.map((account) => {
  const isSelected = selectedSocialNetworkId === account.id;
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      onClick={() => selectSocialNetwork(account.id)}
    >
      {account.display_name || account.platform}
    </Button>
  );
})}
```

### **Section "Playlists"**
```jsx
{filteredPlaylists.map((playlist) => {
  const isSelected = selectedPlaylistId === playlist.id;
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      onClick={() => selectPlaylist(playlist.id)}
    >
      {playlist.name}
    </Button>
  );
})}
```

### **Section "Publications"**
```jsx
{filteredPosts.map((post) => (
  <div key={post.id}>
    <h3>{post.title}</h3>
    <p>{post.created_at}</p>
  </div>
))}
```

## 🔧 **Fonctions Utilitaires**

### **1. `selectSocialNetwork(networkId)`**
- Sélectionne un réseau social
- Reset la sélection de playlist
- Déclenche le filtrage automatique

### **2. `selectPlaylist(playlistId)`**
- Sélectionne une playlist
- Déclenche le filtrage des publications et défis

### **3. `resetFilters()`**
- Remet à zéro toutes les sélections
- Sélectionne le premier réseau social

### **4. `getFilteredStats()`**
- Retourne les statistiques filtrées
- Compteurs de publications, défis, playlists

## 📱 **Expérience Utilisateur**

### **Workflow Typique**
1. **L'utilisateur arrive** sur la page de profil
2. **Le premier réseau social** est automatiquement sélectionné
3. **Les playlists** de ce réseau s'affichent
4. **Les publications** de ce réseau s'affichent
5. **L'utilisateur clique** sur une playlist
6. **Les publications** se filtrent pour cette playlist
7. **Les défis** se filtrent aussi pour cette playlist

### **États Visuels**
- **Réseau sélectionné** : Bouton bleu (variant="default")
- **Réseau non sélectionné** : Bouton blanc (variant="outline")
- **Playlist sélectionnée** : Bouton bleu avec couleur de la playlist
- **Playlist non sélectionnée** : Bouton blanc avec bordure colorée

## ⚡ **Performance**

### **Optimisations**
- **useMemo** : Les données filtrées sont mises en cache
- **useEffect** : Les paramètres se chargent seulement quand nécessaire
- **Filtrage côté client** : Pas de requêtes supplémentaires

### **Chargement**
- **Initial** : Chargement de toutes les données
- **Filtrage** : Instantané (données en mémoire)
- **Paramètres** : Chargement asynchrone des paramètres de programmation

## 🐛 **Débogage**

### **Vérifier la Sélection**
```typescript
console.log('Réseau sélectionné:', selectedSocialNetworkId);
console.log('Playlist sélectionnée:', selectedPlaylistId);
console.log('Publications filtrées:', filteredPosts.length);
console.log('Playlists filtrées:', filteredPlaylists.length);
```

### **Vérifier les Données**
```typescript
console.log('Toutes les publications:', socialPosts);
console.log('Toutes les playlists:', playlists);
console.log('Tous les défis:', userChallenges);
```

## 🚀 **Prochaines Étapes**

### **Améliorations Possibles**
1. **Sauvegarde de la sélection** : Persister la sélection dans localStorage
2. **Filtres avancés** : Par date, statut, etc.
3. **Recherche** : Recherche dans les publications filtrées
4. **Tri** : Tri par date, titre, etc.

### **Fonctionnalités Futures**
1. **Synchronisation** : Synchronisation avec les réseaux sociaux
2. **Analytics** : Statistiques détaillées par réseau/playlist
3. **Export** : Export des données filtrées

## 📞 **Support**

Si vous rencontrez des problèmes :
1. Vérifiez que les données sont bien chargées
2. Vérifiez que la sélection fonctionne
3. Vérifiez que le filtrage s'applique correctement
4. Consultez les logs de la console pour les erreurs
