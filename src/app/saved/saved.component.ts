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
}
