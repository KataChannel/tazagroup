import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadscrumbComponent } from '../../shared/common/breadscrumb/breadscrumb.component';
import { Sanphams } from '../../shared/mockdata/sanpham';
import { MatTabsModule } from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { SwiperComponent } from '../../shared/common/swiper/swiper.component';
import { Baiviets } from '../../shared/mockdata/baiviet';
import { Gioithieus } from '../../shared/mockdata/gioithieu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-gioithieu',
  imports: [
    CommonModule,
    BreadscrumbComponent,
    MatTabsModule,
    MatExpansionModule,
    SwiperComponent,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    FormsModule,
    MatButtonModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './gioithieu.component.html',
  styleUrl: './gioithieu.component.scss'
})
export class GioithieuComponent {
  SearchParams: any = {
    Batdau:moment().startOf('week').toDate(),
    Ketthuc: moment().endOf('week').toDate(),
    pageSize:9999,
    pageNumber:0
  };
  ApplyDate()
  {
    this.ngOnInit()    
  }
  Gioithieu: any={};
  ListGioithieu: any[]=Gioithieus;
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
  ListLieutrinhs:any[]=[
    {id:1,Title:"Liệu trình phục hồi da mỏng yếu",slug:"lieu-trinh-phuc-hoi-da-mong-yeu"},
    {id:2,Title:"Liệu trình thu nhỏ lỗ chân lông",slug:"lieu-trinh-thu-nho-lo-chan-long"},
    {id:3,Title:"Liệu trình dưỡng ẩm cấp nước",slug:"lieu-trinh-duong-am-cap-nuoc"},
    {id:4,Title:"Liệu trình chăm sóc da chảy xệ, nếp nhăn",slug:"lieu-trinh-cham-soc-da-chay-xe-nep-nhan"},
    {id:5,Title:"Liệu trình trị nám, trắng da",slug:"lieu-trinh-tri-nam-trang-da"},
    {id:6,Title:"Liệu trình nâng cơ trẻ hóa dây chằng Biolift",slug:"lieu-trinh-nang-co-tre-hoa-day-chang-biolift"},
    {id:7,Title:"Liệu trình điều trị trũng mắt và thâm mắt",slug:"lieu-trinh-dieu-tri-trung-mat-va-tham-mat"},
    {id:8,Title:"Liệu trình xóa nhăn và làm đầy trán, mu bàn tay, cổ, vùng môi, vùng kính",slug:"lieu-trinh-xoa-nhan-va-lam-day-tran-mu-ban-tay-co-vung-moi-vung-kinh"},
    {id:9,Title:"Liệu trình xóa nhăn trắng da",slug:"lieu-trinh-xoa-nhan-trang-da"},
    {id:10,Title:"Liệu trình xóa nhăn căng bóng",slug:"lieu-trinh-xoa-nhan-cang-bong"},
    {id:11,Title:"Liệu trình phục hồi, trắng da, căng bóng",slug:"lieu-trinh-phuc-hoi-trang-da-cang-bong"},
    {id:12,Title:"Liệu trình điều trị sẹo mụn, sẹo rỗ",slug:"lieu-trinh-dieu-tri-seo-mun-seo-ro"},
    {id:13,Title:"Liệu trình điều trị rụng tóc",slug:"lieu-trinh-dieu-tri-rung-toc"},
    {id:14,Title:"Liệu trình điều trị mụn",slug:"lieu-trinh-dieu-tri-mun"},
    {id:15,Title:"Liệu trình điều trị rạn da",slug:"lieu-trinh-dieu-tri-ran-da"},
    {id:16,Title:"Liệu trình điều trị viêm da cơ địa",slug:"lieu-trinh-dieu-tri-viem-da-co-dia"},
    {id:17,Title:"Liệu trình giảm mỡ",slug:"lieu-trinh-giam-mo"},
  ]    
  constructor(
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    const slugSP = this.route.snapshot.paramMap.get('slug');
    const result = slugSP?.split("-v6")[0];
    this.Gioithieu = this.ListGioithieu.find(v=>v.Slug==result);
    if(!this.Gioithieu)
    {
      location.href="/404";
      return;
    }
    console.log(this.Gioithieu);
    this.Breadcrumbs=[
      {name: 'Trang chủ', link: '/'},
      {name: 'Danh sách sản phẩm', link: '/danh-muc'},
      {name: this.Gioithieu?.Title, link: `${this.Gioithieu?.slug}-v6`}
    ]
    console.log(this.Breadcrumbs);
    
  }
}
