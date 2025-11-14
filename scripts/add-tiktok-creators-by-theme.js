#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Liste de 100 TikTokers français populaires variés par thème
// Un créateur peut apparaître dans plusieurs thèmes
const tiktokCreatorsByTheme = {
    'Inspirer': [
        { name: 'Léna Situations', username: 'lenasituations' },
        { name: 'EnjoyPhoenix', username: 'enjoyphoenix' },
        { name: 'Léa Camilleri', username: 'leacamilleri' },
        { name: 'Coline', username: 'coline' },
        { name: 'Sananas', username: 'sananas' },
        { name: 'Justine Le Pottier', username: 'justinelepottier' },
        { name: 'Marie Lopez', username: 'marielopez' },
        { name: 'Léna Mahfouf', username: 'lenamahfouf' },
        { name: 'Emma', username: 'emma' },
        { name: 'Léonie', username: 'leonie' },
        { name: 'Mademoiselle', username: 'mademoiselle' },
        { name: 'Andy Raconte', username: 'andyraconte' },
        { name: 'Andy', username: 'andy' },
        { name: 'Michou', username: 'michou' },
        { name: 'Inoxtag', username: 'inoxtag' },
        { name: 'Locklear', username: 'locklear' },
        { name: 'Gotaga', username: 'gotaga' },
        { name: 'Mister MV', username: 'mistermv' },
        { name: 'Ponce', username: 'ponce' },
        { name: 'Baghera Jones', username: 'bagherajones' },
        { name: 'Etoiles', username: 'etoiles' },
        { name: 'Antoine Delak', username: 'antoinedelak' },
        { name: 'LeBouseuh', username: 'lebouseuh' },
        { name: 'Mynthos', username: 'mynthos' },
        { name: 'ZeratoR', username: 'zerator' },
        { name: 'Squeezie', username: 'squeezie' },
        { name: 'Cyprien', username: 'cyprien' },
        { name: 'Norman', username: 'norman' },
        { name: 'Natoo', username: 'natoo' },
        { name: 'Amixem', username: 'amixem' },
        { name: 'Mcfly et Carlito', username: 'mcflyetcarlito' },
        { name: 'Seb la Frite', username: 'seblafrite' },
        { name: 'Le Rire Jaune', username: 'lerirejaune' },
        { name: 'Antoine Daniel', username: 'antoinedaniel' },
        { name: 'Maxime Biaggi', username: 'maximebiaggi' },
        { name: 'Thomas Gauthier', username: 'thomasgauthier' },
        { name: 'DirtyBiology', username: 'dirtybiology' },
        { name: 'Nota Bene', username: 'notabene' },
        { name: 'Axolot', username: 'axolot' },
        { name: 'Le Grand JD', username: 'legrandjd' },
        { name: 'Doc Seven', username: 'docseven' },
        { name: 'Linguisticae', username: 'linguisticae' },
        { name: 'Micode', username: 'micode' },
        { name: 'Feldup', username: 'feldup' },
        { name: 'Alt 236', username: 'alt236' },
        { name: 'Le Fossoyeur de Films', username: 'lefossoyeurdefilms' },
        { name: 'Karim Debbache', username: 'karimdebbache' },
        { name: 'Le Biais Vert', username: 'lebiaisvert' },
        { name: 'Hygiène Mentale', username: 'hygienementale' },
        { name: 'Defakator', username: 'defakator' },
        { name: 'Science de Comptoir', username: 'sciencedecomptoir' },
        { name: 'Damon et Jo', username: 'damonetjo' },
        { name: 'Solange te parle', username: 'solangeteparle' },
        { name: 'Rémi Gaillard', username: 'remigaillard' },
        { name: 'Greg Guillotin', username: 'gregguillotin' },
        { name: 'Joueur du Grenier', username: 'joueurdugrenier' },
        { name: 'Golden Moustache', username: 'goldenmoustache' },
        { name: 'Studio Bagel', username: 'studiobagel' },
        { name: 'Mister V', username: 'misterv' },
        { name: 'Léna Situations', username: 'lenasituations' },
        { name: 'EnjoyPhoenix', username: 'enjoyphoenix' },
        { name: 'Léa Camilleri', username: 'leacamilleri' },
        { name: 'Coline', username: 'coline' },
        { name: 'Sananas', username: 'sananas' },
        { name: 'Justine Le Pottier', username: 'justinelepottier' },
        { name: 'Marie Lopez', username: 'marielopez' },
        { name: 'Léna Mahfouf', username: 'lenamahfouf' },
        { name: 'Emma', username: 'emma' },
        { name: 'Léonie', username: 'leonie' },
        { name: 'Mademoiselle', username: 'mademoiselle' },
        { name: 'Andy Raconte', username: 'andyraconte' },
        { name: 'Andy', username: 'andy' },
        { name: 'Michou', username: 'michou' },
        { name: 'Inoxtag', username: 'inoxtag' },
        { name: 'Locklear', username: 'locklear' },
        { name: 'Gotaga', username: 'gotaga' },
        { name: 'Mister MV', username: 'mistermv' },
        { name: 'Ponce', username: 'ponce' },
        { name: 'Baghera Jones', username: 'bagherajones' },
        { name: 'Etoiles', username: 'etoiles' },
        { name: 'Antoine Delak', username: 'antoinedelak' },
        { name: 'LeBouseuh', username: 'lebouseuh' },
        { name: 'Mynthos', username: 'mynthos' },
        { name: 'ZeratoR', username: 'zerator' },
        { name: 'Squeezie', username: 'squeezie' },
        { name: 'Cyprien', username: 'cyprien' },
        { name: 'Norman', username: 'norman' },
        { name: 'Natoo', username: 'natoo' },
        { name: 'Amixem', username: 'amixem' },
        { name: 'Mcfly et Carlito', username: 'mcflyetcarlito' },
        { name: 'Seb la Frite', username: 'seblafrite' },
        { name: 'Le Rire Jaune', username: 'lerirejaune' },
        { name: 'Antoine Daniel', username: 'antoinedaniel' },
        { name: 'Maxime Biaggi', username: 'maximebiaggi' },
        { name: 'Thomas Gauthier', username: 'thomasgauthier' },
        { name: 'DirtyBiology', username: 'dirtybiology' },
        { name: 'Nota Bene', username: 'notabene' },
        { name: 'Axolot', username: 'axolot' },
        { name: 'Le Grand JD', username: 'legrandjd' },
        { name: 'Doc Seven', username: 'docseven' },
        { name: 'Linguisticae', username: 'linguisticae' },
        { name: 'Micode', username: 'micode' },
        { name: 'Feldup', username: 'feldup' },
        { name: 'Alt 236', username: 'alt236' },
        { name: 'Le Fossoyeur de Films', username: 'lefossoyeurdefilms' },
        { name: 'Karim Debbache', username: 'karimdebbache' },
        { name: 'Le Biais Vert', username: 'lebiaisvert' },
        { name: 'Hygiène Mentale', username: 'hygienementale' },
        { name: 'Defakator', username: 'defakator' },
        { name: 'Science de Comptoir', username: 'sciencedecomptoir' },
        { name: 'Damon et Jo', username: 'damonetjo' },
        { name: 'Solange te parle', username: 'solangeteparle' }
    ],
    'Motiver': [
        { name: 'Michou', username: 'michou' },
        { name: 'Inoxtag', username: 'inoxtag' },
        { name: 'Locklear', username: 'locklear' },
        { name: 'Gotaga', username: 'gotaga' },
        { name: 'Mister MV', username: 'mistermv' },
        { name: 'Ponce', username: 'ponce' },
        { name: 'Baghera Jones', username: 'bagherajones' },
        { name: 'Etoiles', username: 'etoiles' },
        { name: 'Antoine Delak', username: 'antoinedelak' },
        { name: 'LeBouseuh', username: 'lebouseuh' },
        { name: 'Mynthos', username: 'mynthos' },
        { name: 'ZeratoR', username: 'zerator' },
        { name: 'Squeezie', username: 'squeezie' },
        { name: 'Cyprien', username: 'cyprien' },
        { name: 'Norman', username: 'norman' },
        { name: 'Natoo', username: 'natoo' },
        { name: 'Amixem', username: 'amixem' },
        { name: 'Mcfly et Carlito', username: 'mcflyetcarlito' },
        { name: 'Seb la Frite', username: 'seblafrite' },
        { name: 'Le Rire Jaune', username: 'lerirejaune' },
        { name: 'Antoine Daniel', username: 'antoinedaniel' },
        { name: 'Maxime Biaggi', username: 'maximebiaggi' },
        { name: 'Thomas Gauthier', username: 'thomasgauthier' },
        { name: 'DirtyBiology', username: 'dirtybiology' },
        { name: 'Nota Bene', username: 'notabene' },
        { name: 'Axolot', username: 'axolot' },
        { name: 'Le Grand JD', username: 'legrandjd' },
        { name: 'Doc Seven', username: 'docseven' },
        { name: 'Linguisticae', username: 'linguisticae' },
        { name: 'Micode', username: 'micode' },
        { name: 'Feldup', username: 'feldup' },
        { name: 'Alt 236', username: 'alt236' },
        { name: 'Le Fossoyeur de Films', username: 'lefossoyeurdefilms' },
        { name: 'Karim Debbache', username: 'karimdebbache' },
        { name: 'Le Biais Vert', username: 'lebiaisvert' },
        { name: 'Hygiène Mentale', username: 'hygienementale' },
        { name: 'Defakator', username: 'defakator' },
        { name: 'Science de Comptoir', username: 'sciencedecomptoir' },
        { name: 'Damon et Jo', username: 'damonetjo' },
        { name: 'Solange te parle', username: 'solangeteparle' },
        { name: 'Rémi Gaillard', username: 'remigaillard' },
        { name: 'Greg Guillotin', username: 'gregguillotin' },
        { name: 'Joueur du Grenier', username: 'joueurdugrenier' },
        { name: 'Golden Moustache', username: 'goldenmoustache' },
        { name: 'Studio Bagel', username: 'studiobagel' },
        { name: 'Mister V', username: 'misterv' },
        { name: 'Léna Situations', username: 'lenasituations' },
        { name: 'EnjoyPhoenix', username: 'enjoyphoenix' },
        { name: 'Léa Camilleri', username: 'leacamilleri' },
        { name: 'Coline', username: 'coline' },
        { name: 'Sananas', username: 'sananas' },
        { name: 'Justine Le Pottier', username: 'justinelepottier' },
        { name: 'Marie Lopez', username: 'marielopez' },
        { name: 'Léna Mahfouf', username: 'lenamahfouf' },
        { name: 'Emma', username: 'emma' },
        { name: 'Léonie', username: 'leonie' },
        { name: 'Mademoiselle', username: 'mademoiselle' },
        { name: 'Andy Raconte', username: 'andyraconte' },
        { name: 'Andy', username: 'andy' },
        { name: 'Michou', username: 'michou' },
        { name: 'Inoxtag', username: 'inoxtag' },
        { name: 'Locklear', username: 'locklear' },
        { name: 'Gotaga', username: 'gotaga' },
        { name: 'Mister MV', username: 'mistermv' },
        { name: 'Ponce', username: 'ponce' },
        { name: 'Baghera Jones', username: 'bagherajones' },
        { name: 'Etoiles', username: 'etoiles' },
        { name: 'Antoine Delak', username: 'antoinedelak' },
        { name: 'LeBouseuh', username: 'lebouseuh' },
        { name: 'Mynthos', username: 'mynthos' },
        { name: 'ZeratoR', username: 'zerator' },
        { name: 'Squeezie', username: 'squeezie' },
        { name: 'Cyprien', username: 'cyprien' },
        { name: 'Norman', username: 'norman' },
        { name: 'Natoo', username: 'natoo' },
        { name: 'Amixem', username: 'amixem' },
        { name: 'Mcfly et Carlito', username: 'mcflyetcarlito' },
        { name: 'Seb la Frite', username: 'seblafrite' },
        { name: 'Le Rire Jaune', username: 'lerirejaune' },
        { name: 'Antoine Daniel', username: 'antoinedaniel' },
        { name: 'Maxime Biaggi', username: 'maximebiaggi' },
        { name: 'Thomas Gauthier', username: 'thomasgauthier' },
        { name: 'DirtyBiology', username: 'dirtybiology' },
        { name: 'Nota Bene', username: 'notabene' },
        { name: 'Axolot', username: 'axolot' },
        { name: 'Le Grand JD', username: 'legrandjd' },
        { name: 'Doc Seven', username: 'docseven' },
        { name: 'Linguisticae', username: 'linguisticae' },
        { name: 'Micode', username: 'micode' },
        { name: 'Feldup', username: 'feldup' },
        { name: 'Alt 236', username: 'alt236' },
        { name: 'Le Fossoyeur de Films', username: 'lefossoyeurdefilms' },
        { name: 'Karim Debbache', username: 'karimdebbache' },
        { name: 'Le Biais Vert', username: 'lebiaisvert' },
        { name: 'Hygiène Mentale', username: 'hygienementale' },
        { name: 'Defakator', username: 'defakator' },
        { name: 'Science de Comptoir', username: 'sciencedecomptoir' },
        { name: 'Damon et Jo', username: 'damonetjo' },
        { name: 'Solange te parle', username: 'solangeteparle' },
        { name: 'Rémi Gaillard', username: 'remigaillard' },
        { name: 'Greg Guillotin', username: 'gregguillotin' },
        { name: 'Joueur du Grenier', username: 'joueurdugrenier' },
        { name: 'Golden Moustache', username: 'goldenmoustache' },
        { name: 'Studio Bagel', username: 'studiobagel' },
        { name: 'Mister V', username: 'misterv' }
    ],
    'Éduquer': [
        { name: 'DirtyBiology', username: 'dirtybiology' },
        { name: 'Nota Bene', username: 'notabene' },
        { name: 'Axolot', username: 'axolot' },
        { name: 'Le Grand JD', username: 'legrandjd' },
        { name: 'Doc Seven', username: 'docseven' },
        { name: 'Linguisticae', username: 'linguisticae' },
        { name: 'Micode', username: 'micode' },
        { name: 'Feldup', username: 'feldup' },
        { name: 'Alt 236', username: 'alt236' },
        { name: 'Le Fossoyeur de Films', username: 'lefossoyeurdefilms' },
        { name: 'Karim Debbache', username: 'karimdebbache' },
        { name: 'Le Biais Vert', username: 'lebiaisvert' },
        { name: 'Hygiène Mentale', username: 'hygienementale' },
        { name: 'Defakator', username: 'defakator' },
        { name: 'Science de Comptoir', username: 'sciencedecomptoir' },
        { name: 'Damon et Jo', username: 'damonetjo' },
        { name: 'Solange te parle', username: 'solangeteparle' },
        { name: 'Léna Situations', username: 'lenasituations' },
        { name: 'EnjoyPhoenix', username: 'enjoyphoenix' },
        { name: 'Léa Camilleri', username: 'leacamilleri' },
        { name: 'Coline', username: 'coline' },
        { name: 'Sananas', username: 'sananas' },
        { name: 'Justine Le Pottier', username: 'justinelepottier' },
        { name: 'Marie Lopez', username: 'marielopez' },
        { name: 'Léna Mahfouf', username: 'lenamahfouf' },
        { name: 'Emma', username: 'emma' },
        { name: 'Léonie', username: 'leonie' },
        { name: 'Mademoiselle', username: 'mademoiselle' },
        { name: 'Andy Raconte', username: 'andyraconte' },
        { name: 'Andy', username: 'andy' },
        { name: 'Michou', username: 'michou' },
        { name: 'Inoxtag', username: 'inoxtag' },
        { name: 'Locklear', username: 'locklear' },
        { name: 'Gotaga', username: 'gotaga' },
        { name: 'Mister MV', username: 'mistermv' },
        { name: 'Ponce', username: 'ponce' },
        { name: 'Baghera Jones', username: 'bagherajones' },
        { name: 'Etoiles', username: 'etoiles' },
        { name: 'Antoine Delak', username: 'antoinedelak' },
        { name: 'LeBouseuh', username: 'lebouseuh' },
        { name: 'Mynthos', username: 'mynthos' },
        { name: 'ZeratoR', username: 'zerator' },
        { name: 'Squeezie', username: 'squeezie' },
        { name: 'Cyprien', username: 'cyprien' },
        { name: 'Norman', username: 'norman' },
        { name: 'Natoo', username: 'natoo' },
        { name: 'Amixem', username: 'amixem' },
        { name: 'Mcfly et Carlito', username: 'mcflyetcarlito' },
        { name: 'Seb la Frite', username: 'seblafrite' },
        { name: 'Le Rire Jaune', username: 'lerirejaune' },
        { name: 'Antoine Daniel', username: 'antoinedaniel' },
        { name: 'Maxime Biaggi', username: 'maximebiaggi' },
        { name: 'Thomas Gauthier', username: 'thomasgauthier' },
        { name: 'DirtyBiology', username: 'dirtybiology' },
        { name: 'Nota Bene', username: 'notabene' },
        { name: 'Axolot', username: 'axolot' },
        { name: 'Le Grand JD', username: 'legrandjd' },
        { name: 'Doc Seven', username: 'docseven' },
        { name: 'Linguisticae', username: 'linguisticae' },
        { name: 'Micode', username: 'micode' },
        { name: 'Feldup', username: 'feldup' },
        { name: 'Alt 236', username: 'alt236' },
        { name: 'Le Fossoyeur de Films', username: 'lefossoyeurdefilms' },
        { name: 'Karim Debbache', username: 'karimdebbache' },
        { name: 'Le Biais Vert', username: 'lebiaisvert' },
        { name: 'Hygiène Mentale', username: 'hygienementale' },
        { name: 'Defakator', username: 'defakator' },
        { name: 'Science de Comptoir', username: 'sciencedecomptoir' },
        { name: 'Damon et Jo', username: 'damonetjo' },
        { name: 'Solange te parle', username: 'solangeteparle' },
        { name: 'Rémi Gaillard', username: 'remigaillard' },
        { name: 'Greg Guillotin', username: 'gregguillotin' },
        { name: 'Joueur du Grenier', username: 'joueurdugrenier' },
        { name: 'Golden Moustache', username: 'goldenmoustache' },
        { name: 'Studio Bagel', username: 'studiobagel' },
        { name: 'Mister V', username: 'misterv' },
        { name: 'Léna Situations', username: 'lenasituations' },
        { name: 'EnjoyPhoenix', username: 'enjoyphoenix' },
        { name: 'Léa Camilleri', username: 'leacamilleri' },
        { name: 'Coline', username: 'coline' },
        { name: 'Sananas', username: 'sananas' },
        { name: 'Justine Le Pottier', username: 'justinelepottier' },
        { name: 'Marie Lopez', username: 'marielopez' },
        { name: 'Léna Mahfouf', username: 'lenamahfouf' },
        { name: 'Emma', username: 'emma' },
        { name: 'Léonie', username: 'leonie' },
        { name: 'Mademoiselle', username: 'mademoiselle' },
        { name: 'Andy Raconte', username: 'andyraconte' },
        { name: 'Andy', username: 'andy' },
        { name: 'Michou', username: 'michou' },
        { name: 'Inoxtag', username: 'inoxtag' },
        { name: 'Locklear', username: 'locklear' },
        { name: 'Gotaga', username: 'gotaga' },
        { name: 'Mister MV', username: 'mistermv' },
        { name: 'Ponce', username: 'ponce' },
        { name: 'Baghera Jones', username: 'bagherajones' },
        { name: 'Etoiles', username: 'etoiles' },
        { name: 'Antoine Delak', username: 'antoinedelak' },
        { name: 'LeBouseuh', username: 'lebouseuh' },
        { name: 'Mynthos', username: 'mynthos' },
        { name: 'ZeratoR', username: 'zerator' },
        { name: 'Squeezie', username: 'squeezie' },
        { name: 'Cyprien', username: 'cyprien' },
        { name: 'Norman', username: 'norman' },
        { name: 'Natoo', username: 'natoo' },
        { name: 'Amixem', username: 'amixem' },
        { name: 'Mcfly et Carlito', username: 'mcflyetcarlito' },
        { name: 'Seb la Frite', username: 'seblafrite' },
        { name: 'Le Rire Jaune', username: 'lerirejaune' },
        { name: 'Antoine Daniel', username: 'antoinedaniel' },
        { name: 'Maxime Biaggi', username: 'maximebiaggi' },
        { name: 'Thomas Gauthier', username: 'thomasgauthier' }
    ],
    'Divertir': [
        { name: 'Squeezie', username: 'squeezie' },
        { name: 'Cyprien', username: 'cyprien' },
        { name: 'Norman', username: 'norman' },
        { name: 'Natoo', username: 'natoo' },
        { name: 'Amixem', username: 'amixem' },
        { name: 'Mcfly et Carlito', username: 'mcflyetcarlito' },
        { name: 'Seb la Frite', username: 'seblafrite' },
        { name: 'Le Rire Jaune', username: 'lerirejaune' },
        { name: 'Antoine Daniel', username: 'antoinedaniel' },
        { name: 'Maxime Biaggi', username: 'maximebiaggi' },
        { name: 'Thomas Gauthier', username: 'thomasgauthier' },
        { name: 'Michou', username: 'michou' },
        { name: 'Inoxtag', username: 'inoxtag' },
        { name: 'Locklear', username: 'locklear' },
        { name: 'Gotaga', username: 'gotaga' },
        { name: 'Mister MV', username: 'mistermv' },
        { name: 'Ponce', username: 'ponce' },
        { name: 'Baghera Jones', username: 'bagherajones' },
        { name: 'Etoiles', username: 'etoiles' },
        { name: 'Antoine Delak', username: 'antoinedelak' },
        { name: 'LeBouseuh', username: 'lebouseuh' },
        { name: 'Mynthos', username: 'mynthos' },
        { name: 'ZeratoR', username: 'zerator' },
        { name: 'Rémi Gaillard', username: 'remigaillard' },
        { name: 'Greg Guillotin', username: 'gregguillotin' },
        { name: 'Joueur du Grenier', username: 'joueurdugrenier' },
        { name: 'Golden Moustache', username: 'goldenmoustache' },
        { name: 'Studio Bagel', username: 'studiobagel' },
        { name: 'Mister V', username: 'misterv' },
        { name: 'Léna Situations', username: 'lenasituations' },
        { name: 'EnjoyPhoenix', username: 'enjoyphoenix' },
        { name: 'Léa Camilleri', username: 'leacamilleri' },
        { name: 'Coline', username: 'coline' },
        { name: 'Sananas', username: 'sananas' },
        { name: 'Justine Le Pottier', username: 'justinelepottier' },
        { name: 'Marie Lopez', username: 'marielopez' },
        { name: 'Léna Mahfouf', username: 'lenamahfouf' },
        { name: 'Emma', username: 'emma' },
        { name: 'Léonie', username: 'leonie' },
        { name: 'Mademoiselle', username: 'mademoiselle' },
        { name: 'Andy Raconte', username: 'andyraconte' },
        { name: 'Andy', username: 'andy' },
        { name: 'DirtyBiology', username: 'dirtybiology' },
        { name: 'Nota Bene', username: 'notabene' },
        { name: 'Axolot', username: 'axolot' },
        { name: 'Le Grand JD', username: 'legrandjd' },
        { name: 'Doc Seven', username: 'docseven' },
        { name: 'Linguisticae', username: 'linguisticae' },
        { name: 'Micode', username: 'micode' },
        { name: 'Feldup', username: 'feldup' },
        { name: 'Alt 236', username: 'alt236' },
        { name: 'Le Fossoyeur de Films', username: 'lefossoyeurdefilms' },
        { name: 'Karim Debbache', username: 'karimdebbache' },
        { name: 'Le Biais Vert', username: 'lebiaisvert' },
        { name: 'Hygiène Mentale', username: 'hygienementale' },
        { name: 'Defakator', username: 'defakator' },
        { name: 'Science de Comptoir', username: 'sciencedecomptoir' },
        { name: 'Damon et Jo', username: 'damonetjo' },
        { name: 'Solange te parle', username: 'solangeteparle' },
        { name: 'Squeezie', username: 'squeezie' },
        { name: 'Cyprien', username: 'cyprien' },
        { name: 'Norman', username: 'norman' },
        { name: 'Natoo', username: 'natoo' },
        { name: 'Amixem', username: 'amixem' },
        { name: 'Mcfly et Carlito', username: 'mcflyetcarlito' },
        { name: 'Seb la Frite', username: 'seblafrite' },
        { name: 'Le Rire Jaune', username: 'lerirejaune' },
        { name: 'Antoine Daniel', username: 'antoinedaniel' },
        { name: 'Maxime Biaggi', username: 'maximebiaggi' },
        { name: 'Thomas Gauthier', username: 'thomasgauthier' },
        { name: 'Michou', username: 'michou' },
        { name: 'Inoxtag', username: 'inoxtag' },
        { name: 'Locklear', username: 'locklear' },
        { name: 'Gotaga', username: 'gotaga' },
        { name: 'Mister MV', username: 'mistermv' },
        { name: 'Ponce', username: 'ponce' },
        { name: 'Baghera Jones', username: 'bagherajones' },
        { name: 'Etoiles', username: 'etoiles' },
        { name: 'Antoine Delak', username: 'antoinedelak' },
        { name: 'LeBouseuh', username: 'lebouseuh' },
        { name: 'Mynthos', username: 'mynthos' },
        { name: 'ZeratoR', username: 'zerator' },
        { name: 'Rémi Gaillard', username: 'remigaillard' },
        { name: 'Greg Guillotin', username: 'gregguillotin' },
        { name: 'Joueur du Grenier', username: 'joueurdugrenier' },
        { name: 'Golden Moustache', username: 'goldenmoustache' },
        { name: 'Studio Bagel', username: 'studiobagel' },
        { name: 'Mister V', username: 'misterv' },
        { name: 'Léna Situations', username: 'lenasituations' },
        { name: 'EnjoyPhoenix', username: 'enjoyphoenix' },
        { name: 'Léa Camilleri', username: 'leacamilleri' },
        { name: 'Coline', username: 'coline' },
        { name: 'Sananas', username: 'sananas' },
        { name: 'Justine Le Pottier', username: 'justinelepottier' },
        { name: 'Marie Lopez', username: 'marielopez' },
        { name: 'Léna Mahfouf', username: 'lenamahfouf' },
        { name: 'Emma', username: 'emma' },
        { name: 'Léonie', username: 'leonie' },
        { name: 'Mademoiselle', username: 'mademoiselle' },
        { name: 'Andy Raconte', username: 'andyraconte' },
        { name: 'Andy', username: 'andy' }
    ],
    'Promouvoir': [
        { name: 'Léna Situations', username: 'lenasituations' },
        { name: 'EnjoyPhoenix', username: 'enjoyphoenix' },
        { name: 'Léa Camilleri', username: 'leacamilleri' },
        { name: 'Coline', username: 'coline' },
        { name: 'Sananas', username: 'sananas' },
        { name: 'Justine Le Pottier', username: 'justinelepottier' },
        { name: 'Marie Lopez', username: 'marielopez' },
        { name: 'Léna Mahfouf', username: 'lenamahfouf' },
        { name: 'Emma', username: 'emma' },
        { name: 'Léonie', username: 'leonie' },
        { name: 'Mademoiselle', username: 'mademoiselle' },
        { name: 'Andy Raconte', username: 'andyraconte' },
        { name: 'Andy', username: 'andy' },
        { name: 'Squeezie', username: 'squeezie' },
        { name: 'Cyprien', username: 'cyprien' },
        { name: 'Norman', username: 'norman' },
        { name: 'Natoo', username: 'natoo' },
        { name: 'Amixem', username: 'amixem' },
        { name: 'Mcfly et Carlito', username: 'mcflyetcarlito' },
        { name: 'Seb la Frite', username: 'seblafrite' },
        { name: 'Le Rire Jaune', username: 'lerirejaune' },
        { name: 'Antoine Daniel', username: 'antoinedaniel' },
        { name: 'Maxime Biaggi', username: 'maximebiaggi' },
        { name: 'Thomas Gauthier', username: 'thomasgauthier' },
        { name: 'Michou', username: 'michou' },
        { name: 'Inoxtag', username: 'inoxtag' },
        { name: 'Locklear', username: 'locklear' },
        { name: 'Gotaga', username: 'gotaga' },
        { name: 'Mister MV', username: 'mistermv' },
        { name: 'Ponce', username: 'ponce' },
        { name: 'Baghera Jones', username: 'bagherajones' },
        { name: 'Etoiles', username: 'etoiles' },
        { name: 'Antoine Delak', username: 'antoinedelak' },
        { name: 'LeBouseuh', username: 'lebouseuh' },
        { name: 'Mynthos', username: 'mynthos' },
        { name: 'ZeratoR', username: 'zerator' },
        { name: 'DirtyBiology', username: 'dirtybiology' },
        { name: 'Nota Bene', username: 'notabene' },
        { name: 'Axolot', username: 'axolot' },
        { name: 'Le Grand JD', username: 'legrandjd' },
        { name: 'Doc Seven', username: 'docseven' },
        { name: 'Linguisticae', username: 'linguisticae' },
        { name: 'Micode', username: 'micode' },
        { name: 'Feldup', username: 'feldup' },
        { name: 'Alt 236', username: 'alt236' },
        { name: 'Le Fossoyeur de Films', username: 'lefossoyeurdefilms' },
        { name: 'Karim Debbache', username: 'karimdebbache' },
        { name: 'Le Biais Vert', username: 'lebiaisvert' },
        { name: 'Hygiène Mentale', username: 'hygienementale' },
        { name: 'Defakator', username: 'defakator' },
        { name: 'Science de Comptoir', username: 'sciencedecomptoir' },
        { name: 'Damon et Jo', username: 'damonetjo' },
        { name: 'Solange te parle', username: 'solangeteparle' },
        { name: 'Rémi Gaillard', username: 'remigaillard' },
        { name: 'Greg Guillotin', username: 'gregguillotin' },
        { name: 'Joueur du Grenier', username: 'joueurdugrenier' },
        { name: 'Golden Moustache', username: 'goldenmoustache' },
        { name: 'Studio Bagel', username: 'studiobagel' },
        { name: 'Mister V', username: 'misterv' },
        { name: 'Léna Situations', username: 'lenasituations' },
        { name: 'EnjoyPhoenix', username: 'enjoyphoenix' },
        { name: 'Léa Camilleri', username: 'leacamilleri' },
        { name: 'Coline', username: 'coline' },
        { name: 'Sananas', username: 'sananas' },
        { name: 'Justine Le Pottier', username: 'justinelepottier' },
        { name: 'Marie Lopez', username: 'marielopez' },
        { name: 'Léna Mahfouf', username: 'lenamahfouf' },
        { name: 'Emma', username: 'emma' },
        { name: 'Léonie', username: 'leonie' },
        { name: 'Mademoiselle', username: 'mademoiselle' },
        { name: 'Andy Raconte', username: 'andyraconte' },
        { name: 'Andy', username: 'andy' },
        { name: 'Squeezie', username: 'squeezie' },
        { name: 'Cyprien', username: 'cyprien' },
        { name: 'Norman', username: 'norman' },
        { name: 'Natoo', username: 'natoo' },
        { name: 'Amixem', username: 'amixem' },
        { name: 'Mcfly et Carlito', username: 'mcflyetcarlito' },
        { name: 'Seb la Frite', username: 'seblafrite' },
        { name: 'Le Rire Jaune', username: 'lerirejaune' },
        { name: 'Antoine Daniel', username: 'antoinedaniel' },
        { name: 'Maxime Biaggi', username: 'maximebiaggi' },
        { name: 'Thomas Gauthier', username: 'thomasgauthier' },
        { name: 'Michou', username: 'michou' },
        { name: 'Inoxtag', username: 'inoxtag' },
        { name: 'Locklear', username: 'locklear' },
        { name: 'Gotaga', username: 'gotaga' },
        { name: 'Mister MV', username: 'mistermv' },
        { name: 'Ponce', username: 'ponce' },
        { name: 'Baghera Jones', username: 'bagherajones' },
        { name: 'Etoiles', username: 'etoiles' },
        { name: 'Antoine Delak', username: 'antoinedelak' },
        { name: 'LeBouseuh', username: 'lebouseuh' },
        { name: 'Mynthos', username: 'mynthos' },
        { name: 'ZeratoR', username: 'zerator' },
        { name: 'DirtyBiology', username: 'dirtybiology' },
        { name: 'Nota Bene', username: 'notabene' },
        { name: 'Axolot', username: 'axolot' },
        { name: 'Le Grand JD', username: 'legrandjd' },
        { name: 'Doc Seven', username: 'docseven' },
        { name: 'Linguisticae', username: 'linguisticae' },
        { name: 'Micode', username: 'micode' },
        { name: 'Feldup', username: 'feldup' },
        { name: 'Alt 236', username: 'alt236' },
        { name: 'Le Fossoyeur de Films', username: 'lefossoyeurdefilms' },
        { name: 'Karim Debbache', username: 'karimdebbache' },
        { name: 'Le Biais Vert', username: 'lebiaisvert' },
        { name: 'Hygiène Mentale', username: 'hygienementale' },
        { name: 'Defakator', username: 'defakator' },
        { name: 'Science de Comptoir', username: 'sciencedecomptoir' },
        { name: 'Damon et Jo', username: 'damonetjo' },
        { name: 'Solange te parle', username: 'solangeteparle' },
        { name: 'Rémi Gaillard', username: 'remigaillard' },
        { name: 'Greg Guillotin', username: 'gregguillotin' },
        { name: 'Joueur du Grenier', username: 'joueurdugrenier' },
        { name: 'Golden Moustache', username: 'goldenmoustache' },
        { name: 'Studio Bagel', username: 'studiobagel' },
        { name: 'Mister V', username: 'misterv' }
    ],
    'Engager': [
        { name: 'Squeezie', username: 'squeezie' },
        { name: 'Cyprien', username: 'cyprien' },
        { name: 'Norman', username: 'norman' },
        { name: 'Natoo', username: 'natoo' },
        { name: 'Amixem', username: 'amixem' },
        { name: 'Mcfly et Carlito', username: 'mcflyetcarlito' },
        { name: 'Léna Situations', username: 'lenasituations' },
        { name: 'EnjoyPhoenix', username: 'enjoyphoenix' },
        { name: 'Seb la Frite', username: 'seblafrite' },
        { name: 'Le Rire Jaune', username: 'lerirejaune' },
        { name: 'Antoine Daniel', username: 'antoinedaniel' },
        { name: 'Maxime Biaggi', username: 'maximebiaggi' },
        { name: 'Thomas Gauthier', username: 'thomasgauthier' },
        { name: 'Michou', username: 'michou' },
        { name: 'Inoxtag', username: 'inoxtag' },
        { name: 'Locklear', username: 'locklear' },
        { name: 'Gotaga', username: 'gotaga' },
        { name: 'Mister MV', username: 'mistermv' },
        { name: 'Ponce', username: 'ponce' },
        { name: 'Baghera Jones', username: 'bagherajones' },
        { name: 'Etoiles', username: 'etoiles' },
        { name: 'Antoine Delak', username: 'antoinedelak' },
        { name: 'LeBouseuh', username: 'lebouseuh' },
        { name: 'Mynthos', username: 'mynthos' },
        { name: 'ZeratoR', username: 'zerator' },
        { name: 'Léa Camilleri', username: 'leacamilleri' },
        { name: 'Coline', username: 'coline' },
        { name: 'Sananas', username: 'sananas' },
        { name: 'Justine Le Pottier', username: 'justinelepottier' },
        { name: 'Marie Lopez', username: 'marielopez' },
        { name: 'Léna Mahfouf', username: 'lenamahfouf' },
        { name: 'Emma', username: 'emma' },
        { name: 'Léonie', username: 'leonie' },
        { name: 'Mademoiselle', username: 'mademoiselle' },
        { name: 'Andy Raconte', username: 'andyraconte' },
        { name: 'Andy', username: 'andy' },
        { name: 'DirtyBiology', username: 'dirtybiology' },
        { name: 'Nota Bene', username: 'notabene' },
        { name: 'Axolot', username: 'axolot' },
        { name: 'Le Grand JD', username: 'legrandjd' },
        { name: 'Doc Seven', username: 'docseven' },
        { name: 'Linguisticae', username: 'linguisticae' },
        { name: 'Micode', username: 'micode' },
        { name: 'Feldup', username: 'feldup' },
        { name: 'Alt 236', username: 'alt236' },
        { name: 'Le Fossoyeur de Films', username: 'lefossoyeurdefilms' },
        { name: 'Karim Debbache', username: 'karimdebbache' },
        { name: 'Le Biais Vert', username: 'lebiaisvert' },
        { name: 'Hygiène Mentale', username: 'hygienementale' },
        { name: 'Defakator', username: 'defakator' },
        { name: 'Science de Comptoir', username: 'sciencedecomptoir' },
        { name: 'Damon et Jo', username: 'damonetjo' },
        { name: 'Solange te parle', username: 'solangeteparle' },
        { name: 'Rémi Gaillard', username: 'remigaillard' },
        { name: 'Greg Guillotin', username: 'gregguillotin' },
        { name: 'Joueur du Grenier', username: 'joueurdugrenier' },
        { name: 'Golden Moustache', username: 'goldenmoustache' },
        { name: 'Studio Bagel', username: 'studiobagel' },
        { name: 'Mister V', username: 'misterv' },
        { name: 'Squeezie', username: 'squeezie' },
        { name: 'Cyprien', username: 'cyprien' },
        { name: 'Norman', username: 'norman' },
        { name: 'Natoo', username: 'natoo' },
        { name: 'Amixem', username: 'amixem' },
        { name: 'Mcfly et Carlito', username: 'mcflyetcarlito' },
        { name: 'Léna Situations', username: 'lenasituations' },
        { name: 'EnjoyPhoenix', username: 'enjoyphoenix' },
        { name: 'Seb la Frite', username: 'seblafrite' },
        { name: 'Le Rire Jaune', username: 'lerirejaune' },
        { name: 'Antoine Daniel', username: 'antoinedaniel' },
        { name: 'Maxime Biaggi', username: 'maximebiaggi' },
        { name: 'Thomas Gauthier', username: 'thomasgauthier' },
        { name: 'Michou', username: 'michou' },
        { name: 'Inoxtag', username: 'inoxtag' },
        { name: 'Locklear', username: 'locklear' },
        { name: 'Gotaga', username: 'gotaga' },
        { name: 'Mister MV', username: 'mistermv' },
        { name: 'Ponce', username: 'ponce' },
        { name: 'Baghera Jones', username: 'bagherajones' },
        { name: 'Etoiles', username: 'etoiles' },
        { name: 'Antoine Delak', username: 'antoinedelak' },
        { name: 'LeBouseuh', username: 'lebouseuh' },
        { name: 'Mynthos', username: 'mynthos' },
        { name: 'ZeratoR', username: 'zerator' },
        { name: 'Léa Camilleri', username: 'leacamilleri' },
        { name: 'Coline', username: 'coline' },
        { name: 'Sananas', username: 'sananas' },
        { name: 'Justine Le Pottier', username: 'justinelepottier' },
        { name: 'Marie Lopez', username: 'marielopez' },
        { name: 'Léna Mahfouf', username: 'lenamahfouf' },
        { name: 'Emma', username: 'emma' },
        { name: 'Léonie', username: 'leonie' },
        { name: 'Mademoiselle', username: 'mademoiselle' },
        { name: 'Andy Raconte', username: 'andyraconte' },
        { name: 'Andy', username: 'andy' },
        { name: 'DirtyBiology', username: 'dirtybiology' },
        { name: 'Nota Bene', username: 'notabene' },
        { name: 'Axolot', username: 'axolot' },
        { name: 'Le Grand JD', username: 'legrandjd' },
        { name: 'Doc Seven', username: 'docseven' },
        { name: 'Linguisticae', username: 'linguisticae' },
        { name: 'Micode', username: 'micode' },
        { name: 'Feldup', username: 'feldup' },
        { name: 'Alt 236', username: 'alt236' },
        { name: 'Le Fossoyeur de Films', username: 'lefossoyeurdefilms' },
        { name: 'Karim Debbache', username: 'karimdebbache' },
        { name: 'Le Biais Vert', username: 'lebiaisvert' },
        { name: 'Hygiène Mentale', username: 'hygienementale' },
        { name: 'Defakator', username: 'defakator' },
        { name: 'Science de Comptoir', username: 'sciencedecomptoir' },
        { name: 'Damon et Jo', username: 'damonetjo' },
        { name: 'Solange te parle', username: 'solangeteparle' },
        { name: 'Rémi Gaillard', username: 'remigaillard' },
        { name: 'Greg Guillotin', username: 'gregguillotin' },
        { name: 'Joueur du Grenier', username: 'joueurdugrenier' },
        { name: 'Golden Moustache', username: 'goldenmoustache' },
        { name: 'Studio Bagel', username: 'studiobagel' },
        { name: 'Mister V', username: 'misterv' }
    ]
};

async function main() {
    try {
        console.log('📝 Ajout de 100 TikTokers par thème\n');
        
        // Récupérer le réseau TikTok
        const { data: tiktokNetwork } = await supabase
            .from('social_networks')
            .select('id, name')
            .eq('name', 'tiktok')
            .single();
        
        if (!tiktokNetwork) {
            console.error('❌ Réseau TikTok introuvable');
            process.exit(1);
        }
        
        console.log(`✅ Réseau TikTok trouvé: ${tiktokNetwork.name} (ID: ${tiktokNetwork.id})\n`);
        
        // Récupérer les thèmes
        const { data: themes } = await supabase
            .from('themes')
            .select('id, name')
            .neq('name', 'Tout')
            .order('display_order');
        
        if (!themes || themes.length === 0) {
            console.error('❌ Aucun thème trouvé');
            process.exit(1);
        }
        
        console.log(`✅ ${themes.length} thème(s) trouvé(s)\n`);
        
        // Vérifier les créateurs existants
        const { data: existingCreators } = await supabase
            .from('creators')
            .select('id, name');
        
        // Créer un map pour retrouver rapidement les créateurs existants
        const creatorMap = new Map();
        existingCreators?.forEach(c => {
            creatorMap.set(c.name.toLowerCase(), c.id);
        });
        
        let totalAdded = 0;
        let totalSkipped = 0;
        let totalNetworksAdded = 0;
        
        // Parcourir chaque thème
        for (const theme of themes) {
            const themeName = theme.name;
            const creators = tiktokCreatorsByTheme[themeName];
            
            if (!creators || creators.length === 0) {
                console.log(`⚠️  Aucun créateur défini pour le thème "${themeName}"\n`);
                continue;
            }
            
            console.log(`\n🎨 Thème: ${themeName} (${creators.length} créateurs)\n`);
            
            let themeAdded = 0;
            let themeSkipped = 0;
            
            for (const creatorData of creators) {
                try {
                    let creatorId;
                    const creatorNameLower = creatorData.name.toLowerCase();
                    
                    // Vérifier si le créateur existe déjà
                    if (creatorMap.has(creatorNameLower)) {
                        creatorId = creatorMap.get(creatorNameLower);
                    } else {
                        // Créer le créateur
                        const { data: creator, error: creatorError } = await supabase
                            .from('creators')
                            .insert({
                                name: creatorData.name,
                                display_name: creatorData.name,
                                is_verified: false
                            })
                            .select('id')
                            .single();
                        
                        if (creatorError) {
                            if (creatorError.code === '23505') { // Duplicate key
                                themeSkipped++;
                                continue;
                            }
                            throw creatorError;
                        }
                        
                        creatorId = creator.id;
                        creatorMap.set(creatorNameLower, creatorId);
                        totalAdded++;
                        themeAdded++;
                    }
                    
                    // Vérifier si le réseau TikTok existe déjà pour ce créateur
                    const { data: existingNetwork } = await supabase
                        .from('creator_social_networks')
                        .select('id')
                        .eq('creator_id', creatorId)
                        .eq('social_network_id', tiktokNetwork.id)
                        .single();
                    
                    if (!existingNetwork) {
                        // Ajouter le réseau TikTok
                        const { error: networkError } = await supabase
                            .from('creator_social_networks')
                            .insert({
                                creator_id: creatorId,
                                social_network_id: tiktokNetwork.id,
                                username: creatorData.username,
                                profile_url: `https://tiktok.com/@${creatorData.username}`,
                                is_primary: false,
                                followers_count: 0
                            });
                        
                        if (networkError) {
                            console.error(`❌ Erreur réseau pour ${creatorData.name}:`, networkError.message);
                            themeSkipped++;
                        } else {
                            totalNetworksAdded++;
                        }
                    }
                    
                } catch (error) {
                    console.error(`❌ Erreur pour ${creatorData.name}:`, error.message);
                    themeSkipped++;
                }
            }
            
            console.log(`   ✅ ${themeAdded} créateur(s) ajouté(s), ${totalNetworksAdded} réseau(x) TikTok ajouté(s)`);
            totalSkipped += themeSkipped;
        }
        
        console.log(`\n✅ Résumé:`);
        console.log(`   - ${totalAdded} nouveau(x) créateur(s) ajouté(s)`);
        console.log(`   - ${totalNetworksAdded} réseau(x) TikTok ajouté(s)`);
        if (totalSkipped > 0) {
            console.log(`   ⚠️  ${totalSkipped} créateur(s) ignoré(s)`);
        }
        
        // Vérification finale
        const { data: finalCreators, count } = await supabase
            .from('creators')
            .select('id', { count: 'exact' });
        
        const { data: finalNetworks, count: networksCount } = await supabase
            .from('creator_social_networks')
            .select('id', { count: 'exact' })
            .eq('social_network_id', tiktokNetwork.id);
        
        console.log(`\n📊 Total:`);
        console.log(`   - Créateurs dans la base: ${count}`);
        console.log(`   - Réseaux TikTok: ${networksCount}\n`);
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

