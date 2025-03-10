import { Component, inject } from '@angular/core';
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
import { ConvertDriveData } from '../../shared/utils/shared.utils';
import { GoogleSheetService } from '../../shared/googlesheets/googlesheets.service';

@Component({
  selector: 'app-danhmuc',
  imports: [
   BreadscrumbComponent,
   CommonModule,
   MatInputModule,
   MatFormFieldModule,
   FormsModule,
   MatIconModule,
   MatButtonModule
  ],
  templateUrl: './danhmuc.component.html',
  styleUrl: './danhmuc.component.scss'
})
export class DanhmucComponent {
  Sanpham: any={};
  Danhmucs: any[]=[];
  // Danhmucs: any[]=Danhmucs.filter((v)=>v.Type=="sanpham");
  Sanphams: any[]=Sanphams;
  FilterDanhmuc:any=0;
  FilterSanphams: any[]=Sanphams;
  FilterType: any[]=[
    {id:1,Title:'Mới Nhất',Value:'new'},
    {id:2,Title:'Giá Thấp - Cao',Value:'asc'},
    {id:3,Title:'Giá Cao - Thấp',Value:'desc'},
    {id:4,Title:'Giảm Giá',Value:'discount'},
  ];
  Breadcrumbs: any[] = [];
  _GoogleSheetService:GoogleSheetService = inject(GoogleSheetService)
  constructor(
   private route: ActivatedRoute,
  ) {
    
  }
  ngOnInit(): void {
    this.Breadcrumbs=[
      {name: 'Trang chủ', link: '/'},
      {name: 'Danh sách sản phẩm', link: '/listsanpham'},
    ]
    
    const ListSheets = JSON.parse(localStorage.getItem('ListSheets') || '[]');
    if (ListSheets.length > 0) {
      const CheckSheet = ListSheets.find((v:any) => v.SheetName === 'Danhmuc');
      if (CheckSheet) {
        this._GoogleSheetService.getDrive(CheckSheet).then(result => {
          if(result.values.length>0)
          {
            this.Danhmucs = ConvertDriveData(result.values).filter((v:any)=>v.Type=="sanpham");;
          }
        });
      }
    }

    const slugDM = this.route.snapshot.paramMap.get('slug');
    const result = slugDM?.split("-v2")[0];
    console.log(result); 
    const Danhmuc = this.Danhmucs.find(v=>v.Slug==result);
    console.log(Danhmuc);
    if(!Danhmuc)
    {
      //location.href="/404";
      return
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.FilterSanphams = this.Sanphams.filter(v => v.Title.toLowerCase().includes(filterValue.trim().toLowerCase()));
  }
  DoFilterDanhmuc(item:any){
    console.log(item.idSP);
    this.FilterDanhmuc = item
    this.FilterSanphams =this.Sanphams.filter(v=>item.idSP.includes(v.id))
  }
}
