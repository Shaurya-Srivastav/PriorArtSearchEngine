import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModalComponent } from '../modals/project-modal/project-modal.component'; // Import your modal component
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/compat/database'; // Import AngularFireDatabase
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.css']
})


export class SavedComponent implements OnInit{

  titleLetters: string[] = Array.from('Semantic');
  searchQuery: any;
  isSearching: boolean = true; 
  userId: any;
  public showResults: boolean = false;

  savedPatents: any[] = [];

  currentPage: number = 1;
  totalPages: any;
  paginatedResults: any[][] = [];
  applicationNumber: string = '';

  filteredPatents: any[] = [];

  searchedTerm: any;

  savedProjects: any[] = [];
  selectedProject: any;

  constructor(
    private projectService: ProjectService, 
    private dialog: MatDialog,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private cd: ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    // Load saved projects when the component initializes
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        console.log(this.userId);
        this.loadSavedProjects(this.userId);
      } else {
        this.userId = null;
        alert('Please Log in to use this page!');
      }
    });
    
  }

  // Open the project modal when the "Add Project" button is clicked
  openProjectModal() {
    const dialogRef = this.dialog.open(ProjectModalComponent, {
      width: '400px',
      data: {uid: this.userId, projectToEdit: false}, // Pass data if needed
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      // Check if the user saved the project in the modal
      if (result && result.saved) {
        this.loadSavedProjects(this.userId);
      }
    });
  }

  // Function to save the project to Firebase
  saveProject(projectDetails: { title: string, description: string }) {
    // Assuming you have the user's UID in userId
    this.projectService.createProject(this.userId, projectDetails).then((response) => {
      console.log('Project created:', response.key);
      // After creating the project, you can also load the updated project list
      this.loadSavedProjects(this.userId);
    });
  }

  // Function to load saved projects
  loadSavedProjects(userId: string) {
    console.log("hello")
    this.projectService.getProjects(userId).subscribe((projects) => {
      this.savedProjects = projects;
    });
  }

  // Function to delete a project
  deleteProject(userId: string, projectKey: string) {
    const confirm = window.confirm('Are you sure you want to delete?');
    if (confirm) {
      this.projectService.deleteProject(userId, projectKey).then(() => {
        // Reload the project list after deletion
        this.loadSavedProjects(this.userId);
        this.loadPatentsForProject(projectKey)
        this.cd.detectChanges();
        alert("succesfully deleted project")
      });
    }
  }

  loadPatentsForProject(projectKey: string) {
    console.log("hi")
    // Assuming you have a function in your service to get patents for a project
    this.projectService.getPatentsForProject(this.userId, projectKey).subscribe((patents) => {
      this.selectedProject = this.savedProjects.find((project) => project.key === projectKey);
      this.savedPatents = patents;
    });
  }

  removePatentFromProject(userId: string, projectId: string, patentKey: string): Promise<void> {
    console.log(patentKey)
    const confirm = window.confirm('Are you sure you want to delete?');
    if (confirm) {
      const patentRef = this.db.object(`projects/${userId}/${projectId}/patents/${patentKey}`);
      return patentRef.remove();
    }  else {
      return Promise.resolve();;
    }
  }

  clearPatentsForProject(userId: string, projectId: string) {
    const confirm = window.confirm('Are you sure you want to delete?');
    if (confirm) {
      const projectPatentsRef = this.db.list(`projects/${userId}/${projectId}/patents`);
      return projectPatentsRef.remove().then(() => {
        // Reload the list of patents for the selected project
        this.loadPatentsForProject(projectId);
        alert("sucessfully cleared")
      });
    } else {
      return 0;
    }
  }

  editProject(projectKey:any, project: any) {
    const dialogRef = this.dialog.open(ProjectModalComponent, {
      width: '400px',
      data: {
        title: project.title, description: project.description , uid: this.userId, projectKey: projectKey, projectToEdit: true
      },
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadSavedProjects(this.userId);
      this.loadPatentsForProject(projectKey)
      this.cd.detectChanges();
      
    });
  }

  
  
}