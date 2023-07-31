import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { AuthService, AuthResData } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLogin = true;
  isLoading = false;
  error: string = null;

  @ViewChild(PlaceHolderDirective) alertHost: PlaceHolderDirective;

  private closeSub: Subscription;

  constructor(
    private authSer: AuthService,
    private router: Router,
    private componentFac: ComponentFactoryResolver
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
      this.showErrorAlert(errorMessage);
      this.isLoading =false;
    });
    authForm.reset();
  }

  handleError(){
    this.error = null;
  }

  private showErrorAlert(errorMessage: string){
    // const alertCom = new AlertComponent();
    const alertComFac = this.componentFac.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef  = this.alertHost.viewConRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertComFac);
    componentRef.instance.message = errorMessage;
    this.closeSub = componentRef.instance.close.subscribe(()=>{
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    })
  }

  ngOnDestroy(){
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }

  }
}
