import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserService } from '../../../../admin/user/user.service';
import { UploadService } from '../../../uploadfile/uploadfile.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    NgxFileDropModule,
    MatSidenavModule
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isMenuOpen: boolean = false;
  profileImageUrl: string = 'avatar.png'; // Default image
  constructor(
    private sanitizer: DomSanitizer,
  ) { }
  isLoading:boolean = false;
  profile = signal<any>({});
  isEditAvatar:boolean=false
  public files: NgxFileDropEntry[] = [];
  _UserService:UserService = inject(UserService)
  _uploadService:UploadService = inject(UploadService)
  Menus:any[]=[
    {id:1,Title:'Cài đặt tài khoản',Slug:'./account'},
    {id:2,Title:'Đổi mật khẩu',Slug:'./password'},
    {id:3,Title:'Kết nối',Slug:'./social'},
    {id:4,Title:'Chính sách bảo mật',Slug:'./privacy'},
    {id:5,Title:'Điều khoản & Điều kiện',Slug:'./terms'},
  ]
  async ngOnInit() {
   await this._UserService.getProfile()
   this.profile = this._UserService.profile
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
            const file = new File([blob], `${this.profile().email.split("@")[0]}_${(new Date().getTime())}.png`, {
              type: blob.type,
            });
            this._uploadService.uploadDriver(file).then((res: any) => {
              console.log(res);
              this.profile().Avatar = res.fileId
              this.isLoading = false;
              this.isEditAvatar =false
              this._UserService.updateUser(this.profile())
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
            this.profile().Avatar = res.fileId
            this.isLoading = false;
            this.isEditAvatar =false
            this._UserService.updateUser(this.profile())
          });
        });
      }
    }
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  openImageUploader() {
    // Implement image upload logic here
  }
}
