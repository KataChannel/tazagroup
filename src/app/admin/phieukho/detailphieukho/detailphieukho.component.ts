import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ListPhieukhoComponent } from '../listphieukho/listphieukho.component';
import { PhieukhoService } from '../phieukho.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { GenId, convertToSlug } from '../../../shared/utils/shared.utils';
import { KhoService } from '../../kho/kho.service';
import { DonhangService } from '../../donhang/donhang.service';
import { DathangService } from '../../dathang/dathang.service';
import { SanphamService } from '../../sanpham/sanpham.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
  @Component({
    selector: 'app-detailphieukho',
    imports: [
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      MatIconModule,
      MatButtonModule,
      MatSelectModule,
      MatDialogModule,
      CommonModule,
      MatSlideToggleModule,
      MatDatepickerModule
    ],
    providers:[provideNativeDateAdapter()],
    templateUrl: './detailphieukho.component.html',
    styleUrl: './detailphieukho.component.scss'
  })
  export class DetailPhieukhoComponent {
    _ListphieukhoComponent:ListPhieukhoComponent = inject(ListPhieukhoComponent)
    _PhieukhoService:PhieukhoService = inject(PhieukhoService)
    _KhoService:KhoService = inject(KhoService)
    _DonhangService:DonhangService = inject(DonhangService)
    _DathangService:DathangService = inject(DathangService)
    _SanphamService:SanphamService = inject(SanphamService)
    _route:ActivatedRoute = inject(ActivatedRoute)
    _router:Router = inject(Router)
    _snackBar:MatSnackBar = inject(MatSnackBar)
    filterSP:any = [];
    LoaiPhieu:any[] =
    [
      {title:'Phiếu Nhập',value:'nhap'},
      {title:'Phiếu Xuất',value:'xuat'},
      {title:'Chuyển Kho',value:'chuyenkho'},
      {title:'Điều Chỉnh',value:'dieuchinh'}
    ]
    constructor(){
      this._route.paramMap.subscribe(async (params) => {
        const id = params.get('id');
        this._PhieukhoService.setPhieukhoId(id);
        await this._DonhangService.getAllDonhang();
        await this._DathangService.getAllDathang();
        await this._SanphamService.getAllSanpham();
        await this._KhoService.getAllKho();
        this.filterSP = this._SanphamService.ListSanpham();
      });
  
      effect(async () => {
        const id = this._PhieukhoService.phieukhoId();
      
        if (!id){
          this._router.navigate(['/admin/phieukho']);
          this._ListphieukhoComponent.drawer.close();
        }
        if(id === '0'){
          this.DetailPhieukho.set({ maphieu: GenId(8, false),sanpham:[],ngay: new Date() });
          this._ListphieukhoComponent.drawer.open();
          this.isEdit.update(value => !value);
          this._router.navigate(['/admin/phieukho', "0"]);
        }
        else{
            await this._PhieukhoService.getPhieukhoByid(id);
            this._ListphieukhoComponent.drawer.open();
            this._router.navigate(['/admin/phieukho', id]);
        }
      });
    }
    ChangeType(event:any){
      this.DetailPhieukho.update((v:any)=>{
        v.sanpham = [];
        return v;
      })
    }
    ChosenDonhang(event:any,type:any){
      console.log(event.value);
      if(type=='xuat'){
        this.DetailPhieukho.update((v:any)=>{
          v.sanpham =  this._DonhangService.ListDonhang().find((x:any)=>x.id == event.value).sanpham.map((x:any)=>{return {
            sanphamId:x.idSP,
            sldat:x.sldat||0,
            soluong:x.sldat||0,
            ghichu:x.ghichu
          }});
          return v;
        })
      }
      else{
        this.DetailPhieukho.update((v:any)=>{
          v.sanpham = this._DathangService.ListDathang().find((x:any)=>x.id == event.value).sanpham.map((x:any)=>{return {
            sanphamId:x.idSP,
            sldat:x.sldat||0,
            soluong:x.sldat||0,
            ghichu:x.ghichu
          }});
          return v;
        })
      }
      console.log(this.DetailPhieukho());
      
    }
    DetailPhieukho: any = this._PhieukhoService.DetailPhieukho;
    isEdit = signal(false);
    isDelete = signal(false);  
    phieukhoId:any = this._PhieukhoService.phieukhoId
    async ngOnInit() {       
    }
    async handlePhieukhoAction() {
      if (this.phieukhoId() === '0') {
        await this.createPhieukho();
      }
      else {
        await this.updatePhieukho();
      }
    }
    private async createPhieukho() {
      try {
        await this._PhieukhoService.CreatePhieukho(this.DetailPhieukho());
        this._snackBar.open('Tạo Mới Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.isEdit.update(value => !value);
      } catch (error) {
        console.error('Lỗi khi tạo phieukho:', error);
      }
      console.log(this.DetailPhieukho());
      
    }

    private async updatePhieukho() {
      try {
        await this._PhieukhoService.updatePhieukho(this.DetailPhieukho());
        this._snackBar.open('Cập Nhật Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.isEdit.update(value => !value);
      } catch (error) {
        console.error('Lỗi khi cập nhật phieukho:', error);
      }
      console.log(this.DetailPhieukho());
    }
    async DeleteData()
    {
      try {
        await this._PhieukhoService.DeletePhieukho(this.DetailPhieukho());
  
        this._snackBar.open('Xóa Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
  
        this._router.navigate(['/admin/phieukho']);
      } catch (error) {
        console.error('Lỗi khi xóa phieukho:', error);
      }
    }
    goBack(){
      this._router.navigate(['/admin/phieukho'])
      this._ListphieukhoComponent.drawer.close();
    }
    trackByFn(index: number, item: any): any {
      return item.id;
    }
    toggleEdit() {
      this.isEdit.update(value => !value);
    }
    
    toggleDelete() {
      this.isDelete.update(value => !value);
    }
    FillSlug(){
      this.DetailPhieukho.update((v:any)=>{
        v.slug = convertToSlug(v.title);
        return v;
      })
    }
    DoFindSanpham(event:any){
      const query = event.target.value.toLowerCase();
       this.filterSP = this._SanphamService.ListSanpham().filter(v => v.title.toLowerCase().includes(query));      
   }
   onChangeSoluong(item:any,event:any){

   }
   AddSanpham(){
    this.DetailPhieukho.update((v:any)=>{
      v.sanpham.push({id:GenId(8,false),idSP:'',sldat:0,soluong:0,ghichu:''})
      return v;
    })
    console.log(this.DetailPhieukho());
    
  }

  }