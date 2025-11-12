import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
  private apiUrl = '/.netlify/functions/get-countries';

  constructor(private http: HttpClient) {}

  async getAllCountries(): Promise<Country[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<Country[]>(this.apiUrl)
      );
      return response;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }
}
