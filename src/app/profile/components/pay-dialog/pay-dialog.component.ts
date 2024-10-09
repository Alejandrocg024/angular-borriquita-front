import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaysService } from '../../services/pays.service';
import { User } from '../../../auth/interfaces';
import { UserService } from '../../services/user.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-pay-dialog',
  templateUrl: './pay-dialog.component.html',
  styleUrl: './pay-dialog.component.css',
  providers: [provideNativeDateAdapter()],
})
export class PayDialogComponent implements OnInit {

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef);
  private paysService = inject(PaysService);

  public serverErrors: string | null = null;

  public searchInput = new FormControl('');
  public users: User[] = [];
  public selectedUser?: User;

  public payForm: FormGroup = this.fb.group({
    userPayer: [''],
    concept: ['', Validators.required],
    quantity: [0, [Validators.required, Validators.min(1)]],
    startDate: ['', Validators.required],
    finishDate: ['', Validators.required],
    state: ['', Validators.required],
  });

  private userService = inject(UserService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data.all){
      this.searchInput.disable();
    }
  }

  searchUser() {
    const value: string = this.searchInput.value || '';

    this.userService.getSuggestions( value )
      .subscribe( users => this.users = users );
  }


  onSelectedOption( event: MatAutocompleteSelectedEvent ): void {
    if ( !event.option.value ) {
      this.selectedUser = undefined;
      return;
    }

    const user: User = event.option.value;
    const fullname = `${user.name} ${user.lastname}`;
    this.searchInput.setValue( fullname );

    this.payForm.get('userPayer')?.setValue( user.id );
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  onSubmit(): void {
    this.payForm.markAllAsTouched();

    if ( this.payForm.invalid ) return;

    const data = this.payForm.value;

    this.paysService.register(data)
      .subscribe({
        next: () => this.dialogRef.close(),
        error: (message: any) => {
          this.serverErrors = message;
          console.error('Errores del servidor:', this.serverErrors);
        }
      })

  }
}
