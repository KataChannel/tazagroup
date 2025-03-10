import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
Swiper.use([Navigation, Pagination, Autoplay]); // Khai báo các module đã import
@Component({
  selector: 'app-swiper',
  imports: [
    MatIconModule,
    CommonModule
  ],
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss'
})
export class SwiperComponent implements AfterViewInit {
  @ViewChild('swiperRef', { static: false }) swiperRef!: ElementRef;
  @Input() Config:any
  @Input() Type:any
  @Input() slides:any[] = [
    { Image: '/demo/banner1.jpg', title: 'Slide 1 Title', description: 'Slide 1 Description' },
    { Image: '/demo/banner1.jpg', title: 'Slide 2 Title', description: 'Slide 2 Description' },
    { Image: '/demo/banner1.jpg', title: 'Slide 3 Title', description: 'Slide 3 Description' },
  ];
  swiper?: Swiper;
  ngAfterViewInit(): void {
    if(!this.Config)
    {
      this.Config = {
        // Các tùy chọn của Swiper
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        autoplay: false,
        // autoplay: {
        //   delay: 2500,
        //   disableOnInteraction: false,
        // },
      }
    }
    else{
      this.Config = this.Config
    }
    this.swiper = new Swiper(this.swiperRef.nativeElement, this.Config);
  }
}