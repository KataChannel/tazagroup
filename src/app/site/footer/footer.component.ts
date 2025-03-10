import { Component } from '@angular/core';
import { StorageService } from '../../shared/utils/storage.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { Footerteamplate1Component } from './footerteamplate1/footerteamplate1.component';
import { Footerteamplate2Component } from './footerteamplate2/footerteamplate2.component';
import { Footerteamplate3Component } from './footerteamplate3/footerteamplate3.component';

@Component({
  selector: 'app-footer',
  imports: [
     CommonModule,
     MatMenuModule,
     Footerteamplate1Component,
     Footerteamplate2Component,
     Footerteamplate3Component
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(private storageService: StorageService) {}
  teamplate:any=1
  ngOnInit(): void {
    this.teamplate = this.storageService.getItem('teamplate');
    console.log(this.teamplate);
  }
}
