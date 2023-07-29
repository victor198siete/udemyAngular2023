import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DataStorageService {

  constructor(
    private http: HttpClient,
    private recipeSer: RecipeService
  ){}

  storeRecipes(){
    const recipes: Recipe[] = this.recipeSer.getRecipes();
    this.http
      .put(
        `https://angular-recipe-book-86729-default-rtdb.firebaseio.com/recipes.json`,
        recipes
      ).subscribe(res => {
        console.log(res);
      });
  }

  fetchRecipes(){
    return this.http
      .get<Recipe[]>(
        `https://angular-recipe-book-86729-default-rtdb.firebaseio.com/recipes.json`
      )
      .pipe(map(recipes => {
        return recipes.map(recipe => {
          return {...recipe,
                  ingredients: recipe.ingredients ? recipe.ingredients : []
                };
        });
      }),
      tap(recipes => {
        this.recipeSer.setRecipes(recipes);
      })
      )
  }

}
