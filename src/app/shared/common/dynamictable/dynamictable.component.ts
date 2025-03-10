import { Component, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu'
@Component({
  selector: 'app-dynamictable',
  templateUrl: './dynamictable.component.html',
  styleUrl: './dynamictable.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    MatTooltipModule
  ],
})
export class DynamictableComponent {
  @Input() ListItem:any = [];
  @Input() displayedColumns:any = [];
  @Input() ColumnName:any = {};
//   displayedColumns: string[] = [];
//   ColumnName: any = {};
  FilterColumns: any[] = JSON.parse(
    localStorage.getItem('NhacungcapColFilter') || '[]'
  );
  Columns: any[] = [];
  isFilter: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  filterValues: { [key: string]: string } = {};
  private _router: Router = inject(Router)
  dataSource = new MatTableDataSource([]);
  constructor() {}
  ngOnChanges(changes: SimpleChanges) {
    console.log('Dữ liệu từ cha thay đổi:', changes['ListItem'].currentValue);
    this.ListItem = changes['ListItem'].currentValue
    this.dataSource.data = this.ListItem;
    console.log(this.dataSource.data);
  }
  async ngOnInit(): Promise<void> {   
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort
    this.initializeColumns();
    if (this.paginator) {
        this.paginator._intl.itemsPerPageLabel = 'Số lượng 1 trang';
        this.paginator._intl.nextPageLabel = 'Tiếp Theo';
        this.paginator._intl.previousPageLabel = 'Về Trước';
        this.paginator._intl.firstPageLabel = 'Trang Đầu';
        this.paginator._intl.lastPageLabel = 'Trang Cuối';
    }

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
      localStorage.setItem('NhacungcapColFilter',JSON.stringify(this.FilterColumns)
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

  toggleColumn(item: any): void {
    const column = this.FilterColumns.find((v) => v.key === item.key);
    if (column) {
      column.isShow = !column.isShow;
      this.updateDisplayedColumns();
    }
  }
  FilterHederColumn(list:any,column:any)
  {
    const uniqueList = list.filter((obj: any, index: number, self: any) => 
      index === self.findIndex((t: any) => t[column] === obj[column])
    );
    return uniqueList
  }
  doFilterHederColumn(event: any, column: any): void {
    this.dataSource.filteredData = this.ListItem.filter((v: any) => v[column].toLowerCase().includes(event.target.value.toLowerCase()));  
    const query = event.target.value.toLowerCase();
    console.log(query,column);
    console.log(this.dataSource.filteredData);   
  }
  ListFilter:any[] =[]
  ChosenItem(item:any)
  {
    if(this.ListFilter.includes(item.id))
    {
      this.ListFilter = this.ListFilter.filter((v) => v !== item.id);
    }
    else{
      this.ListFilter.push(item.id);
    }
    console.log(this.ListFilter);
    
  }
  ChosenAll(list:any)
  {
    list.forEach((v:any) => {
      if(this.ListFilter.includes(v.id))
        {
          this.ListFilter = this.ListFilter.filter((v) => v !== v.id);
        }
        else{
          this.ListFilter.push(v.id);
        }
    });
  }
  ResetFilter()
  {
    this.ListFilter = this.ListItem.map((v:any) => v.id);
    this.dataSource.data = this.ListItem;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  EmptyFiter()
  {
    this.ListFilter = [];
  }
  CheckItem(item:any)
  {
    return this.ListFilter.includes(item.id);
  }
  ApplyFilterColum(menu:any)
  {    
    this.dataSource.data = this.ListItem.filter((v: any) => this.ListFilter.includes(v.id));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.dataSource.data);
    menu.closeMenu();
    
  }
  private updateDisplayedColumns(): void {
    this.displayedColumns = this.FilterColumns.filter((v) => v.isShow).map(
      (item) => item.key
    );
    this.ColumnName = this.FilterColumns.reduce((obj, item) => {
      if (item.isShow) obj[item.key] = item.value;
      return obj;
    }, {} as Record<string, string>);
    localStorage.setItem('NhacungcapColFilter',JSON.stringify(this.FilterColumns)
    );
  }
  doFilterColumns(event: any): void {
    const query = event.target.value.toLowerCase();
    this.FilterColumns = this.Columns.filter((v) =>
      v.value.toLowerCase().includes(query)
    );
  }
  goToDetail(item: any): void {
    this.drawer.open();
    this._router.navigate(['admin/nhacungcap', item.id]);
  }
}