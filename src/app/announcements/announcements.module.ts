import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AnnouncementPageComponent } from './pages/announcement-page/announcement-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';

import { HeroesRoutingModule } from './announcement-routing.module';

import { MaterialModule } from '../material/material.module';
import { HomeModule } from '../home/home.module';
import { CardComponent } from './components/card/card.component';
import { SharedModule } from '../shared/shared.module';
import { ImageModalComponent } from './components/image-modal/image-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [
    AnnouncementPageComponent,
    ListPageComponent,
    NewPageComponent,
    CardComponent,
    ImageModalComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HeroesRoutingModule,
    MaterialModule,
    HttpClientModule,
    HomeModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AnnouncementsModule { }
