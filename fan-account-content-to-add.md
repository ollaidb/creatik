# Contenu à ajouter pour "Fan account"

## ✅ ÉTAPE 1 : Activer le niveau 2

```sql
INSERT INTO public.category_hierarchy_config (category_id, has_level2, created_at, updated_at) 
SELECT 
    id,
    true,
    now(),
    now()
FROM public.categories 
WHERE LOWER(name) LIKE '%fan account%'
ON CONFLICT (category_id) DO UPDATE SET 
    has_level2 = true,
    updated_at = now();
```

---

## 📋 ÉTAPE 2 : Ajouter les sous-catégories NIVEAU 1

### Liste des 10 sous-catégories niveau 1 :

1. **Célébrités** - Comptes de fans de célébrités
2. **Divertissement** - Comptes de fans de contenus de divertissement
3. **Musique** - Comptes de fans d'artistes musicaux
4. **Cinéma** - Comptes de fans de films et acteurs
5. **Séries TV** - Comptes de fans de séries télévisées
6. **Sports** - Comptes de fans de sportifs et équipes
7. **Gaming** - Comptes de fans de jeux vidéo et streamers
8. **Influenceurs** - Comptes de fans d'influenceurs
9. **Livres** - Comptes de fans d'auteurs et livres
10. **Manga/Anime** - Comptes de fans de mangas et animés

---

## 📂 ÉTAPE 3 : Ajouter les sous-catégories NIVEAU 2

### Sous "Célébrités" (15 items) :
1. Beyoncé
2. Taylor Swift
3. Ariana Grande
4. Justin Bieber
5. Selena Gomez
6. Drake
7. The Weeknd
8. Billie Eilish
9. Dua Lipa
10. Ed Sheeran
11. Rihanna
12. Bruno Mars
13. Adele
14. Harry Styles
15. Shawn Mendes

### Sous "Divertissement" (10 items) :
1. Netflix
2. Disney+
3. Amazon Prime
4. HBO
5. Disney
6. Marvel
7. DC Comics
8. Star Wars
9. Harry Potter
10. Game of Thrones

### Sous "Musique" (12 items) :
1. Pop
2. Rock
3. Rap
4. Hip-Hop
5. R&B
6. Jazz
7. Classique
8. Électronique
9. Country
10. Reggae
11. Metal
12. Punk

### Sous "Cinéma" (10 items) :
1. Marvel Cinematic Universe
2. DC Extended Universe
3. Star Wars
4. Harry Potter
5. James Bond
6. Fast & Furious
7. Mission Impossible
8. Pirates des Caraïbes
9. Transformers
10. Jurassic Park

### Sous "Séries TV" (11 items) :
1. Game of Thrones
2. Breaking Bad
3. Stranger Things
4. The Crown
5. The Office
6. Friends
7. The Walking Dead
8. Grey's Anatomy
9. House of Cards
10. The Witcher
11. Squid Game

### Sous "Sports" (10 items) :
1. Football
2. Basketball
3. Tennis
4. Football américain
5. Baseball
6. Hockey
7. Golf
8. Formule 1
9. UFC
10. Boxe

### Sous "Gaming" (13 items) :
1. Fortnite
2. Minecraft
3. Call of Duty
4. FIFA
5. GTA
6. Among Us
7. Valorant
8. League of Legends
9. Apex Legends
10. Pokémon
11. Zelda
12. Mario
13. Sonic

### Sous "Influenceurs" (10 items) :
1. Beauté
2. Mode
3. Lifestyle
4. Tech
5. Gaming
6. Food
7. Travel
8. Fitness
9. Comedy
10. Education

### Sous "Livres" (10 items) :
1. Fantasy
2. Science-Fiction
3. Romance
4. Thriller
5. Mystère
6. Horreur
7. Biographie
8. Histoire
9. Philosophie
10. Poésie

### Sous "Manga/Anime" (10 items) :
1. Naruto
2. One Piece
3. Dragon Ball
4. Attack on Titan
5. Demon Slayer
6. My Hero Academia
7. Death Note
8. Fullmetal Alchemist
9. Tokyo Ghoul
10. Jujutsu Kaisen

---

## 📊 RÉSUMÉ TOTAL

- **Niveau 1** : 10 sous-catégories
- **Niveau 2** : 111 sous-catégories au total
  - Célébrités : 15
  - Divertissement : 10
  - Musique : 12
  - Cinéma : 10
  - Séries TV : 11
  - Sports : 10
  - Gaming : 13
  - Influenceurs : 10
  - Livres : 10
  - Manga/Anime : 10

---

## 🚀 Pour exécuter

Le script SQL complet est dans le fichier : `setup-fan-account-complete.sql`

Vous pouvez l'exécuter directement dans l'éditeur SQL de Supabase.

