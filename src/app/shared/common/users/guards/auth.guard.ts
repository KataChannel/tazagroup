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
import { Observable, of, switchMap, finalize } from 'rxjs';
import { UserService } from '../../../../admin/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private _UserService: UserService,
    private _router: Router,
  //  private _spinner: NgxSpinnerService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const redirectUrl = state.url === '/logout' ? '/' : state.url;
    return this._check(redirectUrl);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const redirectUrl = state.url === '/logout' ? '/' : state.url;
    return this._check(redirectUrl);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._check('/');
  }

  private _check(redirectURL: string): Observable<boolean> {
   // this._spinner.show();
    return this._UserService.checkDangnhap().pipe(
      switchMap((authenticated) => {
        if (!authenticated) {
          this._router.navigate(['/login'], { queryParams: { redirectURL } });
          return of(false);
        }
        return of(true);
      }),
      finalize(() => {
     //   this._spinner.hide();
      })
    );
  }
}
