import { EventEmitter, Injectable } from "@angular/core";

import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from './recipe.model';
import { ShopingListService } from './../shoping-list/shoping-list.service';
import { Subject } from "rxjs";

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  // private recipes: Recipe[] = [
  //   new Recipe('Pasta 1', 'This is a simple Recipe', 'assets/images/pesto.jpg', [new Ingredient('Pasta 1', 1), new Ingredient('Cheese', 5)]),
  //   new Recipe('Pasta 2', 'This is a simple Recipe', 'assets/images/pesto.jpg', [new Ingredient('Pasta 2', 2)]),
  //   new Recipe('Pasta 3', 'This is a simple Recipe', 'assets/images/pesto.jpg', [new Ingredient('Pasta 3', 3)]),
  // ];

  constructor(
    private shopingListService: ShopingListService) {}

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShopingList(ingredients: Ingredient[]) {
    this.shopingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
