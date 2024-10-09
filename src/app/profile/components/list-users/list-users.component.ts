import { inject, OnInit } from '@angular/core';
import { User } from '../../../auth/interfaces';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

/** Constants used to fill up our data base. */

@Component({
  selector: 'profile-list-users',
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent implements AfterViewInit  {
  displayedColumns: string[] = ['dni', 'name', 'lastname', 'email'];
  dataSource!: MatTableDataSource<User>;

  public users: User[] = [];
  public user: User | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  userService = inject( UserService );
  router = inject( Router );

  ngAfterViewInit() {
    this.userService.getUsers()
    .pipe(
      catchError(error => {
        this.router.navigateByUrl('');
        return of(undefined);
      })
    )
    .subscribe(
      response => {
        this.users = response!
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  applyFilter(event: Event) {
    this.user = null;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectUser(row: User) {
    this.user = row;
  }

  onUserClosed() {
    this.user = null;
  }
}
