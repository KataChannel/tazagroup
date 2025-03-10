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
import { ListPhieugiaohangComponent } from '../listphieugiaohang/listphieugiaohang.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  ConvertDriveData,
  GenId,
  convertToSlug,
} from '../../../shared/utils/shared.utils';
import { MatMenuModule } from '@angular/material/menu';
import { KhachhangService } from '../../khachhang/khachhang.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BanggiaService } from '../../banggia/banggia.service';
import moment from 'moment';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GoogleSheetService } from '../../../shared/googlesheets/googlesheets.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SanphamService } from '../../sanpham/sanpham.service';
import html2canvas from 'html2canvas';
import { DonhangService } from '../../donhang/donhang.service';
@Component({
  selector: 'app-detailphieugiaohang',
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
  templateUrl: './detailphieugiaohang.component.html',
  styleUrl: './detailphieugiaohang.component.scss',
})
export class DetailPhieugiaohangComponent {
  _ListphieugiaohangComponent: ListPhieugiaohangComponent = inject(ListPhieugiaohangComponent);
  _PhieugiaohangService: DonhangService = inject(DonhangService);
  _KhachhangService: KhachhangService = inject(KhachhangService);
  _BanggiaService: BanggiaService = inject(BanggiaService);
  _SanphamService: SanphamService = inject(SanphamService);
  _route: ActivatedRoute = inject(ActivatedRoute);
  _router: Router = inject(Router);
  _snackBar: MatSnackBar = inject(MatSnackBar);
  constructor() {
    this._route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      this._PhieugiaohangService.setDonhangId(id);
      await this._KhachhangService.getAllKhachhang();
      this.filterKhachhang = this.ListKhachhang();
      await this._BanggiaService.getAllBanggia();
      this.filterBanggia = this._BanggiaService.ListBanggia();
      this.DetailPhieugiaohang().sanpham = this.DetailPhieugiaohang().sanpham.map((v:any)=>{
        v.ttgiao = Number(v.slgiao)*Number(v.giaban)||0;
        return v;
      })
      await this._SanphamService.getAllSanpham();
      this.filterSanpham = this._SanphamService.ListSanpham();
      this.dataSource().data = this.DetailPhieugiaohang().sanpham;
      this.dataSource().paginator = this.paginator;
      this.dataSource().sort = this.sort;
    });

    effect(async () => {
      const id = this._PhieugiaohangService.donhangId();
      if (!id) {
        this._router.navigate(['/admin/phieugiaohang']);
        this._ListphieugiaohangComponent.drawer.close();
      }
      if (id === '0') {
        this.DetailPhieugiaohang.set({
          title: GenId(8, false),
          maphieugiaohang: GenId(8, false),
          ngaygiao: moment().add(1, 'days').format('YYYY-MM-DD'),
        });
        this._ListphieugiaohangComponent.drawer.open();
        this.isEdit.update((value) => !value);
        this._router.navigate(['/admin/phieugiaohang', '0']);
      } else {
        await this._PhieugiaohangService.getDonhangByid(id);
        this._ListphieugiaohangComponent.drawer.open();
        this._router.navigate(['/admin/phieugiaohang', id]);
      }
    });
  }
  DetailPhieugiaohang: any = this._PhieugiaohangService.DetailDonhang;
  ListKhachhang: any = this._KhachhangService.ListKhachhang;
  isEdit = signal(false);
  isDelete = signal(false);
  filterKhachhang: any = [];
  filterBanggia: any[] = [];
  filterSanpham: any[] = [];
  phieugiaohangId: any = this._PhieugiaohangService.donhangId;
  Trangthai: any = [
    { value: 'dadat', title: 'Đã Đặt' },
    { value: 'dagiao', title: 'Đã Giao' },
    { value: 'danhan', title: 'Đã Nhận' },
    { value: 'huy', title: 'Hủy' },
  ];
  getTitle(item: any) {
    return this.Trangthai.find((v:any) => v.value === item)?.title;

  }
  async ngOnInit() {}
  async handlePhieugiaohangAction() {
    if (this.phieugiaohangId() === '0') {
      await this.createPhieugiaohang();
    } else {
      await this.updatePhieugiaohang();
    }
  }
  private async createPhieugiaohang() {

  }

  private async updatePhieugiaohang() {
    try {
      this.DetailPhieugiaohang().sanpham = this.DetailPhieugiaohang().sanpham.map((v:any)=>{
        v.ttgiao = Number(v.slgiao)*Number(v.giaban)||0;
        return v;
      })
      await this._PhieugiaohangService.updateDonhang(this.DetailPhieugiaohang());
      this._snackBar.open('Cập Nhật Thành Công', '', {
        duration: 1000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'],
      });
      this.isEdit.update((value) => !value);
    } catch (error) {
      console.error('Lỗi khi cập nhật phieugiaohang:', error);
    }
  }
  async DeleteData() {

  }
  goBack() {
    this._router.navigate(['/admin/phieugiaohang']);
    this._ListphieugiaohangComponent.drawer.close();
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
    this.DetailPhieugiaohang.update((v: any) => {
      v.slug = convertToSlug(v.title);
      return v;
    });
  }
  DoFindKhachhang(event: any) {
    const query = event.target.value.toLowerCase();
    this.filterKhachhang = this.ListKhachhang().filter(
      (v: any) =>
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
  Chonkhachhang(item: any) {
    this.DetailPhieugiaohang.update((v: any) => {
      v.khachhangId = item.id;
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
        ? Number((event.target as HTMLElement).innerText.trim()) || 0
        : (event.target as HTMLElement).innerText.trim();
  
    this.DetailPhieugiaohang.update((v: any) => {
      if (index !== null) {
        if (field === 'sldat') {
          v.sanpham[index]['sldat'] = v.sanpham[index]['slgiao'] = v.sanpham[index]['slnhan'] = newValue;
        } else if (field === 'slgiao') {
          const newGiao = newValue
          if (newGiao < v.sanpham[index]['sldat']) {
            // CẬP NHẬT GIÁ TRỊ TRƯỚC KHI HIỂN THỊ SNACKBAR
            v.sanpham[index]['slgiao'] = v.sanpham[index]['sldat'];
            this._snackBar.open('Số lượng giao phải lớn hơn số lượng đặt', '', {
              duration: 1000,
              horizontalPosition: "end",
              verticalPosition: "top",
              panelClass: ['snackbar-error'],
            });
          } else {
            v.sanpham[index]['slgiao'] = v.sanpham[index]['slnhan'] = newGiao;
            v.sanpham[index]['ttgiao']=v.sanpham[index]['slgiao']*v.sanpham[index]['giaban']
          }
        } else {
          v.sanpham[index][field] = newValue;
        }
      } else {
        v[field] = newValue;
      }
      return v;
    });
  
    // CẬP NHẬT LẠI UI BẰNG CÁCH SET NỘI DUNG CHO `contentEditable`
    setTimeout(() => {
      if(index !== null){
      (event.target as HTMLElement).innerText = this.DetailPhieugiaohang()?.sanpham[index]?.slgiao || '0';
      }
    }, 0);
    
    console.log(this.DetailPhieugiaohang());
  }
  GiaoDonhang()
  {
    this.DetailPhieugiaohang.update((v:any)=>{
      v.status='dagiao'
      return v
    })
    this._PhieugiaohangService.updateDonhang(this.DetailPhieugiaohang())
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
  SelectKhachhang(event: any) {
    const selectedKhachhang = this.ListKhachhang().find(
      (v: any) => v.id === event.value
    );
    console.log(selectedKhachhang);
    if (selectedKhachhang) {
      this.DetailPhieugiaohang.update((v: any) => {
        const khachhang = {
          name: selectedKhachhang.name,
          diachi: selectedKhachhang.diachi,
          sdt: selectedKhachhang.sdt,
          ghichu: selectedKhachhang.ghichu,
        };
        v.khachhangId = selectedKhachhang.id;
        v.khachhang = khachhang;
        return v;
      });
    }
    console.log(this.DetailPhieugiaohang());
  }

  displayedColumns: string[] = [
    'STT',
    'title',
    'masp',
    'dvt',
    'sldat',
    'slgiao',
    'giaban',
    'ttgiao',
    'slnhan',
    'ghichu'
  ];
  
  ColumnName: any = {
    STT: 'STT',
    title: 'Tiêu Đề',
    masp: 'Mã SP',
    dvt: 'Đơn Vị Tính',
    sldat: 'SL Đặt',
    slgiao: 'SL Giao',
    giaban: 'Giá Bán',
    ttgiao: 'TT Giao',
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
      SheetName: 'GHImport',
      ApiKey: 'AIzaSyD33kgZJKdFpv1JrKHacjCQccL_O0a2Eao',
    };
    const result: any = await this._GoogleSheetService.getDrive(DriveInfo);
    const data = ConvertDriveData(result.values);
    console.log(data);
    this.DetailPhieugiaohang.update((v:any)=>{
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
    console.log(this.DetailPhieugiaohang());
        
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
    this.dataSource().data = this.DetailPhieugiaohang().sanpham;
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
    this.DetailPhieugiaohang.update((v:any)=>{
      v.sanpham = []
      return v;
    })
    this.dataSource().data = this.DetailPhieugiaohang().sanpham;
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;
    this.reloadfilter();
  }
  getName(id:any)
  {
    return this.ListKhachhang().find((v:any)=>v.id===id);
  }


  reloadfilter(){
    this.filterSanpham = this._SanphamService.ListSanpham().filter((v:any) => !this.DetailPhieugiaohang().sanpham.some((v2:any) => v2.id === v.id));
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
    this.DetailPhieugiaohang.update((v:any)=>{
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
    this.dataSource().data = this.DetailPhieugiaohang().sanpham;
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;    
  }
  RemoveSanpham(item:any){
    this.DetailPhieugiaohang.update((v:any)=>{
      v.sanpham = v.sanpham.filter((v1:any) => v1.id !== item.id);
      this.reloadfilter();
      return v;
    })
    this.dataSource().data = this.DetailPhieugiaohang().sanpham;
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;
  }

  CoppyDon()
  {

  }

  printContent()
  {
    const printContent = document.getElementById('printContent');
    if (printContent) {
      const newWindow = window.open('', '_blank');
    const tailwindCSS =  `
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: { extend: {} }
      };
    </script>
  `
      if (newWindow) {
        newWindow.document.write(`
          <html>
          <head>
            <title>In Bảng</title>
             ${tailwindCSS}
            <style>
              body { font-size: 12px; font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #000; padding: 4px; text-align: left; }
              @media print { 
              body { margin: 0; } 
              img {height:80px}
              }
            </style>
          </head>
          <body>
            ${printContent.outerHTML}
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        console.error('Không thể mở cửa sổ in');
      }
    } else {
      console.error('Không tìm thấy phần tử printContent');
    }



    // html2canvas(element, { scale: 2 }).then(canvas => {
    //   const imageData = canvas.toDataURL('image/png');

    //   // Mở cửa sổ mới và in ảnh
    //   const printWindow = window.open('', '_blank');
    //   if (!printWindow) return;

    //   printWindow.document.write(`
    //     <html>
    //       <head>
    //         <title>${this.DetailPhieugiaohang()?.title}</title>
    //       </head>
    //       <body style="text-align: center;">
    //         <img src="${imageData}" style="max-width: 100%;"/>
    //         <script>
    //           window.onload = function() {
    //             window.print();
    //             window.onafterprint = function() { window.close(); };
    //           };
    //         </script>
    //       </body>
    //     </html>
    //   `);

    //   printWindow.document.close();
    // });
  }
}
