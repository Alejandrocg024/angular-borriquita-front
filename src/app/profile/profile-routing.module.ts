import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from '../home/layouts/layout-page/layout-page.component';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { isMayGuard } from '../auth/guards/is-may.guard';
import { ListUserComponent } from './pages/list-user/list-user.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: '', canActivate: [isMayGuard], component: AdminPanelComponent },
      { path: ':id', component: ListUserComponent },
      { path: 'editar/:id', component: UserProfileComponent },
      { path: '**', redirectTo: '' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
