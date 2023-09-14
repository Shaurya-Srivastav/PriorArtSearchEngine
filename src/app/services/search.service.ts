import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchResults = new BehaviorSubject<any[]>([]);
  
  setSearchResults(data: any[]): void {
    this.searchResults.next(data);
  }
  
  getSearchResults(): Observable<any[]> {
    return this.searchResults.asObservable();
  }
}