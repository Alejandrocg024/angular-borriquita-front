import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { AuthStatus } from '../../../auth/interfaces';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private authService = inject( AuthService );

  public logged: boolean = false;
  public userId: string | null = null;


  public authStatusChangedEffect = effect(() => {

    switch( this.authService.authStatus() ) {

      case AuthStatus.checking:
        return;

      case AuthStatus.authenticated:{
        this.logged = true;
        this.userId = this.authService.currentUser()!.id;
        console.log(this.userId);
        return;
      }

      case AuthStatus.notAuthenticated:{
        this.logged = false;
        return;
      }

    }
  });


  onLogout() {
    this.authService.logout();
  }

}
