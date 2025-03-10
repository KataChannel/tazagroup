import { Component, Input, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ModuleRegistry,ColDef, AllCommunityModule, ClientSideRowModelModule, ColumnAutoSizeModule, RowSelectionModule,
} from 'ag-grid-community';
ModuleRegistry.registerModules([
  AllCommunityModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  ColumnAutoSizeModule,
  ]);
const vietnameseLocaleText = {
  page: 'Trang',
  to: 'đến',
  of: 'của',
  first: 'Đầu tiên',
  previous: 'Trước',
  next: 'Tiếp',
  last: 'Cuối cùng',
  filterOoo: 'Lọc...',
  equals: 'Bằng',
  notEqual: 'Không bằng',
  lessThan: 'Nhỏ hơn',
  greaterThan: 'Lớn hơn',
  contains: 'Chứa',
  startsWith: 'Bắt đầu bằng',
  endsWith: 'Kết thúc bằng',
  applyFilter: 'Áp dụng',
  resetFilter: 'Đặt lại',
  clearFilter: 'Xóa bộ lọc',
  noRowsToShow: 'Không có hàng để hiển thị',
  loadingOoo: 'Đang tải...',
  pagesize:'Số Lượng'
};
@Component({
  selector: 'app-aggrid',
  imports: [
    AgGridAngular,
  ],
  templateUrl: './aggrid.component.html',
  styleUrl: './aggrid.component.scss'
})
export class AggridComponent {
@ViewChild('agGrid') agGrid!: AgGridAngular;
@Input() columnDefs: ColDef[]= [];
@Input() rowData: any[]= [];
@Input() defaultColDef: ColDef= {};
@Input() theme: any= 'ag-theme-alpine';
  // Column Definitions: Define the structure of the grid columns
  // columnDefs: ColDef[] = 
  // [
  //   { headerName: 'Name', field: 'name', sortable: true, filter: true},
  //   { headerName: 'Mã KH', field: 'makh', sortable: true, filter: true },
  //   { headerName: 'Tên NN', field: 'namenn', sortable: true, filter: true },
  //   { headerName: 'Địa Chỉ', field: 'diachi', sortable: true, filter: true },
  //   { headerName: 'Quận', field: 'quan', sortable: true, filter: true },
  //   { headerName: 'Email', field: 'email', sortable: true, filter: true },
  //   { headerName: 'SĐT', field: 'sdt', sortable: true, filter: true },
  //   { headerName: 'MST', field: 'mst', sortable: true, filter: true },
  //   { headerName: 'Giờ Nhận Hàng', field: 'gionhanhang', sortable: true, filter: true },
  //   { headerName: 'Bảng Giá', field: 'banggia', sortable: true, filter: true },
  //   { headerName: 'Loại KH', field: 'loaikh', sortable: true, filter: true },
  //   { headerName: 'Order', field: 'order', sortable: true, filter: true },
  //   { headerName: 'Trạng Thái', field: 'isActive', sortable: true, filter: true },
  //   { headerName: 'Ngày Tạo', field: 'createdAt', sortable: true, filter: true },
  //   { headerName: 'Ngày Cập Nhật', field: 'updatedAt', sortable: true, filter: true }
  // ];
  // // Row Data: Sample data to display in the grid
  // rowData = []
  
  // // [
  // //   { make: 'Toyota', model: 'Celica', price: 35000 },
  // //   { make: 'Ford', model: 'Mondeo', price: 32000 },
  // //   { make: 'Porsche', model: 'Boxster', price: 72000 }
  // // ];

  // // Default Column Settings (applied to all columns unless overridden)
  // defaultColDef: ColDef = {
  //   editable: true,
  //   flex: 1,
  //   minWidth: 100,
  //   resizable: true
  // };

  // Grid Options
  gridOptions = {
    pagination: true,
    paginationPageSize: 20,
    localeText: vietnameseLocaleText,
    rowSelection: 'single' as const, // Change this to 'single' or 'multiple'
    onGridReady: (params: any) => {
      params.api.sizeColumnsToFit();
      console.log('Grid is ready!');
      if (params.api) {
        console.log('Total Rows:', params.api.getDisplayedRowCount());
        console.log('Pagination Total Items:', params.api.paginationGetRowCount());
        console.log('Current Page:', params.api.paginationGetCurrentPage());
        params.api.sizeColumnsToFit();
        setTimeout(() => {
          if (this.agGrid && this.agGrid.api) {
            console.log('Rows via ViewChild:', this.agGrid.api.getDisplayedRowCount());
          }
        }, 100);
      } else {
        console.log('Grid API is not available');
      }
    }
  };


  ngOnInit(): void {
    console.log('Column Definitions:', this.columnDefs);
    console.log('Row Data:', this.rowData);
    console.log('Default Column Settings:', this.defaultColDef);
  }
}


