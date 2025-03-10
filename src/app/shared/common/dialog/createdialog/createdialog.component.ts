// import { Component, inject } from '@angular/core';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';

// @Component({
//   selector: 'app-createdialog',
//   standalone: true,
//   imports: [],
//   templateUrl: './createdialog.component.html',
//   styleUrl: './createdialog.component.scss'
// })
// export class CreatedialogComponent {
//   data = inject(MAT_DIALOG_DATA);
//   constructor() {
//     console.log(this.data)
//     console.log('CreatedialogComponent')
//   }  
// }


import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { convertToSlug } from '../../../utils/shared.utils';


@Component({
    selector: 'app-Createdialog',
    standalone:true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatDialogModule,
        MatSelectModule
    ],
    templateUrl: './createdialog.component.html',
    styleUrl: './createdialog.component.scss'
})
export class CreatedialogComponent {
  
    Detail:any = {}
    Forms:any = []
    constructor(
      public dialogRef: MatDialogRef<CreatedialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
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

