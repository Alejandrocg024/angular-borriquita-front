import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaysService } from '../../services/pays.service';
import { catchError, of, switchMap } from 'rxjs';
import { Pay } from '../../interfaces/pay.interface';

@Component({
  selector: 'app-confirm-pay',
  templateUrl: './confirm-pay.component.html',
  styleUrl: './confirm-pay.component.css'
})
export class ConfirmPayComponent implements OnInit{
  public pay!: Pay;

  constructor(
    private paysService: PaysService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.activatedRoute.params
      .pipe(
        switchMap( ({ token }) => this.paysService.payCard(token)),
        catchError(() => {
          this.router.navigateByUrl('');
          return of(undefined);
        })
      )
      .subscribe( res => {
        this.pay = res!;
        return;
      })

  }

}
