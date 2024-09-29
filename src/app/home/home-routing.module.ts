import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeLayoutPageComponent } from './layouts/home-layout-page/home-layout-page.component';


const routes: Routes = [
  {
    path: '',
    component: HomeLayoutPageComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: '**', redirectTo: '' },
    ]
  }
];




@NgModule({
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ],
})
export class HomeRoutingModule { }
