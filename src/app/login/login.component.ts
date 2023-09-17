import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

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

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {}

  toggleForm() {
    this.showSignupForm = !this.showSignupForm;
  }

  login() {
    this.afAuth.signInWithEmailAndPassword(this.email, this.password).then((res) => {
      console.log(res);
      this.router.navigate(['/search']);
    }).catch((err) => {
      alert(err.message);
    })
  }

  register() {
    this.afAuth.createUserWithEmailAndPassword(this.newEmail, this.newPassword).then((res) => {
      console.log(res);
      this.router.navigate(['/search']);
    }).catch((err) => {
      alert(err.message);
    })
  }


}
