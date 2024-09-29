import { Component, Input } from '@angular/core';

interface carouselImage {
  imageSrc: string;
  alt?: string;
}

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.css'
})
export class ImageCarouselComponent {

  @Input() imagesCarousel: carouselImage[] = [];
  @Input() imagesURL: string[] = [];
  @Input() interval: number = 3000;

  public images: carouselImage[] = [];

  public selectedIndex: number = 0;

  ngOnInit(): void {
    this.images = this.imagesCarousel.length > 0 ? this.imagesCarousel : this.imagesURL!.map(imageSrc => ({ imageSrc }));
    this.images = this.images.sort(() => Math.random() - 0.5);

    if(this.interval > 0) {
      setInterval(() => {
        this.nextImage();
      }, this.interval);
    }
  }

  selectImage(index: number) {
    this.selectedIndex = index;
  }

  nextImage() {
    this.selectedIndex = (this.selectedIndex + 1) % this.images.length;
  }

  prevImage() {
    this.selectedIndex = (this.selectedIndex - 1 + this.images.length) % this.images.length;
  }

}
