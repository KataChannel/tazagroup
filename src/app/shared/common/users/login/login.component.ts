import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, inject, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import * as Auth from 'firebase/auth';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { Config } from './login';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../admin/user/user.service';
import { StorageService } from '../../../utils/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  token: any;
  gotonew:any="translate-x-0"
  _UserService: UserService = inject(UserService);
  _StorageService: StorageService = inject(StorageService);
  Config:any=Config
  order1:any='order-1'
  order2:any='order-2'
  rightpanel:any='transform-x-0'
  leftpanel:any='transform-x-0'
  // _spinner: NgxSpinnerService = inject(NgxSpinnerService);
  // _NotifierService: NotifierService = inject(NotifierService);
  User:any={}
  constructor(
    private auth: AngularFireAuth,
    private route: ActivatedRoute, private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token') || null;
    }
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent): void {
    if (event.origin !== 'http://localhost:4300') return;
    // console.log('Got this message from parent: ' + JSON.stringify(event.data));
  }
  SlidingForm()
  {

    if(this.order1=='order-1'){
    this.rightpanel='opacity-0'
    this.leftpanel='opacity-0'
    }else{
      this.rightpanel='opacity-100'
      this.leftpanel='opacity-100'
    }
    setTimeout(() => {
    this.order1=='order-1'?this.order1='order-2':this.order1='order-1',
    this.order2=='order-1'?this.order2='order-2':this.order2='order-1'
    this.rightpanel='opacity-100'
    this.leftpanel='opacity-100'
    }, 200);

  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        console.log('Token from URL:', token);
        this.validateToken(token); // Validate the token
      } else {
        this.router.navigate(['/admin/donhang']);
        console.error('Token not found in URL');
      }
    });
  }
  validateToken(token: string) {
    // Decode the token (if it's a JWT)
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the payload
      // Check if the token is expired (if it has an `exp` field)
      if (payload.exp && payload.exp < Date.now() / 1000) {
      } else {
        
       this._StorageService.setItem('token', token); // Store the token
       this._UserService.getProfile().then((res: any) => {
        if(res){
          if(res.permissions>0){
            console.log(res);
            window.location.reload(); // Reload the page
          }
          else {
            this.router.navigate(['/404',{ queryParams: {data:{ code:403,title:'Bạn không có quyền truy cập liên hệ admin' }}}]);
          }

        }
       }) 
      }
    } catch (error) {
    }
  }
  async Dangnhap() {
    //console.log(this.User);
    if ((this.User.SDT && this.User.SDT !== "") && (this.User.password && this.User.password !== ""))
    {
      this.User.email = this.User.SDT
      try {
        this._UserService.login(this.User).then((data:any) => {
          console.log(data);
          
          if (data[0]) {
            setTimeout(() => {
                window.location.reload();
              }, 100); 
          //  console.log(data);
            // this.postMessage(data[1]);
            // if (isPlatformBrowser(this.platformId)) {
            //   this.postMessage(data[1]);
            //   setTimeout(() => {
            //     window.location.reload();
            //   }, 100);    
            // }
          }
          else {
        //     this._NotifierService.notify('error',data[1])
        //  //   console.log(data);
        //     this._spinner.hide();
          }
        });
      } catch (error) {
        console.error('Login error:', error);
      }
     
    }
    else
    {
      //this._NotifierService.notify('error',"Vui lòng điền đủ thông tin")
    }

  }
  async loginWithGoogle() {
    const GoogleAuthProvider = new Auth.GoogleAuthProvider();    
    try {
      const result = await this.auth.signInWithPopup(GoogleAuthProvider);
      console.log('Logged in:', result);
      
      console.log('Logged in:', result.user);
      console.log('Logged in:', result.user?.providerData[0]);
      this._UserService.LoginByGoogle(result.user?.providerData[0]).then((data:any) => {
        if (data[0]) {
        //  console.log(data);
          //this.postMessage(data[1]);
          if (isPlatformBrowser(this.platformId)) {
           // this.postMessage(data[1]);
            // setTimeout(() => {
            //   window.location.reload();
            // }, 0);
            
          }
        }
      });
    } catch (error) {
      // Handle errors (e.g., display an error message)
      console.error('Login error:', error);
    }
  }


  loginGoogle() {
    this._UserService.loginWithGoogle();
  }

  loginFacebook() {
    this._UserService.loginWithFacebook();
  }

  loginZalo() {
    this._UserService.loginWithZalo();
  }


  // async postMessage(authToken: string) {
  //   if (window.opener) {
  //   const targetOrigin = "http://localhost:4300";
  //   const targetOrigin1 = "https://zalo.tazaskinclinic.com";
  //   //const targetOrigin = "http://localhost:4300/";
  //   const targetOrigin2 = "https://timona.edu.vn";

  //   window.opener.postMessage({ type: "AUTH_SUCCESS", token: authToken }, targetOrigin);
  //   window.opener.postMessage({ type: "AUTH_SUCCESS", token: authToken }, targetOrigin1); 
  //   window.opener.postMessage({ type: "AUTH_SUCCESS", token: authToken }, targetOrigin2); 
  //   }
   
  // }
}
