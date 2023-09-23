import { Component, EventEmitter, Output, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService  } from 'src/app/services/project.service';
@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.css']
})
export class ProjectModalComponent {
  projectTitle: string = '';
  projectDescription: string = '';

  @Output() projectSaved = new EventEmitter<{ title: string, description: string }>();

  // Inject MatDialogRef for closing the dialog
  constructor(
    public dialogRef: MatDialogRef<ProjectModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService
    ) {}

    ngOnInit() {
      if (this.data) {
        this.projectTitle = this.data.title;
        this.projectDescription = this.data.description;
      }
    }

    
    saveProject() {
      if (this.projectTitle.trim() !== '' && this.projectDescription.trim() !== '') {
        if (this.data && this.data.projectToEdit) { // Check if in edit mode
          this.projectService.updateProject(this.data.uid, this.data.projectKey, { title: this.projectTitle, description: this.projectDescription });
        } else { // If not in edit mode, create a new project
          this.projectService.createProject(this.data.uid, { title: this.projectTitle, description: this.projectDescription });
        }
        this.closeModal();
      }
    }

  closeModal() {
    // Close the modal using MatDialogRef
    this.dialogRef.close();
  }
}