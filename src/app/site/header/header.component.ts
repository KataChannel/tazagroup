import { Component, ViewChild } from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../shared/utils/storage.service';
import { Headerteamplate1Component } from './headerteamplate1/headerteamplate1.component';
import { Headerteamplate2Component } from './headerteamplate2/headerteamplate2.component';
import { Headerteamplate3Component } from './headerteamplate3/headerteamplate3.component';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    MatMenuModule,
    Headerteamplate1Component,
    Headerteamplate2Component,
    Headerteamplate3Component
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private storageService: StorageService) {}
  teamplate:any=1
  ngOnInit(): void {
    this.teamplate = this.storageService.getItem('teamplate');
    console.log(this.teamplate);
  }
}
