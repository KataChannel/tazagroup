import { Inject, Injectable, signal,Signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { StorageService } from '../../shared/utils/storage.service';
import { io } from 'socket.io-client';
import { openDB } from 'idb';
@Injectable({
  providedIn: 'root'
})
export class PhieuchiahangService {
  constructor(
    private _StorageService: StorageService,
    private router: Router,
  ) { }
  ListPhieuchiahang = signal<any[]>([]);
  DetailPhieuchiahang = signal<any>({});
  phieuchiahangId = signal<string | null>(null);
  setPhieuchiahangId(id: string | null) {
    this.phieuchiahangId.set(id);
  }
  private socket = io(`${environment.APIURL}`);
  async CreatePhieuchiahang(dulieu: any) {
    try {
      const options = {
          method:'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dulieu),
        };
        const response = await fetch(`${environment.APIURL}/phieuchiahang`, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            const result  = JSON.stringify({ code:response.status,title:'Vui lòng đăng nhập lại' })
            this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            // this.Dangxuat()
          } else if (response.status === 403) {
            const result  = JSON.stringify({ code:response.status,title:'Bạn không có quyền truy cập' })
            this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            // this.Dangxuat()
          } else if (response.status === 500) {
            const result  = JSON.stringify({ code:response.status,title:'Lỗi máy chủ, vui lòng thử lại sau' })
            this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            // this.Dangxuat()
          } else {
            const result  = JSON.stringify({ code:response.status,title:'Lỗi không xác định' })
            this.router.navigate(['/errorserver'], { queryParams: {data:result}});
          }
        }
        this.getAllPhieuchiahang()
        this.phieuchiahangId.set(data.id)
    } catch (error) {
        return console.error(error);
    }
  }

  async getAllPhieuchiahang() {
    const db = await this.initDB();
    const cachedData = await db.getAll('phieuchiahangs');
    const updatedAtCache = parseInt(localStorage.getItem('updatedAt') || '0');
    
    // 1️⃣ Gọi API lấy lastUpdated từ server
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+this._StorageService.getItem('token')
        },
      };
      const response = await fetch(`${environment.APIURL}/phieuchiahang`, options);
      if (!response.ok) {
        if (response.status === 401) {
          const result  = JSON.stringify({ code:response.status,title:'Vui lòng đăng nhập lại' })
          this.router.navigate(['/errorserver'], { queryParams: {data:result}});
          // this.Dangxuat()
        } else if (response.status === 403) {
          const result  = JSON.stringify({ code:response.status,title:'Bạn không có quyền truy cập' })
          this.router.navigate(['/errorserver'], { queryParams: {data:result}});
          // this.Dangxuat()
        } else if (response.status === 500) {
          const result  = JSON.stringify({ code:response.status,title:'Lỗi máy chủ, vui lòng thử lại sau' })
          this.router.navigate(['/errorserver'], { queryParams: {data:result}});
        } else {
          const result  = JSON.stringify({ code:response.status,title:'Lỗi không xác định' })
          this.router.navigate(['/errorserver'], { queryParams: {data:result}});
        }
      }
      const data = await response.json();       
      const updatedAtServer = data.reduce((max:any, p:any) => Math.max(max, new Date(p.updatedAt).getTime()), 0);

      // 2️⃣ Nếu dữ liệu trên server mới hơn, cập nhật IndexedDB + LocalStorage
      if (updatedAtServer > updatedAtCache) {
        await this.savePhieuchiahangs(data);
        localStorage.setItem('lastUpdated', updatedAtServer.toString());
        localStorage.setItem('phieuchiahangs', JSON.stringify(data));
      }
      this.ListPhieuchiahang.set(data);
      return cachedData.length > 0 ? cachedData : data;    
      // localStorage.setItem('phieuchiahangs', JSON.stringify(data)); // Cache vào LocalStorage
    } catch (error) {
      return console.error(error);
    }
  }

  // 3️⃣ Lắng nghe cập nhật từ WebSocket
  listenPhieuchiahangUpdates() {
    this.socket.on('phieuchiahang-updated', async () => {
      console.log('🔄 Dữ liệu sản phẩm thay đổi, cập nhật lại cache...');
      await this.getAllPhieuchiahang();
    });
  }
  // Khởi tạo IndexedDB
  private async initDB() {
    return await openDB('PhieuchiahangDB', 1, {
      upgrade(db) {
        db.createObjectStore('phieuchiahangs', { keyPath: 'id' });
      },
    });
  }

  // Lưu vào IndexedDB
  private async savePhieuchiahangs(data: any[]) {
    const db = await this.initDB();
    const tx = db.transaction('phieuchiahangs', 'readwrite');
    const store = tx.objectStore('phieuchiahangs');
    await store.clear(); // Xóa dữ liệu cũ
    data.forEach(item => store.put(item));
    await tx.done;
  }

  async getPhieuchiahangByid(id: any) {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(`${environment.APIURL}/phieuchiahang/findid/${id}`, options);      
      if (!response.ok) {
        if (response.status === 401) {
          const result  = JSON.stringify({ code:response.status,title:'Vui lòng đăng nhập lại' })
          this.router.navigate(['/errorserver'], { queryParams: {data:result}});
          // this.Dangxuat()
        } else if (response.status === 403) {
          const result  = JSON.stringify({ code:response.status,title:'Bạn không có quyền truy cập' })
          this.router.navigate(['/errorserver'], { queryParams: {data:result}});
          // this.Dangxuat()
        } else if (response.status === 500) {
          const result  = JSON.stringify({ code:response.status,title:'Lỗi máy chủ, vui lòng thử lại sau' })
          this.router.navigate(['/errorserver'], { queryParams: {data:result}});
          // this.Dangxuat()
        } else {
          const result  = JSON.stringify({ code:response.status,title:'Lỗi không xác định' })
          this.router.navigate(['/errorserver'], { queryParams: {data:result}});
        }
      }
      const data = await response.json();      
      this.DetailPhieuchiahang.set(data)
    } catch (error) {
      return console.error(error);
    }
  }
  async updatePhieuchiahang(dulieu: any) {
    try {
      const options = {
          method:'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dulieu),
        };
        const response = await fetch(`${environment.APIURL}/phieuchiahang/${dulieu.id}`, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            const result  = JSON.stringify({ code:response.status,title:'Vui lòng đăng nhập lại' })
            this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            // this.Dangxuat()
          } else if (response.status === 403) {
            const result  = JSON.stringify({ code:response.status,title:'Bạn không có quyền truy cập' })
            this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            // this.Dangxuat()
          } else if (response.status === 500) {
            const result  = JSON.stringify({ code:response.status,title:'Lỗi máy chủ, vui lòng thử lại sau' })
            this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            // this.Dangxuat()
          } else {
            const result  = JSON.stringify({ code:response.status,title:'Lỗi không xác định' })
            this.router.navigate(['/errorserver'], { queryParams: {data:result}});
          }
        }
        this.getAllPhieuchiahang()
        this.getPhieuchiahangByid(dulieu.id)
    } catch (error) {
        return console.error(error);
    }
  }
  async DeletePhieuchiahang(item:any) {    
    try {
        const options = {
            method:'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          };
          const response = await fetch(`${environment.APIURL}/phieuchiahang/${item.id}`, options);
          if (!response.ok) {
            if (response.status === 401) {
              const result  = JSON.stringify({ code:response.status,title:'Vui lòng đăng nhập lại' })
              this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            } else if (response.status === 403) {
              const result  = JSON.stringify({ code:response.status,title:'Bạn không có quyền truy cập' })
              this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            } else if (response.status === 500) {
              const result  = JSON.stringify({ code:response.status,title:'Lỗi máy chủ, vui lòng thử lại sau' })
              this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            } else {
              const result  = JSON.stringify({ code:response.status,title:'Lỗi không xác định' })
              this.router.navigate(['/errorserver'], { queryParams: {data:result}});
            }
          }
          this.getAllPhieuchiahang()
      } catch (error) {
          return console.error(error);
      }
  }
}