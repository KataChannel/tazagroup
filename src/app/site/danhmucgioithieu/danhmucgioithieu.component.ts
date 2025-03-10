import { Component } from '@angular/core';
import { Danhmucs } from '../../shared/mockdata/danhmuc';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { BreadscrumbComponent } from '../../shared/common/breadscrumb/breadscrumb.component';
import { Sanphams } from '../../shared/mockdata/sanpham';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Baiviets } from '../../shared/mockdata/baiviet';
import { SwiperComponent } from '../../shared/common/swiper/swiper.component';
@Component({
  selector: 'app-danhmucgioithieu',
  imports: [
   BreadscrumbComponent,
   CommonModule,
   MatInputModule,
   MatFormFieldModule,
   FormsModule,
   MatIconModule,
   MatButtonModule,
   SwiperComponent
  ],
  templateUrl: './danhmucgioithieu.component.html',
  styleUrl: './danhmucgioithieu.component.scss'
})
export class DanhmucgioithieuComponent {
  Baiviet: any={};
  Danhmucs: any[]=Danhmucs.filter((v)=>v.Type=="gioithieu");;
  Baiviets: any[]=Baiviets;
  FilterDanhmuc:any=0;
  FilterBaiviets: any[]=Baiviets;
  FilterType: any[]=[
    {id:1,Title:'Mới Nhất',Value:'new'},
    {id:2,Title:'Giá Thấp - Cao',Value:'asc'},
    {id:3,Title:'Giá Cao - Thấp',Value:'desc'},
    {id:4,Title:'Giảm Giá',Value:'discount'},
  ];
  Breadcrumbs: any[] = [];
  Page:any=[
    {id:1,Title:"NÂNG TẦM ĐẲNG CẤP VỚI CÔNG NGHỆ SẢN XUẤT TIÊN TIẾN",Heading:'CÔNG NGHỆ LIÊN KẾT CHÉO 2IN1',Mota:'<p>Rau Sạch Trần Gia ứng dụng c&ocirc;ng nghệ li&ecirc;n kết ch&eacute;o 2in1 ti&ecirc;n tiến, c&oacute; khả năng vừa tấn c&ocirc;ng xử l&yacute; c&aacute;c vấn đề da như mụn, th&acirc;m, n&aacute;m, vừa phục hồi v&agrave; t&aacute;i tạo da sau điều trị. C&ocirc;ng nghệ n&agrave;y khắc phục hạn chế của sản phẩm th&ocirc;ng thường, vốn chỉ c&oacute; thể thực hiện một trong hai t&aacute;c dụng hoặc g&acirc;y cảm gi&aacute;c đau buốt, kh&oacute; chịu.</p><p>Với c&ocirc;ng nghệ n&agrave;y, sản phẩm Rau Sạch Trần Gia mang đến giải ph&aacute;p chăm s&oacute;c to&agrave;n diện, nhẹ nh&agrave;ng nhưng đạt hiệu quả tối ưu. L&agrave;n da được điều trị v&agrave; phục hồi một c&aacute;ch đồng thời, gi&uacute;p bạn cảm nhận sự cải thiện r&otilde; rệt m&agrave; kh&ocirc;ng cần phải lo lắng về cảm gi&aacute;c đau hoặc phải ủ t&ecirc; trước khi sử dụng.</p>',Image:'https://down-vn.img.susercontent.com/file/75937cc15391ca9e7b1fd39f2ff72af8'},
    {id:2,Title:"TÍCH HỢP HÀM LƯỢNG EXOSOME CAO",Heading:'CÔNG NGHỆ LIÊN KẾT CHÉO 2IN1',Mota:'<p>Rau Sạch Trần Gia nổi bật với c&ocirc;ng nghệ t&iacute;ch hợp 20 tỷ hạt Exosome trong mỗi sản phẩm &ndash; một th&agrave;nh tựu đột ph&aacute; trong y học t&aacute;i tạo. Exosome hoạt động như "người vận chuyển th&ocirc;ng minh" truyền tải c&aacute;c t&iacute;n hiệu sinh học cần thiết để th&uacute;c đẩy qu&aacute; tr&igrave;nh phục hồi v&agrave; t&aacute;i tạo da hiệu quả.</p><p>Sản phẩm của Rau Sạch Trần Gia k&iacute;ch th&iacute;ch sản sinh collagen v&agrave; elastin, cải thiện độ đ&agrave;n hồi v&agrave; gi&uacute;p l&agrave;n da khắc phục tổn thương do mụn, n&aacute;m, th&acirc;m sạm. C&ocirc;ng nghệ Exosome c&ograve;n tối ưu h&oacute;a khả năng hấp thụ dưỡng chất, nu&ocirc;i dưỡng l&agrave;n da khỏe mạnh từ s&acirc;u b&ecirc;n trong. Với khả năng kh&aacute;ng vi&ecirc;m v&agrave; l&agrave;m dịu vượt trội, sản phẩm đặc biệt ph&ugrave; hợp với l&agrave;n da nhạy cảm hoặc sau c&aacute;c liệu tr&igrave;nh điều trị.</p>',Image:'https://down-vn.img.susercontent.com/file/75937cc15391ca9e7b1fd39f2ff72af8'},
    {id:3,Title:"QUY MÔ NHÀ MÁY ĐẠT TIÊU CHUẨN QUỐC TẾ",Heading:'CÔNG NGHỆ LIÊN KẾT CHÉO 2IN1',Mota:'<p>Nh&agrave; m&aacute;y sản xuất Rau Sạch Trần Gia được x&acirc;y dựng tr&ecirc;n diện t&iacute;ch rộng lớn v&agrave; đạt ti&ecirc;u chuẩn CGMP, gi&uacute;p đảm bảo quy tr&igrave;nh nghi&ecirc;n cứu v&agrave; ph&aacute;t triển sản phẩm đạt chất lượng cao nhất. Với đội ngũ chuy&ecirc;n gia h&agrave;ng đầu trong lĩnh vực mỹ phẩm v&agrave; y học t&aacute;i tạo, nh&agrave; m&aacute;y trở th&agrave;nh trung t&acirc;m ph&aacute;t triển sản phẩm đạt ti&ecirc;u chuẩn quốc tế.</p><p>Nhờ hệ thống sản xuất đạt chuẩn, Rau Sạch Trần Gia đ&atilde; trở th&agrave;nh thương hiệu nội địa được tin d&ugrave;ng tại c&aacute;c bệnh viện v&agrave; thẩm mỹ viện h&agrave;ng đầu tại H&agrave;n Quốc. Sự nghi&ecirc;m ngặt trong quy tr&igrave;nh nghi&ecirc;n cứu v&agrave; kiểm so&aacute;t chất lượng gi&uacute;p sản phẩm kh&ocirc;ng chỉ hiệu quả m&agrave; c&ograve;n an to&agrave;n cho người d&ugrave;ng.</p><p>Rau Sạch Trần Gia nổi bật với c&ocirc;ng nghệ t&iacute;ch hợp 20 tỷ hạt Exosome trong mỗi sản phẩm &ndash; một th&agrave;nh tựu đột ph&aacute; trong y học t&aacute;i tạo. Exosome hoạt động như "người vận chuyển th&ocirc;ng minh" truyền tải c&aacute;c t&iacute;n hiệu sinh học cần thiết để th&uacute;c đẩy qu&aacute; tr&igrave;nh phục hồi v&agrave; t&aacute;i tạo da hiệu quả.</p><p>Sản phẩm của Rau Sạch Trần Gia k&iacute;ch th&iacute;ch sản sinh collagen v&agrave; elastin, cải thiện độ đ&agrave;n hồi v&agrave; gi&uacute;p l&agrave;n da khắc phục tổn thương do mụn, n&aacute;m, th&acirc;m sạm. C&ocirc;ng nghệ Exosome c&ograve;n tối ưu h&oacute;a khả năng hấp thụ dưỡng chất, nu&ocirc;i dưỡng l&agrave;n da khỏe mạnh từ s&acirc;u b&ecirc;n trong. Với khả năng kh&aacute;ng vi&ecirc;m v&agrave; l&agrave;m dịu vượt trội, sản phẩm đặc biệt ph&ugrave; hợp với l&agrave;n da nhạy cảm hoặc sau c&aacute;c liệu tr&igrave;nh điều trị.</p>',Image:'https://down-vn.img.susercontent.com/file/75937cc15391ca9e7b1fd39f2ff72af8'},
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
    this.Breadcrumbs=[
      {name: 'Trang chủ', link: '/'},
      {name: 'Danh sách sản phẩm', link: '/listsanpham'},
    ]
    const slugDM = this.route.snapshot.paramMap.get('slug');
    const result = slugDM?.split("-v5")[0];
    console.log(result); 
    const Danhmuc = this.Danhmucs.find(v=>v.Slug==result);
    console.log(Danhmuc);
    if(!Danhmuc)
    {
      location.href="/404";
      return
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.FilterBaiviets = this.Baiviets.filter(v => v.Title.toLowerCase().includes(filterValue.trim().toLowerCase()));
  }
  DoFilterDanhmuc(item:any){
    console.log(item.idSP);
    this.FilterDanhmuc = item
    this.FilterBaiviets =this.Baiviets.filter(v=>item.idSP.includes(v.id))
  }
}
