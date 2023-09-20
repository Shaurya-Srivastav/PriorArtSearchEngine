import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for HTTP requests
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { SearchHistoryService } from '../services/search-history.service';
import { savePatentService } from '../services/save-patent.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  animations: [
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          height: 'auto', // Initial height, adjust as per your design needs
          overflow: 'visible', // change from 'hidden' to 'visible'
        })
      ),
      state(
        'expanded',
        style({
          height: '*', // Will take the full content height
          overflow: 'visible', // change from 'hidden' to 'visible'
        })
      ),
      transition('collapsed <=> expanded', [
        animate('0.3s cubic-bezier(.68,-0.55,.27,1.55)'), // Using a cubic bezier for smooth effect
      ]),
    ]),
  ],
})
export class ResultsComponent implements OnInit {
  titleLetters: string[] = Array.from('Semantic');
  searchQuery: any;
  isSearching: boolean = false;
  results: any = null;
  showResultsType = 'granted'; // or 'pregranted'
  grantedResults: any[] = [];
  pregrantedResults: any[] = [];
  combinedResults: any[] = [];
  showResults: boolean = false;
  queryValue: string = '';
  selectedDate: Date = new Date();

  isSubmitting: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;

  minDist: number = Infinity;
  maxDist: number = 0;

  userId: any;

  savedPatents: any[] = [];
  recentSearches: any[] = [];

  title: string = 'Granted Patents';

  isSidebarOpen: boolean = false;
  displayGranted: boolean = true;
  displayPregranted: boolean = false;
  displayBoth: boolean = false;
  saveSearchQuery: boolean = true;
  activeSearch: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private searchHistoryService: SearchHistoryService,
    private savePatentService: savePatentService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { data: any };
    if (state) {
      this.results = state;
      this.queryValue = this.results.query;
      this.grantedResults = this.results.data['Granted results'].map(
        (res: any) => ({ ...res, state: 'collapsed' })
      );
      this.grantedResults = this.results.data['Granted results'];
      this.pregrantedResults = this.results.data['Pregranted Results'];
      this.grantedResults.sort((a, b) => a.similarity - b.similarity); // Added sorting
      this.pregrantedResults.sort((a, b) => a.similarity - b.similarity); // Added sorting
      this.searchHistoryService.addSearchQuery(this.queryValue, this.grantedResults, this.pregrantedResults);
      this.updateDistanceBounds();
      localStorage.setItem(
        'grantedResults',
        JSON.stringify(this.grantedResults)
      );
      localStorage.setItem(
        'pregrantedResults',
        JSON.stringify(this.pregrantedResults)
      );
    }
    console.log('granted results', this.grantedResults);
  }

  ngOnInit(): void {
    this.showResults = true;
    this.isSearching = false;

    if (localStorage.getItem('grantedResults')) {
      this.grantedResults = JSON.parse(
        localStorage.getItem('grantedResults') || '[]'
      );
    }
    if (localStorage.getItem('pregrantedResults')) {
      this.pregrantedResults = JSON.parse(
        localStorage.getItem('pregrantedResults') || '[]'
      );
    }
    this.updateDistanceBounds();
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid; // Here's the user ID!
      } else {
        this.userId = null;
      }
    });
    

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        console.log(this.userId);
        this.searchQuery = this.route.snapshot.queryParamMap.get('query') || '';

        this.savePatentService.fetchSavedPatents(this.userId).subscribe(patents => {
          this.savedPatents = patents;
        });
        this.searchHistoryService.fetchRecentSearches(this.userId).subscribe(searches => {
          this.recentSearches = searches;
          console.log(this.recentSearches)
        });
      } else {
        this.userId = null;
        alert('Please Log in to use this page!');
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
    return currentResults.slice(startIndex, endIndex);
  }

  getDisplayResults() {
    if (this.displayBoth) {
      return [...this.grantedResults, ...this.pregrantedResults];
    } else if (this.displayGranted) {
      return this.grantedResults;
    } else if (this.displayPregranted) {
      return this.pregrantedResults;
    } else {
      return []; // No results if no filters are selected.
    }
  }

  toggleResults() {
    this.showResultsType =
      this.showResultsType === 'granted' ? 'pregranted' : 'granted';
    this.currentPage = 1; // reset to the first page when toggling
  }
  togglePatent(patent: any) {
    patent.state = patent.state === 'expanded' ? 'collapsed' : 'expanded';
  }

  onSubmit() {
    if (!this.queryValue || this.queryValue.trim() === '') {
      // Maybe show a warning message here
      console.warn('Search is empty. No action taken.');
      return; // Return here to exit the function early and not proceed with the query
    }
    this.isSubmitting = true;
    this.isSearching = true;
    this.showResults = false;
    console.log('submit', this.queryValue);
    
    const formattedDate = this.selectedDate
      ? this.selectedDate.toISOString().split('T')[0]
      : null;

    const requestData = {
      input_idea: this.queryValue,
      user_input_date: formattedDate,
    };

    this.http.post('http://129.213.84.77:5000/search', requestData).subscribe(
      (response: any) => {
        console.log('API Response:', response);

        if (response) {
          if (response['Granted results']) {
            this.grantedResults = response['Granted results'].map(
              (res: any) => ({ ...res, state: 'collapsed' })
            );
          }

          if (response['Pregranted Results']) {
            this.pregrantedResults = response['Pregranted Results'];
          }
          this.activeSearch = this.queryValue; 
          console.log("save query", this.saveSearchQuery)
          if (this.saveSearchQuery == true) {
            this.searchHistoryService.addSearchQuery(this.queryValue, this.grantedResults, this.pregrantedResults);
          }
          localStorage.setItem(
            'grantedResults',
            JSON.stringify(this.grantedResults)
          );
          localStorage.setItem(
            'pregrantedResults',
            JSON.stringify(this.pregrantedResults)
          );
          this.updateDistanceBounds();
          // Reopen the results section now that the data has been fetched and processed
          this.showResults = true;
          this.saveSearchQuery = true;
          this.currentPage = 1; // Reset the current page after getting new results
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

  onSearchHistoryClick(search: any) {
    this.queryValue = search.query;  // Set the clicked query as the current search input
    this.saveSearchQuery = false;
    
    // Set the results if they exist
    if (search.results) {
        this.grantedResults = search.results.granted;
        this.pregrantedResults = search.results.pregranted;
        this.updateDistanceBounds();
    }
  }

  onDeleteSearchHistory(searchKey: string, event: Event) {
    event.stopPropagation(); // Prevent triggering other click events

    const confirmation = window.confirm("Are you sure you want to delete this search history?");
    if (confirmation) {
        this.searchHistoryService.deleteSearchHistory(this.userId, searchKey)
            .then(() => {
                // Refresh local data or remove the deleted item from local list
                this.recentSearches = this.recentSearches.filter(search => search.key !== searchKey);
            })
            .catch(error => {
                console.error('Error deleting search history:', error);
                alert('An error occurred while deleting the search history. Please try again.');
            });
    }
}

  async savePatent(patent: any) {
    if (!this.userId) {
      console.error('No user logged in');
      return;
    }

    const patentId = patent.patent_id; // Assuming the patent object has an 'id' property

    const patentRef = this.db.database.ref(
      `saved_patents/${this.userId}/${patentId}`
    );

    patentRef
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          alert('This patent has already been saved!');
        } else {
          patentRef
            .set(patent)
            .then(() => {
              alert('Patent saved successfully!');
            })
            .catch((error) => {
              console.error('Error while saving the patent:', error);
              alert(
                'An error occurred while saving the patent. Please try again.'
              );
            });
        }
      })
      .catch((error) => {
        console.error('Error while checking the patent:', error);
        alert('An error occurred while checking the patent. Please try again.');
      });
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  isSaved(patent: any): boolean {
    return this.savedPatents.some(savedPatent => savedPatent.key === patent.patent_id);
  }

  routeSaved() {
    this.router.navigate(['/saved'], {
      state: { data: this.results },
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  applyFilters() {
    if (this.displayGranted && this.displayPregranted) {
      this.displayBoth = true;
      this.displayGranted = false;
      this.displayPregranted = false;
    }
    // Close the sidebar
    this.toggleSidebar();
  }

  onGrantedCheckboxChange() {
    // If granted is checked, uncheck the other boxes
    if (this.displayGranted) {
      this.displayPregranted = false;
      this.displayBoth = false;
    }
    this.updateTitle();
  }

  onPregrantedCheckboxChange() {
    // If pregranted is checked, uncheck the other boxes
    if (this.displayPregranted) {
      this.displayGranted = false;
      this.displayBoth = false;
    }
    this.updateTitle();
  }

  onBothCheckboxChange() {
    // If both are checked, uncheck the other boxes
    if (this.displayBoth) {
      this.displayGranted = false;
      this.displayPregranted = false;
    }
    this.updateTitle();
  }

  updateTitle() {
    if (this.displayGranted) {
      this.title = 'Granted Patents';
    } else if (this.displayPregranted) {
      this.title = 'Pregranted Patents';
    } else if (this.displayBoth) {
      this.title = 'Granted + Pregranted Patents';
    } else {
      this.title = 'No Selection'; // You can change this default title if needed
    }
  }

  getSimilarityBadge(score: number): { color: string; label: string } {
    const similarity = this.getSimilarityPercentage(score, this.minDist, this.maxDist);
  
    let color: string;
  
    if (similarity > 66) {
      color = '#AED581';  // Green for high similarity
    } else if (similarity > 33) {
      color = '#FFF9C4';  // Yellow for medium similarity
    } else {
      color = '#FFC1A1';  // Red for low similarity
    }
  
    const label = `${similarity.toFixed(2)}% Similar`;
    return { color, label };
  }
  
  getSimilarityPercentage(score: number, minDist: number, maxDist: number): number {
    if (minDist === maxDist) return 100; // Highest similarity (edge case)
    return 100 - ((score - minDist) / (maxDist - minDist) * 100);
  }

  computeDistances(arr: any[]): { minDist: number, maxDist: number } {
    const minDist = Math.min(...arr.map(p => p.similarity_score));
    const maxDist = Math.max(...arr.map(p => p.similarity_score));
    return { minDist, maxDist };
  }
  
  updateDistanceBounds(): void {
    const grantedDistances = this.computeDistances(this.grantedResults);
    const pregrantedDistances = this.computeDistances(this.pregrantedResults);
  
    // Here, you take the global minimum and maximum across both arrays.
    this.minDist = Math.min(grantedDistances.minDist, pregrantedDistances.minDist);
    this.maxDist = Math.max(grantedDistances.maxDist, pregrantedDistances.maxDist);
  }

  // Add a function to toggle the expanded class
  toggleSearchInputHeight() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.classList.toggle(
        'expanded',
        searchInput.scrollHeight > searchInput.clientHeight
      );
    }
  }

  isPatentSaved(patent: any): boolean {
    const patentId = patent.patent_id || patent.application_id;
    return this.savedPatents.some(savedPatent => savedPatent.key === patentId);
  }

  // Modify the savePatent method to incorporate the un-saving functionality
  async toggleSavePatent(patent: any): Promise<void> {
      const patentId = patent.patent_id || patent.application_id;

      if (this.isPatentSaved(patent)) {
          // If the patent is saved, then un-save it
          try {
              await this.savePatentService.deletePatent(this.userId, patentId);
              alert('Patent removed successfully.');
              this.savedPatents = this.savedPatents.filter(p => p.key !== patentId);
          } catch (error) {
              console.error('Error removing patent: ', error);
              alert('An error occurred. Please try again.');
          }
      } else {
          // If the patent is not saved, then save it
          try {
              await this.savePatentService.savePatent(this.userId, patent);
              alert('Patent saved successfully.');
              this.savedPatents.push(patent);
          } catch (error) {
              console.error('Error saving patent: ', error);
              alert('An error occurred. Please try again.');
          }
      }
  }
}
