import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for HTTP requests

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

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { data: any };

    if (state) {
      this.results = state;
      this.grantedResults = this.results.data['Granted results'].map((res: any) => ({ ...res, state: 'collapsed' }));
      this.grantedResults = this.results.data['Granted results'];
      this.pregrantedResults = this.results.data['Pregranted Results'];
    }
  }

  ngOnInit(): void {
    this.showResults = true;
    this.isSearching = false;
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

    this.http.post('http://127.0.0.1:5000/search', requestData).subscribe(
      (response: any) => {
        console.log("API Response:", response);

        if (response) {
          if (response['Granted results']) {
            this.grantedResults = response['Granted results'].map((res: any) => ({ ...res, state: 'collapsed' }));
          }

          if (response['Pregranted Results']) {
            this.pregrantedResults = response['Pregranted Results'];
          }

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

}