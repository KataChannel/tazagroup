import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { convertToSlug } from '../../../utils/shared.utils';
@Component({
    selector: 'app-updatedialog',
    standalone:true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatDialogModule,
        MatSelectModule
    ],
    templateUrl: './updatedialog.component.html',
    styleUrl: './updatedialog.component.scss'
})
export class UpdatedialogComponent {
  
    Detail:any = {}
    Forms:any = []
    constructor(
      public dialogRef: MatDialogRef<UpdatedialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.Detail = data.Detail  
      this.Forms = data.Forms  
    }
    FillSlug() {
      this.Detail.Slug = convertToSlug(this.Detail.Title)
    }
    onSaveClick(): void {
      // Pass Detail data back to the ConfigComponent
      this.dialogRef.close({ Detail: this.Detail });
    }
}

