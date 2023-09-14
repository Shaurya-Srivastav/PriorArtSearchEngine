import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('loginBox') loginBox!: ElementRef;
  @ViewChild('signupBox') signupBox!: ElementRef;
  @ViewChild('loginLink') loginLink!: ElementRef;
  @ViewChild('signupLink') signupLink!: ElementRef;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Get references to the anchor elements
    const signupLinkElement = this.signupLink.nativeElement;
    const loginLinkElement = this.loginLink.nativeElement;

    // Handle click on "Sign up" link
    signupLinkElement.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault(); // Prevent the default behavior of the anchor
      this.loginBox.nativeElement.style.display = 'none';
      this.signupBox.nativeElement.style.display = 'block';
    });

    // Handle click on "Back to Login" link
    loginLinkElement.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault(); // Prevent the default behavior of the anchor
      this.signupBox.nativeElement.style.display = 'none';
      this.loginBox.nativeElement.style.display = 'block';
    });

    // Handle form submission (you can add form submission logic here)
    // Example: this.loginForm.nativeElement.addEventListener('submit', (e) => { ... });
    // Example: this.signupForm.nativeElement.addEventListener('submit', (e) => { ... });
  }
}
