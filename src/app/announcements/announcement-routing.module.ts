import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { AnnouncementPageComponent } from './pages/announcement-page/announcement-page.component';
import { LayoutPageComponent } from '../home/layouts/layout-page/layout-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'nueva', component: NewPageComponent },
      { path: 'editar/:id', component: NewPageComponent },
      { path: '', component: ListPageComponent },
      { path: ':id', component: AnnouncementPageComponent },
      { path: '**', redirectTo: '' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeroesRoutingModule { }
