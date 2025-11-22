#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const subcategories = [
    { name: 'Animaux', description: 'Fun facts sur les animaux' },
    { name: 'Nature', description: 'Fun facts sur la nature' },
    { name: 'Science', description: 'Fun facts scientifiques' },
    { name: 'Histoire', description: 'Fun facts historiques' },
    { name: 'Géographie', description: 'Fun facts géographiques' },
    { name: 'Espace', description: 'Fun facts sur l\'espace' },
    { name: 'Océans', description: 'Fun facts sur les océans' },
    { name: 'Corps humain', description: 'Fun facts sur le corps humain' },
    { name: 'Cerveau', description: 'Fun facts sur le cerveau' },
    { name: 'Langues', description: 'Fun facts sur les langues' },
    { name: 'Cultures', description: 'Fun facts culturels' },
    { name: 'Pays', description: 'Fun facts sur les pays' },
    { name: 'Villes', description: 'Fun facts sur les villes' },
    { name: 'Technologie', description: 'Fun facts technologiques' },
    { name: 'Internet', description: 'Fun facts sur internet' },
    { name: 'Médias', description: 'Fun facts médiatiques' },
    { name: 'Cinéma', description: 'Fun facts cinéma' },
    { name: 'Musique', description: 'Fun facts musique' },
    { name: 'Sport', description: 'Fun facts sport' },
    { name: 'Nourriture', description: 'Fun facts alimentaires' },
    { name: 'Boissons', description: 'Fun facts sur les boissons' },
    { name: 'Plantes', description: 'Fun facts sur les plantes' },
    { name: 'Insectes', description: 'Fun facts sur les insectes' },
    { name: 'Oiseaux', description: 'Fun facts sur les oiseaux' },
    { name: 'Mammifères', description: 'Fun facts sur les mammifères' },
    { name: 'Reptiles', description: 'Fun facts sur les reptiles' },
    { name: 'Poissons', description: 'Fun facts sur les poissons' },
    { name: 'Météo', description: 'Fun facts météorologiques' },
    { name: 'Climat', description: 'Fun facts climatiques' },
    { name: 'Volcans', description: 'Fun facts sur les volcans' },
    { name: 'Montagnes', description: 'Fun facts sur les montagnes' },
    { name: 'Déserts', description: 'Fun facts sur les déserts' },
    { name: 'Forêts', description: 'Fun facts sur les forêts' },
    { name: 'Océans profonds', description: 'Fun facts sur les océans profonds' },
    { name: 'Inventions', description: 'Fun facts sur les inventions' },
    { name: 'Découvertes', description: 'Fun facts sur les découvertes' },
    { name: 'Records', description: 'Records et faits étonnants' },
    { name: 'Chiffres', description: 'Fun facts avec des chiffres' },
    { name: 'Statistiques', description: 'Fun facts statistiques' },
    { name: 'Coïncidences', description: 'Coïncidences étonnantes' },
    { name: 'Mystères', description: 'Fun facts mystérieux' },
    { name: 'Légendes', description: 'Fun facts et légendes' },
    { name: 'Mythologie', description: 'Fun facts mythologiques' },
    { name: 'Religion', description: 'Fun facts religieux' },
    { name: 'Philosophie', description: 'Fun facts philosophiques' },
    { name: 'Psychologie', description: 'Fun facts psychologiques' },
    { name: 'Société', description: 'Fun facts sociaux' },
    { name: 'Économie', description: 'Fun facts économiques' },
    { name: 'Politique', description: 'Fun facts politiques' },
    { name: 'Art', description: 'Fun facts artistiques' },
    { name: 'Littérature', description: 'Fun facts littéraires' },
    { name: 'Architecture', description: 'Fun facts architecturaux' },
    { name: 'Mode', description: 'Fun facts mode' },
    { name: 'Transport', description: 'Fun facts transport' },
    { name: 'Communication', description: 'Fun facts communication' },
    { name: 'Énergie', description: 'Fun facts énergétiques' },
    { name: 'Médecine', description: 'Fun facts médicaux' },
    { name: 'Santé', description: 'Fun facts santé' },
    { name: 'Éducation', description: 'Fun facts éducatifs' },
    { name: 'Travail', description: 'Fun facts professionnels' },
    { name: 'Vie quotidienne', description: 'Fun facts quotidiens' },
    { name: 'Surprenant', description: 'Fun facts surprenants' },
    { name: 'Drôle', description: 'Fun facts drôles' },
    { name: 'Étrange', description: 'Fun facts étranges' },
    { name: 'Incroyable', description: 'Fun facts incroyables' }
];

async function main() {
    try {
        console.log('🚀 Ajout des sous-catégories Fun fact\n');
        
        // 1. Récupérer la catégorie Fun fact
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', '%fun fact%')
            .single();
        
        if (catError || !category) {
            throw new Error('Catégorie Fun fact introuvable');
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
        
        console.log(`\n📊 Total final: ${all?.length || 0} sous-catégorie(s) Fun fact`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

