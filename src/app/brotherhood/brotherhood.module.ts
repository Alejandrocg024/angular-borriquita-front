import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoPageComponent } from './pages/info-page/info-page.component';
import { BrotherhoodRoutingModule } from './brotherhood-routing.module';
import { HomeModule } from '../home/home.module';
import { MaterialModule } from '../material/material.module';
import { InformationComponent } from './components/information/information.component';
import { TitularesComponent } from './components/titulares/titulares.component';
import { DomingoComponent } from './components/domingo/domingo.component';



@NgModule({
  declarations: [
    InfoPageComponent,
    InformationComponent,
    TitularesComponent,
    DomingoComponent
  ],
  imports: [
    CommonModule,
    BrotherhoodRoutingModule,
    HomeModule,
    MaterialModule
  ],
})
export class BrotherhoodModule { }
