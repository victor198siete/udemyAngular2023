import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShopingListService } from './../shoping-list.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shoping-edit',
  templateUrl: './shoping-edit.component.html',
  styleUrls: ['./shoping-edit.component.css']
})
export class ShopingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form') shoppingListForm: NgForm;
  sub: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shopingListService: ShopingListService) { }

  ngOnInit(): void {
    this.sub = this.shopingListService.startedEditing
      .subscribe(
        (index: number) => {
          this.editedItemIndex = index;
          this.editMode = true;
          this.editedItem = this.shopingListService.getIngredient(index);
          console.log(this.editedItem);
          this.shoppingListForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        }
      );
  }

  onAddItem(form: NgForm){
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode) {
      this.shopingListService.updateIngredients(this.editedItemIndex, newIngredient);
    } else {
      this.shopingListService.addIngredient(newIngredient);
    }
    this.onClear();
  }

  onClear(){
    this.editMode = false;
    this.shoppingListForm.reset();
  }

  onDelete(){
    this.shopingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
