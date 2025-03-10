import { CommonModule } from '@angular/common';
import { Component, Inject, Input, Sanitizer } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-chatuser',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './chatuser.component.html',
  styleUrl: './chatuser.component.scss',
})
export class ChatuserComponent {
  Detail: any = {};
  Users:any[]=[]
  constructor(
    public dialogRef: MatDialogRef<ChatuserComponent>,
    public sanitizer:DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }
  onSaveClick(item:any): void {
    this.dialogRef.close({ Detail: item });
  }
  getTrustUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
