#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const subcategories = [
    // Par domaine
    { name: 'Cuisine', description: 'Astuces culinaires et recettes' },
    { name: 'Maison', description: 'Astuces ménage et organisation de la maison' },
    { name: 'Beauté', description: 'Astuces beauté et soins' },
    { name: 'Mode', description: 'Astuces mode et style' },
    { name: 'Tech', description: 'Astuces technologiques' },
    { name: 'Voyage', description: 'Astuces voyage et déplacements' },
    { name: 'Économie', description: 'Astuces pour économiser de l\'argent' },
    { name: 'Organisation', description: 'Astuces organisation personnelle' },
    { name: 'Productivité', description: 'Astuces productivité et efficacité' },
    { name: 'Santé', description: 'Astuces santé et bien-être' },
    { name: 'Jardinage', description: 'Astuces jardinage et plantes' },
    { name: 'Bricolage', description: 'Astuces bricolage et réparations' },
    { name: 'Éducation', description: 'Astuces éducation et apprentissage' },
    { name: 'Relations', description: 'Astuces relations et communication' },
    { name: 'Parentalité', description: 'Astuces pour parents' },
    { name: 'Études', description: 'Astuces pour étudiants' },
    { name: 'Travail', description: 'Astuces professionnelles' },
    { name: 'Finance', description: 'Astuces financières et budget' },
    { name: 'Shopping', description: 'Astuces shopping et achats' },
    { name: 'Transport', description: 'Astuces transport et déplacements' },
    { name: 'Énergie', description: 'Astuces économie d\'énergie' },
    { name: 'Écologie', description: 'Astuces écologiques et environnement' },
    { name: 'Animaux', description: 'Astuces pour animaux de compagnie' },
    { name: 'Sport', description: 'Astuces sport et fitness' },
    { name: 'Créativité', description: 'Astuces créatives et artistiques' },
    { name: 'Social', description: 'Astuces sociales et networking' },
    { name: 'Développement personnel', description: 'Astuces développement personnel' },
    { name: 'Méditation', description: 'Astuces méditation et relaxation' },
    { name: 'Sommeil', description: 'Astuces sommeil et repos' },
    { name: 'Stress', description: 'Astuces gestion du stress' },
    
    // Types généraux (en gardant ceux qui existent déjà)
    { name: 'Rapide', description: 'Astuces rapides et faciles' },
    { name: 'Simple', description: 'Astuces simples à mettre en pratique' },
    { name: 'Efficace', description: 'Astuces efficaces et performantes' },
    { name: 'Gratuit', description: 'Astuces gratuites et économiques' },
    { name: 'DIY', description: 'Astuces faites maison et créatives' }
];

async function main() {
    try {
        console.log('🚀 Insertion automatique des sous-catégories Astuce\n');
        
        // 1. Vérifier/Créer la catégorie
        console.log('📋 Vérification de la catégorie Astuce...');
        let { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .eq('name', 'Astuce')
            .single();
        
        if (catError && catError.code === 'PGRST116') {
            console.log('➕ Création de la catégorie Astuce...');
            const { data: theme } = await supabase
                .from('themes')
                .select('id')
                .in('name', ['Lifestyle', 'Divertissement', 'Tout'])
                .limit(1)
                .single();
            
            const { data: newCat, error: createError } = await supabase
                .from('categories')
                .insert({
                    name: 'Astuce',
                    color: 'primary',
                    description: 'Conseils pratiques et astuces utiles',
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
        
        console.log(`\n📊 Total final: ${all?.length || 0} sous-catégorie(s) Astuce`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

