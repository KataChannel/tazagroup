import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadscrumbComponent } from '../../shared/common/breadscrumb/breadscrumb.component';
import { Sanphams } from '../../shared/mockdata/sanpham';
import { MatTabsModule } from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { SwiperComponent } from '../../shared/common/swiper/swiper.component';
import { Baiviets } from '../../shared/mockdata/baiviet';
@Component({
  selector: 'app-baiviet',
  imports: [
    CommonModule,
    BreadscrumbComponent,
    MatTabsModule,
    MatExpansionModule,
    SwiperComponent
  ],
  templateUrl: './baiviet.component.html',
  styleUrl: './baiviet.component.scss'
})
export class BaivietComponent {
  Baiviet: any={};
  ListBaiviet: any[]=Baiviets;
  Breadcrumbs: any[] = [];
  Config:any={
    slidesPerView: 2,
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
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 50,
      },
    },
  }
  constructor(
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    const slugSP = this.route.snapshot.paramMap.get('slug');
    const result = slugSP?.split("-v3")[0];
    console.log(result);
    this.Baiviet = this.ListBaiviet.find(v=>v.Slug==result);
    console.log(this.Baiviet);
    if(!this.Baiviet)
    {
      location.href="/404";
      return;
    }
    this.Breadcrumbs=[
      {name: 'Trang chủ', link: '/'},
      {name: 'Danh sách sản phẩm', link: '/danh-muc'},
      {name: this.Baiviet?.Title, link: `${this.Baiviet?.slug}-v3`}
    ]
    console.log(this.Breadcrumbs);
    
  }
}
