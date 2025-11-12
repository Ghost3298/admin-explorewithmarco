import { Injectable } from '@angular/core';
import { neon } from '@netlify/neon';


export interface Country {
  id: number;
  country_name: string;
  country_image: string;
  status: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private sql;

  constructor() {
    this.sql = neon();
  }

  async getAllCountries(): Promise<Country[]> {
    try {
      const [countries] = await this.sql`
        SELECT * FROM countries 
        ORDER BY created_at DESC
      `;
      return countries as Country[];
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }
}