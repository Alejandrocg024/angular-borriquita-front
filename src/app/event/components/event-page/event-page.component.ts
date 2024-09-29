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

  public eventForm = new FormGroup(
    {
      id: new FormControl(''),
      title: new FormControl('Pruebita', [Validators.required]),
      startDate: new FormControl<Date>(new Date(), [Validators.required]),
      endDate: new FormControl<Date>(new Date(), [Validators.required]),
      allDay: new FormControl<Boolean>(true, [Validators.required]),
      description: new FormControl('LOcura', [Validators.required]),
      location: new FormControl(''),
    }
  );

  // range = new FormGroup({
  //   start: new FormControl<Date | null>(null),
  //   end: new FormControl<Date | null>(null),
  // });

  hours = new FormGroup({
    start: new FormControl(''),
    end: new FormControl(''),
  });



  constructor(
    public dialogRef: MatDialogRef<EventPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private eventsService: EventsService,
    private authService: AuthService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUser();

    if (this.data) {
      this.eventsService.getEventById(this.data)
        .subscribe(event => {
          if (!event) return this.dialogRef.close();
          // this.range.setValue({ start: event.startDate, end: event.endDate });
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
    } else {
      this.isEditMode = true;
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  get currentEventOnForm() {
    console.log('currentEventOnForm', this.eventForm.value);
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
      console.log('daysDiff', daysDiff);
      event.endDate = addDays(event.startDate, daysDiff);
      console.log('event.endDate', event.endDate);
      console.log('event.startDate', event.startDate);
    }
    return event;
  }

  onSubmit(): void {


    if (this.eventForm.invalid) return;

    const event = this.currentEventOnForm;

    console.log('event', event);


    if (event.id) {
      console.log('Actualizando evento');
      this.eventsService.updateEvent(event)
        .subscribe(event => {
          this.eventUpdated.emit();
          this.dialogRef.close();
          this.showSnackbar(`Evento actualizado!`);
        });

      return;
    } else {
      console.log('Creando evento');
      this.eventsService.addEvent(event)
        .subscribe(event => {
          this.eventUpdated.emit();
          this.dialogRef.close();
          this.showSnackbar(`Evento creado!`);
        });

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
