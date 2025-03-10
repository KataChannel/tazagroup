import { Inject, Injectable, signal,Signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { StorageService } from '../../shared/utils/storage.service';
@Injectable({
  providedIn: 'root'
})
export class DonhangService {
  constructor(
    private _StorageService: StorageService,
    private router: Router,
  ) { }
  ListDonhang = signal<any[]>([]);
  DetailDonhang = signal<any>({});
  donhangId = signal<string | null>(null);
  setDonhangId(id: string | null) {
    this.donhangId.set(id);
  }
  async CreateDonhang(dulieu: any) {
    try {
      const options = {
          method:'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dulieu),
        };
        const response = await fetch(`${environment.APIURL}/donhang`, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!response.ok) {
          // if (response.status === 401) {
          //   const result  = JSON.stringify({ code:response.status,title:'Vui lòng đăng nhập lại' })
          //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
          //   // this.Dangxuat()
          // } else if (response.status === 403) {
          //   const result  = JSON.stringify({ code:response.status,title:'Bạn không có quyền truy cập' })
          //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
          //   // this.Dangxuat()
          // } else if (response.status === 500) {
          //   const result  = JSON.stringify({ code:response.status,title:'Lỗi máy chủ, vui lòng thử lại sau' })
          //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
          //   // this.Dangxuat()
          // } else {
          //   const result  = JSON.stringify({ code:response.status,title:'Lỗi không xác định' })
          //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
          // }
        }
        this.getAllDonhang()
        this.donhangId.set(data.id)
        return data;
    } catch (error) {
        return console.error(error);
    }
  }

  async searchDonhang(SearchParams: any) {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+this._StorageService.getItem('token')
        },
        body: JSON.stringify(SearchParams),
      };
      const response = await fetch(`${environment.APIURL}/donhang/search`, options);
      if (!response.ok) {
        // if (response.status === 401) {
        //   const result  = JSON.stringify({ code:response.status,title:'Vui lòng đăng nhập lại' })
        //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
        //   // this.Dangxuat()
        // } else if (response.status === 403) {
        //   const result  = JSON.stringify({ code:response.status,title:'Bạn không có quyền truy cập' })
        //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
        //   // this.Dangxuat()
        // } else if (response.status === 500) {
        //   const result  = JSON.stringify({ code:response.status,title:'Lỗi máy chủ, vui lòng thử lại sau' })
        //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
        // } else {
        //   const result  = JSON.stringify({ code:response.status,title:'Lỗi không xác định' })
        //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
        // }
      }
      const data = await response.json();           
      this.ListDonhang.set(data)
    } catch (error) {
      return console.error(error);
    }
  }
  async getAllDonhang() {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+this._StorageService.getItem('token')
        },
      };
      const response = await fetch(`${environment.APIURL}/donhang`, options);
      if (!response.ok) {
        // if (response.status === 401) {
        //   const result  = JSON.stringify({ code:response.status,title:'Vui lòng đăng nhập lại' })
        //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
        //   // this.Dangxuat()
        // } else if (response.status === 403) {
        //   const result  = JSON.stringify({ code:response.status,title:'Bạn không có quyền truy cập' })
        //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
        //   // this.Dangxuat()
        // } else if (response.status === 500) {
        //   const result  = JSON.stringify({ code:response.status,title:'Lỗi máy chủ, vui lòng thử lại sau' })
        //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
        // } else {
        //   const result  = JSON.stringify({ code:response.status,title:'Lỗi không xác định' })
        //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
        // }
      }
      const data = await response.json();           
      this.ListDonhang.set(data)
    } catch (error) {
      return console.error(error);
    }
  }
  async getDonhangByid(id: any) {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(`${environment.APIURL}/donhang/findid/${id}`, options);      
      if (!response.ok) {
        // if (response.status === 401) {
        //   const result  = JSON.stringify({ code:response.status,title:'Vui lòng đăng nhập lại' })
        //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
        //   // this.Dangxuat()
        // } else if (response.status === 403) {
        //   const result  = JSON.stringify({ code:response.status,title:'Bạn không có quyền truy cập' })
        //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
        //   // this.Dangxuat()
        // } else if (response.status === 500) {
        //   const result  = JSON.stringify({ code:response.status,title:'Lỗi máy chủ, vui lòng thử lại sau' })
        //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
        //   // this.Dangxuat()
        // } else {
        //   const result  = JSON.stringify({ code:response.status,title:'Lỗi không xác định' })
        //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
        // }
      }
      const data = await response.json();      
      this.DetailDonhang.set(data)
    } catch (error) {
      return console.error(error);
    }
  }
  async updateDonhang(dulieu: any) {
    try {
      const options = {
          method:'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dulieu),
        };
        const response = await fetch(`${environment.APIURL}/donhang/${dulieu.id}`, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!response.ok) {
          // if (response.status === 401) {
          //   const result  = JSON.stringify({ code:response.status,title:'Vui lòng đăng nhập lại' })
          //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
          //   // this.Dangxuat()
          // } else if (response.status === 403) {
          //   const result  = JSON.stringify({ code:response.status,title:'Bạn không có quyền truy cập' })
          //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
          //   // this.Dangxuat()
          // } else if (response.status === 500) {
          //   const result  = JSON.stringify({ code:response.status,title:'Lỗi máy chủ, vui lòng thử lại sau' })
          //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
          //   // this.Dangxuat()
          // } else {
          //   const result  = JSON.stringify({ code:response.status,title:'Lỗi không xác định' })
          //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
          // }
        }
        this.getAllDonhang()
        this.getDonhangByid(dulieu.id)
    } catch (error) {
        return console.error(error);
    }
  }
  async DeleteDonhang(item:any) {    
    try {
        const options = {
            method:'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          };
          const response = await fetch(`${environment.APIURL}/donhang/${item.id}`, options);
          if (!response.ok) {
            // if (response.status === 401) {
            //   const result  = JSON.stringify({ code:response.status,title:'Vui lòng đăng nhập lại' })
            //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            // } else if (response.status === 403) {
            //   const result  = JSON.stringify({ code:response.status,title:'Bạn không có quyền truy cập' })
            //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            // } else if (response.status === 500) {
            //   const result  = JSON.stringify({ code:response.status,title:'Lỗi máy chủ, vui lòng thử lại sau' })
            //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            // } else {
            //   const result  = JSON.stringify({ code:response.status,title:'Lỗi không xác định' })
            //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            // }
          }
          this.getAllDonhang()
      } catch (error) {
          return console.error(error);
      }
  }

  async SearchDonhang(SearchParams:any) {
    try {
      const options = {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(SearchParams),
      };
          const response = await fetch(`${environment.APIURL}/donhang/search`,options);
          if (!response.ok) {
            // if (response.status === 401) {
            //   const result  = JSON.stringify({ code:response.status,title:'Vui lòng đăng nhập lại' })
            //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            //   // this.Dangxuat()
            // } else if (response.status === 403) {
            //   const result  = JSON.stringify({ code:response.status,title:'Bạn không có quyền truy cập' })
            //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            //   // this.Dangxuat()
            // } else if (response.status === 500) {
            //   const result  = JSON.stringify({ code:response.status,title:'Lỗi máy chủ, vui lòng thử lại sau' })
            //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            //   // this.Dangxuat()
            // } else {
            //   const result  = JSON.stringify({ code:response.status,title:'Lỗi không xác định' })
            //   this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            // }
          }
          const data = await response.json();   
          this.ListDonhang.set(data.items)
          return data;
      } catch (error) {
          return console.error(error);
      }
  }
}