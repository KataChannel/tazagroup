import { AfterViewInit, Component, computed, effect, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DonhangService } from '../donhang.service';
import { MatMenuModule } from '@angular/material/menu';
import { readExcelFile, writeExcelFile } from '../../../shared/utils/exceldrive.utils';
import { ConvertDriveData, convertToSlug, GenId } from '../../../shared/utils/shared.utils';
import { GoogleSheetService } from '../../../shared/googlesheets/googlesheets.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import moment from 'moment';
@Component({
  selector: 'app-vandon',
  templateUrl: './vandon.component.html',
  styleUrls: ['./vandon.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatSidenavModule,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    MatTooltipModule,
    MatDatepickerModule
  ],
  providers:[provideNativeDateAdapter()]
})
export class VandonComponent {
  Detail: any = {};
  displayedColumns: string[] = [
    'madonhang',
    'khachhang',
    'diachi',
    'sdt',
    'masp',
    'title',
    'giagoc',
    'dvt',
    'sldat',
    'slgiao',
    'slnhan',
    'order',
    'ngaygiao'
  ];
  ColumnName: any = {
    madonhang: 'Mã Đơn Hàng',
    khachhang: 'Khách Hàng',
    diachi: 'Địa Chỉ',
    sdt: 'Số Điện Thoại',
    masp: 'Mã Sản Phẩm',
    title: 'Tên Sản Phẩm',
    giagoc: 'Giá Gốc',
    dvt: 'Đơn Vị Tính',
    sldat: 'SL Đặt',
    slgiao: 'SL Giao',
    slnhan: 'SL Nhận',
    order: 'Thứ Tự',
    ngaygiao: 'Ngày Giao',
  };
  FilterColumns: any[] = JSON.parse(
    localStorage.getItem('VandonColFilter') || '[]'
  );
  Columns: any[] = [];
  isFilter: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  filterValues: { [key: string]: string } = {};
  private _DonhangService: DonhangService = inject(DonhangService);
  private _breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private _GoogleSheetService: GoogleSheetService = inject(GoogleSheetService);
  private _router: Router = inject(Router);
  Vandon:any = this._DonhangService.ListDonhang;
  dataSource = computed(() => {
    const Listvandon = this.Vandon()
    .flatMap((item: any,k:any) => {
      const Info = {
      madonhang: item?.madonhang,
      khachhang: item?.khachhang?.name,
      sdt: item?.khachhang?.sdt,  
      diachi: item?.khachhang?.diachi,
      createdAt: item.createdAt,
      isActive: item.isActive,
      ngaygiao: item.ngaygiao,
      };
      return item.sanpham.map((v: any) => ({ ...v, ...Info }));
    }); 
    Listvandon.forEach((v:any,k:any)=>{
      v.id=k+1
    })
    console.log(Listvandon);
    
    const ds = new MatTableDataSource(Listvandon);
    ds.filterPredicate = this.createFilter();
    ds.paginator = this.paginator;
    ds.sort = this.sort;
    return ds;
  });
  donhangId:any = this._DonhangService.donhangId;
  _snackBar: MatSnackBar = inject(MatSnackBar);
  CountItem: any = 0;
  SearchParams: any = {
    Batdau: moment().format('YYYY-MM-DD'),
    Ketthuc: moment().add(1,'day').format('YYYY-MM-DD'),
    Type: 'donsi',
    pageSize: 9999,
    pageNumber: 1,
  };
  ListDate: any[] = [
    { id: 1, Title: '1 Ngày', value: 'day' },
    { id: 2, Title: '1 Tuần', value: 'week' },
    { id: 3, Title: '1 Tháng', value: 'month' },
    { id: 4, Title: '1 Năm', value: 'year' },
  ];
  Chonthoigian: any = 'day';
  isSearch: boolean = false;
  constructor() {
    this.displayedColumns.forEach(column => {
      this.filterValues[column] = '';
    });
  }
  onSelectionChange(event: MatSelectChange): void {
    const timeFrames: { [key: string]: () => void } = {
      day: () => {
        this.SearchParams.Batdau = moment().startOf('day').format('YYYY-MM-DD');
        this.SearchParams.Ketthuc = moment().endOf('day').add(1,'day').format('YYYY-MM-DD');
      },
      week: () => {
        this.SearchParams.Batdau = moment().startOf('week').format('YYYY-MM-DD');
        this.SearchParams.Ketthuc = moment().endOf('week').format('YYYY-MM-DD');
      },
      month: () => {
        this.SearchParams.Batdau = moment().startOf('month').format('YYYY-MM-DD');
        this.SearchParams.Ketthuc = moment().endOf('month').format('YYYY-MM-DD');
      },
      year: () => {
        this.SearchParams.Batdau = moment().startOf('year').format('YYYY-MM-DD');
        this.SearchParams.Ketthuc = moment().endOf('year').format('YYYY-MM-DD');
      },
    };

    timeFrames[event.value]?.();
    this.refresh();
  }
  onDateChange(event: any): void {
    console.log(event);
    if(event.value){
    }
  }
  createFilter(): (data: any, filter: string) => boolean {
    return (data, filter) => {
      const filterObject = JSON.parse(filter);
      let isMatch = true;
      this.displayedColumns.forEach(column => {
        if (filterObject[column]) {
          const value = data[column] ? data[column].toString().toLowerCase() : '';
          isMatch = isMatch && value.includes(filterObject[column].toLowerCase());
        }
      });
      return isMatch;
    };
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
    if (this.dataSource().paginator) {
      this.dataSource()?.paginator?.firstPage();
    }
  }
  async ngOnInit(): Promise<void> {    
    await this._DonhangService.searchDonhang(this.SearchParams);
    this.CountItem = this.Vandon().length;
    this.initializeColumns();
    this.setupDrawer();
    this.paginator._intl.itemsPerPageLabel = 'Số lượng 1 trang';
    this.paginator._intl.nextPageLabel = 'Tiếp Theo';
    this.paginator._intl.previousPageLabel = 'Về Trước';
    this.paginator._intl.firstPageLabel = 'Trang Đầu';
    this.paginator._intl.lastPageLabel = 'Trang Cuối';
  }
  async refresh() {
    await this._DonhangService.searchDonhang(this.SearchParams);
  }
  private initializeColumns(): void {
    this.Columns = Object.keys(this.ColumnName).map((key) => ({
      key,
      value: this.ColumnName[key],
      isShow: true,
    }));
    if (this.FilterColumns.length === 0) {
      this.FilterColumns = this.Columns;
    } else {
      localStorage.setItem('VandonColFilter',JSON.stringify(this.FilterColumns)
      );
    }
    this.displayedColumns = this.FilterColumns.filter((v) => v.isShow).map(
      (item) => item.key
    );
    this.ColumnName = this.FilterColumns.reduce((obj, item) => {
      if (item.isShow) obj[item.key] = item.value;
      return obj;
    }, {} as Record<string, string>);
  }

  private setupDrawer(): void {
    this._breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        if (result.matches) {
          this.drawer.mode = 'over';
          this.paginator.hidePageSize = true;
        } else {
          this.drawer.mode = 'side';
        }
      });
  }
  toggleColumn(item: any): void {
    const column = this.FilterColumns.find((v) => v.key === item.key);
    if (column) {
      column.isShow = !column.isShow;
      this.updateDisplayedColumns();
    }
  }
  private updateDisplayedColumns(): void {
    this.displayedColumns = this.FilterColumns.filter((v) => v.isShow).map(
      (item) => item.key
    );
    this.ColumnName = this.FilterColumns.reduce((obj, item) => {
      if (item.isShow) obj[item.key] = item.value;
      return obj;
    }, {} as Record<string, string>);
    localStorage.setItem('VandonColFilter',JSON.stringify(this.FilterColumns)
    );
  }
  doFilterColumns(event: any): void {
    const query = event.target.value.toLowerCase();
    this.FilterColumns = this.Columns.filter((v) =>
      v.value.toLowerCase().includes(query)
    );
  }
  async LoadDrive() {
    const DriveInfo = {
      IdSheet: '15npo25qyH5FmfcEjl1uyqqyFMS_vdFnmxM_kt0KYmZk',
      SheetName: 'SPImport',
      ApiKey: 'AIzaSyD33kgZJKdFpv1JrKHacjCQccL_O0a2Eao',
    };
   const result: any = await this._GoogleSheetService.getDrive(DriveInfo);
   const data = ConvertDriveData(result.values);
   console.log(data);
   this.DoImportData(data);
    // const updatePromises = data.map(async (v: any) => {
    //   const item = this._KhachhangsService
    //     .ListKhachhang()
    //     .find((v1) => v1.MaKH === v.MaKH);
    //   if (item) {
    //     const item1 = { ...item, ...v };
    //     console.log(item1);

    //     await this._KhachhangsService.updateOneKhachhang(item1);
    //   }
    // });
    // Promise.all(updatePromises).then(() => {
    //   this._snackBar.open('Cập Nhật Thành Công', '', {
    //     duration: 1000,
    //     horizontalPosition: 'end',
    //     verticalPosition: 'top',
    //     panelClass: ['snackbar-success'],
    //   });
    //   //  window.location.reload();
    // });
  }
  DoImportData(data:any)
  {
    console.log(data);
    
    const transformedData = data.map((v: any) => ({
      title: v.title?.trim()||'',
      masp: v.masp?.trim()||'',
      slug:`${convertToSlug(v?.title?.trim()||'')}_${GenId(5,false)}`,
      giagoc: Number(v.giagoc)||0,
      dvt: v.dvt||'',
      soluong: Number(v.soluong)||0,
      soluongkho: Number(v.soluongkho)||0,
      ghichu: v.ghichu||'',
      order: Number(v.order)||0,
   }));
   // Filter out duplicate masp values
   const uniqueData = transformedData.filter((value:any, index:any, self:any) => 
      index === self.findIndex((t:any) => (
        t.masp === value.masp
      ))
   )
    const listId2 = uniqueData.map((v: any) => v.masp);
    const listId1 = this._DonhangService.ListDonhang().map((v: any) => v.masp);
    const listId3 = listId2.filter((item:any) => !listId1.includes(item));
    const createuppdateitem = uniqueData.map(async (v: any) => {
        const item = this._DonhangService.ListDonhang().find((v1) => v1.masp === v.masp);
        if (item) {
          const item1 = { ...item, ...v };
          await this._DonhangService.updateDonhang(item1);
        }
        else{
          await this._DonhangService.CreateDonhang(v);
        }
      });
     const disableItem = listId3.map(async (v: any) => {
        const item = this._DonhangService.ListDonhang().find((v1) => v1.masp === v);
        item.isActive = false;
        await this._DonhangService.updateDonhang(item);
      });
      Promise.all([...createuppdateitem, ...disableItem]).then(() => {
        this._snackBar.open('Cập Nhật Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
       // window.location.reload();
      });
  }
  async ImporExcel(event: any) {
  const data = await readExcelFile(event)
  this.DoImportData(data);
  }   
  ExportExcel(data:any,title:any) {
    writeExcelFile(data,title);
  }






  @memoize()
  FilterHederColumn(list:any,column:any)
  {
    const uniqueList = list.filter((obj: any, index: number, self: any) => 
      index === self.findIndex((t: any) => t[column] === obj[column])
    );
    return uniqueList
  }
  @Debounce(300)
  doFilterHederColumn(event: any, column: any): void {
    this.dataSource().filteredData = this.Vandon().filter((v: any) => v[column].toLowerCase().includes(event.target.value.toLowerCase()));  
    const query = event.target.value.toLowerCase();  
  }
  trackByFn(index: number, item: any): any {
    return item.id; // Use a unique identifier
  }
  ListFilter:any[] =[]
  ChosenItem(item:any,column:any)
  {
    const CheckItem = this.dataSource().filteredData.filter((v:any)=>v[column]===item[column]);
    const CheckItem1 = this.ListFilter.filter((v:any)=>v[column]===item[column]);
    if(CheckItem1.length>0)
    {
      this.ListFilter = this.ListFilter.filter((v) => v[column] !== item[column]);
    }
    else{
      this.ListFilter = [...this.ListFilter,...CheckItem];
    }
  }
  ChosenAll(list:any)
  {
    list.forEach((v:any) => {
      const CheckItem = this.ListFilter.find((v1)=>v1.id===v.id)?true:false;
      if(CheckItem)
        {
          this.ListFilter = this.ListFilter.filter((v) => v.id !== v.id);
        }
        else{
          this.ListFilter.push(v);
        }
    });
  }
  ResetFilter()
  {
    this.ListFilter = this.Vandon();
    this.dataSource().data = this.Vandon();
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;
  }
  EmptyFiter()
  {
    this.ListFilter = [];
  }
  CheckItem(item:any)
  {
    return this.ListFilter.find((v)=>v.id===item.id)?true:false;
  }
  ApplyFilterColum(menu:any)
  {    
    this.dataSource().data = this.Vandon().filter((v: any) => this.ListFilter.some((v1) => v1.id === v.id));
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;
    menu.closeMenu();
  }
}



function memoize() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const cache = new Map();

    descriptor.value = function (...args: any[]) {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = originalMethod.apply(this, args);
      cache.set(key, result);
      return result;
    };

    return descriptor;
  };
}

function Debounce(delay: number = 300) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    let timeoutId: any;

    descriptor.value = function (...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        originalMethod.apply(this, args);
      }, delay);
    };

    return descriptor;
  };
}