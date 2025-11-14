#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const subcategories = [
    { name: 'Vie quotidienne', description: 'Conseils pour la vie quotidienne' },
    { name: 'Santé', description: 'Conseils santé' },
    { name: 'Bien-être', description: 'Conseils bien-être' },
    { name: 'Nutrition', description: 'Conseils nutrition' },
    { name: 'Sport', description: 'Conseils sport' },
    { name: 'Fitness', description: 'Conseils fitness' },
    { name: 'Beauté', description: 'Conseils beauté' },
    { name: 'Mode', description: 'Conseils mode' },
    { name: 'Relations', description: 'Conseils relations' },
    { name: 'Amour', description: 'Conseils amour' },
    { name: 'Famille', description: 'Conseils famille' },
    { name: 'Parentalité', description: 'Conseils parentalité' },
    { name: 'Éducation', description: 'Conseils éducation' },
    { name: 'Travail', description: 'Conseils professionnels' },
    { name: 'Carrière', description: 'Conseils carrière' },
    { name: 'Finance', description: 'Conseils financiers' },
    { name: 'Épargne', description: 'Conseils épargne' },
    { name: 'Investissement', description: 'Conseils investissement' },
    { name: 'Immobilier', description: 'Conseils immobilier' },
    { name: 'Voyage', description: 'Conseils voyage' },
    { name: 'Cuisine', description: 'Conseils cuisine' },
    { name: 'Maison', description: 'Conseils maison' },
    { name: 'Décoration', description: 'Conseils décoration' },
    { name: 'Jardinage', description: 'Conseils jardinage' },
    { name: 'Bricolage', description: 'Conseils bricolage' },
    { name: 'Technologie', description: 'Conseils technologie' },
    { name: 'Informatique', description: 'Conseils informatique' },
    { name: 'Études', description: 'Conseils études' },
    { name: 'Examen', description: 'Conseils examens' },
    { name: 'Productivité', description: 'Conseils productivité' },
    { name: 'Organisation', description: 'Conseils organisation' },
    { name: 'Gestion du temps', description: 'Conseils gestion du temps' },
    { name: 'Stress', description: 'Conseils gestion stress' },
    { name: 'Sommeil', description: 'Conseils sommeil' },
    { name: 'Méditation', description: 'Conseils méditation' },
    { name: 'Développement personnel', description: 'Conseils développement personnel' },
    { name: 'Confiance en soi', description: 'Conseils confiance en soi' },
    { name: 'Motivation', description: 'Conseils motivation' },
    { name: 'Communication', description: 'Conseils communication' },
    { name: 'Leadership', description: 'Conseils leadership' },
    { name: 'Entrepreneuriat', description: 'Conseils entrepreneuriat' },
    { name: 'Business', description: 'Conseils business' },
    { name: 'Marketing', description: 'Conseils marketing' },
    { name: 'Vente', description: 'Conseils vente' },
    { name: 'Réseautage', description: 'Conseils réseautage' },
    { name: 'Écriture', description: 'Conseils écriture' },
    { name: 'Lecture', description: 'Conseils lecture' },
    { name: 'Langues', description: 'Conseils langues' },
    { name: 'Créativité', description: 'Conseils créativité' },
    { name: 'Art', description: 'Conseils art' },
    { name: 'Musique', description: 'Conseils musique' },
    { name: 'Photographie', description: 'Conseils photographie' },
    { name: 'Vidéo', description: 'Conseils vidéo' },
    { name: 'Social media', description: 'Conseils réseaux sociaux' },
    { name: 'Sécurité', description: 'Conseils sécurité' },
    { name: 'Économie d\'énergie', description: 'Conseils économie d\'énergie' },
    { name: 'Écologie', description: 'Conseils écologie' },
    { name: 'Animaux', description: 'Conseils animaux' },
    { name: 'Véhicules', description: 'Conseils véhicules' },
    { name: 'Achat', description: 'Conseils d\'achat' },
    { name: 'Économies', description: 'Conseils économies' },
    { name: 'Budget', description: 'Conseils budget' },
    { name: 'Assurance', description: 'Conseils assurance' },
    { name: 'Retraite', description: 'Conseils retraite' },
    { name: 'Légal', description: 'Conseils légaux' },
    { name: 'Administratif', description: 'Conseils administratifs' },
    { name: 'Démarches', description: 'Conseils démarches' },
    { name: 'Droit', description: 'Conseils droit' },
    { name: 'Santé mentale', description: 'Conseils santé mentale' },
    { name: 'Relations sociales', description: 'Conseils relations sociales' }
];

async function main() {
    try {
        console.log('🚀 Ajout des sous-catégories Conseil\n');
        
        // 1. Récupérer la catégorie Conseil
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', '%conseil%')
            .single();
        
        if (catError || !category) {
            throw new Error('Catégorie Conseil introuvable');
        }
        
        console.log(`✅ Catégorie ID: ${category.id}\n`);
        
        // 2. Vérifier les sous-catégories existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const { data: existing } = await supabase
            .from('subcategories')
            .select('name')
            .eq('category_id', category.id);
        
        const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);
        console.log(`📊 ${existingNames.size} sous-catégorie(s) existante(s)\n`);
        
        const toAdd = subcategories.filter(s => !existingNames.has(s.name.toLowerCase()));
        
        if (toAdd.length === 0) {
            console.log('✅ Toutes les sous-catégories existent déjà !');
            return;
        }
        
        console.log(`➕ ${toAdd.length} nouvelle(s) sous-catégorie(s) à ajouter\n`);
        
        // 3. Insertion
        console.log('💾 Insertion des sous-catégories...');
        const now = new Date().toISOString();
        let success = 0;
        let failed = 0;
        
        // Insérer par batch de 50
        const batchSize = 50;
        for (let i = 0; i < toAdd.length; i += batchSize) {
            const batch = toAdd.slice(i, i + batchSize);
            const batchData = batch.map(sub => ({
                name: sub.name,
                description: sub.description,
                category_id: category.id,
                created_at: now,
                updated_at: now
            }));
            
            const { error } = await supabase
                .from('subcategories')
                .insert(batchData);
            
            if (error) {
                // Si erreur batch, essayer une par une
                for (const sub of batch) {
                    const { error: singleError } = await supabase
                        .from('subcategories')
                        .insert({
                            name: sub.name,
                            description: sub.description,
                            category_id: category.id,
                            created_at: now,
                            updated_at: now
                        });
                    
                    if (singleError) {
                        if (singleError.message.includes('duplicate') || singleError.code === '23505') {
                            success++;
                        } else {
                            console.log(`⚠️  "${sub.name}": ${singleError.message}`);
                            failed++;
                        }
                    } else {
                        success++;
                    }
                }
            } else {
                success += batch.length;
            }
        }
        
        console.log(`\n✅ ${success} ajoutée(s), ⚠️  ${failed} échouée(s)`);
        
        // 4. Vérification finale
        const { data: all } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id)
            .order('name');
        
        console.log(`\n📊 Total final: ${all?.length || 0} sous-catégorie(s) Conseil`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

