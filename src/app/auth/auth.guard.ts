import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, tap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{

  constructor(
    private authSer: AuthService,
    private router: Router
  ){}

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authSer.user.pipe(
      take(1),
      map(user => {
      const isAuth = !!user;
      if(isAuth) {
        return true;
      }
      return this.router.createUrlTree(['/auth']);
    })
    );
  }

  // canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
  //   return this.authSer.user.pipe(map(user => {
  //     return !!user;
  //   }),tap(isAuth => {
  //       if(!isAuth){
  //         this.router.navigate(['auth']);
  //       }
  //   }) );
  // }
}
