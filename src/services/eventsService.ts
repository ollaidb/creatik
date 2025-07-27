interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'holiday' | 'birthday' | 'anniversary' | 'cultural' | 'business';
  country?: string;
  hashtags: string[];
  category: string;
}

class EventsService {
  // Wikipedia Events (déjà intégré)
  async getWikipediaEvents(date: string): Promise<Event[]> {
    try {
      const events = await fetch(`https://fr.wikipedia.org/api/rest_v1/feed/onthisday/all/${date}`);
      const data = await events.json();
      
      return data.events?.map((event: any) => ({
        id: `wiki_${event.year}_${event.text}`,
        title: event.text,
        description: `Événement historique de ${event.year}`,
        date: date,
        type: 'anniversary' as const,
        hashtags: this.generateHashtags(event.text),
        category: this.categorizeEvent(event.text)
      })) || [];
    } catch (error) {
      console.error('Erreur Wikipedia API:', error);
      return [];
    }
  }

  // Calendrier français (simulation)
  async getFrenchHolidays(year: number): Promise<Event[]> {
    const holidays = [
      {
        id: 'new_year',
        title: 'Nouvel An',
        description: 'Célébration du début de l\'année',
        date: `${year}-01-01`,
        type: 'holiday' as const,
        country: 'FR',
        hashtags: ['#NouvelAn', '#2024', '#Celebration'],
        category: 'celebration'
      },
      {
        id: 'bastille_day',
        title: 'Fête Nationale',
        description: '14 juillet - Prise de la Bastille',
        date: `${year}-07-14`,
        type: 'holiday' as const,
        country: 'FR',
        hashtags: ['#14Juillet', '#FeteNationale', '#France'],
        category: 'patriotism'
      }
    ];
    
    return holidays;
  }

  // Anniversaires célèbres (simulation)
  async getCelebrityBirthdays(date: string): Promise<Event[]> {
    const celebrities = [
      {
        id: 'celeb_1',
        title: 'Anniversaire de [Nom Célèbre]',
        description: 'Célébrité française',
        date: date,
        type: 'birthday' as const,
        hashtags: ['#Anniversaire', '#Celebrite', '#France'],
        category: 'entertainment'
      }
    ];
    
    return celebrities;
  }

  // Génération de hashtags
  private generateHashtags(text: string): string[] {
    const words = text.split(' ').filter(word => word.length > 3);
    return words.slice(0, 3).map(word => `#${word.replace(/[^a-zA-Z]/g, '')}`);
  }

  // Catégorisation des événements
  private categorizeEvent(text: string): string {
    const categories = {
      politics: ['politique', 'gouvernement', 'élection', 'président'],
      culture: ['art', 'musique', 'cinéma', 'littérature'],
      science: ['science', 'découverte', 'invention', 'technologie'],
      sports: ['sport', 'olympique', 'championnat', 'match']
    };

    const lowerText = text.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return category;
      }
    }
    return 'general';
  }

  // Service principal - Tous les événements du jour
  async getTodayEvents(): Promise<Event[]> {
    const today = new Date();
    const dateString = `${today.getMonth() + 1}/${today.getDate()}`;
    const year = today.getFullYear();

    const [wikiEvents, holidays, birthdays] = await Promise.all([
      this.getWikipediaEvents(dateString),
      this.getFrenchHolidays(year),
      this.getCelebrityBirthdays(today.toISOString().split('T')[0])
    ]);

    // Filtrer les événements d'aujourd'hui
    const todayEvents = [...wikiEvents, ...holidays, ...birthdays].filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === today.getDate() && 
             eventDate.getMonth() === today.getMonth();
    });

    return todayEvents.sort((a, b) => a.title.localeCompare(b.title));
  }
}

export const eventsService = new EventsService(); 