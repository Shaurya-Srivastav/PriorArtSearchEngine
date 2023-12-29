import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';  // <-- Import Router
import { HttpClient } from '@angular/common/http'; // Import HttpClient for HTTP requests
import { SearchHistoryService } from '../services/search-history.service';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  titleLetters: string[] = Array.from('Semantic');
  showResults: boolean = false;
  results: string[] = [];
  isSearching: boolean = false;
  querySemanticValue: string = "";
  queryIndexValue: string = "";

  selectedDate: Date = new Date();
  isSubmitting: boolean = false;

  @ViewChild('searchForm') searchForm!: ElementRef;
  @ViewChild('calendarRef') calendarRef!: ElementRef;
  @ViewChild('picker') datePicker!: MatDatepicker<Date>;

  // Inject the Router service
  constructor(
    private router: Router,
    private http: HttpClient,
    private searchHistoryService: SearchHistoryService,
    private authService: AuthService
  ) 
  {}
  

  search() {
    if (!this.querySemanticValue.trim() && !this.queryIndexValue.trim()) {
        alert('Please enter a query in at least one of the search boxes.');
    }
    else if (this.querySemanticValue.trim() && !this.queryIndexValue.trim()) {
        this.semanticSearch();
    }
    else if (!this.querySemanticValue.trim() && this.queryIndexValue.trim()) {
        this.indexSearch();
    }
    else {
        this.combinedSearch();
    }
  }

  semanticSearch() {
    console.log(this.querySemanticValue);
    this.isSubmitting = true;
    this.isSearching = true;
    const formattedDate = this.selectedDate ? this.selectedDate.toISOString().split('T')[0] : null;
    // Create a request object with the input data
    const requestData = {
      input_idea: this.querySemanticValue,
      user_input_date: formattedDate, // Use datePicker instead of datePickerRef
    };
    
    // Send a POST request to your Flask server
    this.http.post('http://129.213.131.75:5000/search', requestData).subscribe(
      (response: any) => {
        console.log(response)
        if (response['Granted results']) {
          // Assuming your server returns results in the response
          this.results = response;
          this.isSearching = false;
          this.isSubmitting = false;
          this.router.navigate(['/results'], {
            state: { data: this.results, query: this.querySemanticValue, formattedDate: formattedDate },
          });
        } else {
          alert(response['error'])
          this.isSearching = false;
          this.isSubmitting = false;
        }
       
      },
      (error) => {
        console.error('Error:', error);
        this.isSubmitting = false;
        this.isSearching = false; // Handle error and reset isSearching flag
      }
    );
  }

  indexSearch() {
    console.log(this.queryIndexValue);
    this.isSubmitting = true;
    this.isSearching = true;
    const formattedDate = this.selectedDate ? this.selectedDate.toISOString().split('T')[0] : null;
    // Create a request object with the input data
    const requestData = {
      input_idea: this.queryIndexValue,
      user_input_date: formattedDate, // Use datePicker instead of datePickerRef
    };
    
    // Send a POST request to your Flask server
    this.http.post('http://129.213.131.75:5000/index-search', requestData).subscribe(
      (response: any) => {
        console.log(response)
        if (response['Granted results']) {
          // Assuming your server returns results in the response
          this.results = response;
          this.isSearching = false;
          this.isSubmitting = false;
          this.router.navigate(['/results'], {
            state: { data: this.results, query: this.queryIndexValue, formattedDate: formattedDate },
          });

          } else {
          alert(response['error'])
          this.isSearching = false;
          this.isSubmitting = false;
        }
       
      },
      (error) => {
        console.error('Error:', error);
        this.isSubmitting = false;
        this.isSearching = false; // Handle error and reset isSearching flag
      }
    );
  }

  combinedSearch() {
    console.log(this.queryIndexValue);
    this.isSubmitting = true;
    this.isSearching = true;
    const formattedDate = this.selectedDate ? this.selectedDate.toISOString().split('T')[0] : null;
    // Create a request object with the input data
    const requestData = {
      semantic_query: this.querySemanticValue,
      index_query: this.queryIndexValue,
      user_input_date: formattedDate, // Use datePicker instead of datePickerRef
    };
    
    // Send a POST request to your Flask server
    this.http.post('http://129.213.131.75:5000/combined-search', requestData).subscribe(
      (response: any) => {
        console.log(response)
        if (response['Granted results']) {
          // Assuming your server returns results in the response
          this.results = response;
          this.isSearching = false;
          this.isSubmitting = false;
          this.router.navigate(['/results'], {
            state: { data: this.results, query: this.queryIndexValue, formattedDate: formattedDate },
          });

          } else {
          alert(response['error'])
          this.isSearching = false;
          this.isSubmitting = false;
        }
       
      },
      (error) => {
        console.error('Error:', error);
        this.isSubmitting = false;
        this.isSearching = false; // Handle error and reset isSearching flag
      }
    );
  }
  
  

  onCalendarClick() {
    this.datePicker.open();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
