import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = 'http://35.162.99.219:5000/search'; // Your Flask API endpoint

  constructor(private http: HttpClient) { }

  search(query: string, date: string) {
    const body = {
      input_idea: query,
      user_input_date: date
    };
    return this.http.post(this.apiUrl, body);
  }
  
  
}