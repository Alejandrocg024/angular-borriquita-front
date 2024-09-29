import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListEventsComponent } from './pages/list-events/list-events.component';
import { HomeModule } from '../home/home.module';
import { MaterialModule } from '../material/material.module';
import { EventRoutingModule } from './event-routing.module';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { EventPageComponent } from './components/event-page/event-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MY_DATE_FORMATS } from './interfaces/dateFormats';



@NgModule({
  declarations: [
    ListEventsComponent,
    CalendarComponent,
    EventPageComponent
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    HomeModule,
    MaterialModule,
    FullCalendarModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    FormsModule
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
})
export class EventModule { }
