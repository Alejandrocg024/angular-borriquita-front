import { Component, EventEmitter, Inject, inject, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../auth/interfaces';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Pay, PayMethod, PayState } from '../../interfaces/pay.interface';
import { PaysService } from '../../services/pays.service';
import { AuthService } from '../../../auth/services/auth.service';


@Component({
  selector: 'profile-pay-component',
  templateUrl: './pay-component.component.html',
  styleUrl: './pay-component.component.css'
})
export class PayComponentComponent implements OnInit {
  @Input() payId!: string;
  public pay!: Pay;
  public user!: User;
  @Output() closed = new EventEmitter<void>();
  public myPay= false;

  public states = [
    { value: PayState.Pending, label: 'Pendiente' },
    { value: PayState.Paid, label: 'Pagado' },
    { value: PayState.Cancelled, label: 'Cancelado' }
  ];

  public method = [
    { value: PayMethod.Cash, label: 'Efectivo' },
    { value: PayMethod.Card, label: 'Tarjeta' }
  ];

  router = inject( Router );
  userService = inject( UserService );
  paysService = inject( PaysService );
  authService = inject( AuthService );

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.paysService.getPayById(this.payId).subscribe(pay => {
      this.pay = pay!;
      this.user = pay!.user as unknown as User;
      this.myPay = this.authService.currentUser()?.id === this.user.id;
    });
  }


  getStateLabel(value: PayState): string {
    const state = this.states.find(s => s.value === value);
    return state ? state.label : 'Desconocido';
  }

  getStateClass(value: PayState): string {
    switch (value) {
      case PayState.Pending:
        return 'state-pending';
      case PayState.Paid:
        return 'state-paid';
      case PayState.Cancelled:
        return 'state-cancelled';
      default:
        return '';
    }
  }

  getMethodLabel(value: PayMethod): string {
    const method = this.method.find(m => m.value === value);
    return method ? method.label : 'Desconocido';
  }



  onClose() {
    this.closed.emit();
  }

  onPay(){
    this.paysService.update(this.pay)
  }

  onCancel() {
    this.paysService.deletePay(this.pay.id)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/hermanos');
        },
      })
  }
}
