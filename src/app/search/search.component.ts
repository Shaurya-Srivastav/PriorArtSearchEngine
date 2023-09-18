import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';  // <-- Import Router
import { HttpClient } from '@angular/common/http'; // Import HttpClient for HTTP requests
import { SearchService } from '../services/search.service';

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
  queryValue: string = "";
  selectedDate: Date = new Date();
  isSubmitting: boolean = false;
  
  @ViewChild('searchForm') searchForm!: ElementRef;
  @ViewChild('calendarRef') calendarRef!: ElementRef;
  @ViewChild('picker') datePicker!: MatDatepicker<Date>;

  gradients: string[] = [
    "linear-gradient(106.5deg, rgba(255, 215, 185, 0.91) 23%, rgba(223, 159, 247, 0.8) 93%)",
    "linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)",
    "linear-gradient(110.4deg, rgb(255, 196, 254) 9.6%, rgb(251, 229, 123) 91%)",
  ];

  ngAfterViewInit(): void {
    this.setRandomGradient();
  }

  

  setRandomGradient(): void {
    const randomIndex = Math.floor(Math.random() * this.gradients.length);
    const selectedGradient = this.gradients[randomIndex];
    const searchSection = document.getElementById('search');
    if (searchSection) {
      searchSection.style.background = selectedGradient;
    }
  }


  // Inject the Router service
  constructor(
    private router: Router,
    private http: HttpClient,
  ) 
    {}

  onSubmit() {
    if (!this.queryValue || this.queryValue.trim() === '') {
      // Maybe show a warning message here
      console.warn('Search is empty. No action taken.');
      return;  // Return here to exit the function early and not proceed with the query
    }
    console.log(this.queryValue);
    this.isSubmitting = true;
    this.isSearching = true;
    const formattedDate = this.selectedDate ? this.selectedDate.toISOString().split('T')[0] : null;
    // Create a request object with the input data
    const requestData = {
      input_idea: this.queryValue,
      user_input_date: formattedDate, // Use datePicker instead of datePickerRef
    };
    
    // Send a POST request to your Flask server
    this.http.post('http://129.213.84.77:5000/search', requestData).subscribe(
      (response: any) => {
        // Assuming your server returns results in the response
        this.results = response;
        this.isSearching = false;
        this.isSubmitting = false;
        this.router.navigate(['/results'], {
          state: { data: this.results }
        });
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
}