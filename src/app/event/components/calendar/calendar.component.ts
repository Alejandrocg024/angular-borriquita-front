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
import { AuthService } from '../../../auth/services/auth.service';
import { User, Role } from '../../../auth/interfaces';

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
  });
  currentEvents = signal<EventApi[]>([]);

  public user: User | null = null;
  public Role = Role;

  constructor(private changeDetector: ChangeDetectorRef,
    private eventsService: EventsService,
    private authService: AuthService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser();
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
    if(!(this.user!.role === Role.Admin || this.user!.role === Role.Comm)) return;

    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    const dialogRef = this.dialog.open(EventPageComponent, {
      data: { selectInfo }});

    dialogRef.componentInstance.eventUpdated.subscribe(() => {
      this.loadEvents();
    });
  }

  onNewEvent() {
    const dialogRef = this.dialog.open(EventPageComponent);

    dialogRef.componentInstance.eventUpdated.subscribe(() => {
      this.loadEvents();
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    const dialogRef = this.dialog.open(EventPageComponent, {
      data: {
        id: clickInfo.event.id
      }
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
