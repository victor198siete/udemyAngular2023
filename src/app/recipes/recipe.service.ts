import { EventEmitter, Injectable } from "@angular/core";

import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";
import { ShopingListService } from './../shoping-list/shoping-list.service';

@Injectable()
export class RecipeService {

  private recipes: Recipe[] = [
    new Recipe('Pasta 1', 'This is a simple Recipe', 'assets/images/pesto.jpg', [new Ingredient('Pasta 1', 1), new Ingredient('Cheese', 5)]),
    new Recipe('Pasta 2', 'This is a simple Recipe', 'assets/images/pesto.jpg', [new Ingredient('Pasta 2', 2)]),
    new Recipe('Pasta 3', 'This is a simple Recipe', 'assets/images/pesto.jpg', [new Ingredient('Pasta 3', 3)]),
  ];

  constructor(private shopingListService: ShopingListService) {}

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
  }

  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index] = newRecipe;
  }
}
