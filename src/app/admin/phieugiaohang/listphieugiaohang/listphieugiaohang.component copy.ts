// import { AfterViewInit, Component, computed, effect, inject, ViewChild } from '@angular/core';
// import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
// import { MatSort, MatSortModule } from '@angular/material/sort';
// import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
// import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
// import { Router, RouterLink, RouterOutlet } from '@angular/router';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatSelectModule } from '@angular/material/select';
// import { CommonModule } from '@angular/common';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { FormsModule } from '@angular/forms';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatMenuModule } from '@angular/material/menu';
// import { readExcelFile, writeExcelFile } from '../../../shared/utils/exceldrive.utils';
// import { ConvertDriveData, convertToSlug, GenId } from '../../../shared/utils/shared.utils';
// import { GoogleSheetService } from '../../../shared/googlesheets/googlesheets.service';
// import { DonhangService } from '../../donhang/donhang.service';
// @Component({
//   selector: 'app-listphieugiaohang',
//   templateUrl: './listphieugiaohang.component.html',
//   styleUrls: ['./listphieugiaohang.component.scss'],
//   imports: [
//     MatFormFieldModule,
//     MatInputModule,
//     MatTableModule,
//     MatSortModule,
//     MatPaginatorModule,
//     MatMenuModule,
//     MatSidenavModule,
//     RouterOutlet,
//     MatIconModule,
//     MatButtonModule,
//     MatSelectModule,
//     CommonModule,
//     FormsModule,
//     MatTooltipModule
//   ],
// })
// export class ListPhieugiaohangComponent {
//   Detail: any = {};
//   displayedColumns: string[] = [
//     'madonhang',
//     'khachhang',
//     'sanpham',
//     'ngaygiao',
//     'status',
//     'ghichu',
//     'createdAt',
//     'updatedAt',
//   ];
//   ColumnName: any = {
//     madonhang: 'Mã Đơn Hàng',
//     khachhang: 'Khách Hàng',
//     sanpham: 'Sản Phẩm',
//     ngaygiao: 'Ngày Giao',
//     status: 'Trạng Thái',
//     ghichu: 'Ghi Chú',
//     createdAt:'Ngày Tạo',
//     updatedAt:'Ngày Cập Nhật'
//   };
//   FilterColumns: any[] = JSON.parse(
//     localStorage.getItem('PhieugiaohangColFilter') || '[]'
//   );
//   Columns: any[] = [];
//   isFilter: boolean = false;

//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;
//   @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
//   filterValues: { [key: string]: string } = {};
//   private _DonhangService: DonhangService = inject(DonhangService);
//   private _breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
//   private _GoogleSheetService: GoogleSheetService = inject(GoogleSheetService);
//   private _router: Router = inject(Router);
//   Listphieugiaohang:any = this._DonhangService.ListDonhang;
//   dataSource = new MatTableDataSource([]);
//   donhangId:any = this._DonhangService.donhangId;
//   _snackBar: MatSnackBar = inject(MatSnackBar);
//   isSearch: boolean = false;
//   CountItem: any = 0;
//   constructor() {
//     this.displayedColumns.forEach(column => {
//       this.filterValues[column] = '';
//     });
//   }
//   createFilter(): (data: any, filter: string) => boolean {
//     return (data, filter) => {
//       const filterObject = JSON.parse(filter);
//       let isMatch = true;
//       this.displayedColumns.forEach(column => {
//         if (filterObject[column]) {
//           const value = data[column] ? data[column].toString().toLowerCase() : '';
//           isMatch = isMatch && value.includes(filterObject[column].toLowerCase());
//         }
//       });
//       return isMatch;
//     };
//   }
//   async ngOnInit(): Promise<void> {    
//     await this._DonhangService.getAllDonhang();
//     this.CountItem = this.Listphieugiaohang().length;
//     this.dataSource = new MatTableDataSource(this.Listphieugiaohang());
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
//     this.dataSource.filterPredicate = this.createFilter();
//     this.initializeColumns();
//     this.setupDrawer();
//     this.paginator._intl.itemsPerPageLabel = 'Số lượng 1 trang';
//     this.paginator._intl.nextPageLabel = 'Tiếp Theo';
//     this.paginator._intl.previousPageLabel = 'Về Trước';
//     this.paginator._intl.firstPageLabel = 'Trang Đầu';
//     this.paginator._intl.lastPageLabel = 'Trang Cuối';
//   }
//   async refresh() {
//    await this._DonhangService.getAllDonhang();
//   }
//   applyFilter(event: Event) {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//   }
//   private initializeColumns(): void {
//     this.Columns = Object.keys(this.ColumnName).map((key) => ({
//       key,
//       value: this.ColumnName[key],
//       isShow: true,
//     }));
//     if (this.FilterColumns.length === 0) {
//       this.FilterColumns = this.Columns;
//     } else {
//       localStorage.setItem('PhieugiaohangColFilter',JSON.stringify(this.FilterColumns)
//       );
//     }
//     this.displayedColumns = this.FilterColumns.filter((v) => v.isShow).map(
//       (item) => item.key
//     );
//     this.ColumnName = this.FilterColumns.reduce((obj, item) => {
//       if (item.isShow) obj[item.key] = item.value;
//       return obj;
//     }, {} as Record<string, string>);
//   }

//   private setupDrawer(): void {
//     this._breakpointObserver
//       .observe([Breakpoints.Handset])
//       .subscribe((result) => {
//         if (result.matches) {
//           this.drawer.mode = 'over';
//           this.paginator.hidePageSize = true;
//         } else {
//           this.drawer.mode = 'side';
//         }
//       });
//   }
//   toggleColumn(item: any): void {
//     const column = this.FilterColumns.find((v) => v.key === item.key);
//     if (column) {
//       column.isShow = !column.isShow;
//       this.updateDisplayedColumns();
//     }
//   }
//   FilterHederColumn(list:any,column:any)
//   {
//     const uniqueList = list.filter((obj: any, index: number, self: any) => 
//       index === self.findIndex((t: any) => t[column] === obj[column])
//     );
//     return uniqueList
//   }
//   doFilterHederColumn(event: any, column: any): void {
//     this.dataSource.filteredData = this.Listphieugiaohang().filter((v: any) => v[column].toLowerCase().includes(event.target.value.toLowerCase()));  
//     const query = event.target.value.toLowerCase();
//     console.log(query,column);
//     console.log(this.dataSource.filteredData);   
//   }
//   ListFilter:any[] =[]
//   ChosenItem(item:any)
//   {
//     if(this.ListFilter.includes(item.id))
//     {
//       this.ListFilter = this.ListFilter.filter((v) => v !== item.id);
//     }
//     else{
//       this.ListFilter.push(item.id);
//     }
//     console.log(this.ListFilter);
    
//   }
//   ChosenAll(list:any)
//   {
//     list.forEach((v:any) => {
//       if(this.ListFilter.includes(v.id))
//         {
//           this.ListFilter = this.ListFilter.filter((v) => v !== v.id);
//         }
//         else{
//           this.ListFilter.push(v.id);
//         }
//     });
//   }
//   ResetFilter()
//   {
//     this.ListFilter = this.Listphieugiaohang().map((v:any) => v.id);
//     this.dataSource.data = this.Listphieugiaohang();
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
//   }
//   EmptyFiter()
//   {
//     this.ListFilter = [];
//   }
//   CheckItem(item:any)
//   {
//     return this.ListFilter.includes(item.id);
//   }
//   ApplyFilterColum(menu:any)
//   {    
//     this.dataSource.data = this.Listphieugiaohang().filter((v: any) => this.ListFilter.includes(v.id));
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
//     console.log(this.dataSource.data);
//     menu.closeMenu();
    
//   }
//   private updateDisplayedColumns(): void {
//     this.displayedColumns = this.FilterColumns.filter((v) => v.isShow).map(
//       (item) => item.key
//     );
//     this.ColumnName = this.FilterColumns.reduce((obj, item) => {
//       if (item.isShow) obj[item.key] = item.value;
//       return obj;
//     }, {} as Record<string, string>);
//     localStorage.setItem('PhieugiaohangColFilter',JSON.stringify(this.FilterColumns)
//     );
//   }
//   doFilterColumns(event: any): void {
//     const query = event.target.value.toLowerCase();
//     this.FilterColumns = this.Columns.filter((v) =>
//       v.value.toLowerCase().includes(query)
//     );
//   }
//   create(): void {
//     this.drawer.open();
//     this._router.navigate(['admin/phieugiaohang', 0]);
//   }
//   goToDetail(item: any): void {
//      this._DonhangService.setDonhangId(item.id);
//     this.drawer.open();
//     this._router.navigate(['admin/phieugiaohang', item.id]);
//   }
//   async LoadDrive() {
//     const DriveInfo = {
//       IdSheet: '15npo25qyH5FmfcEjl1uyqqyFMS_vdFnmxM_kt0KYmZk',
//       SheetName: 'PGHImport',
//       ApiKey: 'AIzaSyD33kgZJKdFpv1JrKHacjCQccL_O0a2Eao',
//     };
//    const result: any = await this._GoogleSheetService.getDrive(DriveInfo);
//    const data = ConvertDriveData(result.values);
//    console.log(data);
//    this.DoImportData(data);
//     // const updatePromises = data.map(async (v: any) => {
//     //   const item = this._KhachhangsService
//     //     .ListKhachhang()
//     //     .find((v1) => v1.MaKH === v.MaKH);
//     //   if (item) {
//     //     const item1 = { ...item, ...v };
//     //     console.log(item1);

//     //     await this._KhachhangsService.updateOneKhachhang(item1);
//     //   }
//     // });
//     // Promise.all(updatePromises).then(() => {
//     //   this._snackBar.open('Cập Nhật Thành Công', '', {
//     //     duration: 1000,
//     //     horizontalPosition: 'end',
//     //     verticalPosition: 'top',
//     //     panelClass: ['snackbar-success'],
//     //   });
//     //   //  window.location.reload();
//     // });
//   }
//   DoImportData(data:any)
//   {

//   }
//   async ImporExcel(event: any) {
//   const data = await readExcelFile(event)
//   this.DoImportData(data);
//   }   
//   ExportExcel(data:any,title:any) {
//     writeExcelFile(data,title);
//   }
// }