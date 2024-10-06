import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ValidatorsService } from '../../../shared/service/validators.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  public serverErrors: string | null = null;
  public haveToPay: boolean = false;

  private fb          = inject( FormBuilder );
  private authService = inject( AuthService );
  private router      = inject( Router );
  private validatorsService = inject( ValidatorsService );
  private snackbar = inject( MatSnackBar );


  public myForm: FormGroup = this.fb.group({
    dni:    ['12345678Z', [ Validators.required, Validators.pattern(this.validatorsService.dniPattern ) ]],
    password: ['admin123', [ Validators.required, Validators.minLength(6) ]],
  });

  onLogin() {
    this.myForm.markAllAsTouched();

    if ( this.myForm.invalid ) return;

    const { dni, password } = this.myForm.value;

    this.authService.login(dni, password)
      .subscribe({
        next: () => this.router.navigateByUrl('/profile'),
        error: (message) => {
          if( message = 'Tienes cuotas pendientes de pago'){
            this.haveToPay = true;
          }
          this.serverErrors = message;
          console.log('Errores del servidor:', this.serverErrors);
        }
      })

  }

}
