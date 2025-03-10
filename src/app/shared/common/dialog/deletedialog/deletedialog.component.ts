import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
    selector: 'app-deletedialog',
    standalone:true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatDialogModule
    ],
    templateUrl: './deletedialog.component.html',
    styleUrl: './deletedialog.component.scss'
})
export class DeletedialogComponent {
  Detail:any = {}
  constructor(
    public dialogRef: MatDialogRef<DeletedialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.Detail = data
  }
  onClick(): void {
    this.dialogRef.close({ Detail: this.Detail });
  }
}
