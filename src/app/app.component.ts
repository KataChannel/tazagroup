import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { UserService } from './admin/user/user.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private titleService: Title, 
    private metaService: Meta,
    private _UserService: UserService,
    
  ) { }
  ngOnInit() {
   this._UserService.loadPermissions();
  //   this._UserService.getProfile().then((data)=>{
  //     console.log(data);
      
  //   })
  //  this._UserService.permissions$.subscribe((data)=>{
  //     console.log(data);
      
  //   })
  //   console.log("asdsajdhska");
    
    
    this.titleService.setTitle('My Dynamic Title'); 
    // this.metaService.addTags([
    //   { name: 'description', content: 'Taza Group - Giải pháp chăm sóc da toàn diện với công nghệ tiên tiến, mang lại làn da khỏe mạnh, rạng rỡ.' },
    //   { name: 'keywords', content: 'Taza Group, chăm sóc da, công nghệ, làm đẹp, skincare, mỹ phẩm, da khỏe mạnh' },
    //   { name: 'author', content: 'Tên tác giả hoặc công ty' },

    //   { property: 'og:title', content: 'Taza Group' },
    //   { property: 'og:type', content: 'website' },
    //   { property: 'og:url', content: 'URL của trang web' },
    //   { property: 'og:image', content: 'URL của hình ảnh đại diện' },
    //   { property: 'og:description', content: 'Mô tả ngắn gọn, hấp dẫn về Taza Group.' },
    //   { property: 'og:site_name', content: 'Tên trang web' },

    //   { name: 'twitter:card', content: 'summary_large_image' },
    //   { name: 'twitter:title', content: 'Taza Group' },
    //   { name: 'twitter:description', content: 'Mô tả ngắn gọn, hấp dẫn về Taza Group.' },
    //   { name: 'twitter:image', content: 'URL của hình ảnh đại diện' }
    // ]);
  }
}
