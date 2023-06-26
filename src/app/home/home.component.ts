import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  input: any;

  constructor(
    private http: HttpClient,
  ) {

  }
  ngOnInit(){
    
  }
  //a controller for controlling the actuator, wherein the actuator is configured to control at least one surface property of a portion of the outer surface of the outer layer based on a sensed kinematical state of the article of footwear from the sensor, wherein the sensed kinematical state corresponds to a predetermined event.
  async test() {
    console.log("test")
    let formData = new FormData();
    formData.append('input_idea', this.input);
    this.http.post('http://34.125.108.223:3003/search', formData, {responseType: 'text'}).subscribe((res: any) => {
      console.log('POST request successful:', res);
    }),
    async (error: any) => {
      alert(error.message);

    }
  }


}
