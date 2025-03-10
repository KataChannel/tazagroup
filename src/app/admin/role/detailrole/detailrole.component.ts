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
import { ListRoleComponent } from '../listrole/listrole.component';
import { RoleService } from '../role.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GenId, convertToSlug } from '../../../shared/utils/shared.utils';
import { PermissionService } from '../../permission/permission.service';
@Component({
  selector: 'app-detailrole',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    CommonModule,
    MatSlideToggleModule,
  ],
  templateUrl: './detailrole.component.html',
  styleUrl: './detailrole.component.scss',
})
export class DetailRoleComponent {
  _ListroleComponent: ListRoleComponent = inject(ListRoleComponent);
  _RoleService: RoleService = inject(RoleService);
  _PermissionService: PermissionService = inject(PermissionService);
  _route: ActivatedRoute = inject(ActivatedRoute);
  _router: Router = inject(Router);
  _snackBar: MatSnackBar = inject(MatSnackBar);
  ListPermission: any = [];
  filterPermission: any = [];
  idRole: any = 0;
  constructor() {
    this._route.paramMap.subscribe(async (params) => {
      this.idRole = params.get('id');
    });
    // effect(async () => {
    //   const id = this._RoleService.roleId();
    //   if (!id) {
    //     this._router.navigate(['/admin/nhomuser']);
    //     this._ListroleComponent.drawer.close();
    //   }
    //   if (id === '0') {
    //     this._ListroleComponent.drawer.open();
    //     this.isEdit.update((value) => !value);
    //     this._router.navigate(['/admin/nhomuser', '0']);
    //   } else {
    //     await this._RoleService.getRoleByid(id);
    //     this._ListroleComponent.drawer.open();
    //     this._router.navigate(['/admin/nhomuser', id]);
    //   }
    // });
  }
  DetailRole:any={};
  isEdit = signal(false);
  isDelete = signal(false);
  async ngOnInit() {
    await this._PermissionService.getAllPermission();
    this.ListPermission = this._PermissionService.ListPermission();
    if (!this.idRole) {
      this._router.navigate(['/admin/nhomuser']);
      this._ListroleComponent.drawer.close();
    } else if (this.idRole === '0') {
      this._ListroleComponent.drawer.open();
      this.isEdit.update((value) => !value);
      this._router.navigate(['/admin/nhomuser', '0']);
    } else {
      await this._RoleService.getRoleByid(this.idRole).then(() => {
        this.DetailRole = this._RoleService.DetailRole();
        this.filterPermission = this.ListPermission.map((v: any) => {
          if (this.DetailRole?.permissions?.length > 0) {
            v.hasPermission = this.DetailRole?.permissions.find(
              (p: any) => p.permissionId === v.id
            )
              ? true
              : false;
          }
          return v;
        });
        })
      this._ListroleComponent.drawer.open();
      this._router.navigate(['/admin/nhomuser', this.idRole]);
    };
  }
  async handleRoleAction() {
    if (this.idRole === '0') {
      await this.createRole();
    } else {
      await this.updateRole();
    }
  }
  private async createRole() {
    console.log(this.DetailRole);
    
    try {
      await this._RoleService.CreateRole(this.DetailRole);
      this._snackBar.open('Tạo Mới Thành Công', '', {
        duration: 1000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'],
      });
      this.isEdit.update((value) => !value);
    } catch (error) {
      console.error('Lỗi khi tạo role:', error);
    }
  }

  private async updateRole() {
    try {
      await this._RoleService.updateRole(this.DetailRole);
      this._snackBar.open('Cập Nhật Thành Công', '', {
        duration: 1000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'],
      });
      this.isEdit.update((value) => !value);
    } catch (error) {
      console.error('Lỗi khi cập nhật role:', error);
    }
  }
  async DeleteData() {
    try {
      await this._RoleService.DeleteRole(this.DetailRole);

      this._snackBar.open('Xóa Thành Công', '', {
        duration: 1000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'],
      });

      this._router.navigate(['/admin/nhomuser']);
    } catch (error) {
      console.error('Lỗi khi xóa role:', error);
    }
  }
  goBack() {
    this._router.navigate(['/admin/nhomuser']);
    this._ListroleComponent.drawer.close();
  }
  trackByFn(index: number, item: any): any {
    return item.id;
  }
  toggleEdit() {
    this.isEdit.update((value) => !value);
  }

  toggleDelete() {
    this.isDelete.update((value) => !value);
  }
  FillSlug() {
    // this.DetailRole.update((v: any) => {
    //   v.slug = convertToSlug(v.title);
    //   return v;
    // });
  }
  togglePermission(item: any) {
    item.hasPermission = !item.hasPermission;
    console.log(item);
    if (item.hasPermission) {
      this._RoleService.assignPermissionToRole({
        roleId: this.idRole,
        permissionId: item.id,
      });
    } else {
      this._RoleService.removePermissionFromRole({
        roleId: this.idRole,
        permissionId: item.id,
      });
    }
  }
}
