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

@Component({
  selector: 'app-danhmucbaiviet',
  imports: [
   BreadscrumbComponent,
   CommonModule,
   MatInputModule,
   MatFormFieldModule,
   FormsModule,
   MatIconModule,
   MatButtonModule
  ],
  templateUrl: './danhmucbaiviet.component.html',
  styleUrl: './danhmucbaiviet.component.scss'
})
export class DanhmucbaivietComponent {
  Baiviet: any={};
  Danhmucs: any[]=Danhmucs.filter((v)=>v.Type=="baiviet");;
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
  constructor(
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.Breadcrumbs=[
      {name: 'Trang chủ', link: '/'},
      {name: 'Danh sách sản phẩm', link: '/listsanpham'},
    ]
    const slugDM = this.route.snapshot.paramMap.get('slug');
    const result = slugDM?.split("-v4")[0];
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
