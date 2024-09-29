import { Component, OnInit } from '@angular/core';
import { Announcement } from '../../interfaces/announcement.interface';
import { AnnouncementsService } from '../../services/announcements.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, switchMap, of, filter } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ImageModalComponent } from '../../components/image-modal/image-modal.component';
import { AuthService } from '../../../auth/services/auth.service';
import { User, Role } from '../../../auth/interfaces';

@Component({
  selector: 'app-announcement-page',
  templateUrl: './announcement-page.component.html',
  styleUrl: './announcement-page.component.css'
})
export class AnnouncementPageComponent implements OnInit {
[x: string]: any;

  public announcement?: Announcement;
  public user: User | null = null;
  public Role = Role;

  constructor(
    private announcementsService: AnnouncementsService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser();

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.announcementsService.getAnnouncementById( id )),
        catchError(() => {
          this.router.navigateByUrl('noticias');
          return of(undefined);
        })
      )
      .subscribe( ann => {

        if ( !ann ) return this.router.navigate([ 'noticias/' ]);
        this.announcement = ann;
        return;
      })

  }

  openFullScreen(): void {
    this.dialog.open(ImageModalComponent, {
      data: this.announcement?.media,
    });
  }

  goBack():void {
    this.router.navigateByUrl('noticias')
  }


}
