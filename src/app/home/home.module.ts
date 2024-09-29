import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeRoutingModule } from './home-routing.module';
import { LayoutPageComponent } from './layouts/layout-page/layout-page.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeLayoutPageComponent } from './layouts/home-layout-page/home-layout-page.component';



@NgModule({
  declarations: [
    LayoutPageComponent,
    HomeLayoutPageComponent,
    HomePageComponent,
    NavbarComponent,
    FooterComponent

  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    SharedModule,
  ],
  exports: [
    NavbarComponent,
    FooterComponent
  ]
})
export class HomeModule { }
