#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const subcategories = [
    // Sous-catégories thématiques
    { name: 'Animaux de compagnie', description: 'Contenu sur les animaux de compagnie' },
    { name: 'Animaux sauvages', description: 'Contenu sur les animaux sauvages' },
    { name: 'Animaux marins', description: 'Contenu sur les animaux marins' },
    { name: 'Animaux de ferme', description: 'Contenu sur les animaux de ferme' },
    { name: 'Fun facts', description: 'Faits intéressants sur les animaux' },
    { name: 'Vie animale', description: 'Explorer la vie d\'un animal' },
    { name: 'Habitat', description: 'Habitats et environnements des animaux' },
    { name: 'Alimentation', description: 'Alimentation et nutrition animale' },
    { name: 'Reproduction', description: 'Reproduction et cycle de vie' },
    { name: 'Communication', description: 'Communication animale' },
    { name: 'Intelligence', description: 'Intelligence et capacités animales' },
    { name: 'Évolution', description: 'Évolution et adaptation des animaux' },
    { name: 'Espèces', description: 'Découvrir différentes espèces' },
    { name: 'Records', description: 'Records et statistiques animales' },
    { name: 'Mythologie', description: 'Animaux dans la mythologie' },
    { name: 'Culture', description: 'Animaux dans la culture' },
    { name: 'Conservation', description: 'Protection et conservation' },
    { name: 'Élevage', description: 'Élevage responsable' },
    { name: 'Adoption', description: 'Adoption et sauvetage' },
    { name: 'Santé', description: 'Santé et vétérinaire' },
    { name: 'Dressage', description: 'Techniques de dressage' },
    { name: 'Voyage', description: 'Voyager avec son animal' },
    { name: 'Accessoires', description: 'Accessoires et équipements pour animaux' },
    { name: 'Jeux', description: 'Jeux et activités pour animaux' },
    { name: 'Thérapie', description: 'Animaux de thérapie' },
    { name: 'Travail', description: 'Animaux de travail' },
    { name: 'Refuge', description: 'Refuges et associations' },
    { name: 'Sauvetage', description: 'Sauvetage d\'animaux' },
    { name: 'Protection', description: 'Protection et bien-être animal' },
    
    // Noms d'animaux de compagnie
    { name: 'Chien', description: 'Contenu sur les chiens' },
    { name: 'Chat', description: 'Contenu sur les chats' },
    { name: 'Hamster', description: 'Contenu sur les hamsters' },
    { name: 'Lapin', description: 'Contenu sur les lapins' },
    { name: 'Cochon d\'Inde', description: 'Contenu sur les cochons d\'Inde' },
    { name: 'Souris', description: 'Contenu sur les souris' },
    { name: 'Rat', description: 'Contenu sur les rats' },
    { name: 'Furet', description: 'Contenu sur les furets' },
    { name: 'Oiseau', description: 'Contenu sur les oiseaux' },
    { name: 'Perroquet', description: 'Contenu sur les perroquets' },
    { name: 'Canari', description: 'Contenu sur les canaris' },
    { name: 'Poisson rouge', description: 'Contenu sur les poissons rouges' },
    { name: 'Poisson tropical', description: 'Contenu sur les poissons tropicaux' },
    { name: 'Tortue', description: 'Contenu sur les tortues' },
    { name: 'Lézard', description: 'Contenu sur les lézards' },
    { name: 'Serpent', description: 'Contenu sur les serpents' },
    { name: 'Araignée', description: 'Contenu sur les araignées' },
    { name: 'Chinchilla', description: 'Contenu sur les chinchillas' },
    { name: 'Gerbille', description: 'Contenu sur les gerbilles' },
    { name: 'Octodon', description: 'Contenu sur les octodons' },
    { name: 'Hérisson', description: 'Contenu sur les hérissons' },
    { name: 'Iguane', description: 'Contenu sur les iguanes' },
    { name: 'Gecko', description: 'Contenu sur les geckos' },
    { name: 'Caméléon', description: 'Contenu sur les caméléons' },
    { name: 'Poule', description: 'Contenu sur les poules' },
    { name: 'Canard', description: 'Contenu sur les canards' },
    { name: 'Chèvre', description: 'Contenu sur les chèvres' },
    { name: 'Cochon', description: 'Contenu sur les cochons' },
    { name: 'Cheval', description: 'Contenu sur les chevaux' },
    { name: 'Poney', description: 'Contenu sur les poneys' },
    { name: 'Âne', description: 'Contenu sur les ânes' },
    { name: 'Alpaga', description: 'Contenu sur les alpagas' },
    { name: 'Lama', description: 'Contenu sur les lamas' }
];

async function main() {
    try {
        console.log('🚀 Insertion automatique des sous-catégories Animaux\n');
        
        // 1. Vérifier/Créer la catégorie
        console.log('📋 Vérification de la catégorie Animaux...');
        let { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .eq('name', 'Animaux')
            .single();
        
        if (catError && catError.code === 'PGRST116') {
            console.log('➕ Création de la catégorie Animaux...');
            const { data: theme } = await supabase
                .from('themes')
                .select('id')
                .in('name', ['Lifestyle', 'Divertissement', 'Tout'])
                .limit(1)
                .single();
            
            const { data: newCat, error: createError } = await supabase
                .from('categories')
                .insert({
                    name: 'Animaux',
                    color: 'green',
                    description: 'Contenus sur les animaux',
                    theme_id: theme?.id || null
                })
                .select()
                .single();
            
            if (createError) throw createError;
            category = newCat;
        }
        
        const categoryId = category.id;
        console.log(`✅ Catégorie ID: ${categoryId}\n`);
        
        // 2. Vérifier les existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const { data: existing } = await supabase
            .from('subcategories')
            .select('name')
            .eq('category_id', categoryId);
        
        const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);
        console.log(`📊 ${existingNames.size} sous-catégorie(s) existante(s)\n`);
        
        const toAdd = subcategories.filter(s => !existingNames.has(s.name.toLowerCase()));
        
        if (toAdd.length === 0) {
            console.log('✅ Toutes les sous-catégories existent déjà !');
            return;
        }
        
        console.log(`➕ ${toAdd.length} nouvelle(s) sous-catégorie(s) à ajouter\n`);
        
        // 3. Insertion directe avec la clé service_role (contourne RLS)
        console.log('💾 Insertion directe des sous-catégories...');
        const now = new Date().toISOString();
        let success = 0;
        let failed = 0;
        
        for (const sub of toAdd) {
            const { error } = await supabase
                .from('subcategories')
                .insert({
                    name: sub.name,
                    description: sub.description,
                    category_id: categoryId,
                    created_at: now,
                    updated_at: now
                });
            
            if (error) {
                // Si c'est une erreur de doublon, c'est OK
                if (error.message.includes('duplicate') || error.code === '23505') {
                    success++;
                } else {
                    console.log(`⚠️  "${sub.name}": ${error.message}`);
                    failed++;
                }
            } else {
                success++;
            }
        }
        
        console.log(`\n✅ ${success} ajoutée(s), ⚠️  ${failed} échouée(s)`);
        
        // 4. Vérification finale
        const { data: all } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', categoryId)
            .order('name');
        
        console.log(`\n📊 Total final: ${all?.length || 0} sous-catégorie(s) Animaux`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

