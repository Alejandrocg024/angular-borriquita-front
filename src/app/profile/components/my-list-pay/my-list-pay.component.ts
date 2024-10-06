import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Pay, PayState } from '../../interfaces/pay.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { PaysService } from '../../services/pays.service';
import { catchError, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PayDialogComponent } from '../pay-dialog/pay-dialog.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'profile-my-list-pay',
  templateUrl: './my-list-pay.component.html',
  styleUrl: './my-list-pay.component.css'
})
export class MyListPayComponent implements AfterViewInit  {
  displayedColumns: string[] = ['concept', 'state', 'finishDate', 'quantity'];
  dataSource!: MatTableDataSource<Pay>;

  public pays: Pay[] = [];
  public pay: Pay | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialog = inject(MatDialog)

  paysService = inject( PaysService );
  router = inject( Router );
  authService = inject( AuthService );

  ngAfterViewInit() {
    this.paysService.getPays()
    .pipe(
      catchError(error => {
        this.router.navigateByUrl('');
        return of(undefined);
      })
    )
    .subscribe(
      response => {
        this.authService.currentUser()?.id;
        this.pays = response!.filter(pay => pay.user === this.authService.currentUser()?.id);
        this.dataSource = new MatTableDataSource(this.pays);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  applyFilter(event: Event) {
    this.pay = null;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectPay(row: Pay) {
    this.pay = row;
  }

  onPayClosed() {
    this.pay = null;
  }

  public states = [
    { value: PayState.Pending, label: 'Pendiente' },
    { value: PayState.Paid, label: 'Pagado' },
    { value: PayState.Cancelled, label: 'Cancelado' }
  ];


  getStateLabel(value: PayState): string {
    const state = this.states.find(s => s.value === value);
    return state ? state.label : 'Desconocido';
  }

  onNewPay(): void {
    this.dialog.open(PayDialogComponent, {
      width: '400px',
      data: {}
    });

  }

  onNewAllPay(): void {
    this.dialog.open(PayDialogComponent, {
      width: '400px',
      data: { all: true }
    });

  }
}
