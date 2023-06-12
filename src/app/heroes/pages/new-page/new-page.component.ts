import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from 'src/app/interfaces/hero.interface';
import { HeroService } from '../../../services/hero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { STRING_TYPE } from '@angular/compiler';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  constructor(private heroService:HeroService,
    private activatedRoute :ActivatedRoute,
    private router:Router,
    private matSnackBar :MatSnackBar,
    private matDialog : MatDialog )
  {

  }
  ngOnInit(): void {

    if(!this.router.url.includes('edit'))
    {
      return;
    }

    this.activatedRoute.params
    .pipe(
      switchMap( ({id}) => this.heroService.getHeroeById(id)),

    )
    .subscribe(hero => {
        //data result of request
        if(!hero)
        {
          return this.router.navigateByUrl('/');

        }

        this.heroForm.reset( hero );

        return;
      }
    );
  }
  get currentHero() : Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }
  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ]

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', {nonNullable:true}),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  onSubmit():void {
    /* console.log(
      {
        formIsValid : this.heroForm.valid,
        value : this.heroForm.value
      }

    ); */
//debugger;
    if(this.heroForm.invalid)
    {
      return;
    }

    if(this.currentHero.id)
    {
      this.heroService.updateHeroe(this.currentHero)
      .subscribe( hero => {

          //TODO:mostrar snackbar

          let message : string =
          this.getSublimeMessage('updated hero:' + hero.superhero + ':ok');

          console.log(message);

          this.showSnackBar(message);
        }
      );


      return;
    }

    this.heroService.addHeroe(this.currentHero)
      .subscribe( hero => {
         //TODO:mostrar snackbar y redirigir a /heroes/edit/ hero.id

         this.router.navigate(['/heroes/edit',hero.id]);

         let message : string =
         this.getSublimeMessage('added hero:' + hero.superhero + ':ok');

         console.log(message);

         this.showSnackBar(message);

      });
  }

  showSnackBar(pMessage : string): void {
    this.matSnackBar.open( pMessage, 'done',{
      duration : 2500,
    });
  }
  getSublimeMessage(pValue: string): string {
    return `(*)(*) == ${pValue} == (.)(.)`;
  }

  openDialog(pValue1 : string, pValue2 : string):void {

  }

  onDeleteHero() : void
  {
    if(!this.currentHero.id){
      throw Error('Hero id is required');
    }

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
    .pipe(
      filter( ( result :boolean ) => result ),
      switchMap( () => this.heroService.deleteHeroe( this.currentHero.id ) ),
      filter( ( isDeleted : boolean ) => isDeleted ),
    )
    .subscribe( () => {
      this.router.navigate(['/heroes']);
      console.log(this.getSublimeMessage('delete:sucessfull'));

    });
    /*
    dialogRef.afterClosed().subscribe(result => {
      if(!result)
      {
        return;
      }
      let Message : string =  this.getSublimeMessage('delete:init');

      this.heroService.deleteHeroe(this.currentHero.id)
      .subscribe( isDeleted => {
        if(isDeleted)
        {
          this.router.navigate(['/heroes']);
          Message = this.getSublimeMessage('delete:sucessfull');
        }
        else{
          Message = this.getSublimeMessage('delete:failed');
        }
        console.log(Message);
        console.log(result);

      });

    });

    */
  }
}
