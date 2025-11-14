// countries-service.ts - Simplified version
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Country {
  id: number;
  country_name: string;
  country_image: string; // This will be base64 string
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
      
      let imageBase64 = '';
      
      // If there's a file, convert it to base64
      if (countryData.country_image) {
        imageBase64 = await this.fileToBase64(countryData.country_image);
        console.log('Image converted to base64, length:', imageBase64.length);
      }

      const jsonData = {
        country_name: countryData.country_name,
        country_image: imageBase64
      };

      console.log('Sending data to add-country function');
      const response = await firstValueFrom(
        this.http.post<Country>(`${this.baseUrl}/test-add-country`,{
          name: countryData.country_name,
          image: imageBase64
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
      return response;
    } catch (error) {
      console.error('Error adding country:', error);
      throw error;
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        resolve(e.target.result);
      };
      
      reader.onerror = (error) => {
        reject(new Error('Failed to read file: ' + error));
      };
      
      reader.readAsDataURL(file);
    });
  }
}