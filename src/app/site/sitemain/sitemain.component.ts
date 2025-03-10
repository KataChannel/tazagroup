import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import {MatSidenavModule} from '@angular/material/sidenav';
import { StorageService } from '../../shared/utils/storage.service';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-sitemain',
  imports: [
    // HeaderComponent,
    // FooterComponent,
    MatSidenavModule,
    RouterOutlet
],
  templateUrl: './sitemain.component.html',
  styleUrl: './sitemain.component.scss'
})
export class SitemainComponent implements OnInit {
  template:any=1;

  constructor(
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.template = this.storageService.getItem('teamplate');
    if(this.template==null){
      console.log('teamplate1',this.template);    
    }
    else {
      console.log('teamplate2',this.template);    
    }
  }
}
