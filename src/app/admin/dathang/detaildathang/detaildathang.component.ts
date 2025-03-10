import {
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
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
import { ListDathangComponent } from '../listdathang/listdathang.component';
import { DathangService } from '../dathang.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  ConvertDriveData,
  GenId,
  convertToSlug,
} from '../../../shared/utils/shared.utils';
import { MatMenuModule } from '@angular/material/menu';
import { NhacungcapService } from '../../nhacungcap/nhacungcap.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BanggiaService } from '../../banggia/banggia.service';
import moment from 'moment';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GoogleSheetService } from '../../../shared/googlesheets/googlesheets.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SanphamService } from '../../sanpham/sanpham.service';
@Component({
  selector: 'app-detaildathang',
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
    MatMenuModule,
    MatDatepickerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './detaildathang.component.html',
  styleUrl: './detaildathang.component.scss',
})
export class DetailDathangComponent {
  _ListdathangComponent: ListDathangComponent = inject(ListDathangComponent);
  _DathangService: DathangService = inject(DathangService);
  _NhacungcapService: NhacungcapService = inject(NhacungcapService);
  _BanggiaService: BanggiaService = inject(BanggiaService);
  _SanphamService: SanphamService = inject(SanphamService);
  _route: ActivatedRoute = inject(ActivatedRoute);
  _router: Router = inject(Router);
  _snackBar: MatSnackBar = inject(MatSnackBar);
  constructor() {
    this._route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      this._DathangService.setDathangId(id);
      await this._NhacungcapService.getAllNhacungcap();
      this.filterNhacungcap = this.ListNhacungcap().filter((v: any) => v.isActive);
      await this._BanggiaService.getAllBanggia();
      this.filterBanggia = this._BanggiaService.ListBanggia();
      await this._SanphamService.getAllSanpham();
      this.filterSanpham = this._SanphamService.ListSanpham();
      this.dataSource().data = this.DetailDathang().sanpham;
      this.dataSource().paginator = this.paginator;
      this.dataSource().sort = this.sort;
    });

    effect(async () => {
      const id = this._DathangService.dathangId();
      if (!id) {
        this._router.navigate(['/admin/dathang']);
        this._ListdathangComponent.drawer.close();
      }
      if (id === '0') {
        this.DetailDathang.set({
          title: GenId(8, false),
          madncc: GenId(8, false),
          type:'dathang',
          ngaynhan: moment().add(1, 'days').format('YYYY-MM-DD'),
        });
        this._ListdathangComponent.drawer.open();
        this.isEdit.update((value) => !value);
        this._router.navigate(['/admin/dathang', '0']);
      } else {
        await this._DathangService.getDathangByid(id);
        this._ListdathangComponent.drawer.open();
        this._router.navigate(['/admin/dathang', id]);
      }
    });
  }
  DetailDathang: any = this._DathangService.DetailDathang;
  ListNhacungcap: any = this._NhacungcapService.ListNhacungcap;
  isEdit = signal(false);
  isDelete = signal(false);
  filterNhacungcap: any = [];
  filterBanggia: any[] = [];
  filterSanpham: any[] = [];
  dathangId: any = this._DathangService.dathangId;
  async ngOnInit() {}
  async handleDathangAction() {
    if (this.dathangId() === '0') {
      await this.createDathang();
    } else {
      await this.updateDathang();
    }
  }
  private async createDathang() {
    try {
      this.DetailDathang.update((v: any) => {
        v.ngaynhan = moment(v.ngaygiao).format('YYYY-MM-DD');
        return v;
      });
      await this._DathangService.CreateDathang(this.DetailDathang());
      this._snackBar.open('Tạo Mới Thành Công', '', {
        duration: 1000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'],
      });
      this.isEdit.update((value) => !value);
    } catch (error) {
      console.error('Lỗi khi tạo dathang:', error);
    }
  }

  private async updateDathang() {
    try {
      await this._DathangService.updateDathang(this.DetailDathang());
      this._snackBar.open('Cập Nhật Thành Công', '', {
        duration: 1000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'],
      });
      this.isEdit.update((value) => !value);
    } catch (error) {
      console.error('Lỗi khi cập nhật dathang:', error);
    }
  }
  async DeleteData() {
    try {
      await this._DathangService.DeleteDathang(this.DetailDathang());

      this._snackBar.open('Xóa Thành Công', '', {
        duration: 1000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'],
      });

      this._router.navigate(['/admin/dathang']);
    } catch (error) {
      console.error('Lỗi khi xóa dathang:', error);
    }
  }
  goBack() {
    this._router.navigate(['/admin/dathang']);
    this._ListdathangComponent.drawer.close();
  }
  trackByFn(index: number, item: any): any {
    return item.id;
  }
  toggleEdit() {
    this.isEdit.update((value) => !value);
  }

  toggleDelete() {
    this.isDelete.update((value) => !value);
  }
  FillSlug() {
    this.DetailDathang.update((v: any) => {
      v.slug = convertToSlug(v.title);
      return v;
    });
  }
  DoFindNhacungcap(event: any) {
    const query = event.target.value.toLowerCase();
    this.filterNhacungcap = this.ListNhacungcap().filter(
      (v: any) =>
        v.isActive &&
        v.name.toLowerCase().includes(query) ||
        v.namenn.toLowerCase().includes(query) ||
        v.sdt.toLowerCase().includes(query)
    );
  }
  DoFindBanggia(event: any) {
    const query = event.target.value.toLowerCase();
    //  this.FilterBanggia = this.ListBanggia.filter(v => v.Title.toLowerCase().includes(query));
  }
  UpdateBangia() {
    // const Banggia = this.ListBanggia.find(v => v.id === this.Detail.idBanggia)
    // const valueMap = new Map(Banggia.ListSP.map(({ MaSP, giaban }:any) => [MaSP, giaban]));
    // this.Detail.Giohangs = this.Detail.Giohangs
    //     .filter(({ MaSP }:any) => valueMap.has(MaSP)) // Chỉ giữ lại phần tử có trong data2
    //     .map((item:any) => ({
    //         ...item,  // Giữ lại tất cả các thuộc tính từ data1
    //         gia: valueMap.get(item.MaSP)?? item.gia, // Cập nhật giá trị value từ data2
    //         Tongtien: valueMap.get(item.MaSP)?? item.gia // Cập nhật giá trị value từ data2
    //     }));
    //     this.UpdateListSanpham()
    // console.log(this.Detail.Giohangs);
  }
  SelectBanggia(event: any) {
    console.log(event.value);
    // this.Detail.idBanggia = event.value
    // this.UpdateBangia()
    // const Banggia = this.ListBanggia.find(v => v.id === event.value)
    // const valueMap = new Map(Banggia.ListSP.map(({ id, giaban }:any) => [id, giaban]));
    // this.Detail.Giohangs = this.Detail.Giohangs
    //     .filter(({ id }:any) => valueMap.has(id)) // Chỉ giữ lại phần tử có trong data2
    //     .map((item:any) => ({
    //         ...item,  // Giữ lại tất cả các thuộc tính từ data1
    //         gia: valueMap.get(item.id)?? item.gia, // Cập nhật giá trị value từ data2
    //         Tongtien: valueMap.get(item.id)?? item.gia // Cập nhật giá trị value từ data2
    //     }));
    // console.log(this.Detail.Giohangs);
  }
  Chonnhacungcap(item: any) {
    this.DetailDathang.update((v: any) => {
      v.nhacungcapId = item.id;
      return v;
    });
  }

  updateValue(
    event: Event,
    index: number | null,
    element: any,
    field: keyof any,
    type: 'number' | 'string'
  ) {
    const newValue =
      type === 'number'
        ? Number(
            (event.target as HTMLElement).innerText
              .trim()
              .replace(/[^0-9]/g, '')
          ) || 0
        : (event.target as HTMLElement).innerText.trim();

    this.DetailDathang.update((v: any) => {
      if (index !== null) {
        if(field=='sldat'){
          v.sanpham[index][field] = v.sanpham[index]['slgiao'] = newValue;
        }else{
          v.sanpham[index][field] = newValue;
        }
       
      } else {
        v[field] = newValue;
      }
      return v;
    });
  }
  Tongcong: any = 0;
  Tong: any = 0;
  Tinhtongcong(value: any) {
    this.Tongcong = value.Tongcong;
    this.Tong = value.Tong;
  }
  TinhTong(items: any, fieldTong: any) {
    return (
      items?.reduce((sum: any, item: any) => sum + (item[fieldTong] || 0), 0) ||
      0
    );
  }
  SelectNhacungcap(event: any) {
    const selectedNhacungcap = this.ListNhacungcap().find(
      (v: any) => v.id === event.value
    );
    console.log(selectedNhacungcap);
    if (selectedNhacungcap) {
      this.DetailDathang.update((v: any) => {
        const nhacungcap = {
          name: selectedNhacungcap.name,
          diachi: selectedNhacungcap.diachi,
          sdt: selectedNhacungcap.sdt,
          ghichu: selectedNhacungcap.ghichu,
        };
        v.nhacungcapId = selectedNhacungcap.id;
        v.nhacungcap = nhacungcap;
        return v;
      });
    }
    console.log(this.DetailDathang());
  }

  displayedColumns: string[] = [
    'STT',
    'title',
    'masp',
    'dvt',
    'sldat',
    'slnhan',
    'ghichu'
  ];
  ColumnName: any = {
    STT: 'STT',
    title: 'Tiêu Đề',
    masp: 'Mã SP',
    dvt: 'Đơn Vị Tính',
    sldat: 'SL Đặt',
    slnhan: 'SL Nhận',
    ghichu: 'Ghi Chú'
  };
  dataSource = signal(new MatTableDataSource<any>([]));
  CountItem = computed(() => this.dataSource().data.length);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  _GoogleSheetService: GoogleSheetService = inject(GoogleSheetService);
  async LoadDrive() {
    const DriveInfo = {
      IdSheet: '15npo25qyH5FmfcEjl1uyqqyFMS_vdFnmxM_kt0KYmZk',
      SheetName: 'DatHImport',
      ApiKey: 'AIzaSyD33kgZJKdFpv1JrKHacjCQccL_O0a2Eao',
    };
    const result: any = await this._GoogleSheetService.getDrive(DriveInfo);
    const data = ConvertDriveData(result.values);
    console.log(data);
    this.DetailDathang.update((v:any)=>{
      v.sanpham = data.map((v1:any) => {
        v1.sldat = Number(v1.sldat)||0;
        v1.slgiao = Number(v1.slgiao)||0;
        v1.slnhan = Number(v1.slnhan)||0;
        v1.ttdat = Number(v1.ttdat)||0;
        v1.ttgiao = Number(v1.ttgiao)||0;
        v1.ttnhan = Number(v1.ttnhan)||0;
        const item = this._SanphamService.ListSanpham().find((v2) => v2.masp === v1.masp);
        console.log(item); 
        if (item) {
          return { ...item, ...v1 };
        }
        return v1;
      });
      return v;
    });
    console.log(this.DetailDathang());
        
    //  this.DetailBanggia.update((v:any)=>{
    //   const listdata = data.map((item:any) => {
    //     item.masp = item.masp?.trim()||'';
    //     item.giaban = Number(item.giaban)||0;
    //     const item1 = this._SanphamService.ListSanpham().find((v1) => v1.masp === item.masp);
    //     if (item1) {
    //       return { ...item1, ...item };
    //     }
    //     return item;
    //   });
    //   v.sanpham = listdata
    //   return v;
    // })
    this.dataSource().data = this.DetailDathang().sanpham;
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;
    this.reloadfilter();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
  }
  EmptyCart()
  {
    this.DetailDathang.update((v:any)=>{
      v.sanpham = []
      return v;
    })
    this.dataSource().data = this.DetailDathang().sanpham;
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;
    this.reloadfilter();
  }
  getName(id:any)
  {
    return this.ListNhacungcap().find((v:any)=>v.id===id);
  }


  reloadfilter(){
    this.filterSanpham = this._SanphamService.ListSanpham().filter((v:any) => !this.DetailDathang().sanpham.some((v2:any) => v2.id === v.id));
  }
  // RemoveSanpham(item:any){
  //   this.DetailBanggia.update((v:any)=>{
  //     v.sanpham = v.sanpham.filter((v1:any) => v1.id !== item.id);
  //     this.reloadfilter();
  //     return v;
  //   })
  //   this.dataSource().data = this.DetailBanggia().sanpham;
  //   this.dataSource().paginator = this.paginator;
  //   this.dataSource().sort = this.sort;
  // }
  DoFindSanpham(event:any){
    const value = event.target.value;
    console.log(value);
    
    this.filterSanpham = this._SanphamService.ListSanpham().filter((v) => v.title.toLowerCase().includes(value.toLowerCase()));
  }
  SelectSanpham(event:any){
    const value = event.value;
    const item = this._SanphamService.ListSanpham().find((v) => v.id === value);
    this.DetailDathang.update((v:any)=>{
      if(!v.sanpham){
        v.sanpham = [];
        item.sldat = item.slgiao = 1;
        v.sanpham.push(item);
      }
      else{
          item.sldat = item.slgiao = 1;
          v.sanpham.push(item);
      }
      this.reloadfilter();
      return v;
    })
    this.dataSource().data = this.DetailDathang().sanpham;
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;    
  }
  RemoveSanpham(item:any){
    this.DetailDathang.update((v:any)=>{
      v.sanpham = v.sanpham.filter((v1:any) => v1.id !== item.id);
      this.reloadfilter();
      return v;
    })
    this.dataSource().data = this.DetailDathang().sanpham;
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;
  }
  GetGoiy(item:any){
    const result = parseFloat(((item.soluongkho - item.soluong) * (1 + (item.haohut / 100))).toString()).toFixed(2);
    if(Number(result) < 0){
      return 0;
    }
    return result;
   }
}

