import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from '../home/layouts/layout-page/layout-page.component';
import { isMayGuard } from '../auth/guards/is-may.guard';


const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: '**', redirectTo: '' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestFormRoutingModule { }
