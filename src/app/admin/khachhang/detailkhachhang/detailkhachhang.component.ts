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
import { ListKhachhangComponent } from '../listkhachhang/listkhachhang.component';
import { KhachhangService } from '../khachhang.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { GenId, convertToSlug } from '../../../shared/utils/shared.utils';
  @Component({
    selector: 'app-detailkhachhang',
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
    templateUrl: './detailkhachhang.component.html',
    styleUrl: './detailkhachhang.component.scss'
  })
  export class DetailKhachhangComponent {
    _ListkhachhangComponent:ListKhachhangComponent = inject(ListKhachhangComponent)
    _KhachhangService:KhachhangService = inject(KhachhangService)
    _route:ActivatedRoute = inject(ActivatedRoute)
    _router:Router = inject(Router)
    _snackBar:MatSnackBar = inject(MatSnackBar)
    constructor(){
      this._route.paramMap.subscribe((params) => {
        const id = params.get('id');
        this._KhachhangService.setKhachhangId(id);
      });
  
      effect(async () => {
        const id = this._KhachhangService.khachhangId();
      
        if (!id){
          this._router.navigate(['/admin/khachhang']);
          this._ListkhachhangComponent.drawer.close();
        }
        if(id === '0'){
          this.DetailKhachhang.set({loaikh:'khachsi'});
          this._ListkhachhangComponent.drawer.open();
          this.isEdit.update(value => !value);
          this._router.navigate(['/admin/khachhang', "0"]);
        }
        else{
            await this._KhachhangService.getKhachhangByid(id);
            this._ListkhachhangComponent.drawer.open();
            this._router.navigate(['/admin/khachhang', id]);
        }
      });
    }
    DetailKhachhang: any = this._KhachhangService.DetailKhachhang;
    isEdit = signal(false);
    isDelete = signal(false);  
    khachhangId:any = this._KhachhangService.khachhangId
    async ngOnInit() {       
    }
    async handleKhachhangAction() {
      if (this.khachhangId() === '0') {
        await this.createKhachhang();
      }
      else {
        await this.updateKhachhang();
      }
    }
    private async createKhachhang() {
      try {
        await this._KhachhangService.CreateKhachhang(this.DetailKhachhang());
        this._snackBar.open('Tạo Mới Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.isEdit.update(value => !value);
      } catch (error) {
        console.error('Lỗi khi tạo khachhang:', error);
      }
    }

    private async updateKhachhang() {
      try {
        await this._KhachhangService.updateKhachhang(this.DetailKhachhang());
        this._snackBar.open('Cập Nhật Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.isEdit.update(value => !value);
      } catch (error) {
        console.error('Lỗi khi cập nhật khachhang:', error);
      }
    }
    async DeleteData()
    {
      try {
        await this._KhachhangService.DeleteKhachhang(this.DetailKhachhang());
  
        this._snackBar.open('Xóa Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
  
        this._router.navigate(['/admin/khachhang']);
      } catch (error) {
        console.error('Lỗi khi xóa khachhang:', error);
      }
    }
    goBack(){
      this._router.navigate(['/admin/khachhang'])
      this._ListkhachhangComponent.drawer.close();
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
      this.DetailKhachhang.update((v:any)=>{
        v.slug = convertToSlug(v.title);
        return v;
      })
    }
  }