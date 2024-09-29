import { NgModule } from '@angular/core';
import { LazyImageComponent } from './components/lazy-image/lazy-image.component';
import { CommonModule } from '@angular/common';
import { ImageCarouselComponent } from './components/image-carousel/image-carousel.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    LazyImageComponent,
    ImageCarouselComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    LazyImageComponent,
    ImageCarouselComponent
  ]
})
export class SharedModule { }
