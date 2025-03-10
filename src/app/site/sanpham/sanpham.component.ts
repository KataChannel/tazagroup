import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadscrumbComponent } from '../../shared/common/breadscrumb/breadscrumb.component';
import { Sanphams } from '../../shared/mockdata/sanpham';
import { MatTabsModule } from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { SwiperComponent } from '../../shared/common/swiper/swiper.component';
@Component({
  selector: 'app-sanpham',
  imports: [
    CommonModule,
    BreadscrumbComponent,
    MatTabsModule,
    MatExpansionModule,
    SwiperComponent
  ],
  templateUrl: './sanpham.component.html',
  styleUrl: './sanpham.component.scss'
})
export class SanphamComponent {
  Sanpham: any={};
  ListSanpham: any[]=Sanphams;
  Breadcrumbs: any[] = [];
  ListTabs:any[]=[
    {id:1,Title:'Thành Phần',Value:'Thanhphan'},
    {id:2,Title:'Công Dụng',Value:'Congdung'},
    {id:3,Title:'Chỉ Định',Value:'Chidinh'},
    {id:4,Title:'Hướng Dẫn',Value:'Huongdan'}
  ]
  Cauhois:any[]=[
    {id:1,Title:'Câu hỏi 1',Answer:'Câu trả lời 1'},
    {id:2,Title:'Câu hỏi 2',Answer:'Câu trả lời 2'},
    {id:3,Title:'Câu hỏi 3',Answer:'Câu trả lời 3'},
    {id:4,Title:'Câu hỏi 4',Answer:'Câu trả lời 4'},
    {id:5,Title:'Câu hỏi 5',Answer:'Câu trả lời 5'},
    {id:6,Title:'Câu hỏi 6',Answer:'Câu trả lời 6'},
    {id:7,Title:'Câu hỏi 7',Answer:'Câu trả lời 7'},
    {id:8,Title:'Câu hỏi 8',Answer:'Câu trả lời 8'},
    {id:9,Title:'Câu hỏi 9',Answer:'Câu trả lời 9'},
    {id:10,Title:'Câu hỏi 10',Answer:'Câu trả lời 10'},
  ]
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
    const result = slugSP?.split("-v1")[0];
    this.Sanpham = this.ListSanpham.find(v=>v.Slug==result);
    console.log(this.Sanpham);
    if(!this.Sanpham)
    {
      location.href="/404";
      return
    }
    this.Breadcrumbs=[
      {name: 'Trang chủ', link: '/'},
      {name: 'Danh sách sản phẩm', link: '/danh-muc'},
      {name: this.Sanpham?.Title, link: `${this.Sanpham?.slug}-v1`}
    ]
    console.log(this.Breadcrumbs);
    
  }
}
