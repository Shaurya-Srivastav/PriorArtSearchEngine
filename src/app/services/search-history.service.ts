import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchHistoryService {
  private baseUrl = 'http://129.213.131.75:5000'; // Flask server URL

  constructor(private http: HttpClient) {}

  // Utility method to get the HTTP options
  private getHttpOptions() {
    const token = localStorage.getItem('token'); 
    console.log(token);
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  addSearchQuery(query: string, results: any[]): Observable<any> {
    const body = {
      query: query,
      results: results  // Send as a JSON object/array
    };

    return this.http.post(`${this.baseUrl}/save_search`, body, this.getHttpOptions());
}

fetchRecentSearches(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/get_search_history`, this.getHttpOptions());
}
  // Assuming you have an endpoint to delete a specific search history
  deleteSearchHistory(searchId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete_search/${searchId}`, this.getHttpOptions());
  }
}
