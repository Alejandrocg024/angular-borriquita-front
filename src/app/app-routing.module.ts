import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from './auth/guards';

const routes: Routes = [
  {
    path: 'hermandad',
    loadChildren: () => import('./brotherhood/brotherhood.module').then(m => m.BrotherhoodModule),
  },
  {
    path: 'solicitud',
    loadChildren: () => import('./request-form/request-form.module').then(m => m.RequestFormModule),
  },
  {
    path: 'eventos',
    loadChildren: () => import('./event/event.module').then(m => m.EventModule),
  },
  {
    path: 'noticias',
    loadChildren: () => import('./announcements/announcements.module').then(m => m.AnnouncementsModule),
  },
  {
    path: 'hermanos',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
  },
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
