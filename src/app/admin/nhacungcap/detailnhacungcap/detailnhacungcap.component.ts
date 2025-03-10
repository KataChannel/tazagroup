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
import { ListNhacungcapComponent } from '../listnhacungcap/listnhacungcap.component';
import { NhacungcapService } from '../nhacungcap.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { GenId, convertToSlug } from '../../../shared/utils/shared.utils';
  @Component({
    selector: 'app-detailnhacungcap',
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
    templateUrl: './detailnhacungcap.component.html',
    styleUrl: './detailnhacungcap.component.scss'
  })
  export class DetailNhacungcapComponent {
    _ListnhacungcapComponent:ListNhacungcapComponent = inject(ListNhacungcapComponent)
    _NhacungcapService:NhacungcapService = inject(NhacungcapService)
    _route:ActivatedRoute = inject(ActivatedRoute)
    _router:Router = inject(Router)
    _snackBar:MatSnackBar = inject(MatSnackBar)
    constructor(){
      this._route.paramMap.subscribe((params) => {
        const id = params.get('id');
        this._NhacungcapService.setNhacungcapId(id);
      });
  
      effect(async () => {
        const id = this._NhacungcapService.nhacungcapId();
      
        if (!id){
          this._router.navigate(['/admin/nhacungcap']);
          this._ListnhacungcapComponent.drawer.close();
        }
        if(id === '0'){
          this.DetailNhacungcap.set({ title: GenId(8, false), slug: GenId(8, false) });
          this._ListnhacungcapComponent.drawer.open();
          this.isEdit.update(value => !value);
          this._router.navigate(['/admin/nhacungcap', "0"]);
        }
        else{
            await this._NhacungcapService.getNhacungcapByid(id);
            this._ListnhacungcapComponent.drawer.open();
            this._router.navigate(['/admin/nhacungcap', id]);
        }
      });
    }
    DetailNhacungcap: any = this._NhacungcapService.DetailNhacungcap;
    isEdit = signal(false);
    isDelete = signal(false);  
    nhacungcapId:any = this._NhacungcapService.nhacungcapId
    async ngOnInit() {       
    }
    async handleNhacungcapAction() {
      if (this.nhacungcapId() === '0') {
        await this.createNhacungcap();
      }
      else {
        await this.updateNhacungcap();
      }
    }
    private async createNhacungcap() {
      try {
        await this._NhacungcapService.CreateNhacungcap(this.DetailNhacungcap());
        this._snackBar.open('Tạo Mới Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.isEdit.update(value => !value);
      } catch (error) {
        console.error('Lỗi khi tạo nhacungcap:', error);
      }
    }

    private async updateNhacungcap() {
      try {
        await this._NhacungcapService.updateNhacungcap(this.DetailNhacungcap());
        this._snackBar.open('Cập Nhật Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.isEdit.update(value => !value);
      } catch (error) {
        console.error('Lỗi khi cập nhật nhacungcap:', error);
      }
    }
    async DeleteData()
    {
      try {
        await this._NhacungcapService.DeleteNhacungcap(this.DetailNhacungcap());
  
        this._snackBar.open('Xóa Thành Công', '', {
          duration: 1000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
  
        this._router.navigate(['/admin/nhacungcap']);
      } catch (error) {
        console.error('Lỗi khi xóa nhacungcap:', error);
      }
    }
    goBack(){
      this._router.navigate(['/admin/nhacungcap'])
      this._ListnhacungcapComponent.drawer.close();
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
      this.DetailNhacungcap.update((v:any)=>{
        v.slug = convertToSlug(v.title);
        return v;
      })
    }
  }