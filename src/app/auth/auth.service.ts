import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

export interface AuthResData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpTimer: any;

  constructor(
    private http: HttpClient
  ) { }

  signup(email: string, pass: string){
    return this.http.post<AuthResData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDNbWYQIZ8rlRR4cgTFCd8h7D_MMk8rDck`,
      {email: email, password: pass, returnSecureToken: true }
    )
    .pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handerlUserAuth(
          resData.email, resData.localId, resData.idToken, +resData.expiresIn
          )}
    ));
  }

  autologin(){
    const userData: { email: string, id: string, _token: string, _tokenExpirationDate: string}  = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
      return
    }
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if(loadedUser.token){
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autologout(expirationDuration);
    }
  }

  login(email: string, pass: string){
    return this.http.post<AuthResData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDNbWYQIZ8rlRR4cgTFCd8h7D_MMk8rDck`,
      {email: email, password: pass, returnSecureToken: true }
    )
    .pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handerlUserAuth(
          resData.email, resData.localId, resData.idToken, +resData.expiresIn
          )}
    ));
  }

  logout(){
    this.user.next(null);
    // localStorage.clear();
    localStorage.removeItem('userData');
    if(this.tokenExpTimer){
      clearTimeout(this.tokenExpTimer);
    }
    this.tokenExpTimer = null;
  }

  autologout(expirationTime: number){
    this.tokenExpTimer = setTimeout(()=>{
      this.logout();
    }, expirationTime);
  }

  private handerlUserAuth(email: string, userId: string, token:string, expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + +expiresIn*1000);
      const user = new User(email, userId, token, expirationDate);
      this.user.next(user);
      this.autologout(expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse){
    console.log(errorRes);
    let errorMessage = 'An unknow error ocurred!';
    if(!errorRes.error || !errorRes.error.error){
      return throwError(errorMessage);
    }
    switch(errorRes.error.error.message){
      case 'EMAIL_EXISTS':
        errorMessage = "This email exists";
        break;
      case 'MISSING_CUSTOM_TOKEN':
        errorMessage = "Missing token";
        break;
      case 'INVALID_EMAIL':
        errorMessage = "This email is invalid";
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = "Email not found";
        break;
      case 'INVALID_PASSWORD':
        errorMessage = "Invalid password";
        break;
    }
    return throwError(errorMessage);
  }

}
