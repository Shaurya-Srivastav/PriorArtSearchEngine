import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showSignupForm: boolean = false;
  email: string = '';
  password: string = '';
  newEmail: string = '';
  newPassword: string = '';
  firstName: string = '';
  lastName: string = '';
  company: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  toggleForm() {
    this.showSignupForm = !this.showSignupForm;
  }

  login() {
    this.http.post('http://129.213.131.75:5000/login', { username: this.email, password: this.password }).subscribe({
      next: (response: any) => {
        console.log(response)
        this.authService.login(response.access_token);
        this.router.navigate(['/search']);
      },
      error: (err) => {
        alert(err.error.message || 'Error during login');
      }
    });
    
  }

  register() {
    const newUser = {
      username: this.newEmail,
      password: this.newPassword,
      firstName: this.firstName,
      lastName: this.lastName, 
      company: this.company    
    };
  
    this.http.post('http://129.213.131.75:5000/register', newUser).subscribe({
      next: (response: any) => {
        console.log(response)
        this.authService.login(response.access_token);
        this.router.navigate(['/search']);
      },
      error: (err) => {
        alert(err.error.message || 'Error during registration');
      }
    });
  }
  
}
