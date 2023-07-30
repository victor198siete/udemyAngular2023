import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService, AuthResData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLogin = true;
  isLoading = false;
  error: string = null;


  constructor(
    private authSer: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSwitchMode(){
    this.isLogin = !this.isLogin;
  }

  onSubmit(authForm: NgForm){
    if(!authForm.valid){
      return;
    }

    const email = authForm.value.email;
    const password = authForm.value.password;

    let authObs: Observable<AuthResData>;

    this.isLoading = true;
    if(this.isLogin){
      authObs = this.authSer.login(email, password);
    } else {
      authObs = this.authSer.signup(email, password);
    }

    authObs.subscribe(res => {
      console.log(res);
      this.router.navigate(['/recipes']);
      this.isLoading =false;
    }, errorMessage => {
      console.log(errorMessage);
      this.error = errorMessage;
      this.isLoading =false;
    });
    authForm.reset();
  }
}
