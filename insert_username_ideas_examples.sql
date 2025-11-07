-- Script SQL pour insérer 10 exemples de pseudos pour chaque réseau social
-- IMPORTANT: Remplacez 'VOTRE_USER_ID' par votre vrai user_id avant d'exécuter

-- Ce script récupère automatiquement les IDs des réseaux sociaux et insère les pseudos
-- Vous devez remplacer 'VOTRE_USER_ID' par votre user_id (UUID de auth.users)

-- ============================================
-- TIKTOK - 10 pseudos créatifs
-- ============================================
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT 
  pseudo,
  (SELECT id FROM public.social_networks WHERE name = 'tiktok' LIMIT 1) as social_network_id,
  'VOTRE_USER_ID'::uuid as user_id
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
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo 
  AND social_network_id = (SELECT id FROM public.social_networks WHERE name = 'tiktok' LIMIT 1)
);

-- ============================================
-- YOUTUBE - 10 pseudos créatifs
-- ============================================
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT 
  pseudo,
  (SELECT id FROM public.social_networks WHERE name = 'youtube' LIMIT 1) as social_network_id,
  'VOTRE_USER_ID'::uuid as user_id
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
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo 
  AND social_network_id = (SELECT id FROM public.social_networks WHERE name = 'youtube' LIMIT 1)
);

-- ============================================
-- INSTAGRAM - 10 pseudos créatifs
-- ============================================
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT 
  pseudo,
  (SELECT id FROM public.social_networks WHERE name = 'instagram' LIMIT 1) as social_network_id,
  'VOTRE_USER_ID'::uuid as user_id
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
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo 
  AND social_network_id = (SELECT id FROM public.social_networks WHERE name = 'instagram' LIMIT 1)
);

-- ============================================
-- FACEBOOK - 10 pseudos créatifs
-- ============================================
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT 
  pseudo,
  (SELECT id FROM public.social_networks WHERE name = 'facebook' LIMIT 1) as social_network_id,
  'VOTRE_USER_ID'::uuid as user_id
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
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo 
  AND social_network_id = (SELECT id FROM public.social_networks WHERE name = 'facebook' LIMIT 1)
);

-- ============================================
-- TWITTER - 10 pseudos créatifs
-- ============================================
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT 
  pseudo,
  (SELECT id FROM public.social_networks WHERE name = 'twitter' LIMIT 1) as social_network_id,
  'VOTRE_USER_ID'::uuid as user_id
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
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo 
  AND social_network_id = (SELECT id FROM public.social_networks WHERE name = 'twitter' LIMIT 1)
);

-- ============================================
-- TWITCH - 10 pseudos créatifs
-- ============================================
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT 
  pseudo,
  (SELECT id FROM public.social_networks WHERE name = 'twitch' LIMIT 1) as social_network_id,
  'VOTRE_USER_ID'::uuid as user_id
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
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo 
  AND social_network_id = (SELECT id FROM public.social_networks WHERE name = 'twitch' LIMIT 1)
);

-- ============================================
-- LINKEDIN - 10 pseudos créatifs
-- ============================================
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT 
  pseudo,
  (SELECT id FROM public.social_networks WHERE name = 'linkedin' LIMIT 1) as social_network_id,
  'VOTRE_USER_ID'::uuid as user_id
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
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo 
  AND social_network_id = (SELECT id FROM public.social_networks WHERE name = 'linkedin' LIMIT 1)
);

-- ============================================
-- BLOG - 10 pseudos créatifs
-- ============================================
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT 
  pseudo,
  (SELECT id FROM public.social_networks WHERE name = 'blog' LIMIT 1) as social_network_id,
  'VOTRE_USER_ID'::uuid as user_id
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
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo 
  AND social_network_id = (SELECT id FROM public.social_networks WHERE name = 'blog' LIMIT 1)
);

-- ============================================
-- ARTICLE - 10 pseudos créatifs
-- ============================================
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT 
  pseudo,
  (SELECT id FROM public.social_networks WHERE name = 'article' LIMIT 1) as social_network_id,
  'VOTRE_USER_ID'::uuid as user_id
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
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo 
  AND social_network_id = (SELECT id FROM public.social_networks WHERE name = 'article' LIMIT 1)
);

-- ============================================
-- PODCASTS - 10 pseudos créatifs
-- ============================================
INSERT INTO public.username_ideas (pseudo, social_network_id, user_id)
SELECT 
  pseudo,
  (SELECT id FROM public.social_networks WHERE name = 'podcasts' LIMIT 1) as social_network_id,
  'VOTRE_USER_ID'::uuid as user_id
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
WHERE NOT EXISTS (
  SELECT 1 FROM public.username_ideas 
  WHERE pseudo = t.pseudo 
  AND social_network_id = (SELECT id FROM public.social_networks WHERE name = 'podcasts' LIMIT 1)
);

-- ============================================
-- VÉRIFICATION
-- ============================================
-- Vérifier combien de pseudos ont été insérés
SELECT 
  sn.display_name as reseau,
  COUNT(ui.id) as nombre_pseudos
FROM public.username_ideas ui
JOIN public.social_networks sn ON ui.social_network_id = sn.id
GROUP BY sn.display_name
ORDER BY sn.display_name;

-- Afficher tous les pseudos insérés
SELECT 
  ui.pseudo,
  sn.display_name as reseau,
  ui.created_at
FROM public.username_ideas ui
JOIN public.social_networks sn ON ui.social_network_id = sn.id
ORDER BY sn.display_name, ui.pseudo;

