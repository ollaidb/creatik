import { Category, ContentIdea, Challenge } from "../types";

export const categories: Category[] = [
  { id: "education", name: "Éducation", color: "primary" },
  { id: "information", name: "Information", color: "orange" },
  { id: "inspiration", name: "Inspiration / Motivation", color: "green" },
  { id: "opinion", name: "Opinion / Prise de position", color: "pink" },
  { id: "divertissement", name: "Divertissement / Fun", color: "primary" },
  { id: "lifestyle", name: "Lifestyle / Vie personnelle", color: "orange" },
  { id: "vlog", name: "Vlog", color: "green" },
  { id: "grwm", name: "GRWM", color: "pink" },
  { id: "playback", name: "Play-back", color: "primary" },
  { id: "storytelling", name: "Storytelling", color: "orange" },
  { id: "lire", name: "Lire", color: "green" },
  { id: "art", name: "Art", color: "pink" },
  { id: "dilemme", name: "Dilemme", color: "primary" },
  { id: "defis", name: "Défis / Challenge", color: "orange" },
  { id: "meme", name: "Page Meme", color: "green" },
  { id: "classement", name: "Classement", color: "pink" },
  { id: "danse", name: "Danse", color: "primary" },
  { id: "fan", name: "Page Fan", color: "orange" },
  { id: "cuisine", name: "Cuisine", color: "green" },
  { id: "ugc", name: "UGC (User Generated Content)", color: "pink" },
  { id: "dates", name: "Annoncer des dates", color: "primary" },
  { id: "tendance", name: "Tendance / Réactivité", color: "orange" },
  { id: "promotion", name: "Promotion / Vente", color: "green" },
  { id: "engagement", name: "Engagement / Communauté", color: "pink" },
  { id: "bts", name: "BTS (Behind The Scenes) / Coulisses", color: "primary" },
  { id: "autorite", name: "Autorité / Expertise", color: "orange" },
  { id: "podcast", name: "Podcast", color: "green" },
  { id: "sans-visage", name: "Sans visage", color: "pink" },
  { id: "evenement", name: "Événement", color: "primary" },
  { id: "activiste", name: "Activiste", color: "orange" },
  { id: "sport", name: "Sport", color: "green" },
  { id: "video-game", name: "Video Game", color: "pink" },
  { id: "caption", name: "Caption", color: "primary" },
  { id: "photo", name: "Photo", color: "orange" },
  { id: "tuto", name: "Tuto", color: "green" },
  { id: "prank", name: "Prank", color: "pink" },
  { id: "recyclage", name: "Recyclage (débat/situation)", color: "primary" },
  { id: "pov", name: "POV", color: "orange" },
  { id: "reposte", name: "Reposte", color: "green" },
  { id: "nostalgie", name: "Nostalgie", color: "pink" },
  { id: "reaction", name: "Reaction", color: "primary" },
  { id: "mode", name: "Mode / Fashion", color: "orange" },
  { id: "micro-trottoir", name: "Micro-trottoir", color: "green" },
  { id: "review", name: "Review / Unboxing", color: "pink" },
  { id: "dev-personnel", name: "Développement personnel", color: "primary" },
  { id: "satisfaisante", name: "Satisfaisante", color: "orange" },
  { id: "asmr", name: "ASMR", color: "green" },
  { id: "animaux", name: "Animaux", color: "pink" },
  { id: "tech", name: "Technologie", color: "primary" },
  { id: "complotiste", name: "Complotiste", color: "orange" },
  { id: "fail-story", name: "Fail Story", color: "green" },
  { id: "mythes", name: "Mythes / Réalités", color: "pink" },
  { id: "avant-apres", name: "Avant / Après", color: "primary" },
  { id: "astuces", name: "Astuces vie quotidienne", color: "orange" },
  { id: "experiences", name: "Expériences sociales", color: "green" },
  { id: "manifestation", name: "Manifestation", color: "pink" },
  { id: "religion", name: "Religion", color: "primary" },
  { id: "hypotheses", name: "Hypothèses", color: "orange" },
  { id: "recommandation", name: "Recommandation", color: "green" },
  { id: "rage-bait", name: "Rage bait", color: "pink" },
];

export const contentIdeas: ContentIdea[] = [
  {
    id: "1",
    title: "Expliquer un concept complexe en 30 secondes",
    description: "Choisir un concept difficile et le simplifier au maximum pour un format ultra court.",
    platform: "tiktok",
    type: "educational",
    category: "education",
    popularity: 95
  },
  {
    id: "2",
    title: "Défier les préjugés dans votre domaine",
    description: "Identifiez une idée reçue commune et montrez pourquoi elle est fausse.",
    platform: "instagram",
    type: "trending",
    category: "influence",
    popularity: 87
  },
  {
    id: "3",
    title: "Analyse express d'une œuvre culturelle",
    description: "Donnez votre avis critique sur un livre, un film ou une série en format court.",
    platform: "youtube",
    type: "storytelling",
    category: "culture",
    popularity: 78
  },
  {
    id: "4",
    title: "Routine matinale d'un entrepreneur",
    description: "Montrez les étapes clés de votre routine matinale pour maximiser la productivité.",
    platform: "all",
    type: "trending",
    category: "business",
    popularity: 92
  },
  {
    id: "5",
    title: "Avant/Après transformation",
    description: "Montrez une transformation impressionnante dans votre domaine d'expertise.",
    platform: "instagram",
    type: "trending",
    category: "lifestyle",
    popularity: 96
  },
  {
    id: "6",
    title: "Tuto rapide d'une nouvelle app ou gadget",
    description: "Présentez une fonction méconnue d'une application ou d'un gadget populaire.",
    platform: "tiktok",
    type: "educational",
    category: "tech",
    popularity: 83
  },
  {
    id: "7",
    title: "Un jour dans la vie à...",
    description: "Documentez une journée dans un lieu inhabituel ou intéressant.",
    platform: "youtube",
    type: "storytelling",
    category: "travel",
    popularity: 89
  },
  {
    id: "8",
    title: "Challenge fitness en 7 jours",
    description: "Montrez les progrès et résultats d'un défi fitness court mais intense.",
    platform: "all",
    type: "trending",
    category: "fitness",
    popularity: 91
  },
];

export const challenges: Challenge[] = [
  {
    id: "1",
    title: "Le défi vulgarisation",
    description: "Expliquez un concept complexe de votre domaine en moins de 60 secondes sans jargon technique.",
    difficulty: "medium",
    category: "education"
  },
  {
    id: "2",
    title: "Storytime captivant",
    description: "Racontez une anecdote personnelle marquante en utilisant au moins 3 transitions créatives.",
    difficulty: "easy",
    category: "storytelling"
  },
  {
    id: "3",
    title: "Challenge des 5 tendances",
    description: "Intégrez 5 tendances actuelles dans une seule vidéo cohérente de moins de 2 minutes.",
    difficulty: "hard",
    category: "trending"
  }
];

// Fonction pour simuler des recommandations personnalisées basées sur les catégories visitées
export const getPersonalizedRecommendations = (visitedCategories: string[]): ContentIdea[] => {
  if (visitedCategories.length === 0) {
    // Si aucune catégorie visitée, retourner quelques idées populaires
    return contentIdeas.filter(idea => idea.popularity > 85).slice(0, 4);
  }

  // Sinon, filtrer les idées basées sur les catégories visitées
  return contentIdeas
    .filter(idea => visitedCategories.includes(idea.category))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);
};
