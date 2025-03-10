import { Component, inject } from '@angular/core';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { DomSanitizer } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../../admin/user/user.service';
import { UploadService } from '../../../../uploadfile/uploadfile.service';
import { DynamicformComponent } from '../../../dynamicform/dynamicform.component';

@Component({
  selector: 'app-general',
  imports: [
    NgxFileDropModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    DynamicformComponent
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent {
  isLoading:boolean = false;
  account: any = {};
  isEditAvatar:boolean=false
  public files: NgxFileDropEntry[] = [];
  _UserService:UserService = inject(UserService)
  _uploadService:UploadService = inject(UploadService)
  Detail:any={}
  constructor(
    private sanitizer: DomSanitizer,
  ) { 
     this.Detail={
        Data:{
          "id": "8efd5ba3-d073-4baf-ab89-31180ee7471d",
          "ref_id": "0",
          "gid": "",
          "fid": "",
          "zid": "",
          "pid": "",
          "SDT": "098765421",
          "idGroup": "",
          "Code": "751221",
          "Hoten": "test1",
          "Avatar": "",
          "Ngaysinh": null,
          "email": "test1@gmail.com",
          "Gioitinh": "",
          "EditChinhanhs": [],
          "Diachi": [],
          "ListImage": [],
          "Profile": [],
          "Role": "user",
          "Phanquyen": [],
          "Menu": [],
          "fcmToken": [],
          "Type": "",
          "Ordering": 1,
          "idDelete": false,
          "Status": 0,
          "CreateAt": "10:11:52 11/12/2024",
          "UpdateAt": "2024-12-11T03:11:52.074Z",
          "DeleteAt": null,
          "idCreate": null
      },
        Forms:[
          {id:1,Title:'Họ Tên',value:'Hoten',Type:'text',required:true},
          {id:2,Title:'Email',value:'email',Type:'text',required:true},
          {id:3,Title:'SDT',value:'SDT',Type:'text',required:false},
          {id:4,Title:'Mật Khẩu',value:'password',Type:'text',required:true},  
          {id:5,Title:'Trạng Thái',value:'Status',Type:'text',required:true},  
        ]
      }
  }
  getTrustUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  public handlePaste(event: ClipboardEvent) {
    this.isLoading = true;
    const clipboardItems = event.clipboardData?.items;
    if (clipboardItems) {
      for (let i = 0; i < clipboardItems.length; i++) {
        const item = clipboardItems[i];
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            // Here you can upload the pasted screenshot
            console.log('Pasted image:', blob);
            const file = new File([blob], `${this.account.email.split("@")[0]}_${(new Date().getTime())}.png`, {
              type: blob.type,
            });
            this._uploadService.uploadDriver(file).then((res: any) => {
              console.log(res);
              this.account.Avatar = res.fileId
              this.isLoading = false;
              this.isEditAvatar =false
              this._UserService.updateUser(this.account)
            });
          }
        }
      }
    }
  }
  public dropped(files: NgxFileDropEntry[]) {
    this.isLoading = true;
    this.files = files;
    for (const droppedFile of files) {
      // Check if the file is a folder or a file
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can process the file, such as uploading it
          this._uploadService.uploadDriver(file).then((res: any) => {
            console.log(res);
            this.account.Avatar = res.fileId
            this.isLoading = false;
            this.isEditAvatar =false
            this._UserService.updateUser(this.account)
          });
        });
      }
    }
  }
}
