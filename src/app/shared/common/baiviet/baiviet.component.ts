import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
Swiper.use([Navigation, Pagination, Autoplay]); // Khai báo các module đã import
@Component({
  selector: 'app-baiviet',
  imports: [],
  templateUrl: './baiviet.component.html',
  styleUrl: './baiviet.component.scss'
})
export class BaivietComponent implements AfterViewInit {
  @ViewChild('swiperRef', { static: false }) swiperRef!: ElementRef;
  @Input() Config:any
  @Input() Heading:any
  swiper?: Swiper;
  slides = [
    { image: 'https://vcdn1-dulich.vnecdn.net/2018/12/07/ve-dep-cua-doi-che-o-phu-tho-duoc-giai-anh-quoc-te-gioi-thieu-1544156909.png?w=1200&h=0&q=100&dpr=1&fit=crop&s=8yyOVKR-BPYcs0rNnBKxRg', title: 'Slide 1 Title', description: 'Slide 1 Description' },
    { image: 'https://vcdn1-dulich.vnecdn.net/2018/12/07/ve-dep-cua-doi-che-o-phu-tho-duoc-giai-anh-quoc-te-gioi-thieu-1544156909.png?w=1200&h=0&q=100&dpr=1&fit=crop&s=8yyOVKR-BPYcs0rNnBKxRg', title: 'Slide 2 Title', description: 'Slide 2 Description' },
    { image: 'https://fantasea.vn/wp-content/uploads/2019/01/%C4%91%E1%BA%A1i-di%E1%BB%87n-4.jpg', title: 'Slide 3 Title', description: 'Slide 3 Description' },
    { image: 'https://vcdn1-dulich.vnecdn.net/2018/12/07/ve-dep-cua-doi-che-o-phu-tho-duoc-giai-anh-quoc-te-gioi-thieu-1544156909.png?w=1200&h=0&q=100&dpr=1&fit=crop&s=8yyOVKR-BPYcs0rNnBKxRg', title: 'Slide 1 Title', description: 'Slide 1 Description' },
    { image: 'https://vcdn1-dulich.vnecdn.net/2018/12/07/ve-dep-cua-doi-che-o-phu-tho-duoc-giai-anh-quoc-te-gioi-thieu-1544156909.png?w=1200&h=0&q=100&dpr=1&fit=crop&s=8yyOVKR-BPYcs0rNnBKxRg', title: 'Slide 2 Title', description: 'Slide 2 Description' },
    { image: 'https://fantasea.vn/wp-content/uploads/2019/01/%C4%91%E1%BA%A1i-di%E1%BB%87n-4.jpg', title: 'Slide 3 Title', description: 'Slide 3 Description' },
  ];
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