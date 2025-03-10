// import { Component, inject, ViewChild, Inject, PLATFORM_ID, signal } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
// import { MatSort, MatSortModule } from '@angular/material/sort';
// import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatMenuModule } from '@angular/material/menu';
// import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
// import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
// import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatSelectModule } from '@angular/material/select';
// import { CommonModule } from '@angular/common';
// import { ListHotro } from '../listhotro';
// import { HotrosService } from '../listhotro.service';
// import { CkeditorComponent } from '../../../../shared/common/ckeditor/ckeditor.component';
//   @Component({
//     selector: 'app-detailhotro',
//     templateUrl: './detailhotro.component.html',
//     styleUrl: './detailhotro.component.scss',
//     imports: [
//       MatFormFieldModule,
//       MatInputModule,
//       MatTableModule,
//       MatSortModule,
//       MatPaginatorModule,
//       MatMenuModule,
//       MatSidenavModule,
//       MatIconModule,
//       MatButtonModule,
//       MatSelectModule,
//       CommonModule,
//       CkeditorComponent
//     ],
//   })
//   export class DetailHotroComponent {
//     Detail: any = signal<any>({});
//     dataSource!: MatTableDataSource<any>;
//     displayedColumns: string[] = [];
//     ColumnName: any = { 'STT': 'STT' };
//     FilterColumns: any[] = [];
//     Columns: any[] = [];
//     Listhotro: any[] = ListHotro;
//     toolbar:any[] = [
//       'heading',
//       'alignment',
//       '|',
//       'bold',
//       'italic',
//       'link',
//       'bulletedList',
//       'numberedList',
//       'blockQuote',
//       'undo',
//       'redo',
//     ]
//     @ViewChild(MatPaginator) paginator!: MatPaginator;
//     @ViewChild(MatSort) sort!: MatSort;
//     @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
//     constructor(
//       private _breakpointObserver: BreakpointObserver,
//       @Inject(PLATFORM_ID) private platformId: Object
//     ) {
//       if (isPlatformBrowser(this.platformId)) {
//         this.FilterColumns = JSON.parse(localStorage.getItem('hotro_FilterColumns') || '[]');
//       }
//     }
//     private _hotrosService: HotrosService = inject(HotrosService);
//     _router:ActivatedRoute = inject(ActivatedRoute)
//     _route:Router = inject(Router)
//     async ngOnInit(): Promise<void> {
//         this._router.paramMap.subscribe(async (data: any) => {
//           const paramsId = data.get('id')
//           if (paramsId) {
//             await this._hotrosService.getHotroByid(paramsId);
//             this.Detail = this._hotrosService.Hotro;
//           } else {
           
//           }
//         });
//       this.setupDrawer();
//     }
    
//     private setupDrawer(): void {
//       this._breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
//         if (result.matches) {
//           this.drawer.mode = 'side';
//           this.paginator.hidePageSize = true;
//         } else {
//           this.drawer.mode = 'side';
//         }
//       });
//     }
//     onContentChange(event: any) {
//       this.Detail = event;
//     }
  
//   }