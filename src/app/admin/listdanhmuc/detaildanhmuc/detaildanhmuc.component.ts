import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ListdanhmucComponent } from '../listdanhmuc.component';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { Forms, ListDanhmuc } from '../listdanhmuc';

@Component({
  selector: 'app-detaildanhmuc',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './detaildanhmuc.component.html',
  styleUrl: './detaildanhmuc.component.scss'
})
export class DetailDanhmucComponent {
  _ListdanhmucComponent:ListdanhmucComponent = inject(ListdanhmucComponent)
  _router:ActivatedRoute = inject(ActivatedRoute)
  constructor(){}
  Detail:any={Data:{},Forms:[]}
  isEdit:boolean=false
  isDelete:boolean=false
  idDanhmuc:any
  ngOnInit(): void {
    this._router.paramMap.subscribe(async (data: any) => {
      this.idDanhmuc = data.get('id')
      this.Detail.Forms = Forms;
      this.isEdit = this.idDanhmuc === '0';   
      if (this.idDanhmuc) {
        this._ListdanhmucComponent.drawer.open();     
        this.Detail.Data = ListDanhmuc.find((v: any) => v.id === this.idDanhmuc) || {};
      } else {
        this.Detail.Data = {};
      }
    });
    
    
  }
  SaveData()
  {
    if(this.idDanhmuc=='0')
    {
      ListDanhmuc.push(this.Detail.Data)
    }
    else
    {
      ListDanhmuc[this.idDanhmuc]=this.Detail.Data
    }
    this.isEdit=false
    
  }
}
