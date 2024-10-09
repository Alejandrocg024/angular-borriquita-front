import { Component, OnInit } from '@angular/core';
import { User } from '../../../auth/interfaces';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.css'
})
export class ListUserComponent implements OnInit {
    public user: User | null = null;

    constructor(
      private userService: UserService,
      private authService: AuthService,
      private activatedRoute: ActivatedRoute,
      private router: Router
    ) {}

    ngOnInit(): void {
      const me = this.authService.currentUser();

      if(!me) {
        this.router.navigateByUrl('');
        return;
      }

      this.activatedRoute.params
        .pipe(
          switchMap( ({ id }) => this.userService.getUserById( id )),
          catchError(() => {
            this.router.navigateByUrl('');
            return of(undefined);
          })
        )
        .subscribe( user => {
          if ( !user) return this.router.navigateByUrl('');
          this.user = user;
          return;
        })

    }

  }
