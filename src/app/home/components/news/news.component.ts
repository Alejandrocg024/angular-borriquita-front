import { Component, inject, OnInit } from '@angular/core';
import { Announcement } from '../../../announcements/interfaces/announcement.interface';
import { AnnouncementsService } from '../../../announcements/services/announcements.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'home-news',
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  public announcements: Announcement[] = [];


  announcementService = inject( AnnouncementsService );


  ngOnInit(): void {

    this.announcementService.getHomeAnnouncements()
    .pipe(
      catchError(error => of(undefined))
    )
    .subscribe(
      response => this.announcements = response!
    );
  }

}
