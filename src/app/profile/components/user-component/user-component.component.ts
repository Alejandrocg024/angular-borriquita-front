import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { User } from '../../../auth/interfaces';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'profile-user-component',
  templateUrl: './user-component.component.html',
  styleUrl: './user-component.component.css'
})
export class UserComponentComponent {
  @Input() user!: User;
  @Output() closed = new EventEmitter<void>();

  public isEditMode: boolean = false;

  router = inject( Router );
  userService = inject( UserService );

  onClose() {
    this.closed.emit();
  }
}
