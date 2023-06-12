import { Component, OnInit } from '@angular/core';
import { Hero } from 'src/app/interfaces/hero.interface';
import { HeroService } from 'src/app/services/hero.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [
  ]
})
export class ListPageComponent implements OnInit {
  public ArrayHeroes : Hero[] = [];

  constructor( private heroService : HeroService)
  {

  }
  ngOnInit(): void {
    //debugger;
    this.heroService.getHeroes()
    .subscribe( heroes =>
      {
          this.ArrayHeroes = heroes;

          console.log(JSON.stringify(this.ArrayHeroes));
      });

  }
}
