#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('name', 'Actualités')
        .single();
    
    if (!category) {
        console.log('❌ Catégorie introuvable');
        return;
    }
    
    const { data: level1 } = await supabase
        .from('subcategories')
        .select('id, name')
        .eq('category_id', category.id)
        .order('name');
    
    console.log(`\n📊 Niveau 1: ${level1?.length || 0} sous-catégories\n`);
    
    if (level1 && level1.length > 0) {
        for (const l1 of level1.slice(0, 10)) {
            const { data: level2 } = await supabase
                .from('subcategories_level2')
                .select('id, name')
                .eq('subcategory_id', l1.id);
            
            console.log(`  - ${l1.name}: ${level2?.length || 0} niveau 2`);
            if (level2 && level2.length > 0) {
                level2.slice(0, 5).forEach(l2 => {
                    console.log(`    • ${l2.name}`);
                });
                if (level2.length > 5) {
                    console.log(`    ... et ${level2.length - 5} autres`);
                }
            }
        }
    }
    
    const { data: allLevel2 } = await supabase
        .from('subcategories_level2')
        .select('id, name, subcategory_id')
        .in('subcategory_id', level1?.map(s => s.id) || []);
    
    console.log(`\n📊 Total niveau 2: ${allLevel2?.length || 0}\n`);
}

main().catch(console.error);

