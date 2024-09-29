import { Announcement } from '../../interfaces/announcement.interface';
import { AnnouncementsService } from '../../services/announcements.service';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Component, effect, inject, OnInit } from '@angular/core';
import { AuthStatus, Role  } from '../../../auth/interfaces';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html'
})
export class ListPageComponent implements OnInit {
  private announcements: Announcement[] = [];
  public displayAnnouncements: Announcement[] = [];
  public isAllVisible: boolean = false;

  Role = Role;

  announcementService = inject( AnnouncementsService );
  authService = inject( AuthService );
  router = inject( Router );

  public userRol?: Role;


  public authStatusChangedEffect = effect(() => {

    switch( this.authService.authStatus() ) {

      case AuthStatus.authenticated:{
        this.userRol = this.authService.currentUser()!.role;
        return;
      }

      default:
        return;

    }
  });


  ngOnInit(): void {

    this.announcementService.getAnnouncements()
    .pipe(
      catchError(error => {
        this.router.navigateByUrl('noticias');
        return of(undefined);
      })
    )
    .subscribe(
      response => {
        this.announcements = response!;
        this.filterAnnouncements();
      }
    );
  }

  filterAnnouncements() {
    if (this.isAllVisible) {
      this.displayAnnouncements = this.announcements;
    } else {
      this.displayAnnouncements = this.announcements.filter(announcement => announcement.available);
    }
  }


}
