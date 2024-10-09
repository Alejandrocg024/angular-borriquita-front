import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AnnouncementsService } from '../../services/announcements.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Announcement } from '../../interfaces/announcement.interface';
import { filter, switchMap } from 'rxjs';
import { ImageModalComponent } from '../../components/image-modal/image-modal.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.css']
})
export class NewPageComponent implements OnInit {

  public loading = false;
  public serverErrors: string | null = null;
  public announcementForm = new FormGroup(
    {
      id: new FormControl(''),
      title: new FormControl('', [Validators.required, Validators.minLength(4)]),
      publicationDate: new FormControl<Date>(new Date(), [Validators.required]),
      modificationDate: new FormControl<Date>(new Date(), [Validators.required]),
      available: new FormControl(true, [Validators.required]),
      body: new FormControl('', [Validators.required, Validators.minLength(4)]),
      media: new FormControl(''),
    }
  );

  private file: File | undefined;

  constructor(
    private announcementsService: AnnouncementsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if ( !this.router.url.includes('editar') ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.announcementsService.getAnnouncementById( id ) ),
      ).subscribe( ann => {

        if ( !ann ) {
          return this.router.navigateByUrl('/noticias/');
        }

        this.announcementForm.reset( ann );
        return;
      });

  }

  openFullScreen(): void {
    this.dialog.open(ImageModalComponent, {
      data: this.currentAnnouncement?.media,
    });
  }

  get currentAnnouncement() {
    const ann = this.announcementForm.value as Announcement;
    return ann;
  }

  onSubmit(): void {
    this.announcementForm.markAllAsTouched();

    if ( this.announcementForm.invalid ) return;

    if ( this.currentAnnouncement.id ) {
      this.announcementsService.updateAnnouncement( this.currentAnnouncement )
        .subscribe({
          next: ann => {
            this.router.navigate(['/noticias', ann.id ]);
            this.showSnackbar(`Noticia ${ ann.title } actualizada!`);
          },
          error: (message: any) => {
            this.serverErrors = message;
            console.error('Errores del servidor:', this.serverErrors);
          }
        })

      return;
    }

    this.announcementsService.addAnnouncement( this.currentAnnouncement )
      .subscribe({
        next: ann => {
          this.router.navigate(['/noticias', ann.id ]);
          this.showSnackbar(`Noticia ${ ann.title } creada!`);
        },
        error: (message: any) => {
          this.serverErrors = message;
          console.error('Errores del servidor:', this.serverErrors);
        }
      })
  }


  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'Cerrar', {
      duration: 5000,
    })
  }

  async onFileSelected(event: any): Promise<void> {
    this.file = event.target.files[0];

    if(this.file){
      try {
          this.loading = true;
          const response = await this.announcementsService.uploadImageAsPromise(this.file);
          this.announcementForm.get('media')?.setValue(response.upload[1]);
      } catch (error) {
        console.error('Error uploading image:', error);
        this.showSnackbar('Error subiendo la imagen, es demasiado grande.');
        return;
      } finally {
        this.loading = false;
      }
    }
  }

  onDeleteHero() {
    if ( !this.currentAnnouncement.id ) throw Error('Hero id is required');

    const dialogRef = this.dialog.open( ConfirmDialogComponent, {
      data: this.announcementForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        filter( (result: boolean) => result ),
        switchMap( () => this.announcementsService.deleteAnnouncement( this.currentAnnouncement.id )),
        filter( (wasDeleted: boolean) => wasDeleted ),
      )
      .subscribe(() => {
        this.showSnackbar(`Noticia eliminada correctamente!`);
        this.router.navigate(['/noticias']);
      });

  }


}
