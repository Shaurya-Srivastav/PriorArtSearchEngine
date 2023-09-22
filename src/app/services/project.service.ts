import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';
import { take } from 'rxjs/operators';
export interface Project {
  title: string;
  description: string;
  // Add any other properties you have in your project data
}
interface Patent {
  patentNumber: string,
  title: string,
  abstract: string,
  summary: string,
  claims: string,
  projectId: string,
  // ... other fields of your patent object
}
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  
  constructor(private db: AngularFireDatabase) {}

  createProject(userId: string, project: { title: string, description: string }) {
    return this.db.list(`projects/${userId}`).push(project);
  }

  getProjects(userId: string) {
    return this.db.list(`projects/${userId}`).snapshotChanges().pipe(
      map(actions => {
        let projects = actions.map(a => {
          const data = a.payload.val();
          const key = a.key; // Use a.key to access the object's key
          if (typeof data === 'object' && data !== null) {
            return { key, ...data };
          } else {
            return { key };
          }
        });
        return projects;
      })
    );
  }

  deleteProject(userId: string, projectKey: string) {
    return this.db.object(`projects/${userId}/${projectKey}`).remove();
  }

  addPatentToProject(userId: string, projectId: string, patent: any): Promise<void> {
    const patentsRef = this.db.list(`projects/${userId}/${projectId}/patents`);
    return new Promise((resolve, reject) => {
        patentsRef.snapshotChanges().pipe(
            take(1)
        ).subscribe(patents => {
            // Check if patent already exists
            console.log(patents)
            const existingPatent = patents.find(p => {
                let data = p.payload.val() as Patent;
                // Adjust the condition to match your data structure by comparing patent_id
                return data.patentNumber === patent.patentNumber;
            });
            console.log(existingPatent)
            if (existingPatent) {
              // If patent already exists, reject promise
              alert("Patent already exists in project.")
              reject(new Error('Patent already exists in project.'));
          } else {
              // If patent doesn't exist, add it to the project
              patentsRef.push(patent).then(ref => {
                  // Do something with the ref if necessary, or just resolve the promise
                  resolve();
              }).catch(reject);
          }
        });
    });
}


  getPatentsForProject(userId: string, projectKey: string) {
    return this.db.list(`projects/${userId}/${projectKey}/patents`).snapshotChanges().pipe(
      map(actions => {
        let patents = actions.map(a => {
          const data = a.payload.val();
          const key = a.key; // Use a.key to access the object's key
          if (typeof data === 'object' && data !== null) {
            return { key, ...data };
          } else {
            return { key };
          }
        });
        return patents;
      })
    )
  }

  removePatentFromProject(userId: string, projectId: string, patentId: string): Promise<void> {
    const projectPatentsRef = this.db.list(`projects/${userId}/${projectId}/patents`);
    return projectPatentsRef.remove(patentId);
  }

  updateProject(userId: string, projectKey: string, updatedProject: Project) {
    return this.db.object(`projects/${userId}/${projectKey}`).update(updatedProject);
  }
}
