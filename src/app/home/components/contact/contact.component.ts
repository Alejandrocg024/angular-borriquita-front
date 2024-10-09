import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestFormService } from '../../../request-form/services/request-form.service';
import { RequestForm } from '../../../request-form/interfaces/request-form.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidatorsService } from '../../../shared/service/validators.service';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces';

@Component({
  selector: 'home-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {

  public isContentVisible = false;
  public serverErrors: string | null = null;


  private fb          = inject( FormBuilder );
  private requestFormService = inject( RequestFormService );
  private snackbar = inject( MatSnackBar );
  private validatorsService = inject( ValidatorsService );
  private authService = inject( AuthService );

  public contactForm: FormGroup = this.fb.group({
    type:    ['', [ Validators.required ]],
    date:    [new Date(), [ Validators.required ]],
    details: ['', [ Validators.required, Validators.minLength(10) ]],
    email:   ['', [ Validators.required, Validators.pattern(this.validatorsService.emailPattern) ]],
  });

  ngOnInit(): void {
    this.contactForm.get('email')?.setValue(this.authService.currentUser()?.email);
  }

  get currentForm() {
    const ann = this.contactForm.value as RequestForm;
    return ann;
  }

  onSubmit() {
    this.contactForm.markAllAsTouched();

    if ( this.contactForm.invalid ) return;

    const data = this.contactForm.value;

    this.requestFormService.create(data)
      .subscribe({
        next: () => {
          this.contactForm.reset();
          this.showSnackbar('Formulario enviado correctamente. Recibiras una respuesta en tu correo.')},
        error: (message: any) => {
          this.serverErrors = message;
          console.error('Errores del servidor:', this.serverErrors);
        }
    })
  }

  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'Cerrar', {
      duration: 5000,
    })
  }

  toggleContentVisibility() {
    this.isContentVisible = !this.isContentVisible;
  }
}
