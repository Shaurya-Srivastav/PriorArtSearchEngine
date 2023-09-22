import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';

export interface Project {
  title: string;
  description: string;
  // Add any other properties you have in your project data
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

  addPatentToProject(userId: string, projectId: string, patent: any) {
    return this.db.list(`projects/${userId}/${projectId}/patents`).push(patent);
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
