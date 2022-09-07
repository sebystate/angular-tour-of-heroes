import { Component, OnInit } from '@angular/core';

import { HeroService } from '../hero.service';

import { Hero } from '../hero';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[] = [];

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if(!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    // there's nothing for the HeroesComponent to do with the Observable returned by heroService.deleteHero(), but IT MUST subscribe anyway!!!
    this.heroService.deleteHero(hero.id).subscribe();
    // if you neglect to subscribe(), the heroService can't send the delete requiest to the server.
    // As a rule, an Observable does nothing until something subscribes.
  }

}
