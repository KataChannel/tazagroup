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
import { ListUserComponent } from '../listuser/listuser.component';
import { UserService } from '../user.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { GenId, convertToSlug } from '../../../shared/utils/shared.utils';
import { RoleService } from '../../role/role.service';
import { MatMenuModule } from '@angular/material/menu';
  @Component({
    selector: 'app-detailuser',
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
      MatMenuModule
    ],
    templateUrl: './detailuser.component.html',
    styleUrl: './detailuser.component.scss'
  })
  export class DetailUserComponent {
    _ListuserComponent:ListUserComponent = inject(ListUserComponent)
    _UserService:UserService = inject(UserService)
    _RoleService:RoleService = inject(RoleService)
    _route:ActivatedRoute = inject(ActivatedRoute)
    _router:Router = inject(Router)
    _snackBar:MatSnackBar = inject(MatSnackBar)
    constructor(){
      this._route.paramMap.subscribe((params) => {
        const id = params.get('id');
        this._UserService.setUserId(id);
      });
  
      effect(async () => {
        const id = this._UserService.userId();
      
        if (!id){
          this._router.navigate(['/admin/user']);
          this._ListuserComponent.drawer.close();
        }
        if(id === '0'){
          this.DetailUser.set({ title: GenId(8, false), slug: GenId(8, false) });
          this._ListuserComponent.drawer.open();
          this.isEdit.update(value => !value);
          this._router.navigate(['/admin/user', "0"]);
        }
        else{
            await this._UserService.getUserByid(id);
            this._ListuserComponent.drawer.open();
            this._router.navigate(['/admin/user', id]);
        }
      });
    }
    DetailUser: any = this._UserService.DetailUser;
    isEdit = signal(false);
    isDelete = signal(false);  
    userId:any = this._UserService.userId
    ListRole:any = []
    async ngOnInit() {    
      await this._RoleService.getAllRole();
      this.ListRole = this._RoleService.ListRole();
    }
    async handleUserAction() {
      if (this.userId() === '0') {
        await this.createUser();
      }
      else {
        await this.updateUser();
      }
    }
    private async createUser() {
      try {
        await this._UserService.CreateUser(this.DetailUser());
        this._snackBar.open('Tạo Mới Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.isEdit.update(value => !value);
      } catch (error) {
        console.error('Lỗi khi tạo user:', error);
      }
    }

    private async updateUser() {
      try {
        await this._UserService.updateUser(this.DetailUser());
        this._snackBar.open('Cập Nhật Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.isEdit.update(value => !value);
      } catch (error) {
        console.error('Lỗi khi cập nhật user:', error);
      }
    }
    async DeleteData()
    {
      try {
        await this._UserService.DeleteUser(this.DetailUser());
  
        this._snackBar.open('Xóa Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
  
        this._router.navigate(['/admin/user']);
      } catch (error) {
        console.error('Lỗi khi xóa user:', error);
      }
    }
    goBack(){
      this._router.navigate(['/admin/user'])
      this._ListuserComponent.drawer.close();
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
      this.DetailUser.update((v:any)=>{
        v.slug = convertToSlug(v.title);
        return v;
      })
    }
    doFilterHederColumn(event:any){
      this.ListRole = this._RoleService.ListRole().filter((v:any)=>v.name.toLowerCase().includes(event.target.value.toLowerCase()));
    }
    handleAddRole(item:any){
      console.log(item);
      this.ListRole.push(item);
      this._UserService.assignRoleToUser({userId:this.DetailUser().id,roleId:item.id});
    }
    handleRemoveRole(item:any){
      this.ListRole = this.ListRole.filter((v:any)=>v.id !== item.id);
      this._UserService.removeRoleFromUser({userId:item.userId,roleId:item.roleId});
    }
  }