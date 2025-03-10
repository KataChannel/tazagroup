import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ListbaivietComponent } from '../listbaiviet.component';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { Forms, ListBaiviet } from '../listbaiviet';
import { CkeditorComponent } from '../../../shared/common/ckeditor/ckeditor.component';

@Component({
  selector: 'app-detailbaiviet',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    CkeditorComponent
  ],
  templateUrl: './detailbaiviet.component.html',
  styleUrl: './detailbaiviet.component.scss'
})
export class DetailBaivietComponent {
  _ListbaivietComponent:ListbaivietComponent = inject(ListbaivietComponent)
  _router:ActivatedRoute = inject(ActivatedRoute)
  constructor(){}
  Detail:any={Data:{},Forms:[]}
  isEdit:boolean=false
  isDelete:boolean=false
  idBaiviet:any
  ngOnInit(): void {
    this._router.paramMap.subscribe(async (data: any) => {
      this.idBaiviet = data.get('id')
      this.Detail.Forms = Forms;
      this.isEdit = this.idBaiviet === '0';   
      if (this.idBaiviet) {
        this._ListbaivietComponent.drawer.open();     
        this.Detail.Data = ListBaiviet.find((v: any) => v.id === this.idBaiviet) || {};
      } else {
        this.Detail.Data = {};
      }
    });
    
    
  }
  SaveData()
  {
    if(this.idBaiviet=='0')
    {
      ListBaiviet.push(this.Detail.Data)
    }
    else
    {
      ListBaiviet[this.idBaiviet]=this.Detail.Data
    }
    this.isEdit=false
    
  }
}
