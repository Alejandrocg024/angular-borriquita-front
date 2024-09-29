import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {

  private fb          = inject( FormBuilder );
  private authService = inject( AuthService );
  private router      = inject( Router )


  public myForm: FormGroup = this.fb.group({
    dni:    ['12345678Z', [ Validators.required ]],
    password: ['admin123', [ Validators.required, Validators.minLength(6) ]],
  });

  onLogin() {
    const { dni, password } = this.myForm.value;

    this.authService.login(dni, password)
      .subscribe({
        next: () => this.router.navigateByUrl('/profile'),
        error: (message) => {
          Swal.fire('Error', message.error, 'error' )
        }
      })

  }


}
