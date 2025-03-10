import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import {
  FileSystemFileEntry,
  NgxFileDropEntry,
  NgxFileDropModule,
} from 'ngx-file-drop';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { UploadService } from './uploadfile.service';
@Component({
  selector: 'app-uploadfile',
  standalone: true,
  imports: [
    NgxFileDropModule,
    MatDialogModule,
    CommonModule
  ],
  templateUrl: './uploadfile.component.html',
  styleUrl: './uploadfile.component.scss',
})
export class UploadfileComponent {
  public files: NgxFileDropEntry[] = [];
  @Input() listFiles: any = [];
  @Output() fileUploaded = new EventEmitter<any[]>();
  @Input() Type: any = 'googledrive';
  SelectImage: any;
  isLoading:boolean = false;
  constructor(
    private _uploadService: UploadService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {}
  public fileOver(event: any){
    console.log(event);
  }

  public fileLeave(event: any){
    console.log(event);
  }
  getTrustUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
            this.listFiles = [...this.listFiles, res];
            this.fileUploaded.emit(this.listFiles);
            this.isLoading = false;
          });
        });
      }
    }
  }
  ViewImage(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate, {
    });
  }
DownloadImage()
{
  if (this.SelectImage && this.SelectImage.url) {
    const link = document.createElement('a');
    link.href = this.SelectImage.url;
    link.download = this.SelectImage.name || 'download';
    link.rel = 'noopener noreferrer'; // Security best practice for opening links
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100); // Remove the link after a short delay
  } else {
    console.error('No image selected or URL not available');
    // Optionally, you could show a user-friendly error message here
  }
}
  // Handle paste event to capture screenshots
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
            const file = new File([blob], 'screenshot.png', {
              type: blob.type,
            });
            this._uploadService.uploadDriver(file).then((res: any) => {
              console.log(res);
              this.listFiles = [...this.listFiles, res];
              this.fileUploaded.emit(this.listFiles);
              this.isLoading = false;
            });
          }
        }
      }
    }
  }
  removeFile(data: any) {
    this.listFiles = this.listFiles.filter((item: any) => item.id !== data.id);
    this.fileUploaded.emit(this.listFiles);
    // this._uploadService.DeleteuploadDriver(data).then((res: any) => {
    //   this.listFiles = this.listFiles.filter((item: any) => item.id !== data.id);
    // })
  }
}
