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
  private baseUrl = '/.netlify/functions';

  constructor(private http: HttpClient) {}

  async getAllCountries(): Promise<Country[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<Country[]>(`${this.baseUrl}/get-countries`)
      );
      return response;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }

  async addCountry(countryData: {country_name: string; country_image: File | null}): Promise<Country>{
    try {
      console.log('Sending country data:', countryData);
      
      // For now, let's send as JSON without the file to test
      const jsonData = {
        country_name: countryData.country_name,
        country_image: countryData.country_image ? countryData.country_image.name : ''
      };

      console.log('JSON data being sent:', jsonData);

      const response = await firstValueFrom(
        this.http.post<Country>(`${this.baseUrl}/add-country`, jsonData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
      return response;
    } catch (error) {
      console.error('Error adding country:', error);
      console.error('Error details:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        error: error.error
      });
      throw error;
    }
  }
}