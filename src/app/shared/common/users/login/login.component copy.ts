// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { Component, inject, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
// import { FIREBASE_OPTIONS } from '@angular/fire/compat';
// import * as Auth from 'firebase/auth';
// import { isPlatformBrowser } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { UserService } from '../users.service';
// import {MatInputModule} from '@angular/material/input';
// import {MatCheckboxModule} from '@angular/material/checkbox';
// import {MatButtonModule} from '@angular/material/button';
// import {MatIconModule} from '@angular/material/icon';
// import { Config } from './login';
// import { RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [
//     MatInputModule,
//     MatCheckboxModule,
//     MatButtonModule,
//     FormsModule,
//     MatIconModule,
//     RouterLink
//   ],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss'
// })
// export class LoginComponent implements OnInit {
//   token: any;
//   gotonew:any="translate-x-0"
//   _UserService: UserService = inject(UserService);
//   Config:any=Config
//   order1:any='order-1'
//   order2:any='order-2'
//   // _spinner: NgxSpinnerService = inject(NgxSpinnerService);
//   // _NotifierService: NotifierService = inject(NotifierService);
//   User:any={}
//   constructor(
//     private auth: AngularFireAuth,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {
//     if (isPlatformBrowser(this.platformId)) {
//       this.token = localStorage.getItem('token') || null;
//     }
//   }
//   @HostListener('window:message', ['$event'])
//   onMessage(event: MessageEvent): void {
//     if (event.origin !== 'http://localhost:4300') return;
//     // console.log('Got this message from parent: ' + JSON.stringify(event.data));
//   }
//   SlidingForm()
//   {
//     this.order1=='order-1'?this.order1='order-2':this.order1='order-1',
//     this.order2=='order-1'?this.order2='order-2':this.order2='order-1'
//   }
//   ngOnInit(): void {
//     // this._UserService.getProfile().then((data) => {
//     //  // console.log(data);
//     // });
//   }
//   async Dangnhap() {
//     //console.log(this.User);
    
//     if ((this.User.SDT && this.User.SDT !== "") && (this.User.password && this.User.password !== ""))
//     {
//       this.User.email = this.User.SDT
//       try {
//       //   this._spinner.show();
//       //   this._UserService.Dangnhap(this.User).then((data:any) => {
//       //     console.log(data);
//       //     if (data[0]=="200") {
//       //       this._spinner.hide();
//       //     //  console.log(data);
//       //       this.postMessage(data[1]);
//       //       if (isPlatformBrowser(this.platformId)) {
//       //         this.postMessage(data[1]);
//       //         setTimeout(() => {
//       //           window.location.reload();
//       //         }, 100);    
//       //       }
//       //     }
//       //     else {
//       //       this._NotifierService.notify('error',data[1])
//       //    //   console.log(data);
//       //       this._spinner.hide();
//       //     }
//       //   });
//       } catch (error) {
//         console.error('Login error:', error);
//       }
     
//     }
//     else
//     {
//       //this._NotifierService.notify('error',"Vui lòng điền đủ thông tin")
//     }

//   }
//   async loginWithGoogle() {
//     const GoogleAuthProvider = new Auth.GoogleAuthProvider();
//     try {
//       const result = await this.auth.signInWithPopup(GoogleAuthProvider);
//       console.log('Logged in:', result.user);
//       console.log('Logged in:', result.user?.providerData[0]);
//       // this._UserService.LoginByGoogle(result.user?.providerData[0]).then((data:any) => {
//       //   if (data[0]) {
//       //   //  console.log(data);
//       //     //this.postMessage(data[1]);
//       //     if (isPlatformBrowser(this.platformId)) {
//       //      // this.postMessage(data[1]);
//       //       setTimeout(() => {
//       //         window.location.reload();
//       //       }, 100);
            
//       //     }
//       //   }
//       // });
//     } catch (error) {
//       // Handle errors (e.g., display an error message)
//       console.error('Login error:', error);
//     }
//   }

//   // async postMessage(authToken: string) {
//   //   if (window.opener) {
//   //   const targetOrigin = "http://localhost:4300";
//   //   const targetOrigin1 = "https://zalo.tazaskinclinic.com";
//   //   //const targetOrigin = "http://localhost:4300/";
//   //   const targetOrigin2 = "https://timona.edu.vn";

//   //   window.opener.postMessage({ type: "AUTH_SUCCESS", token: authToken }, targetOrigin);
//   //   window.opener.postMessage({ type: "AUTH_SUCCESS", token: authToken }, targetOrigin1); 
//   //   window.opener.postMessage({ type: "AUTH_SUCCESS", token: authToken }, targetOrigin2); 
//   //   }
   
//   // }
// }
