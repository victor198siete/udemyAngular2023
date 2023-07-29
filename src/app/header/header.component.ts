import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // @Output() featureSelected = new EventEmitter<string>();

  constructor(
    private dataStorageSer: DataStorageService
  ) { }

  ngOnInit(): void {
  }

  onSaveData(){
    this.dataStorageSer.storeRecipes();
  }

  onFetchData(){
    this.dataStorageSer.fetchRecipes().subscribe();
  }

  // onSelect(feature: string){
  //   this.featureSelected.emit(feature)
  // }

}
