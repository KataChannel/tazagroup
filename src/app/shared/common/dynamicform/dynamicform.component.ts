import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dynamicform',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './dynamicform.component.html',
  styleUrl: './dynamicform.component.scss'
})
export class DynamicformComponent {
  @Input() CusClass:any={Main:'',Footer:''}
  @Input() Detail:any={
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
