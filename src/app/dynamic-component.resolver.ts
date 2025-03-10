import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { routeMap } from './shared/mockdata/routeMap';

@Injectable({ providedIn: 'root' })
export class DynamicComponentResolver implements Resolve<string> {
  constructor(private router: Router) {}
  resolve(route: ActivatedRouteSnapshot): Observable<string | any> {
    const slug: any = route.paramMap.get('slug'); // Lấy giá trị slug từ URL
    const lastPart = slug.slice(slug.lastIndexOf('-') + 1); // Lấy phần sau dấu "-" cuối cùng
    const componentType = routeMap[lastPart] || 'notfound';
    console.log(componentType);
    history.replaceState({ componentType }, ''); // Lưu kết quả vào history.state
    return of(componentType); // Trả về kết quả dưới dạng Observable
  }
  private determineComponentType(slug: any): any {
    switch (slug) {
      case 'v1':
        return 'sanpham';
      case 'v2':
        return 'danhmuc';
      case 'v3':
        return 'baiviet';
      case 'v4':
        return 'danhmucbaiviet';
      case 'v5':
        return 'danhmucgioithieu';
      case 'v6':
        return 'gioithieu';
      default:
        return 'notfound';
    }
  }
}
