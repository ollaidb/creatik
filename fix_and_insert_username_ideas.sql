-- Script complet pour corriger et insérer les pseudos
-- Exécutez ce script dans Supabase Dashboard → SQL Editor

-- ============================================
-- ÉTAPE 1 : Vérifier et modifier la colonne user_id si nécessaire
-- ============================================
DO $$ 
BEGIN
  -- Vérifier si user_id est NOT NULL et le rendre nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'username_ideas' 
    AND column_name = 'user_id' 
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.username_ideas 
    ALTER COLUMN user_id DROP NOT NULL;
    RAISE NOTICE 'Colonne user_id rendue nullable';
  ELSE
    RAISE NOTICE 'Colonne user_id est déjà nullable';
  END IF;
END $$;

-- ============================================
-- ÉTAPE 2 : Mettre à jour les politiques RLS
-- ============================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Username ideas are insertable by authenticated users" ON public.username_ideas;
DROP POLICY IF EXISTS "Username ideas are insertable by everyone" ON public.username_ideas;
DROP POLICY IF EXISTS "Users can update own username ideas" ON public.username_ideas;
DROP POLICY IF EXISTS "Users can delete own username ideas" ON public.username_ideas;

-- Créer les nouvelles politiques
CREATE POLICY "Username ideas are insertable by everyone" 
ON public.username_ideas 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update own username ideas" 
ON public.username_ideas 
FOR UPDATE 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL)
);

CREATE POLICY "Users can delete own username ideas" 
ON public.username_ideas 
FOR DELETE 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL)
);

-- ============================================
-- ÉTAPE 3 : Insérer les pseudos (10 par réseau)
-- ============================================

-- TIKTOK
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT pseudo, network_id, NULL
FROM (VALUES
  ('creativetok'),
  ('vibesonly'),
  ('trendsetter'),
  ('contentqueen'),
  ('viralvibes'),
  ('danceking'),
  ('lifetok'),
  ('funnyvids'),
  ('creativemind'),
  ('trendytok')
) AS t(pseudo)
CROSS JOIN (SELECT id as network_id FROM public.social_networks WHERE name = 'tiktok' LIMIT 1) n
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo AND social_network_id = n.network_id
);

-- YOUTUBE
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT pseudo, network_id, NULL
FROM (VALUES
  ('creativetube'),
  ('videomaster'),
  ('contentcreator'),
  ('youtubepro'),
  ('videoking'),
  ('channelmaster'),
  ('contentqueen'),
  ('videowizard'),
  ('youtubestar'),
  ('creativechannel')
) AS t(pseudo)
CROSS JOIN (SELECT id as network_id FROM public.social_networks WHERE name = 'youtube' LIMIT 1) n
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo AND social_network_id = n.network_id
);

-- INSTAGRAM
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT pseudo, network_id, NULL
FROM (VALUES
  ('instacreative'),
  ('visualvibes'),
  ('instastar'),
  ('photolife'),
  ('instaqueen'),
  ('visualstory'),
  ('instamagic'),
  ('creativegram'),
  ('instavibes'),
  ('visualdream')
) AS t(pseudo)
CROSS JOIN (SELECT id as network_id FROM public.social_networks WHERE name = 'instagram' LIMIT 1) n
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo AND social_network_id = n.network_id
);

-- FACEBOOK
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT pseudo, network_id, NULL
FROM (VALUES
  ('facebookpro'),
  ('socialcreator'),
  ('facebookstar'),
  ('socialvibes'),
  ('facebookqueen'),
  ('socialmaster'),
  ('facebooklife'),
  ('socialgenius'),
  ('facebookking'),
  ('socialwizard')
) AS t(pseudo)
CROSS JOIN (SELECT id as network_id FROM public.social_networks WHERE name = 'facebook' LIMIT 1) n
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo AND social_network_id = n.network_id
);

-- TWITTER
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT pseudo, network_id, NULL
FROM (VALUES
  ('tweetmaster'),
  ('twitterpro'),
  ('tweetstar'),
  ('twittervibes'),
  ('tweetqueen'),
  ('twitterlife'),
  ('tweetking'),
  ('twittergenius'),
  ('tweetwizard'),
  ('twittercreative')
) AS t(pseudo)
CROSS JOIN (SELECT id as network_id FROM public.social_networks WHERE name = 'twitter' LIMIT 1) n
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo AND social_network_id = n.network_id
);

-- TWITCH
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT pseudo, network_id, NULL
FROM (VALUES
  ('streamking'),
  ('twitchpro'),
  ('streamqueen'),
  ('twitchstar'),
  ('streammaster'),
  ('twitchvibes'),
  ('streamlife'),
  ('twitchgenius'),
  ('streamwizard'),
  ('twitchcreative')
) AS t(pseudo)
CROSS JOIN (SELECT id as network_id FROM public.social_networks WHERE name = 'twitch' LIMIT 1) n
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo AND social_network_id = n.network_id
);

-- LINKEDIN
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT pseudo, network_id, NULL
FROM (VALUES
  ('linkedinpro'),
  ('professional'),
  ('linkedinstar'),
  ('careerking'),
  ('linkedinqueen'),
  ('businesspro'),
  ('linkedinlife'),
  ('networkmaster'),
  ('linkedingenius'),
  ('professionalvibes')
) AS t(pseudo)
CROSS JOIN (SELECT id as network_id FROM public.social_networks WHERE name = 'linkedin' LIMIT 1) n
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo AND social_network_id = n.network_id
);

-- BLOG
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT pseudo, network_id, NULL
FROM (VALUES
  ('blogmaster'),
  ('blogpro'),
  ('blogstar'),
  ('blogqueen'),
  ('blogking'),
  ('bloglife'),
  ('bloggenius'),
  ('blogwizard'),
  ('blogcreative'),
  ('blogvibes')
) AS t(pseudo)
CROSS JOIN (SELECT id as network_id FROM public.social_networks WHERE name = 'blog' LIMIT 1) n
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo AND social_network_id = n.network_id
);

-- ARTICLE
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT pseudo, network_id, NULL
FROM (VALUES
  ('articlepro'),
  ('writermaster'),
  ('articlestar'),
  ('writerqueen'),
  ('articleking'),
  ('writerlife'),
  ('articlegenius'),
  ('writerwizard'),
  ('articlecreative'),
  ('writervibes')
) AS t(pseudo)
CROSS JOIN (SELECT id as network_id FROM public.social_networks WHERE name = 'article' LIMIT 1) n
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo AND social_network_id = n.network_id
);

-- PODCASTS
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT pseudo, network_id, NULL
FROM (VALUES
  ('podcastpro'),
  ('podcastmaster'),
  ('podcaststar'),
  ('podcastqueen'),
  ('podcastking'),
  ('podcastlife'),
  ('podcastgenius'),
  ('podcastwizard'),
  ('podcastcreative'),
  ('podcastvibes')
) AS t(pseudo)
CROSS JOIN (SELECT id as network_id FROM public.social_networks WHERE name = 'podcasts' LIMIT 1) n
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo AND social_network_id = n.network_id
);

-- ============================================
-- ÉTAPE 4 : Vérification finale
-- ============================================
SELECT 
  '✅ Script terminé!' as message,
  COUNT(*) as total_pseudos,
  COUNT(DISTINCT social_network_id) as nombre_reseaux
FROM public.username_ideas;

