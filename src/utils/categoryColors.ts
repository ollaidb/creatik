// Utilitaire pour gérer les couleurs des catégories

// Fonction pour obtenir un index de couleur basé sur l'ID de manière cyclique
const getColorIndex = (categoryId: string): number => {
  // Extraire un nombre de l'ID pour une distribution cyclique
  let numericValue = 0;
  
  // Convertir l'ID en valeur numérique
  for (let i = 0; i < categoryId.length; i++) {
    const char = categoryId.charCodeAt(i);
    numericValue += char;
  }
  
  // Utiliser modulo pour une distribution cyclique
  return numericValue % 5; // Retourne un index entre 0 et 4
};

// Fonction pour obtenir un index de couleur basé sur la position dans la liste
export const getCategoryColorByIndex = (index: number): number => {
  // Distribution cyclique basée sur l'index
  return index % 5;
};

export const getCategoryColorClass = (categoryId: string): string => {
  const colorIndex = getColorIndex(categoryId);
  const colors = [
    'bg-creatik-category-1',
    'bg-creatik-category-2', 
    'bg-creatik-category-3',
    'bg-creatik-category-4',
    'bg-creatik-category-5'
  ];
  return colors[colorIndex];
};

// Nouvelle fonction pour obtenir la classe de couleur par index
export const getCategoryColorClassByIndex = (index: number): string => {
  const colorIndex = getCategoryColorByIndex(index);
  const colors = [
    'bg-creatik-category-1',
    'bg-creatik-category-2', 
    'bg-creatik-category-3',
    'bg-creatik-category-4',
    'bg-creatik-category-5'
  ];
  return colors[colorIndex];
};

export const getCategoryTextColorClass = (): string => {
  // Les textes des catégories sont TOUJOURS blancs
  return 'text-creatik-category-text';
};

// Fonction pour obtenir la couleur hexadécimale basée sur l'index et le mode
export const getCategoryHexColor = (categoryId: string, isDarkMode: boolean = false): string => {
  const colorIndex = getColorIndex(categoryId);
  
  if (isDarkMode) {
    const darkColors = [
      '#010f29', // Bleu foncé
      '#27020e', // Rouge foncé
      '#210227', // Violet foncé
      '#021b27', // Bleu-vert foncé
      '#221400'  // Marron foncé
    ];
    return darkColors[colorIndex];
  } else {
    const lightColors = [
      '#dc2329', // Rouge
      '#0007ad', // Bleu
      '#ff55f3', // Rose
      '#ffb001', // Orange
      '#00a86b'  // Vert
    ];
    return lightColors[colorIndex];
  }
};

// Nouvelle fonction pour obtenir la couleur hexadécimale par index
export const getCategoryHexColorByIndex = (index: number, isDarkMode: boolean = false): string => {
  const colorIndex = getCategoryColorByIndex(index);
  
  if (isDarkMode) {
    const darkColors = [
      '#010f29', // Bleu foncé
      '#27020e', // Rouge foncé
      '#210227', // Violet foncé
      '#021b27', // Bleu-vert foncé
      '#221400'  // Marron foncé
    ];
    return darkColors[colorIndex];
  } else {
    const lightColors = [
      '#dc2329', // Rouge
      '#0007ad', // Bleu
      '#ff55f3', // Rose
      '#ffb001', // Orange
      '#00a86b'  // Vert
    ];
    return lightColors[colorIndex];
  }
};

// Fonction pour obtenir le nom de la couleur
export const getCategoryColorName = (categoryId: string): string => {
  const colorIndex = getColorIndex(categoryId);
  const colorNames = [
    'Rouge',
    'Bleu',
    'Rose',
    'Orange',
    'Vert'
  ];
  return colorNames[colorIndex];
};

// Nouvelle fonction pour obtenir le nom de la couleur par index
export const getCategoryColorNameByIndex = (index: number): string => {
  const colorIndex = getCategoryColorByIndex(index);
  const colorNames = [
    'Rouge',
    'Bleu',
    'Rose',
    'Orange',
    'Vert'
  ];
  return colorNames[colorIndex];
};

// Fonction pour obtenir la classe de couleur avec opacité
export const getCategoryColorWithOpacity = (categoryId: string, opacity: number = 0.9): string => {
  const colorIndex = getColorIndex(categoryId);
  const colors = [
    'bg-creatik-category-1',
    'bg-creatik-category-2', 
    'bg-creatik-category-3',
    'bg-creatik-category-4',
    'bg-creatik-category-5'
  ];
  const baseColor = colors[colorIndex];
  return `${baseColor} opacity-${Math.round(opacity * 100)}`;
}; 