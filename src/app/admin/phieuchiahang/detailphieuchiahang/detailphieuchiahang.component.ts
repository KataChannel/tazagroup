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
import { ListPhieuchiahangComponent } from '../listphieuchiahang/listphieuchiahang.component';
import { PhieuchiahangService } from '../phieuchiahang.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { GenId, convertToSlug } from '../../../shared/utils/shared.utils';
  @Component({
    selector: 'app-detailphieuchiahang',
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
    templateUrl: './detailphieuchiahang.component.html',
    styleUrl: './detailphieuchiahang.component.scss'
  })
  export class DetailPhieuchiahangComponent {
    _ListphieuchiahangComponent:ListPhieuchiahangComponent = inject(ListPhieuchiahangComponent)
    _PhieuchiahangService:PhieuchiahangService = inject(PhieuchiahangService)
    _route:ActivatedRoute = inject(ActivatedRoute)
    _router:Router = inject(Router)
    _snackBar:MatSnackBar = inject(MatSnackBar)
    constructor(){
      this._route.paramMap.subscribe((params) => {
        const id = params.get('id');
        this._PhieuchiahangService.setPhieuchiahangId(id);
      });
  
      effect(async () => {
        const id = this._PhieuchiahangService.phieuchiahangId();
      
        if (!id){
          this._router.navigate(['/admin/phieuchiahang']);
          this._ListphieuchiahangComponent.drawer.close();
        }
        if(id === '0'){
          this.DetailPhieuchiahang.set({ title: GenId(8, false), slug: GenId(8, false) });
          this._ListphieuchiahangComponent.drawer.open();
          this.isEdit.update(value => !value);
          this._router.navigate(['/admin/phieuchiahang', "0"]);
        }
        else{
            await this._PhieuchiahangService.getPhieuchiahangByid(id);
            this._ListphieuchiahangComponent.drawer.open();
            this._router.navigate(['/admin/phieuchiahang', id]);
        }
      });
    }
    DetailPhieuchiahang: any = this._PhieuchiahangService.DetailPhieuchiahang;
    isEdit = signal(false);
    isDelete = signal(false);  
    phieuchiahangId:any = this._PhieuchiahangService.phieuchiahangId
    async ngOnInit() {       
    }
    async handlePhieuchiahangAction() {
      if (this.phieuchiahangId() === '0') {
        await this.createPhieuchiahang();
      }
      else {
        await this.updatePhieuchiahang();
      }
    }
    private async createPhieuchiahang() {
      try {
        await this._PhieuchiahangService.CreatePhieuchiahang(this.DetailPhieuchiahang());
        this._snackBar.open('Tạo Mới Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.isEdit.update(value => !value);
      } catch (error) {
        console.error('Lỗi khi tạo phieuchiahang:', error);
      }
    }

    private async updatePhieuchiahang() {
      try {
        await this._PhieuchiahangService.updatePhieuchiahang(this.DetailPhieuchiahang());
        this._snackBar.open('Cập Nhật Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.isEdit.update(value => !value);
      } catch (error) {
        console.error('Lỗi khi cập nhật phieuchiahang:', error);
      }
    }
    async DeleteData()
    {
      try {
        await this._PhieuchiahangService.DeletePhieuchiahang(this.DetailPhieuchiahang());
  
        this._snackBar.open('Xóa Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
  
        this._router.navigate(['/admin/phieuchiahang']);
      } catch (error) {
        console.error('Lỗi khi xóa phieuchiahang:', error);
      }
    }
    goBack(){
      this._router.navigate(['/admin/phieuchiahang'])
      this._ListphieuchiahangComponent.drawer.close();
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
      this.DetailPhieuchiahang.update((v:any)=>{
        v.slug = convertToSlug(v.title);
        return v;
      })
    }
  }