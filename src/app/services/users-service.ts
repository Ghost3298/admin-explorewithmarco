import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';


export interface User{
  id: number,
  username: string,
  password: string,
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  status: boolean,
  show_on_website: boolean,
  role: string,
  image: string,
  created_at: string
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = '/.netlify/functions';

  constructor(private http: HttpClient){}

  async getAllUsers():Promise<User[]>{
    try{
      const response = await firstValueFrom(
        this.http.get<User[]>(`${this.baseUrl}/get-users`)
      );
      return response;
    } catch (err){
      console.log('Error fetching users: ', err);
      throw err;
    }
  }

  async addUser(){}

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

  async updateUser(){}

}
