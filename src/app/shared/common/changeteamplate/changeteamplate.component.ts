import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { StorageService } from '../../utils/storage.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-changeteamplate',
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './changeteamplate.component.html',
  styleUrl: './changeteamplate.component.scss'
})
export class ChangeteamplateComponent {
  constructor(private storageService: StorageService) {}
  teamplate:any=1
  ListTeamplate:any[]=[
    {id:1,Title:"Teamplate 1"},
    {id:2,Title:"Teamplate 2"},
    {id:3,Title:"Teamplate 3"},
  ]
  ngOnInit(): void {
    this.teamplate = this.storageService.getItem('teamplate');
    console.log(this.teamplate);
  }
  ChangeTeamplate(item:any)
  {
      this.storageService.setItem('teamplate', item.id);
      window.location.reload();
  }
}
