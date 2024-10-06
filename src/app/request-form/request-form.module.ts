import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewRequestComponent } from './components/new-request/new-request.component';
import { NewResponseComponent } from './components/new-response/new-response.component';
import { RequestComponent } from './pages/request/request.component';
import { RequestFormRoutingModule } from './request-form-routing.module';
import { MaterialModule } from '../material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeModule } from '../home/home.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    NewRequestComponent,
    NewResponseComponent,
    RequestComponent
  ],
  imports: [
    CommonModule,
    RequestFormRoutingModule,
    MaterialModule,
    HttpClientModule,
    HomeModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class RequestFormModule { }
