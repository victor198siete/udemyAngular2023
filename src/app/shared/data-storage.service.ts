import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';



import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {

  constructor(
    private http: HttpClient,
    private recipeSer: RecipeService,
    private authSer: AuthService
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
      return this.authSer.user.pipe(
        take(1),
        exhaustMap(user => {
        return this.http
          .get<Recipe[]>(
          `https://angular-recipe-book-86729-default-rtdb.firebaseio.com/recipes.json`,
          {
            params: new HttpParams().set('auth', user.token)
          }
        );
      }),
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
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
