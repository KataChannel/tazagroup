import { Component, inject } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatIconModule } from '@angular/material/icon';
  import { MatInputModule } from '@angular/material/input';
  import { ListquanlyfileComponent } from '../listquanlyfile.component';
  import { MatButtonModule } from '@angular/material/button';
  import { ActivatedRoute } from '@angular/router';
  import { Forms, ListQuanlyfile } from '../listquanlyfile';
  @Component({
    selector: 'app-detailquanlyfile',
    imports: [
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      MatIconModule,
      MatButtonModule,
    ],
    templateUrl: './detailquanlyfile.component.html',
    styleUrl: './detailquanlyfile.component.scss'
  })
  export class DetailQuanlyfileComponent {
    _ListquanlyfileComponent:ListquanlyfileComponent = inject(ListquanlyfileComponent)
    _router:ActivatedRoute = inject(ActivatedRoute)
    constructor(){}
    Detail:any={Data:{},Forms:[]}
    isEdit:boolean=false
    isDelete:boolean=false
    idQuanlyfile:any
    ngOnInit(): void {
      this._router.paramMap.subscribe(async (data: any) => {
        this.idQuanlyfile = data.get('id')
        this.Detail.Forms = Forms;
        this.isEdit = this.idQuanlyfile === '0';   
        if (this.idQuanlyfile) {
          this._ListquanlyfileComponent.drawer.open();     
          this.Detail.Data = ListQuanlyfile.find((v: any) => v.id === this.idQuanlyfile) || {};
        } else {
          this.Detail.Data = {};
        }
      });   
    }
    SaveData()
    {
      if(this.idQuanlyfile=='0')
      {
        ListQuanlyfile.push(this.Detail.Data)
      }
      else
      {
        ListQuanlyfile[this.idQuanlyfile]=this.Detail.Data
      }
      this.isEdit=false  
    }
  }