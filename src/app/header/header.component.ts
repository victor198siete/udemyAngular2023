import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false
  private userSub: Subscription;

  constructor(
    private dataStorageSer: DataStorageService,
    private router: Router,
    private authSer: AuthService
  ) { }

  ngOnInit(): void {
    this.userSub = this.authSer.user.subscribe( user => {
      this.isAuth = !!user;
      console.log(!user);
      console.log(!!user);
    })
  }

  onSaveData(){
    this.dataStorageSer.storeRecipes();
  }

  onFetchData(){
    this.dataStorageSer.fetchRecipes().subscribe();
  }

  onLogout(){
    this.authSer.logout();
    this.router.navigate(['/auth']);
  }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }
}
