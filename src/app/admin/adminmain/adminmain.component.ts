import { ChangeDetectionStrategy, Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Config, User } from './adminmain';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeModule, MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MenuService } from '../menu/menu/menu.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TreemenuComponent } from '../../shared/common/treemenu/treemenu.component';
import { UserService } from '../user/user.service';
@Component({
  selector: 'app-adminmain',
  imports: [
    MatTreeModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    MatMenuModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    CommonModule,
    RouterLink,
    // RouterLinkActive,
    TreemenuComponent,
  ],
  templateUrl: './adminmain.component.html',
  styleUrl: './adminmain.component.scss'
})
export class AdminmainComponent {
  isFullscreen:boolean=false
  showFiller = false;
  Config:any =Config
  User:any ={}
  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node?.children && node?.children.length > 0,
      title: node.title,
      level: level,
      node:node,
    };
  };

  treeControl = new FlatTreeControl<any>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node?.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  _MenuService:MenuService = inject(MenuService)
  constructor(
    private _breakpointObserver:BreakpointObserver,
    private _UserService:UserService,
  ) {}

  hasChild = (_: number, node: any) => node.expandable;
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  @ViewChild('drawer1', { static: true }) drawer1!: MatDrawer;
  _snackBar:MatSnackBar = inject(MatSnackBar)
  ListMenu:any[] = []
  async ngOnInit() {
    await this._UserService.getProfile().then(async (res: any) => {
      if(res){
        this.User = res;  
        const permissions = this.User?.permissions?.map((v:any)=>v.name);     
        await this._MenuService.getTreeMenu(permissions)
        this.ListMenu = this._MenuService.ListMenu()    
        this.dataSource.data = this._MenuService.ListMenu()
      } 
    });
   
 
    this._breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        this.drawer.mode = 'over';
        this.drawer.close();
      } else {
        this.drawer.mode = 'side';
        this.drawer.open();
      }
    });
  }
  logout() {    
    this._UserService.logout().then((res: any) => {
      if (res) {
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    });
  }
  ClearCache(){
    const token = localStorage.getItem('token');
    localStorage.clear();
    if (token) {
      localStorage.setItem('token', token);
    }
    this._snackBar.open('Xoá Cache Thành Công', '', {
      duration: 1000,
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: ['snackbar-success'],
    });
  }
}
