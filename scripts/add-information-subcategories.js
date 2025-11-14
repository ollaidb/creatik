#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Liste des sous-catégories pour "Information"
const subcategories = [
    'FAQ',
    'Vidéo',
    'Tutoriel',
    'Guide',
    'Documentation',
    'Manuel',
    'Notice',
    'Instructions',
    'Procédure',
    'Aide',
    'Support',
    'Article',
    'Blog',
    'Actualité',
    'Newsletter',
    'Communiqué',
    'Annonce',
    'Alerte',
    'Avertissement',
    'Rappel',
    'Déclaration',
    'Conférence',
    'Webinaire',
    'Séminaire',
    'Colloque',
    'Formation',
    'Atelier',
    'Workshop',
    'Podcast',
    'Audio',
    'Infographie',
    'Graphique',
    'Schéma',
    'Tableau',
    'Liste',
    'Checklist',
    'Rapport',
    'Étude',
    'Analyse',
    'Statistiques',
    'Données',
    'Recherche',
    'Expertise',
    'Conseil',
    'Recommandation',
    'Avis',
    'Test',
    'Comparaison',
    'Revue',
    'Critique',
    'Témoignage',
    'Cas d\'usage',
    'Exemple',
    'Démonstration',
    'Présentation',
    'Explication',
    'Définition',
    'Glossaire',
    'Lexique',
    'Dictionnaire',
    'Encyclopédie',
    'Référence',
    'Ressource',
    'Lien',
    'Source',
    'Citation',
    'Référencement',
    'Index',
    'Sommaire',
    'Table des matières'
];

async function main() {
    try {
        console.log('📝 Ajout des sous-catégories pour "Information"\n');
        
        // Récupérer la catégorie "Information"
        const { data: category, error: categoryError } = await supabase
            .from('categories')
            .select('id, name')
            .ilike('name', '%information%')
            .single();
        
        if (categoryError || !category) {
            console.error('❌ Erreur: Catégorie "Information" introuvable');
            console.error(categoryError);
            process.exit(1);
        }
        
        console.log(`✅ Catégorie trouvée: ${category.name} (ID: ${category.id})\n`);
        
        // Vérifier les sous-catégories existantes
        const { data: existingSubcategories } = await supabase
            .from('subcategories')
            .select('name')
            .eq('category_id', category.id);
        
        const existingNames = new Set(existingSubcategories?.map(s => s.name.toLowerCase()) || []);
        
        // Filtrer les sous-catégories à ajouter (éviter les doublons)
        const toAdd = subcategories.filter(name => 
            !existingNames.has(name.toLowerCase())
        );
        
        if (toAdd.length === 0) {
            console.log('ℹ️  Toutes les sous-catégories existent déjà.\n');
            return;
        }
        
        console.log(`📊 Sous-catégories à ajouter: ${toAdd.length}\n`);
        
        // Préparer les données pour l'insertion
        const subcategoriesToInsert = toAdd.map(name => ({
            category_id: category.id,
            name: name,
            description: null
        }));
        
        // Insérer les sous-catégories
        const { data: inserted, error: insertError } = await supabase
            .from('subcategories')
            .insert(subcategoriesToInsert)
            .select('id, name');
        
        if (insertError) {
            console.error('❌ Erreur lors de l\'insertion:', insertError);
            process.exit(1);
        }
        
        console.log(`✅ ${inserted.length} sous-catégorie(s) ajoutée(s) avec succès:\n`);
        
        inserted.forEach((sub, index) => {
            console.log(`   ${index + 1}. ${sub.name}`);
        });
        
        // Vérification finale
        const { data: finalSubcategories, count } = await supabase
            .from('subcategories')
            .select('id', { count: 'exact' })
            .eq('category_id', category.id);
        
        console.log(`\n📊 Total de sous-catégories pour "Information": ${count}\n`);
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

