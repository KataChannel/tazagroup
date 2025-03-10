import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { StorageService } from '../utils/storage.service';
@Injectable({
  providedIn: 'root'
})
export class GoogleSheetService {
  private _authenticated: boolean = false;
  private APIURL: string = environment.APIURL;
  private isBrowser: boolean;
  constructor(
    private _StorageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  
  async getDrive(DriveInfo:any) {
    try {
      const options = {
        method:'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${DriveInfo.IdSheet}/values/${DriveInfo.SheetName}?key=${DriveInfo.ApiKey}`,options);
    const data = await response.json();
    return data;
      } catch (error) {
          return console.error(error);
      }
  }
}
