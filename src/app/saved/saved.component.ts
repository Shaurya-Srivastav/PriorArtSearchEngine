import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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

  
  constructor(
    private route: ActivatedRoute, 
    private cdr: ChangeDetectorRef, 
    private http: HttpClient,
    private router: Router,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    ) { }

    ngOnInit(): void {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userId = user.uid;
          console.log(this.userId)
          this.searchQuery = this.route.snapshot.queryParamMap.get('query') || '';
    
          // Fetch saved patents
          this.db.list(`saved_patents/${this.userId}`).snapshotChanges().pipe(
            map(actions => actions.map(a => {
              const data = a.payload.val();
              const key = a.key;
              if (typeof data === 'object' && data !== null) {
                return { key, ...data };
              } else {
                // Handle this case as you see fit. For now, just returning key.
                return { key };
              }
            }))
          ).subscribe(patents => {
            console.log(patents)
            this.savedPatents = patents;
          });
        } else {
          this.userId = null;
          alert("Please Log in to use this page!")
        }
      });
  }

  deletePatent(patentKey: string): void {
    if (this.userId && patentKey) {
      this.db.object(`saved_patents/${this.userId}/${patentKey}`).remove()
        .then(() => {
          // Successfully deleted
          alert('Patent removed successfully.');
          // Optionally, you could filter out the deleted patent from this.savedPatents to immediately reflect the change in the UI
          this.savedPatents = this.savedPatents.filter(patent => patent.key !== patentKey);
        })
        .catch(error => {
          console.error('Error removing patent: ', error);
          alert('An error occurred while trying to remove the patent. Please try again.');
        });
    }
  }

  animateLogo(): void {
    const letters = document.querySelectorAll('.letter');
    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add('animate');
      }, 70 * index);
    });
  }

  toggleResults() {
    this.showResults = !this.showResults;
  }

  clearSavedPatents(): void {
    if (this.userId) {
      // Confirm with the user before deleting all saved patents
      const confirmation = window.confirm("Are you sure you want to clear all saved patents?");
      if (confirmation) {
        // Delete saved patents for the user from the database
        this.db.list(`saved_patents/${this.userId}`).remove().then(() => {
          // Once the patents are removed from the database, update the local state
          this.savedPatents = [];
          alert('Saved patents cleared successfully!');
        }).catch(error => {
          console.error('Error clearing saved patents:', error);
        });
      }
    }
  }

  
}
