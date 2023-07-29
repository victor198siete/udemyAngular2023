import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { RecipeService } from './../recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  private recipeSub: Subscription;
  constructor(
    private recipeSer: RecipeService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.recipeSub = this.recipeSer.recipesChanged.subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
        console.log(this.recipes);
      }
    );
    this.recipes = this.recipeSer.getRecipes();
    console.log(this.recipes);
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route })
  }

  ngOnDestroy(): void {
    if(this.recipeSub){
      this.recipeSub.unsubscribe();
    }
  }
}
