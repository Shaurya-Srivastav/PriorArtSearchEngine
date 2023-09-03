import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../services/search.service';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  searchQuery: any;
  results: any[] = []; // adjust the type based on your results structure

  currentPage: number = 1;
  totalPages: any;
  paginatedResults: any[][] = [];
  applicationNumber: string = '';
  constructor(private route: ActivatedRoute, 
    private searchService: SearchService, 
    private cdr: ChangeDetectorRef, 
    private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
    this.searchQuery = this.route.snapshot.queryParamMap.get('query') || ''; // get the query from route parameters
    if (this.searchQuery.trim()) { // Check if the search query is not blank
      this.search(); 
    }
  }

  search() {
    const selectedDate = '2023-01-01'; 
    this.searchService.search(this.searchQuery, selectedDate).subscribe((response: any) => {
      this.results = response.results;
      this.paginatedResults = this.chunkArray(this.results, 10);
      this.totalPages = this.paginatedResults.length;
      console.log(this.results);
      this.cdr.detectChanges();
    });
  }

  chunkArray(arr: any[], size: number): any[][] {
    let result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  setPage(page: number) {
    this.currentPage = page;
  }

  fetchAndRouteApplication(): void {
    const patentNumber = '7344109'; // Replace with the actual patent number
    const url = `https://patentcenter.uspto.gov/retrieval/public/v2/application/data?patentNumber=${patentNumber}`;
    
    this.http.get<any>(url).subscribe((response) => {
      const applicationNumber = response.applicationNumberText;
      if (applicationNumber) {
        // Route to the desired URL with the application number
        this.router.navigate(['/applications', applicationNumber]);
      }
    });
  }
}