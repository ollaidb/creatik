import React from 'react';
import { getCategoryHexColorByIndex, getCategoryColorNameByIndex } from '@/utils/categoryColors';

const ColorTest: React.FC = () => {
  const testCategories = [
    { id: 'category-1', name: 'Catégorie 1' },
    { id: 'category-2', name: 'Catégorie 2' },
    { id: 'category-3', name: 'Catégorie 3' },
    { id: 'category-4', name: 'Catégorie 4' },
    { id: 'category-5', name: 'Catégorie 5' },
    { id: 'category-6', name: 'Catégorie 6' },
    { id: 'category-7', name: 'Catégorie 7' },
    { id: 'category-8', name: 'Catégorie 8' },
    { id: 'category-9', name: 'Catégorie 9' },
    { id: 'category-10', name: 'Catégorie 10' },
  ];

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Test de Distribution Cyclique des Couleurs</h2>
      <p className="text-sm text-gray-600">Les couleurs se distribuent de manière cyclique pour éviter les répétitions adjacentes</p>
      
      {/* Démonstration visuelle en grille */}
      <div className="space-y-4">
        <h3 className="font-semibold">Démonstration Visuelle - Mode Clair</h3>
        <div className="grid grid-cols-5 gap-2">
          {testCategories.slice(0, 10).map((category, index) => (
            <div
              key={category.id}
              className="p-3 rounded-lg text-white font-medium text-center text-xs"
              style={{
                backgroundColor: getCategoryHexColorByIndex(index, false)
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mode Clair */}
        <div className="space-y-2">
          <h3 className="font-semibold">Mode Clair - Distribution Cyclique</h3>
          {testCategories.map((category, index) => (
            <div
              key={category.id}
              className="p-4 rounded-lg text-white font-medium"
              style={{
                backgroundColor: getCategoryHexColorByIndex(index, false)
              }}
            >
              {category.name} (Index: {index}) - {getCategoryColorNameByIndex(index)} ({getCategoryHexColorByIndex(index, false)})
            </div>
          ))}
        </div>

        {/* Mode Sombre */}
        <div className="space-y-2">
          <h3 className="font-semibold">Mode Sombre - Distribution Cyclique</h3>
          {testCategories.map((category, index) => (
            <div
              key={category.id}
              className="p-4 rounded-lg text-white font-medium"
              style={{
                backgroundColor: getCategoryHexColorByIndex(index, true)
              }}
            >
              {category.name} (Index: {index}) - {getCategoryColorNameByIndex(index)} ({getCategoryHexColorByIndex(index, true)})
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-2">Distribution Cyclique :</h3>
        <div className="bg-gray-100 p-4 rounded text-sm space-y-1">
          <div><strong>Index 0:</strong> Rouge (#dc2329)</div>
          <div><strong>Index 1:</strong> Bleu (#0007ad)</div>
          <div><strong>Index 2:</strong> Rose (#ff55f3)</div>
          <div><strong>Index 3:</strong> Orange (#ffb001)</div>
          <div><strong>Index 4:</strong> Vert (#00a86b)</div>
          <div><strong>Index 5:</strong> Rouge (#dc2329) - Cycle recommence</div>
          <div><strong>Index 6:</strong> Bleu (#0007ad) - Cycle recommence</div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Avantages de cette distribution :</h3>
        <div className="bg-green-50 p-4 rounded text-sm space-y-1">
          <div>✅ Pas de répétition de couleurs adjacentes</div>
          <div>✅ Distribution équilibrée et prévisible</div>
          <div>✅ Cycle de 5 couleurs qui se répète</div>
          <div>✅ Chaque bloc a une couleur différente de ses voisins</div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Pattern de couleurs :</h3>
        <div className="bg-blue-50 p-4 rounded text-sm">
          <div className="font-mono text-xs">
            <div>1-2-3-4-5 | 1-2-3-4-5 | 1-2-3-4-5...</div>
            <div>R-B-P-O-V | R-B-P-O-V | R-B-P-O-V...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorTest; 