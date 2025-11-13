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
      const formData = new FormData();
      formData.append('country_name', countryData.country_name);
      
      if (countryData.country_image) {
        formData.append('country_image', countryData.country_image);
      }

      const response = await firstValueFrom(
        this.http.post<Country>(`${this.baseUrl}/add-country`, formData)
      );
      return response;
    } catch (error) {
      console.error('Error adding country:', error);
      throw error;
    }
  }

  // Optional: Add method to upload image separately if needed
  async uploadCountryImage(file: File): Promise<{url: string}> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await firstValueFrom(
      this.http.post<{url: string}>(`${this.baseUrl}/upload-country-image`, formData)
    );
    return response;
  }
}