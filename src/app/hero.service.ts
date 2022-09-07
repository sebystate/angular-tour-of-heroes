import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  // URL to web api
  private heroesUrl = 'api/heroes';

  // defines the header for HTTP save requests
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  /**
   * Obtains the hero of the given id.
   * @param id id of the hero.
   * @returns an observagle of Hero object if the id is found, otherwise will 404.
   */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero [id=${id}]`)),
      catchError(this.handleError<Hero>(`getHero [id=${id}]`))
    );
  }

  /**
   * GET operation: obtains all heroes from the server
   * @returns observable of Hero array
   */
  getHeroes(): Observable<Hero[]> {
    return this.http
      .get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  /**
   * POST operation: adds new hero on the server.
   * @param hero new hero to add.
   * @returns observable of the new added hero.
   */
  addHero(hero: Hero): Observable<Hero> {
    return this.http
      .post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((newHero: Hero) => this.log(`added hero '${newHero.name}' [id=${newHero.id}]`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  /**
   * PUT operation: updates the hero on the server
   * @param hero - hero to update.
   * @returns 
   */
  updateHero(hero: Hero): Observable<any> {
    return this.http
      .put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero '${hero.name}' [id=${hero.id}]`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  /**
   * DELETE operation: deletes the hero from the server.
   * @param id id of the hero to delete.
   * @returns observable of the deleted hero.
   */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http
    .delete<Hero>(url, this.httpOptions)
    .pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /**
   * GET operation: obtains heroes whose name contains search term.
   * @param term string to search for.
   * @returns empty array if there is no search term, 
   *          otherwise an array of matching hero objects
   */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http
      .get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(
        tap(x => x.length ?
          this.log(`found heroes matching "${term}"`) :
          this.log(`no heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /**
   * Logs a @see HeroService message with the @see MessageService .
   * @param message string message to log.
   */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
