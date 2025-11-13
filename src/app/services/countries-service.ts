import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
      
      let imageUrl = '';
      
      // If there's a file, upload it first
      if (countryData.country_image) {
        imageUrl = await this.uploadImage(countryData.country_image);
      }

      const jsonData = {
        country_name: countryData.country_name,
        country_image: imageUrl
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
      
      if (error instanceof HttpErrorResponse) {
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error
        });
      } else {
        console.error('Unexpected error:', error);
      }
      
      throw error;
    }
  }

  private async uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e: any) => {
        try {
          // Convert file to base64
          const base64Image = e.target.result.split(',')[1];
          
          const uploadData = {
            image: base64Image,
            filename: this.generateUniqueFilename(file.name)
          };

          const response = await firstValueFrom(
            this.http.post<{success: boolean; imageUrl: string; filename: string}>(
              `${this.baseUrl}/upload-image`,
              uploadData,
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )
          );

          if (response.success) {
            resolve(response.imageUrl);
          } else {
            reject(new Error('Failed to upload image'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  private generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `country-${timestamp}-${randomString}.${extension}`;
  }
}