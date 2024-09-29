import { Component , signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { EventsService } from '../../services/events.service';
import { EventPageComponent } from '../event-page/event-page.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'event-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit{
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    locale: esLocale,
    initialView: 'dayGridMonth',
    initialEvents: [],
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* TODO: you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(private changeDetector: ChangeDetectorRef,
    private eventsService: EventsService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventsService.getInitialEvents().subscribe(res => {
      this.calendarOptions.update(options => ({
        ...options,
        events: res
      }));
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection
    console.log(selectInfo);
    // calendarApi.addEvent({
    //   id: '19',
    //   title,
    //   start: selectInfo.startStr,
    //   end: selectInfo.endStr,
    //   allDay: selectInfo.allDay
    // });

  }

  onNewEvent() {
    const dialogRef = this.dialog.open(EventPageComponent);

    dialogRef.componentInstance.eventUpdated.subscribe(() => {
      this.loadEvents();
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    // if (confirm(`Estas seguro que quieres eliminar el evento '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove();
    // }
    const dialogRef = this.dialog.open(EventPageComponent, {
      data: clickInfo.event.id
    });

    dialogRef.componentInstance.eventUpdated.subscribe(() => {
      this.loadEvents();
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }
}
