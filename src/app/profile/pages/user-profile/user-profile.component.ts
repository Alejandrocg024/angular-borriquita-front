import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { catchError, of, switchMap } from 'rxjs';
import { User, Role } from '../../../auth/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../shared/service/validators.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  providers: [provideNativeDateAdapter()],
})
export class UserProfileComponent implements OnInit {

  public user: User | null = null;
  public serverErrors: string | null = null;
  public hasAllPermission = true;

  private activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);
  private router = inject(Router);
  private validatorsService = inject(ValidatorsService);
  private fb = inject(FormBuilder);
  private snackbar = inject(MatSnackBar);
  private authService = inject(AuthService);

  public roles = [
    { value: Role.Comm, label: 'Comunicación' },
    { value: Role.Mayord, label: 'Mayordomo' }
  ];


  public userForm: FormGroup = this.fb.group({
    id: ['', [Validators.required]],
    dni: ['12345678Z', [Validators.required, Validators.pattern(this.validatorsService.dniPattern)]],
    name: ['Alejandro', [Validators.required, Validators.minLength(3)]],
    lastname: ['Campano Galán', [Validators.required, Validators.minLength(3)]],
    password: ['admin123', [Validators.required, Validators.minLength(6)]],
    birthDate: [new Date(), [Validators.required]],
    email: ['alecamgal1@alum.us.es', [Validators.required, Validators.pattern(this.validatorsService.emailPattern)]],
    address: ['Calle falsa 123'],
    role: [],
  });

  ngOnInit(): void {


    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.userService.getUserById(id)),
        catchError(() => {
          this.router.navigateByUrl('');
          return of(undefined);
        })
      )
      .subscribe(user => {
        if (!user) return this.router.navigate(['']);

        this.user = user;


        const { password: _, ...userEntity } = user;
        this.userForm.reset(user);
        this.userForm.patchValue({password: '******'});
        return;
      })

    const me = this.authService.currentUser();
    if(!(me?.role === Role.Admin || me?.role===Role.Mayord)){
      this.hasAllPermission = false;
      this.userForm.get('dni')!.disable();
      this.userForm.get('name')!.disable();
      this.userForm.get('lastname')!.disable();
      this.userForm.get('birthDate')!.disable();
      this.userForm.get('role')!.disable();
    } else if(!(me?.role === Role.Admin)){
      this.userForm.get('role')!.disable();
    }

  }

  get currentUser() {
    if(this.userForm.get('password')?.value !== '******') this.userForm.patchValue({password: this.user?.password});
    const user = this.userForm.value as User;
    return user;
  }

  onSubmit(): void {
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid) return;

    const data = this.userForm.value;


    this.userService.updateUser(data)
      .subscribe({
        next: (res) => {
          this.showSnackbar(`Usuario actualizado!`)
          this.router.navigateByUrl('/hermanos/' + res.id);
        },
        error: (message: any) => {
          this.serverErrors = message;
          console.log('Errores del servidor:', this.serverErrors);
        }
      })

  }

  onDelete(): void {
    if (!this.user) return;

    this.userService.deleteUser(this.user.id)
      .subscribe({
        next: () => {
          this.showSnackbar(`Usuario eliminado!`)
          this.router.navigateByUrl('/hermanos');
        },
        error: (message: any) => {
          this.serverErrors = message;
          console.log('Errores del servidor:', this.serverErrors);
        }
      })
  }


  showSnackbar(message: string): void {
    this.snackbar.open(message, 'Cerrar', {
      duration: 5000,
    })
  }

  isEditingPassword = false;


  togglePasswordEdit(): void {
    this.isEditingPassword = !this.isEditingPassword;
  }

}
