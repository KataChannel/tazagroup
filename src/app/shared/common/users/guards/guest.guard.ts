import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable, of,switchMap } from 'rxjs';
import { UserService } from '../../../../admin/user/user.service';
@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(
    private _UserService: UserService,
    private _router: Router,
    ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    //return true;
    return this._check();
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
   return this._check();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
   return this._check();
  }
  private _check(): Observable<boolean> {
    return this._UserService.checkDangnhap().pipe(
      switchMap((authenticated) => {
        if (authenticated) {
         this._router.navigate(['']);
          return of(false);
        }
        return of(true);
      })
    );
  }
}
