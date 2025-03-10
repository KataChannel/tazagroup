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
// import { BanggiaService } from '../banggia.service';
// import { MatMenuModule } from '@angular/material/menu';
// import { readExcelFile, writeExcelFile } from '../../../shared/utils/exceldrive.utils';
// import { ConvertDriveData, convertToSlug, GenId } from '../../../shared/utils/shared.utils';
// import { GoogleSheetService } from '../../../shared/googlesheets/googlesheets.service';
// @Component({
//   selector: 'app-listbanggia',
//   templateUrl: './listbanggia.component.html',
//   styleUrls: ['./listbanggia.component.scss'],
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
//     MatTooltipModule,
//   ],
// })
// export class ListBanggiaComponent {
//   Detail: any = {};
//   displayedColumns: string[] = [
//     'STT',
//     'title',
//     'type',
//     'sanpham',
//     'batdau',
//     'ketthuc',
//     //  'order',
//     'status',
//     // 'isActive',
//     'createdAt',
//     'updatedAt',
//   ];
//   ColumnName: any = {
//     STT: 'STT',
//     title: 'Tiêu Đề',
//     type: 'Loại',
//     sanpham: 'Sản Phẩm',
//     batdau: 'Bắt Đầu',
//     ketthuc: 'Kết Thúc',
//     // order: 'Thứ Tự',
//     status: 'Tình Trạng',
//     // isActive: 'Trạng Thái',
//     createdAt:'Ngày Tạo',
//     updatedAt:'Ngày Cập Nhật'
//   };
//   FilterColumns: any[] = JSON.parse(
//     localStorage.getItem('BanggiaColFilter') || '[]'
//   );
//   Columns: any[] = [];
//   isFilter: boolean = false;
//   ListStatus: any[] = [
//     { value: 'baogia', title: 'Báo Giá' },
//     { value: 'dangban', title: 'Đang Bán' },
//     { value: 'ngungban', title: 'Ngừng Bán' },
//   ];
//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;
//   @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
//   filterValues: { [key: string]: string } = {};
//   private _BanggiaService: BanggiaService = inject(BanggiaService);
//   private _breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
//   private _GoogleSheetService: GoogleSheetService = inject(GoogleSheetService);
//   private _router: Router = inject(Router);
//   Listbanggia:any = this._BanggiaService.ListBanggia;
//   dataSource = computed(() => {
//     const ds = new MatTableDataSource(this.Listbanggia());
//     ds.filterPredicate = this.createFilter();
//     ds.paginator = this.paginator;
//     ds.sort = this.sort;
//     return ds;
//   });
//   banggiaId:any = this._BanggiaService.banggiaId;
//   _snackBar: MatSnackBar = inject(MatSnackBar);
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
//   applyFilter() {
//     this.dataSource().filter = JSON.stringify(this.filterValues);
//   }
//   getName(list:any,field:any,value:any){    
//     return list.find((v:any)=>v[field]===value);
//   }
//   async ngOnInit(): Promise<void> {    
//     await this._BanggiaService.getAllBanggia();
//     this.CountItem = this.Listbanggia().length;
//     this.initializeColumns();
//     this.setupDrawer();
//     this.paginator._intl.itemsPerPageLabel = 'Số lượng 1 trang';
//     this.paginator._intl.nextPageLabel = 'Tiếp Theo';
//     this.paginator._intl.previousPageLabel = 'Về Trước';
//     this.paginator._intl.firstPageLabel = 'Trang Đầu';
//     this.paginator._intl.lastPageLabel = 'Trang Cuối';
//   }
//   async refresh() {
//    await this._BanggiaService.getAllBanggia();
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
//       localStorage.setItem('BanggiaColFilter',JSON.stringify(this.FilterColumns)
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
//   private updateDisplayedColumns(): void {
//     this.displayedColumns = this.FilterColumns.filter((v) => v.isShow).map(
//       (item) => item.key
//     );
//     this.ColumnName = this.FilterColumns.reduce((obj, item) => {
//       if (item.isShow) obj[item.key] = item.value;
//       return obj;
//     }, {} as Record<string, string>);
//     localStorage.setItem('BanggiaColFilter',JSON.stringify(this.FilterColumns)
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
//     this._router.navigate(['admin/banggia', 0]);
//   }
//   goToDetail(item: any): void {
//      this._BanggiaService.setBanggiaId(item.id);
//     this.drawer.open();
//     this._router.navigate(['admin/banggia', item.id]);
//   }
//   async LoadDrive() {
//     const DriveInfo = {
//       IdSheet: '15npo25qyH5FmfcEjl1uyqqyFMS_vdFnmxM_kt0KYmZk',
//       SheetName: 'BGImport',
//       ApiKey: 'AIzaSyD33kgZJKdFpv1JrKHacjCQccL_O0a2Eao',
//     };
//    const result: any = await this._GoogleSheetService.getDrive(DriveInfo);
//    const data = ConvertDriveData(result.values);
//    console.log(data);
//   //  this.DoImportData(data);
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
//     console.log(data);
    
//     const transformedData = data.map((v: any) => ({
//       title: v.title?.trim()||'',
//       masp: v.masp?.trim()||'',
//       slug:`${convertToSlug(v?.title?.trim()||'')}_${GenId(5,false)}`,
//       giagoc: Number(v.giagoc)||0,
//       dvt: v.dvt||'',
//       soluong: Number(v.soluong)||0,
//       soluongkho: Number(v.soluongkho)||0,
//       ghichu: v.ghichu||'',
//       order: Number(v.order)||0,
//    }));
//    // Filter out duplicate masp values
//    const uniqueData = transformedData.filter((value:any, index:any, self:any) => 
//       index === self.findIndex((t:any) => (
//         t.masp === value.masp
//       ))
//    )
//     const listId2 = uniqueData.map((v: any) => v.masp);
//     const listId1 = this._BanggiaService.ListBanggia().map((v: any) => v.masp);
//     const listId3 = listId2.filter((item:any) => !listId1.includes(item));
//     const createuppdateitem = uniqueData.map(async (v: any) => {
//         const item = this._BanggiaService.ListBanggia().find((v1) => v1.masp === v.masp);
//         if (item) {
//           const item1 = { ...item, ...v };
//           await this._BanggiaService.updateBanggia(item1);
//         }
//         else{
//           await this._BanggiaService.CreateBanggia(v);
//         }
//       });
//      const disableItem = listId3.map(async (v: any) => {
//         const item = this._BanggiaService.ListBanggia().find((v1) => v1.masp === v);
//         if (item) {
//           item.isActive = false;
//         }
//         await this._BanggiaService.updateBanggia(item);
//       });
//       Promise.all([...createuppdateitem, ...disableItem]).then(() => {
//         this._snackBar.open('Cập Nhật Thành Công', '', {
//           duration: 1000,
//           horizontalPosition: 'end',
//           verticalPosition: 'top',
//           panelClass: ['snackbar-success'],
//         });
//        // window.location.reload();
//       });
//   }
//   async ImporExcel(event: any) {
//   const data = await readExcelFile(event)
//   this.DoImportData(data);
//   }   
//   ExportExcel(data:any,title:any) {
//     writeExcelFile(data,title);
//   }
// }