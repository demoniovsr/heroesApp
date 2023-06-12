import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroments } from 'enviroments/enviroments';
import { Hero } from '../interfaces/hero.interface';
import { Observable, catchError, map, of } from 'rxjs';

const ResourceHero = '/heroes';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private heroHttpClient : HttpClient) { }

  private baseUrl : string = enviroments.baseUrl;


  getHeroes() : Observable<Hero[]>
  {
    return this.heroHttpClient.get<Hero[]>(`${ this.baseUrl }${ResourceHero}`);
  }

  getHeroeById(id: string) : Observable<Hero|undefined>{
    return this.heroHttpClient.get<Hero> (`${ this.baseUrl }${ResourceHero}/${id}`)
    .pipe(
      catchError( error => of(undefined) )
    );
  }

  getSuggestions( query : string): Observable<Hero[]>{
    return this.heroHttpClient.get<Hero[]> (`${ this.baseUrl }${ResourceHero}?q=${ query }&_limit=6`);
  }

  addHeroe(pHero: Hero) : Observable<Hero>{
    return this.heroHttpClient.post<Hero> (`${ this.baseUrl }${ResourceHero}`,pHero);
  }

  updateHeroe(pHero: Hero) : Observable<Hero>{
    if(!pHero.id)throw Error( 'Hero id is required' );
    return this.heroHttpClient.patch<Hero> (`${ this.baseUrl }${ResourceHero}/${pHero.id}`,pHero);
  }

  deleteHeroe(pId: string) : Observable<boolean>{
    return this.heroHttpClient.delete<Hero> (`${ this.baseUrl }${ResourceHero}/${pId}`)
    .pipe(
      catchError( err => of(false)),
      map( resp => true)
    );
  }
}
