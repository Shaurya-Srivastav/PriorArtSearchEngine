import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchHistoryService {
  userId: string | null = null;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  addSearchQuery(query: string, grantedResults: any[], pregrantedResults: any[]): Promise<void> {
    if (!this.userId) return Promise.reject("User not authenticated.");

    const timestamp = new Date().toISOString();
    const searchItem = {
        query,
        timestamp,
        results: {
            granted: grantedResults,
            pregranted: pregrantedResults
        }
    };

    return this.db.list(`recentSearches/${this.userId}`).push(searchItem).then();
}

  fetchRecentSearches(userId: any) {
    return this.db.list(`recentSearches/${userId}`, ref => ref.orderByChild('timestamp').limitToLast(10)).snapshotChanges().pipe(
      map(actions => {
        let searches = actions.map(a => {
          const data = a.payload.val();
          const key = a.key;
          if (typeof data === 'object' && data !== null) {
            return { key, ...data };
          } else {
            return { key };
          }
        });
        // reverse the array to make it descending
        return searches.reverse();
      })
    );
  }

  deleteSearchHistory(userId: string, searchKey: string): Promise<void> {
    return this.db.object(`recentSearches/${userId}/${searchKey}`).remove();
}
}