import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventsService } from '../../services/events.service';
import { Event } from '../../interfaces/event.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { Role, User } from '../../../auth/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';
import { addDays } from '@fullcalendar/core/internal';
import { DateSelectArg } from '@fullcalendar/core/index.js';

export interface DataRequest {
  id?: string;
  selectInfo?: DateSelectArg;
}

@Component({
  selector: 'event-event-page',
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.css',
  providers: [provideNativeDateAdapter()],
})
export class EventPageComponent implements OnInit {
  @Output() eventUpdated = new EventEmitter<void>();


  public event?: Event;
  public user: User | null = null;
  public Role = Role;
  public selectedTime: string = '';
  public isEditMode: boolean = false;
  public serverErrors: string | null = null;

  public eventForm = new FormGroup(
    {
      id: new FormControl(''),
      title: new FormControl('', [Validators.required, Validators.minLength(5)]),
      startDate: new FormControl<Date>(new Date(), [Validators.required]),
      endDate: new FormControl<Date>(new Date(), [Validators.required]),
      allDay: new FormControl<Boolean>(true, [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(5)]),
      location: new FormControl(''),
    }
  );

  hours = new FormGroup({
    start: new FormControl(''),
    end: new FormControl(''),
  });



  constructor(
    public dialogRef: MatDialogRef<EventPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataRequest,
    private eventsService: EventsService,
    private authService: AuthService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUser();

    if(!this.data) this.isEditMode = true;
    else if (this.data.id) {
      this.eventsService.getEventById(this.data.id)
        .subscribe(event => {
          if (!event) return this.dialogRef.close();
          if (event.allDay) {
            this.hours.setValue({ start: '', end: '' });
          } else {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);
            const start = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
            const end = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
            this.hours.setValue({ start, end });
          }


          this.event = event;
          this.eventForm.reset(event);
        })
    } else if (this.data.selectInfo && (this.user!.role === Role.Admin || this.user!.role === Role.Comm)) {
      this.isEditMode = true;
      const { startStr, endStr } = this.data.selectInfo;
      const dates = { startDate: new Date(startStr), endDate: new Date(endStr) };
      this.eventForm.patchValue(dates);
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  get currentEventOnForm() {
    const event = this.eventForm.value as Event;
    const hoursStart = this.hours.value.start?.split(':') || [];
    const endStart = this.hours.value.end?.split(':') || [];

    if (hoursStart.length === 2 || endStart.length === 2) {
      event.startDate = new Date(event.startDate);
      event.endDate = new Date(event.endDate);
      event.startDate.setHours(Number(hoursStart[0]), Number(hoursStart[1]));
      event.endDate.setHours(Number(endStart[0]), Number(endStart[1]));
    } else {
      const daysDiff = event.endDate.getDate() - event.startDate.getDate();
      event.endDate = addDays(event.startDate, daysDiff);
    }
    return event;
  }

  onSubmit(): void {
    this.eventForm.markAllAsTouched();

    if (this.eventForm.invalid) return;

    const event = this.currentEventOnForm;


    if (event.id) {
      this.eventsService.updateEvent(event)
        .subscribe({
          next: (event) => {
            this.eventUpdated.emit();
            this.dialogRef.close();
            this.showSnackbar(`Evento actualizado!`);
          },
          error: (message) => {
            this.serverErrors = message;
            console.error('Errores del servidor:', this.serverErrors);
          }
        })

      return;
    } else {
      this.eventsService.addEvent(event)
      .subscribe({
        next: (event) => {
          this.eventUpdated.emit();
          this.dialogRef.close();
          this.showSnackbar(`Evento creado!`);
        },
        error: (message) => {
          this.serverErrors = message;
          console.error('Errores del servidor:', this.serverErrors);
        }
      })

      return;
    }
  }

  onDelete() {
    if (!this.event!.id) throw Error('Id del evento es requerido');

    this.eventsService.deleteEvent(this.event!.id)
      .subscribe(event => {
        this.eventUpdated.emit();
        this.dialogRef.close();
        this.showSnackbar(`Evento borrado!`);
      });

    return;

  }


  showSnackbar(message: string): void {
    this.snackbar.open(message, 'Cerrar', {
      duration: 5000,
    })
  }
}
