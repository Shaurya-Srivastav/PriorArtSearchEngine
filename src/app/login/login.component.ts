import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
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
  company: string = ''
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase
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
    this.afAuth.createUserWithEmailAndPassword(this.newEmail, this.newPassword).then((res: any) => {
      console.log(res);
      const userInfo = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.newEmail,
        company: this.company
      }
      this.db.list(`users/${res.user.uid}`).push(userInfo).then();
      this.router.navigate(['/search']);
    }).catch((err) => {
      alert(err.message);
    })
  }


}
