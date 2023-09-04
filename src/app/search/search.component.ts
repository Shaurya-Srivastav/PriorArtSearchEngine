import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';  // <-- Import Router

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
  constructor(private router: Router) {}

  onSubmit() {
    this.isSearching = true;

    // Mock results
    this.results = ['Result 1', 'Result 2', 'Result 3'];

    // Reset the isSearching flag and redirect after the animation duration
    setTimeout(() => {
      this.isSearching = false;
      this.router.navigate(['/results'], { queryParams: { query: this.queryValue } });
  }, 2000)  // Duration to maintain the animation state
  }

  onCalendarClick() {
    this.datePicker.open();
  }
}