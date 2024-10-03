import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Pay } from '../../interfaces/pay.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { PaysService } from '../../services/pays.service';
import { catchError, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PayDialogComponent } from '../pay-dialog/pay-dialog.component';

@Component({
  selector: 'profile-list-pay',
  templateUrl: './list-pay.component.html',
  styleUrl: './list-pay.component.css'
})
export class ListPayComponent implements AfterViewInit  {
  displayedColumns: string[] = ['dni', 'concept', 'quantity', 'state'];
  dataSource!: MatTableDataSource<Pay>;

  public pays: Pay[] = [];
  public pay: Pay | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialog = inject(MatDialog)

  paysService = inject( PaysService );
  router = inject( Router );

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
        this.pays = response!
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

  onNewPay(): void {
    const dialogRef = this.dialog.open(PayDialogComponent, {
      width: '400px',
      data: {}
    });
  }
}
