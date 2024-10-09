import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ValidatorsService } from '../../../shared/service/validators.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  providers: [provideNativeDateAdapter()],
})
export class RegisterPageComponent {
  public serverErrors: string | null = null;


  private fb          = inject( FormBuilder );
  private authService = inject( AuthService );
  private router      = inject( Router );
  private validatorsService = inject( ValidatorsService );
  private snackbar = inject( MatSnackBar );


  public registerForm: FormGroup = this.fb.group({
    dni:    ['', [ Validators.required, Validators.pattern(this.validatorsService.dniPattern ) ]],
    name: ['', [ Validators.required, Validators.minLength(3) ]],
    lastname: ['', [ Validators.required, Validators.minLength(3) ]],
    password: ['', [ Validators.required, Validators.minLength(6) ]],
    password2: ['', [ Validators.required, Validators.minLength(6) ]],
    birthDate: [new Date(), [Validators.required, this.validatorsService.isValidDate]],
    email: ['', [ Validators.required, Validators.pattern(this.validatorsService.emailPattern) ]],
    address: [''],
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualFieldTwo('password','password2')
    ]
  });

  isValidField( field: string ) {
    return this.validatorsService.isValidField( this.registerForm, field );
  }

  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'Cerrar', {
      duration: 5000,
    })
  }

  onSubmit() {
    this.registerForm.markAllAsTouched();

    if ( this.registerForm.invalid ) return;

    const data = this.registerForm.value;

    this.authService.register(data)
      .subscribe({
        next: () => {
          this.showSnackbar('Usuario registrado correctamente. Para usarlo, valida su correo electrónico.');
          this.router.navigateByUrl('/auth/login')
        },
        error: (message: any) => {
          this.serverErrors = message;
          console.error('Errores del servidor:', this.serverErrors);
        }
      })
  }
}
