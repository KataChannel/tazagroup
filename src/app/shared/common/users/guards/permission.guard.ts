import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from '../../../../admin/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(
     private _UserService: UserService,
     private router: Router,
     private _snackBar: MatSnackBar
    ) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredPermission = route.data['permission'];   
    if (!this._UserService.hasPermission(requiredPermission)) {
      this._snackBar.open('Chưa Có Quyền Truy Cập', '', {
        duration: 1000,
        horizontalPosition: "end",
        verticalPosition: "top",
        panelClass: ['snackbar-warning'],
      }); 
      this.router.navigate(['/login']);
      return false;
    }else {
      return true;
    }
  }
}
