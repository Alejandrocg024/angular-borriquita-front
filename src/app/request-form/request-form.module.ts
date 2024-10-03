import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewRequestComponent } from './components/new-request/new-request.component';
import { NewResponseComponent } from './components/new-response/new-response.component';
import { RequestComponent } from './pages/request/request.component';



@NgModule({
  declarations: [
    NewRequestComponent,
    NewResponseComponent,
    RequestComponent
  ],
  imports: [
    CommonModule
  ]
})
export class RequestFormModule { }
