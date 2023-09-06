import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../services/search.service';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.css']
})
export class SavedComponent implements OnInit{

  titleLetters: string[] = Array.from('Semantic');
  searchQuery: any;
  isSearching: boolean = true; 
  results: any[] = [
    {
      title: "Patent 1: Innovative Idea",
      abstract: "This is a description of the innovative idea for patent 1. It revolutionizes the way we think about technology."
    },
    {
      title: "Patent 2: Next-gen Solution",
      abstract: "This is a description of the next-gen solution for patent 2. It's a groundbreaking invention."
    },
    // ... add more dummy patents as needed
  ];
  public showResults: boolean = false;

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
    this.animateLogo();

    setTimeout(() => {
      this.showResults = true;
    }, 500); // 500ms delay

    this.searchQuery = this.route.snapshot.queryParamMap.get('query') || ''; // get the query from route parameters
    if (this.searchQuery.trim()) { // Check if the search query is not blank
      this.search(); 
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
