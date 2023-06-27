import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loading = false;
  input: any;
  title: any;
  abstract: any;

  constructor(
    private http: HttpClient,
  ) {

  }
  ngOnInit(){
    
  }
  //a controller for controlling the actuator, wherein the actuator is configured to control at least one surface property of a portion of the outer surface of the outer layer based on a sensed kinematical state of the article of footwear from the sensor, wherein the sensed kinematical state corresponds to a predetermined event.
  test() {
    this.loading = true;
    console.log(this.input);
    const url = 'http://34.125.201.213:3003/search';

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const requestBody = { input_idea: this.input };
    this.http.post(url, requestBody, { headers }).subscribe({
      next: (response: any) => {
        console.log(response);
        this.title = response.most_similar_title;
        this.abstract = response.most_similar_abstract;
        this.loading = false;
      },
      error: (error: any) => {
        alert(error);
        this.loading = false;
      },
    });
  }


}
