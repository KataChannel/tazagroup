import { TemplateRef , Component, inject, ViewChild, Inject, PLATFORM_ID, ChangeDetectionStrategy, signal } from '@angular/core';
import { isPlatformBrowser} from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Forms, ListHotro, ListType } from './listhotro';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HotrosService } from './listhotro.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminmainComponent } from '../../adminmain/adminmain.component';
import { MatSnackBar} from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../user/user.service';
@Component({
  selector: 'app-listhotro',
  templateUrl: './listhotro.component.html',
  styleUrls: ['./listhotro.component.scss'],
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
    MatInputModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    MatDialogModule,
    MatTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListHotroComponent {
  Detail: any = {Type: 'baoloi'};
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  ColumnName: any = { 'STT': 'STT' };
  FilterColumns: any[] = [];
  Columns: any[] = [];
  ListHotro = signal<any[]>([]);
  InitHotro: any[] = [];
  CountItem: number = 0;
  isFullScreen:boolean = false;
  profile:any = {};
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.FilterColumns = JSON.parse(localStorage.getItem('hotro_FilterColumns') || '[]');
    }
    this._AdminmainComponent.drawer1.close();
    this._AdminmainComponent.drawer.close();
    this._AdminmainComponent.drawer.mode = 'over';
  }
  private _hotrosService: HotrosService = inject(HotrosService);
  private _UserService: UserService = inject(UserService);
  private _AdminmainComponent: AdminmainComponent = inject(AdminmainComponent);
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  async ngOnInit(): Promise<void> {
    this.profile = await this._UserService.getProfile();    
    await this._hotrosService.getAllHotro();
    this.ListHotro = this._hotrosService.ListHotro;
    this.InitHotro = this.ListHotro();
    this.initializeColumns();
    this.setupDataSource();
    this.setupDrawer();
    
  }

  private initializeColumns(): void {
    this.Columns = Object.keys(ListHotro[0]).map(key => ({
      key,
      value: ListHotro[0][key],
      isShow: true
    }));
    if (this.FilterColumns.length === 0) {
      this.FilterColumns = this.Columns;
    } else {
      localStorage.setItem('hotro_FilterColumns', JSON.stringify(this.FilterColumns));
    }

    this.displayedColumns = this.FilterColumns.filter(v => v.isShow).map(item => item.key);
    this.ColumnName = this.FilterColumns.reduce((obj, item) => {
      if (item.isShow) obj[item.key] = item.value;
      return obj;
    }, {} as Record<string, string>);
  }

  private setupDataSource(): void {
    this.dataSource = new MatTableDataSource(this.ListHotro().slice(1).map(v =>
      this.FilterColumns.filter(item => item.isShow).reduce((obj, item) => {
        obj[item.key] = v[item.key];
        return obj;
      }, {})
    ));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if(this.dataSource.paginator)
    {
      this.paginator._intl.itemsPerPageLabel = 'Số lượng 1 trang';
      this.paginator._intl.nextPageLabel = 'Tiếp Theo';
      this.paginator._intl.previousPageLabel = 'Về Trước';
      this.paginator._intl.firstPageLabel = 'Trang Đầu';
      this.paginator._intl.lastPageLabel = 'Trang Cuối';
    }

  }

  private setupDrawer(): void {
    this._breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        this.drawer.mode = 'side';
        // this.paginator.hidePageSize = true;
      } else {
        this.drawer.mode = 'side';
      }
    });
  }

  toggleColumn(item: any): void {
    const column = this.FilterColumns.find(v => v.key === item.key);
    if (column) {
      column.isShow = !column.isShow;
      this.updateDisplayedColumns();
    }
  }

  private updateDisplayedColumns(): void {
    this.displayedColumns = this.FilterColumns.filter(v => v.isShow).map(item => item.key);
    this.ColumnName = this.FilterColumns.reduce((obj, item) => {
      if (item.isShow) obj[item.key] = item.value;
      return obj;
    }, {} as Record<string, string>);
    this.setupDataSource();
    localStorage.setItem('hotro_FilterColumns', JSON.stringify(this.FilterColumns));
  }

  doFilterColumns(event: any): void {
    const query = event.target.value.toLowerCase();
    this.FilterColumns = this.Columns.filter(v => v.value.toLowerCase().includes(query));    
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource);
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async create(): Promise<void> {
    if(!this.Detail.Title||this.Detail.Title=='')
    {
      this._snackBar.open('Vui lòng nhập tiêu đề', '', {
        duration: 1000,
        horizontalPosition: "end",
        verticalPosition: "top",
        panelClass: ['snackbar-warning'],
      });
    }
    else{
      this.Detail.idCreate = this.profile.id;
      const newItem = await this._hotrosService.CreateHotro(this.Detail);
      this.dialogCreateRef.close();
      this.Detail = {Type: 'baoloi'};
      this._router.navigate(['admin/hotro', newItem.id]);
    }
  }

  // goToDetail(item: any): void {
  //   this.drawer.open();
  //   this.Detail = item;
  //   this._router.navigate(['admin/hotros', item.id]);
  // }
  dialog = inject(MatDialog);
  dialogCreateRef: any;
  openCreateDialog(teamplate:TemplateRef<any>) {
     this.dialogCreateRef = this.dialog.open(teamplate, {
      hasBackdrop: true,
      disableClose: true,
    });
  }
  FilterListType: any[] = ListType;
  GetNameType(value: any){
    const type = ListType.find(v => v.value === value);
    return type;
  }
  FilterType(item: any){
    this.ListHotro.set(this.InitHotro.filter(v => v.Type === item.value))
  }
  CountListType(item: any){
    return this.InitHotro.filter(v => v.Type === item.value).length;
  }
  DoFindKhachhang(event:any){
    const query = event.target.value.toLowerCase();
     this.FilterListType = ListType.filter(v => v.Title.toLowerCase().includes(query));      
  }
  applyFilterType(event: any): void {
    const filterValue = event.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  isSearch: boolean = false;
  writeExcelFile(): void {}
  readExcelFile(event:any): void {}
  LoadDrive(): void {}


}