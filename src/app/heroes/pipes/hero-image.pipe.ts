import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from 'src/app/interfaces/hero.interface';

@Pipe({
  name: 'pipeImage'
})
export class HeroImagePipe implements PipeTransform {

  transform(pHero: Hero): string {
    if(!pHero.id && !pHero.alt_img)
    {
      return 'assets/no-image.png';
    }

    if(pHero.alt_img){
      return pHero.alt_img;
    }
    return `assets/heroes/${ pHero.id }.jpg`;
  }

}
