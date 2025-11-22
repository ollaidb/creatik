-- Script SQL simplifié pour insérer 10 pseudos par réseau social
-- Ce script insère les pseudos avec user_id = NULL (données automatiques)
-- Pour associer à un utilisateur, remplacez NULL par auth.uid() ou un UUID spécifique

-- ============================================
-- TIKTOK - 10 pseudos
-- ============================================
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

-- ============================================
-- YOUTUBE - 10 pseudos
-- ============================================
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

-- ============================================
-- INSTAGRAM - 10 pseudos
-- ============================================
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

-- ============================================
-- FACEBOOK - 10 pseudos
-- ============================================
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

-- ============================================
-- TWITTER - 10 pseudos
-- ============================================
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

-- ============================================
-- TWITCH - 10 pseudos
-- ============================================
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

-- ============================================
-- LINKEDIN - 10 pseudos
-- ============================================
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

-- ============================================
-- BLOG - 10 pseudos
-- ============================================
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

-- ============================================
-- ARTICLE - 10 pseudos
-- ============================================
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

-- ============================================
-- PODCASTS - 10 pseudos
-- ============================================
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
-- VÉRIFICATION
-- ============================================
SELECT 
  sn.display_name as reseau,
  COUNT(ui.id) as nombre_pseudos
FROM public.username_ideas ui
JOIN public.social_networks sn ON ui.social_network_id = sn.id
WHERE ui.user_id = auth.uid()
GROUP BY sn.display_name
ORDER BY sn.display_name;

