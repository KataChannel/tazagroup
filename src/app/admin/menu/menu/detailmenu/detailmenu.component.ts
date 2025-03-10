import { Component, effect, inject, signal } from '@angular/core';
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
import { ListMenuComponent } from '../listmenu/listmenu.component';
import { MenuService } from '../menu.service';
import { convertToSlug, GenId } from '../../../../shared/utils/shared.utils';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
  @Component({
    selector: 'app-detailmenu',
    imports: [
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      MatIconModule,
      MatButtonModule,
      MatSelectModule,
      MatDialogModule,
      CommonModule,
      MatSlideToggleModule
    ],
    templateUrl: './detailmenu.component.html',
    styleUrl: './detailmenu.component.scss'
  })
  export class DetailMenuComponent {
    _ListmenuComponent:ListMenuComponent = inject(ListMenuComponent)
    _MenuService:MenuService = inject(MenuService)
    _route:ActivatedRoute = inject(ActivatedRoute)
    _router:Router = inject(Router)
    _snackBar:MatSnackBar = inject(MatSnackBar)
    ListMenu:any[]= []
    constructor(){
      this._route.paramMap.subscribe(async (params) => {
        const id = params.get('id');
         this._MenuService.setMenuId(id);
         await this._MenuService.getAllMenu();
         this.ListMenu = this._MenuService.ListMenu();
      });
  
      effect(async () => {
        const id = this._MenuService.menuId();
      
        if (!id){
          this._router.navigate(['/admin/menu']);
          this._ListmenuComponent.drawer.close();
        }
        if(id === '0'){
          this.DetailMenu.set({ title: GenId(8, false), slug: GenId(8, false) });
          this._ListmenuComponent.drawer.open();
          this.isEdit.update(value => !value);
          this._router.navigate(['/admin/menu', "0"]);
        }
        else{
            await this._MenuService.getMenuByid(id);
            this._ListmenuComponent.drawer.open();
            this._router.navigate(['/admin/menu', id]);
        }
      });
    }
    DetailMenu: any = this._MenuService.DetailMenu;
    isEdit = signal(false);
    isDelete = signal(false);  
    menuId:any = this._MenuService.menuId
    async ngOnInit() {       
    }
    async handleMenuAction() {
      if (this.menuId() === '0') {
        await this.createMenu();
      }
      else {
        await this.updateMenu();
      }
    }
    private async createMenu() {
      try {
        await this._MenuService.CreateMenu(this.DetailMenu());
        this._snackBar.open('Tạo Mới Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.isEdit.update(value => !value);
      } catch (error) {
        console.error('Lỗi khi tạo menu:', error);
      }
    }

    private async updateMenu() {
      try {
        this.DetailMenu.update((v: any) => {
          const { children, ...rest } = v;
          return rest;
        });
        await this._MenuService.updateMenu(this.DetailMenu());
        this._snackBar.open('Cập Nhật Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.isEdit.update(value => !value);
      } catch (error) {
        console.error('Lỗi khi cập nhật menu:', error);
      }
    }
    async DeleteData()
    {
      try {
        await this._MenuService.DeleteMenu(this.DetailMenu());
  
        this._snackBar.open('Xóa Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
  
        this._router.navigate(['/admin/menu']);
      } catch (error) {
        console.error('Lỗi khi xóa menu:', error);
      }
    }
    goBack(){
      this._router.navigate(['/admin/menu'])
      this._ListmenuComponent.drawer.close();
    }
    trackByFn(index: number, item: any): any {
      return item.id;
    }
    toggleEdit() {
      this.isEdit.update(value => !value);
    }
    
    toggleDelete() {
      this.isDelete.update(value => !value);
    }
    FillSlug(){
      this.DetailMenu.update((v:any)=>{
        v.slug = convertToSlug(v.title);
        return v;
      })
    }
    DoFilterMenu(event: any): void {
      const query = event.target.value.toLowerCase();
      this.ListMenu = this._MenuService.ListMenu().filter((v) =>
        v.title.toLowerCase().includes(query)
      );  
    }
  }