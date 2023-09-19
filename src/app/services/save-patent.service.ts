import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class savePatentService {

  constructor(private db: AngularFireDatabase) {}

  // Save Patent
  async savePatent(userId: string, patent: any): Promise<void> {
    const patentId = patent.patent_id || patent.application_id;
    const patentRef = this.db.database.ref(`saved_patents/${userId}/${patentId}`);
    
    return patentRef.set(patent);
  }

  // Delete Specific Patent
  async deletePatent(userId: string, patentKey: string): Promise<void> {
    return this.db.object(`saved_patents/${userId}/${patentKey}`).remove();
  }

  // Clear All Saved Patents
  async clearSavedPatents(userId: string): Promise<void> {
    return this.db.list(`saved_patents/${userId}`).remove();
  }

  fetchSavedPatents(userId: string): Observable<any[]> {
    return this.db.list(`saved_patents/${userId}`).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.val() as { [key: string]: any };  // Type assertion here
        const key = a.key;
        return { key, ...data };
      }))
    );
  }
}