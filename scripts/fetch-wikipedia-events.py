#!/usr/bin/env python3
"""
Script pour récupérer les événements historiques depuis Wikipedia
et les insérer dans la base de données Supabase
"""

import requests
import json
import psycopg2
from datetime import datetime, date
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration Supabase
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
DATABASE_URL = os.getenv('DATABASE_URL')

def get_wikipedia_events(month, day):
    """Récupère les événements du jour depuis Wikipedia"""
    url = f"https://fr.wikipedia.org/api/rest_v1/feed/onthisday/all/{month:02d}/{day:02d}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        events = []
        for event in data.get('events', []):
            events.append({
                'year': event.get('year'),
                'text': event.get('text'),
                'pages': event.get('pages', [])
            })
        
        return events
    except Exception as e:
        print(f"Erreur lors de la récupération des événements: {e}")
        return []

def insert_event_to_db(event_data, month, day):
    """Insère un événement dans la base de données"""
    try:
        # Connexion à la base de données
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        # Préparer les données
        event_date = date(2024, month, day)  # Année actuelle pour l'exemple
        title = event_data['text'][:255]  # Limiter à 255 caractères
        description = event_data['text']
        
        # Insérer l'événement
        cursor.execute("""
            INSERT INTO daily_events (event_type, title, description, date, year, category, is_active)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING
        """, ('evenement', title, description, event_date, event_data['year'], 'Événements historiques', True))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print(f"✅ Événement inséré: {title[:50]}...")
        
    except Exception as e:
        print(f"❌ Erreur lors de l'insertion: {e}")

def main():
    """Fonction principale"""
    print("🚀 Début de la récupération des événements Wikipedia...")
    
    # Récupérer les événements pour chaque jour de l'année
    for month in range(1, 13):
        for day in range(1, 32):
            try:
                events = get_wikipedia_events(month, day)
                
                for event in events:
                    insert_event_to_db(event, month, day)
                
                print(f"📅 Traité: {month:02d}/{day:02d} - {len(events)} événements")
                
            except Exception as e:
                print(f"❌ Erreur pour {month:02d}/{day:02d}: {e}")
                continue
    
    print("✅ Récupération terminée!")

if __name__ == "__main__":
    main() 