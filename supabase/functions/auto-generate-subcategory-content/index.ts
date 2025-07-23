
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Templates de base pour différents types de contenu
const baseTitleTemplates = [
  "Comment maîtriser [TOPIC]",
  "Les secrets de [TOPIC]", 
  "[TOPIC] : guide complet",
  "Découvrez [TOPIC]",
  "Tout sur [TOPIC]",
  "[TOPIC] pour débutants",
  "Les bases de [TOPIC]",
  "[TOPIC] expliqué simplement"
];

const baseHookTemplates = [
  "Tu ne croiras jamais ce qui arrive quand...",
  "La vérité sur [TOPIC] que personne ne te dit",
  "Comment j'ai transformé ma [DOMAIN] en 30 jours",
  "Personne ne parle de ça mais...",
  "Si tu fais [TOPIC], évite cette erreur",
  "Le secret que les pros de [TOPIC] cachent",
  "Pourquoi [TOPIC] change tout",
  "J'ai testé [TOPIC] pendant un mois et..."
];

const baseHashtagTemplates = [
  "viral", "trending", "fyp", "pourtoi", "france", "content", "creator", 
  "tips", "astuce", "tuto", "conseil", "secret", "guide", "decouverte"
];

async function generateWithOpenAI(prompt: string, maxTokens: number = 1000): Promise<string> {
  if (!openAIApiKey) {
    console.log('OpenAI API key not found, using template content');
    return '';
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Tu es un expert en création de contenu TikTok/Instagram. Réponds de manière concise et structurée. Génère uniquement ce qui est demandé, sans introduction ni conclusion.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid OpenAI response structure');
    }
    
    return data.choices[0].message.content || '';
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return '';
  }
}

function generateFallbackTitles(subcategoryName: string, categoryName: string): string[] {
  const titles = [];
  
  // Utiliser les templates de base
  for (const template of baseTitleTemplates) {
    titles.push(template.replace('[TOPIC]', subcategoryName).replace('[DOMAIN]', categoryName));
  }
  
  // Ajouter des titres spécifiques
  const specificTitles = [
    `${subcategoryName} : tendances 2024`,
    `Créer du contenu ${subcategoryName}`,
    `${subcategoryName} viral`,
    `Inspiration ${subcategoryName}`,
    `${subcategoryName} créatif`,
    `Idées ${subcategoryName}`,
    `${subcategoryName} authentique`,
    `${subcategoryName} original`,
    `${subcategoryName} engageant`,
    `${subcategoryName} populaire`,
    `${subcategoryName} unique`,
    `${subcategoryName} tendance`
  ];
  
  titles.push(...specificTitles);
  return titles.slice(0, 20);
}

function generateFallbackHooks(subcategoryName: string, categoryName: string): string[] {
  const hooks = [];
  
  // Utiliser les templates de base
  for (const template of baseHookTemplates) {
    hooks.push(template.replace('[TOPIC]', subcategoryName).replace('[DOMAIN]', categoryName));
  }
  
  // Ajouter des hooks spécifiques
  const specificHooks = [
    `Ce que j'aurais aimé savoir sur ${subcategoryName}`,
    `${subcategoryName} : mon expérience vraie`,
    `Pourquoi ${subcategoryName} m'a changé`,
    `${subcategoryName} : ce qu'on ne dit pas`,
    `Ma plus grosse erreur avec ${subcategoryName}`,
    `${subcategoryName} : la réalité`,
    `Ce qui m'a surpris avec ${subcategoryName}`,
    `${subcategoryName} : mon avis honnête`,
    `${subcategoryName} : ce que j'ai appris`,
    `${subcategoryName} : la vérité`,
    `Mon parcours avec ${subcategoryName}`,
    `${subcategoryName} : mes conseils`
  ];
  
  hooks.push(...specificHooks);
  return hooks.slice(0, 20);
}

function generateFallbackHashtags(subcategoryName: string, categoryName: string): string[] {
  const hashtags = [...baseHashtagTemplates];
  
  // Ajouter des hashtags spécifiques à la catégorie/sous-catégorie
  const cleanSubcategory = subcategoryName.toLowerCase().replace(/\s+/g, '');
  const cleanCategory = categoryName.toLowerCase().replace(/\s+/g, '');
  
  hashtags.push(cleanSubcategory, cleanCategory);
  
  return hashtags.slice(0, 10);
}

async function generateSubcategoryContent(subcategoryName: string, categoryName: string) {
  console.log(`Generating standardized content for: ${subcategoryName} in category: ${categoryName}`);

  // Génération des 20 titres
  const titlesPrompt = `Génère exactement 20 titres courts et efficaces pour du contenu TikTok/Instagram sur "${subcategoryName}" dans "${categoryName}". 
  Critères:
  - Maximum 10 mots par titre
  - Courts, clairs, efficaces
  - Pas de redondance
  - Reflètent le thème de la sous-catégorie
  Format: un titre par ligne, sans numérotation ni tirets.`;
  
  const aiTitles = await generateWithOpenAI(titlesPrompt, 1200);
  let titles = [];
  
  if (aiTitles && aiTitles.trim()) {
    titles = aiTitles.split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0 && !t.match(/^\d+\./))
      .slice(0, 20);
  }
  
  if (titles.length < 20) {
    const fallbackTitles = generateFallbackTitles(subcategoryName, categoryName);
    titles = [...titles, ...fallbackTitles].slice(0, 20);
  }

  // Génération des 20 hooks
  const hooksPrompt = `Génère exactement 20 hooks d'accroche puissants pour du contenu "${subcategoryName}" dans "${categoryName}".
  Critères:
  - Accroches émotionnelles ou intrigantes
  - Cohérentes avec le style de la catégorie
  - Incitent à regarder la suite
  - Aucune information personnelle
  - Maximum 15 mots par hook
  Format: un hook par ligne, sans numérotation ni tirets.`;
  
  const aiHooks = await generateWithOpenAI(hooksPrompt, 1500);
  let hooks = [];
  
  if (aiHooks && aiHooks.trim()) {
    hooks = aiHooks.split('\n')
      .map(h => h.trim())
      .filter(h => h.length > 0 && !h.match(/^\d+\./))
      .slice(0, 20);
  }
  
  if (hooks.length < 20) {
    const fallbackHooks = generateFallbackHooks(subcategoryName, categoryName);
    hooks = [...hooks, ...fallbackHooks].slice(0, 20);
  }

  // Génération des 10 hashtags
  const hashtagsPrompt = `Génère exactement 10 hashtags pertinents pour "${subcategoryName}" dans "${categoryName}".
  Critères:
  - Représentatifs de la catégorie/sous-catégorie
  - Mélange hashtags de niche et reconnus
  - Exclure les hashtags trop génériques (#foryou, #viral)
  - Maximum 3 mots par hashtag (camelCase si besoin)
  Format: hashtag1, hashtag2, hashtag3... (sans le #)`;
  
  const aiHashtags = await generateWithOpenAI(hashtagsPrompt, 800);
  let hashtags = [];
  
  if (aiHashtags && aiHashtags.trim()) {
    hashtags = aiHashtags.split(',')
      .map(h => h.trim().replace('#', ''))
      .filter(h => h.length > 0)
      .slice(0, 10);
  }
  
  if (hashtags.length < 10) {
    const fallbackHashtags = generateFallbackHashtags(subcategoryName, categoryName);
    hashtags = [...hashtags, ...fallbackHashtags].slice(0, 10);
  }

  return {
    titles: titles.slice(0, 20),
    hooks: hooks.slice(0, 20),
    hashtags: hashtags.slice(0, 10)
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subcategoryId } = await req.json();
    
    if (!subcategoryId) {
      throw new Error('subcategoryId is required');
    }

    // Récupérer les infos de la sous-catégorie
    const { data: subcategory, error: subError } = await supabase
      .from('subcategories')
      .select(`
        *,
        category:categories(name)
      `)
      .eq('id', subcategoryId)
      .single();

    if (subError) throw subError;
    
    // Vérifier si le contenu n'a pas déjà été généré
    if (subcategory.auto_generation_completed) {
      return new Response(
        JSON.stringify({ message: 'Content already generated for this subcategory' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating standardized content for:', subcategory.name, 'in category:', subcategory.category?.name);

    // Générer le contenu
    const content = await generateSubcategoryContent(
      subcategory.name, 
      subcategory.category?.name || 'Général'
    );

    // Insérer les titres dans content_titles
    const titlesData = content.titles.map((title, index) => ({
      subcategory_id: subcategoryId,
      title,
      type: 'title',
      platform: 'all'
    }));

    await supabase.from('content_titles').insert(titlesData);

    // Insérer les hooks
    const hooksData = content.hooks.map((hook, index) => ({
      subcategory_id: subcategoryId,
      hook_text: hook,
      hook_order: index + 1
    }));

    await supabase.from('subcategory_hooks').insert(hooksData);

    // Insérer les hashtags
    const hashtagsData = content.hashtags.map((hashtag, index) => ({
      subcategory_id: subcategoryId,
      hashtag,
      hashtag_order: index + 1
    }));

    await supabase.from('subcategory_hashtags').insert(hashtagsData);

    // Marquer comme complété
    await supabase
      .from('subcategories')
      .update({ 
        is_auto_generated: true, 
        auto_generation_completed: true 
      })
      .eq('id', subcategoryId);

    console.log('Standardized content generation completed for subcategory:', subcategoryId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Standardized content generated successfully',
        subcategoryId,
        stats: {
          titles: content.titles.length,
          hooks: content.hooks.length,
          hashtags: content.hashtags.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in auto-generate-subcategory-content:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
