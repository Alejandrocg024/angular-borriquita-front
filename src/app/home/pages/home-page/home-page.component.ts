import { Component, OnInit } from '@angular/core';

interface Image {
  imageSrc: string;
  alt: string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{
  ngOnInit(): void {
    this.images = this.images.sort(() => Math.random() - 0.5);
  }

  images: Image[] = [
    {
      imageSrc: 'images/home-carrusel/img-1.jpg',
      alt: 'Description for Image 1'
    },
    {
      imageSrc: 'images/home-carrusel/img-2.jpg',
      alt: 'Description for Image 2'
    },
    {
      imageSrc: 'images/home-carrusel/img-3.jpg',
      alt: 'Description for Image 3'
    },
    {
      imageSrc: 'images/home-carrusel/img-4.jpg',
      alt: 'Description for Image 4'
    },
    {
      imageSrc: 'images/home-carrusel/img-5.jpg',
      alt: 'Description for Image 5'
    },
    {
      imageSrc: 'images/home-carrusel/img-6.jpg',
      alt: 'Description for Image 6'
    },
    {
      imageSrc: 'images/home-carrusel/img-7.jpg',
      alt: 'Description for Image 7'
    },
    {
      imageSrc: 'images/home-carrusel/img-8.jpg',
      alt: 'Description for Image 8'
    },
    {
      imageSrc: 'images/home-carrusel/img-9.jpg',
      alt: 'Description for Image 9'
    }
  ];
}
