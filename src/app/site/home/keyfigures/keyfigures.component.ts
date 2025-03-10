import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-keyfigures',
  imports: [],
  templateUrl: './keyfigures.component.html',
  styleUrl: './keyfigures.component.scss'
})
export class KeyfiguresComponent {
    @Input() Heading:any
    Listkeyfigures:any[]=[
      {id:1,Title:"100% SẢN PHẨM NỘI ĐỊA TIN CẬY HÀNG ĐẦU",Desc:"",Image:"keyfigures/keyfigures1.png"},
      {id:2,Title:"ĐỘT PHÁ CÔNG NGHỆ KÉP 2IN1",Desc:"",Image:"keyfigures/keyfigures2.png"},
      {id:3,Title:"KIỂM ĐỊNH LÂM SÀNG TẠI CÁC VIỆN HÀN QUỐC",Desc:"",Image:"keyfigures/keyfigures3.png"},
      {id:4,Title:"NHẬP KHẨU TRỰC TIẾP PHÂN PHỐI ĐỘC QUYỀN",Desc:"",Image:"keyfigures/keyfigures4.png"},
    ]
}
