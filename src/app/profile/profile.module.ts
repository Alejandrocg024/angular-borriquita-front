import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from '../material/material.module';
import { HomeModule } from '../home/home.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserComponentComponent } from './components/user-component/user-component.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ListUserComponent } from './pages/list-user/list-user.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { ListPayComponent } from './components/list-pay/list-pay.component';
import { PayComponentComponent } from './components/pay-component/pay-component.component';
import { PayDialogComponent } from './components/pay-dialog/pay-dialog.component';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../event/interfaces/dateFormats';
import { ConfirmPayComponent } from './pages/confirm-pay/confirm-pay.component';
import { MyListPayComponent } from './components/my-list-pay/my-list-pay.component';


@NgModule({
  declarations: [
    ListUsersComponent,
    UserProfileComponent,
    UserComponentComponent,
    ListUserComponent,
    AdminPanelComponent,
    ListPayComponent,
    PayComponentComponent,
    PayDialogComponent,
    ConfirmPayComponent,
    MyListPayComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MaterialModule,
    HttpClientModule,
    HomeModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
})
export class ProfileModule { }
