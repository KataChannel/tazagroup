import {AfterViewInit, Component, inject, viewChild, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ListBaiviet } from './listbaiviet';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DetailBaivietComponent } from './detailbaiviet/detailbaiviet.component';
import { ConvertDriveColumnName, ConvertDriveData } from '../../shared/utils/shared.utils';
import { GoogleSheetService } from '../../shared/googlesheets/googlesheets.service';
@Component({
  selector: 'app-listbaiviet',
  templateUrl: './listbaiviet.component.html',
  styleUrl: './listbaiviet.component.scss',
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
  ],
})
export class ListbaivietComponent implements AfterViewInit {
  Detail:any={}
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'STT',
    'Title', 
    'author', 
    'category',
    'createdAt',
    'status',
  ];
  
  ColumnName: any = {
    'STT': 'STT',
    'Title': 'Tiêu Đề', 
    'author': 'Tác Giả', 
    'category': 'Danh Mục',
    'createdAt': 'Ngày Tạo',
    'status': 'Trạng Thái',
  };
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  _GoogleSheetService:GoogleSheetService=inject(GoogleSheetService)
  ListBaiviet:any[] =[]
  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _router: Router,
  ) {}

  ngOnInit(): void {
        const ListSheets = JSON.parse(localStorage.getItem('ListSheets') || '[]');
        console.log(ListSheets);
        if (ListSheets.length > 0) {
          const CheckSheet = ListSheets.find((v:any) => v.SheetName === 'Baiviet');
          if (CheckSheet) {
            this._GoogleSheetService.getDrive(CheckSheet).then(result => {
              if(result.values.length>0)
              {
                this.displayedColumns = result.values[0].map((item:any)=>item)
                this.ColumnName = ConvertDriveColumnName(result.values)      
                this.dataSource = new MatTableDataSource(ConvertDriveData(result.values));
                this.ListBaiviet = ConvertDriveData(result.values);
                console.log(this.ListBaiviet);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
            });
          }
        }
    // this.dataSource = new MatTableDataSource(ListBaiviet); 
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.Detail.id?this.drawer.open():this.drawer.close()
    this._breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
       this.drawer.mode = 'over';
       this.paginator.hidePageSize =true
      } else {
        this.drawer.mode = 'side';
      }
    });
    
  }
  ngAfterViewInit() { 
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Số lượng 1 trang';
    this.paginator._intl.nextPageLabel = 'Tiếp Theo';
    this.paginator._intl.previousPageLabel = 'Về Trước';
    this.paginator._intl.firstPageLabel = 'Trang Đầu';
    this.paginator._intl.lastPageLabel = 'Trang Cuối';
    this.paginator.pageSize = 30
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  Create()
  {
    this.drawer.open();
    this._router.navigate(['admin/baiviet', 0])
  }
  goToDetail(item:any)
  {
    this.drawer.open();
    this.Detail=item
    this._router.navigate(['admin/baiviet', item.id])  }
}
