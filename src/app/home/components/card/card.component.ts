import { Component, Input, OnInit } from '@angular/core';
import { Role, User } from '../../../auth/interfaces';
import { AuthService } from '../../../auth/services/auth.service';
import { Announcement } from '../../../announcements/interfaces/announcement.interface';

@Component({
  selector: 'home-card-component',
  templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {
  @Input()  public announcement!: Announcement;

  public user: User | null = null;
  public Role = Role;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUser();

    if ( !this.announcement ) throw Error('Se requiere una propiedad de anuncio');
  }
}
