import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { ChangeteamplateComponent } from '../../../shared/common/changeteamplate/changeteamplate.component';
import { ListMenus } from '../../../shared/mockdata/menu';

@Component({
  selector: 'app-headerteamplate1',
  imports: [    
    CommonModule,
    MatMenuModule,
    RouterLink,
    ChangeteamplateComponent],
  templateUrl: './headerteamplate1.component.html',
  styleUrl: './headerteamplate1.component.scss'
})
export class Headerteamplate1Component {
  data:any[]=ListMenus
  Menus:any[]=[]
  nestData = (data:any) => {
    const m:any = new Map(data.map((o:any) => [o.id, {...o, children: []}]));
    data.forEach((o:any) => o.pid && m.get(o.pid)?.children.push(m.get(o.id)));
    return data.filter((o:any) => !o.pid).map((o:any) => m.get(o.id));
  };

  ngOnInit(): void {
    this.Menus = this.nestData(this.data)
    // console.log(this.nestData(this.data));
    // console.log(this.Menus);
    
  }
}
