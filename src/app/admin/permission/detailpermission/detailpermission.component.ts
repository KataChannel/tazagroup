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
import { ListPermissionComponent } from '../listpermission/listpermission.component';
import { PermissionService } from '../permission.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { GenId, convertToSlug } from '../../../shared/utils/shared.utils';
  @Component({
    selector: 'app-detailpermission',
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
    templateUrl: './detailpermission.component.html',
    styleUrl: './detailpermission.component.scss'
  })
  export class DetailPermissionComponent {
    _ListpermissionComponent:ListPermissionComponent = inject(ListPermissionComponent)
    _PermissionService:PermissionService = inject(PermissionService)
    _route:ActivatedRoute = inject(ActivatedRoute)
    _router:Router = inject(Router)
    _snackBar:MatSnackBar = inject(MatSnackBar)
    constructor(){
      this._route.paramMap.subscribe((params) => {
        const id = params.get('id');
        this._PermissionService.setPermissionId(id);
      });
  
      effect(async () => {
        const id = this._PermissionService.permissionId();
      
        if (!id){
          this._router.navigate(['/admin/permission']);
          this._ListpermissionComponent.drawer.close();
        }
        if(id === '0'){
          this._ListpermissionComponent.drawer.open();
          this.isEdit.update(value => !value);
          this._router.navigate(['/admin/permission', "0"]);
        }
        else{
            await this._PermissionService.getPermissionByid(id);
            this._ListpermissionComponent.drawer.open();
            this._router.navigate(['/admin/permission', id]);
        }
      });
    }
    DetailPermission: any = this._PermissionService.DetailPermission;
    isEdit = signal(false);
    isDelete = signal(false);  
    permissionId:any = this._PermissionService.permissionId
    async ngOnInit() {       
    }
    async handlePermissionAction() {
      if (this.permissionId() === '0') {
        await this.createPermission();
      }
      else {
        await this.updatePermission();
      }
    }
    private async createPermission() {
      try {
        await this._PermissionService.CreatePermission(this.DetailPermission());
        this._snackBar.open('Tạo Mới Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.isEdit.update(value => !value);
      } catch (error) {
        console.error('Lỗi khi tạo permission:', error);
      }
    }

    private async updatePermission() {
      try {
        await this._PermissionService.updatePermission(this.DetailPermission());
        this._snackBar.open('Cập Nhật Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.isEdit.update(value => !value);
      } catch (error) {
        console.error('Lỗi khi cập nhật permission:', error);
      }
    }
    async DeleteData()
    {
      try {
        await this._PermissionService.DeletePermission(this.DetailPermission());
  
        this._snackBar.open('Xóa Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
  
        this._router.navigate(['/admin/permission']);
      } catch (error) {
        console.error('Lỗi khi xóa permission:', error);
      }
    }
    goBack(){
      this._router.navigate(['/admin/permission'])
      this._ListpermissionComponent.drawer.close();
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

    }
  }