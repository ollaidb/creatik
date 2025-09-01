import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { content_type, title, category_id, subcategory_id } = await req.json()

    if (!content_type || !title) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'content_type et title sont requis' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Appeler la fonction PostgreSQL pour traiter la publication
    const { data, error } = await supabase.rpc('process_publication', {
      p_content_type: content_type,
      p_title: title,
      p_category_id: category_id || null,
      p_subcategory_id: subcategory_id || null
    })

    if (error) {
      console.error('Erreur lors du traitement:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Erreur lors du traitement de la publication',
          error: error.message 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Erreur interne du serveur',
        error: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}) 