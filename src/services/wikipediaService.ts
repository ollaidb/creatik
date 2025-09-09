interface WikipediaEvent {
  year: number;
  text: string;
  type: 'birthday' | 'death' | 'historical_event' | 'holiday' | 'international_day';
  person_name?: string;
  profession?: string;
  description?: string;
  wikipedia_url?: string;
}

interface WikipediaResponse {
  query: {
    pages: {
      [pageId: string]: {
        title: string;
        extract: string;
        fullurl: string;
      };
    };
  };
}

class WikipediaService {
  private baseUrl = 'https://fr.wikipedia.org/api/rest_v1';
  private searchUrl = 'https://fr.wikipedia.org/w/api.php';

  /**
   * Récupère les événements du jour depuis Wikipédia
   */
  async getTodayEvents(): Promise<WikipediaEvent[]> {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    
    try {
      // Recherche des événements du jour
      const searchQuery = `${day} ${this.getMonthName(month)}`;
      const events = await this.searchEvents(searchQuery);
      
      return events;
    } catch (error) {
      console.error('Erreur lors de la récupération des événements Wikipédia:', error);
      return [];
    }
  }

  /**
   * Recherche des événements par date
   */
  async searchEvents(dateQuery: string): Promise<WikipediaEvent[]> {
    try {
      const response = await fetch(`${this.searchUrl}?action=query&format=json&list=search&srsearch=${encodeURIComponent(dateQuery)}&srlimit=10&origin=*`);
      const data = await response.json();
      
      if (!data.query?.search) {
        return [];
      }

      const events: WikipediaEvent[] = [];
      
      for (const result of data.query.search) {
        const event = this.parseWikipediaEvent(result.title, result.snippet);
        if (event) {
          events.push(event);
        }
      }

      return events;
    } catch (error) {
      console.error('Erreur lors de la recherche Wikipédia:', error);
      return [];
    }
  }

  /**
   * Parse un événement depuis le titre et l'extrait Wikipédia
   */
  private parseWikipediaEvent(title: string, snippet: string): WikipediaEvent | null {
    // Patterns pour détecter les types d'événements
    const birthdayPattern = /(naissance|né|née|birthday|anniversaire)/i;
    const deathPattern = /(décès|mort|mort\(e\)|death)/i;
    const historicalPattern = /(événement|événement historique|historical event)/i;
    const holidayPattern = /(fête|férié|holiday|jour férié)/i;
    const internationalPattern = /(journée internationale|international day)/i;

    let type: WikipediaEvent['type'] = 'historical_event';
    
    if (birthdayPattern.test(title) || birthdayPattern.test(snippet)) {
      type = 'birthday';
    } else if (deathPattern.test(title) || deathPattern.test(snippet)) {
      type = 'death';
    } else if (holidayPattern.test(title) || holidayPattern.test(snippet)) {
      type = 'holiday';
    } else if (internationalPattern.test(title) || internationalPattern.test(snippet)) {
      type = 'international_day';
    }

    // Extraire l'année si présente
    const yearMatch = title.match(/(\d{4})/);
    const year = yearMatch ? parseInt(yearMatch[1]) : undefined;

    // Extraire le nom de la personne pour les naissances/décès
    let person_name: string | undefined;
    let profession: string | undefined;

    if (type === 'birthday' || type === 'death') {
      // Essayer d'extraire le nom de la personne
      const nameMatch = title.match(/^(.+?)(?:\s*\(|$)/);
      if (nameMatch) {
        person_name = nameMatch[1].trim();
      }

      // Essayer d'extraire la profession
      const professionMatch = snippet.match(/(?:est un|était un|est une|était une)\s+([^,.]+)/i);
      if (professionMatch) {
        profession = professionMatch[1].trim();
      }
    }

    return {
      year,
      text: title,
      type,
      person_name,
      profession,
      description: snippet.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
    };
  }

  /**
   * Récupère les détails complets d'un événement
   */
  async getEventDetails(title: string): Promise<{ description: string; url: string } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/page/summary/${encodeURIComponent(title)}`);
      const data: WikipediaResponse = await response.json();
      
      if (data.query?.pages) {
        const pageId = Object.keys(data.query.pages)[0];
        const page = data.query.pages[pageId];
        
        return {
          description: page.extract,
          url: page.fullurl
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      return null;
    }
  }

  /**
   * Récupère les événements pour une date spécifique
   */
  async getEventsForDate(date: Date): Promise<WikipediaEvent[]> {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const searchQuery = `${day} ${this.getMonthName(month)}`;
    
    return this.searchEvents(searchQuery);
  }

  /**
   * Convertit le numéro du mois en nom français
   */
  private getMonthName(month: number): string {
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    return months[month - 1];
  }

  /**
   * Récupère les événements populaires du jour
   */
  async getPopularEvents(): Promise<WikipediaEvent[]> {
    const today = new Date();
    const events = await this.getTodayEvents();
    
    // Filtrer les événements les plus pertinents
    return events.filter(event => 
      event.year && 
      (event.type === 'birthday' || event.type === 'death' || event.type === 'historical_event')
    ).slice(0, 10);
  }
}

export default new WikipediaService();
export type { WikipediaEvent }; 