#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const subcategories = [
    { name: 'Expériences personnelles', description: 'Témoignages d\'expériences personnelles' },
    { name: 'Santé', description: 'Témoignages santé, maladie, guérison' },
    { name: 'Relations', description: 'Témoignages sur les relations' },
    { name: 'Travail', description: 'Témoignages professionnels' },
    { name: 'Éducation', description: 'Témoignages scolaires et universitaires' },
    { name: 'Voyage', description: 'Témoignages de voyages' },
    { name: 'Famille', description: 'Témoignages familiaux' },
    { name: 'Amour', description: 'Témoignages amoureux' },
    { name: 'Amitié', description: 'Témoignages d\'amitié' },
    { name: 'Difficultés', description: 'Témoignages de difficultés' },
    { name: 'Réussites', description: 'Témoignages de réussites' },
    { name: 'Échecs', description: 'Témoignages d\'échecs' },
    { name: 'Changements', description: 'Témoignages de changements' },
    { name: 'Décisions', description: 'Témoignages de décisions importantes' },
    { name: 'Moment marquant', description: 'Témoignages de moments marquants' },
    { name: 'Perte', description: 'Témoignages de deuil et perte' },
    { name: 'Naissance', description: 'Témoignages de naissance' },
    { name: 'Mariage', description: 'Témoignages de mariage' },
    { name: 'Divorce', description: 'Témoignages de divorce' },
    { name: 'Grossesse', description: 'Témoignages de grossesse' },
    { name: 'Parentalité', description: 'Témoignages de parentalité' },
    { name: 'Adoption', description: 'Témoignages d\'adoption' },
    { name: 'Immigration', description: 'Témoignages d\'immigration' },
    { name: 'Discrimination', description: 'Témoignages de discrimination' },
    { name: 'Violence', description: 'Témoignages de violence' },
    { name: 'Harcèlement', description: 'Témoignages de harcèlement' },
    { name: 'Addiction', description: 'Témoignages d\'addiction' },
    { name: 'Récupération', description: 'Témoignages de récupération' },
    { name: 'Spiritualité', description: 'Témoignages spirituels' },
    { name: 'Religion', description: 'Témoignages religieux' },
    { name: 'Conversion', description: 'Témoignages de conversion' },
    { name: 'Inspiration', description: 'Témoignages inspirants' },
    { name: 'Motivation', description: 'Témoignages motivants' },
    { name: 'Courage', description: 'Témoignages de courage' },
    { name: 'Résilience', description: 'Témoignages de résilience' },
    { name: 'Solidarité', description: 'Témoignages de solidarité' },
    { name: 'Entraide', description: 'Témoignages d\'entraide' },
    { name: 'Bienveillance', description: 'Témoignages de bienveillance' },
    { name: 'Gratitude', description: 'Témoignages de gratitude' },
    { name: 'Pardon', description: 'Témoignages de pardon' }
];

async function main() {
    try {
        console.log('🚀 Ajout des sous-catégories Témoignage\n');
        
        // 1. Récupérer la catégorie Témoignage
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', '%témoignage%')
            .single();
        
        if (catError || !category) {
            throw new Error('Catégorie Témoignage introuvable');
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
        
        for (const sub of toAdd) {
            const { error } = await supabase
                .from('subcategories')
                .insert({
                    name: sub.name,
                    description: sub.description,
                    category_id: category.id,
                    created_at: now,
                    updated_at: now
                });
            
            if (error) {
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
            .eq('category_id', category.id)
            .order('name');
        
        console.log(`\n📊 Total final: ${all?.length || 0} sous-catégorie(s) Témoignage`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

