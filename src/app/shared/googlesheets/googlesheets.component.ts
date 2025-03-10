import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../environments/environment.development';
import { GoogleSheetService } from './googlesheets.service';
import { MatButtonModule } from '@angular/material/button';
import { ConvertDriveData } from '../utils/shared.utils';
import { StorageService } from '../utils/storage.service';

@Component({
  selector: 'app-googlesheets',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './googlesheets.component.html',
  styleUrl: './googlesheets.component.scss'
})
export class GooglesheetsComponent {
  DriveInfo:any={
    ApiKey:environment.GSApiKey||'',
    IdSheet:'12Mjlh55kVxdX_12bgITi-zHDsa8EO9Puc6bSOkleIjg',
    SheetName:'ListSheets'
  }
  ListSheets:any[]=JSON.parse(localStorage.getItem('ListSheets') || '[]');
  constructor() {}
  _GoogleSheetService:GoogleSheetService=inject(GoogleSheetService)
  _StorageService:StorageService=inject(StorageService)
  ngOnInit(): void {
    // TODO
  }
  async GetDrive()
    {
      const result = await this._GoogleSheetService.getDrive(this.DriveInfo);   
      console.log(result);  
      if(result.values.length>0)
      {
        this.ListSheets = ConvertDriveData(result.values)
        this._StorageService.setItem('ListSheets',this.ListSheets)
        this.ngOnInit()   
      }
      
  }
  RemoveDrive()
  {
    localStorage.removeItem('ListSheets')
    this.ListSheets = []
  }
}
