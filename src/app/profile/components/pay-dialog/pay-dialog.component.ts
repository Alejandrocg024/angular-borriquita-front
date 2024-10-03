import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaysService } from '../../services/pays.service';

@Component({
  selector: 'app-pay-dialog',
  templateUrl: './pay-dialog.component.html',
  styleUrl: './pay-dialog.component.css',
  providers: [provideNativeDateAdapter()],
})
export class PayDialogComponent {

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef);
  private paysService = inject(PaysService);

  public serverErrors: string | null = null;

  public payForm: FormGroup = this.fb.group({
    user: ['66fb12bd025f63b8e0d760d0', Validators.required],
    concept: ['fff', Validators.required],
    quantity: [10.56, [Validators.required, Validators.min(1)]],
    startDate: ['', Validators.required],
    finishDate: ['', Validators.required],
    state: ['PENDING', Validators.required],
  });

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
          console.log('Errores del servidor:', this.serverErrors);
        }
      })
  }
}
