import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showSignupForm: boolean = false;
  username: string = '';
  password: string = '';
  newUsername: string = '';
  newPassword: string = '';

  constructor() {}

  ngOnInit() {}

  toggleForm() {
    this.showSignupForm = !this.showSignupForm;
  }
}
