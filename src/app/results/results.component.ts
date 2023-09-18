import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for HTTP requests
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: 'auto', // Initial height, adjust as per your design needs
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*', // Will take the full content height
        overflow: 'hidden'
      })),
      transition('collapsed <=> expanded', [
        animate('0.3s cubic-bezier(.68,-0.55,.27,1.55)') // Using a cubic bezier for smooth effect
      ])
    ])
  ]
})
export class ResultsComponent implements OnInit {

  titleLetters: string[] = Array.from('Semantic');
  searchQuery: any;
  isSearching: boolean = false;
  results: any = null;
  showResultsType = 'granted'; // or 'pregranted'
  grantedResults: any[] = [];
  pregrantedResults: any[] = [];
  
  showResults: boolean = false;
  queryValue: string = "";
  selectedDate: Date = new Date();

  isSubmitting: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;

  userId: any;

  savedPatents: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { data: any };

    if (state) {
      this.results = state;
      this.grantedResults = this.results.data['Granted results'].map((res: any) => ({ ...res, state: 'collapsed' }));
      this.grantedResults = this.results.data['Granted results'];
      this.pregrantedResults = this.results.data['Pregranted Results'];
      localStorage.setItem('grantedResults', JSON.stringify(this.grantedResults));
      localStorage.setItem('pregrantedResults', JSON.stringify(this.pregrantedResults));
    }
  }

  ngOnInit(): void {
    this.showResults = true;
    this.isSearching = false;
    if (localStorage.getItem('grantedResults')) {
      this.grantedResults = JSON.parse(localStorage.getItem('grantedResults') || '[]');
  }
  if (localStorage.getItem('pregrantedResults')) {
      this.pregrantedResults = JSON.parse(localStorage.getItem('pregrantedResults') || '[]');
  }
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;  // Here's the user ID!
      } else {
        this.userId = null;
      }
    });

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
          this.savedPatents = patents.map(patent => patent.key);
          console.log(this.savedPatents);
      });
      } else {
        this.userId = null;
        alert("Please Log in to use this page!")
      }
    });
  }
  
  changePage(page: number): void {
    this.currentPage = page;
  }

  getPages(): number[] {
    const totalResults = this.getDisplayResults().length;
    const totalPages = Math.ceil(totalResults / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  getDisplayedResults(): any[] {
    const currentResults = this.getDisplayResults();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    console.log("Start Index:", startIndex, "End Index:", endIndex);
    return currentResults.slice(startIndex, endIndex);
  }

  getDisplayResults() {
    return this.showResultsType === 'granted' ? this.grantedResults : this.pregrantedResults;
  }


  toggleResults() {
    this.showResultsType = this.showResultsType === 'granted' ? 'pregranted' : 'granted';
    this.currentPage = 1; // reset to the first page when toggling
  }
  togglePatent(patent: any) {
    patent.state = patent.state === 'expanded' ? 'collapsed' : 'expanded';
  }

  onSubmit() {
    if (!this.queryValue || this.queryValue.trim() === '') {
      // Maybe show a warning message here
      console.warn('Search is empty. No action taken.');
      return;  // Return here to exit the function early and not proceed with the query
    }
    this.isSubmitting = true;
    this.isSearching = true;
    console.log("submit", this.queryValue);
    // Close the results section immediately
    this.showResults = false;
    const formattedDate = this.selectedDate ? this.selectedDate.toISOString().split('T')[0] : null;

    const requestData = {
      input_idea: this.queryValue,
      user_input_date: formattedDate,
    };

    this.http.post('http://129.213.84.77:5000/search', requestData).subscribe(
      (response: any) => {
        console.log("API Response:", response);

        if (response) {
          if (response['Granted results']) {
            this.grantedResults = response['Granted results'].map((res: any) => ({ ...res, state: 'collapsed' }));
          }

          if (response['Pregranted Results']) {
            this.pregrantedResults = response['Pregranted Results'];
          }

          localStorage.setItem('grantedResults', JSON.stringify(this.grantedResults));
        localStorage.setItem('pregrantedResults', JSON.stringify(this.pregrantedResults));

          // Reopen the results section now that the data has been fetched and processed
          this.showResults = true;
          this.currentPage = 1;  // Reset the current page after getting new results
          this.isSubmitting = false;
          this.isSearching = false;
        }
      },
      (error) => {
        console.error('Error:', error);

        this.isSearching = false; // Handle error and reset isSearching flag
      }
    );
  }


  async savePatent(patent: any) {
    if (!this.userId) {
      console.error('No user logged in');
      return;
    }
  
    const patentId = patent.patent_id; // Assuming the patent object has an 'id' property
  
    const patentRef = this.db.database.ref(`saved_patents/${this.userId}/${patentId}`);
  
    patentRef.get().then((snapshot) => {
      if (snapshot.exists()) {
        alert('This patent has already been saved!');
      } else {
        patentRef.set(patent).then(() => {
          alert('Patent saved successfully!');
        }).catch((error) => {
          console.error('Error while saving the patent:', error);
          alert('An error occurred while saving the patent. Please try again.');
        });
      }
    }).catch((error) => {
      console.error('Error while checking the patent:', error);
      alert('An error occurred while checking the patent. Please try again.');
    });
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }


  isSaved(patent: any): boolean {
    return this.savedPatents.includes(patent.patent_id || patent.application_id);
  }

  routeSaved() {
    this.router.navigate(['/saved'], {
      state: { data: this.results }
    });
  }

  isSidebarOpen: boolean = false;
  displayGranted: boolean = false;
  displayPregranted: boolean = false;
  displayBoth: boolean = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  applyFilters() {
    // Implement your filtering logic here based on the selected filter options.
    // You can use the displayGranted, displayPregranted, and displayBoth variables.
    // Close the sidebar after applying filters if needed.
    console.log('Display Granted:', this.displayGranted);
    console.log('Display Pregranted:', this.displayPregranted);
    console.log('Display Both:', this.displayBoth);

    // Close the sidebar
    this.toggleSidebar();
  }


}

