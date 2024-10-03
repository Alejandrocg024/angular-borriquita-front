import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ValidatorsService } from '../../../shared/service/validators.service';


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


  public registerForm: FormGroup = this.fb.group({
    dni:    ['12345678Z', [ Validators.required, Validators.pattern(this.validatorsService.dniPattern ) ]],
    name: ['Alejandro', [ Validators.required, Validators.minLength(3) ]],
    lastname: ['Campano Galán', [ Validators.required, Validators.minLength(3) ]],
    password: ['admin123', [ Validators.required, Validators.minLength(6) ]],
    password2: ['admin123', [ Validators.required, Validators.minLength(6) ]],
    birthDate: [new Date(), [Validators.required]],
    email: ['alecamgal1@alum.us.es', [ Validators.required, Validators.pattern(this.validatorsService.emailPattern) ]],
    address: ['Calle falsa 123'],
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualFieldTwo('password','password2')
    ]
  });

  isValidField( field: string ) {
    return this.validatorsService.isValidField( this.registerForm, field );
  }

  onSubmit() {
    this.registerForm.markAllAsTouched();

    if ( this.registerForm.invalid ) return;

    const data = this.registerForm.value;

    this.authService.register(data)
      .subscribe({
        next: () => this.router.navigateByUrl('/profile'),
        error: (message: any) => {
          this.serverErrors = message;
          console.log('Errores del servidor:', this.serverErrors);
        }
      })
  }
}
