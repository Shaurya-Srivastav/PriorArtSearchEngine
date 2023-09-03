import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  searchQuery: string = '';

  constructor(private router: Router) { }

  onSubmit(): void {
    // Navigate to the results page and pass the search query
    this.router.navigate(['/results'], { queryParams: { query: this.searchQuery } });
  }
}