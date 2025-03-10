import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { ChangeteamplateComponent } from '../../../shared/common/changeteamplate/changeteamplate.component';
import { ListMenus } from '../../../shared/mockdata/menu';
import { MenuComponent } from '../../../shared/common/menu/menu.component';

@Component({
  selector: 'app-headerteamplate2',
  imports: [    
    CommonModule,
    MatMenuModule,
    ChangeteamplateComponent,
    MenuComponent
  ],
  templateUrl: './headerteamplate2.component.html',
  styleUrl: './headerteamplate2.component.scss'
})
export class Headerteamplate2Component {
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
    console.log(this.Menus);   
  }
}
