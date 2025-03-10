import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
@Component({
  selector: 'app-vantay',
  imports: [],
  templateUrl: './vantay.component.html',
  styleUrl: './vantay.component.scss'
})
export class VantayComponent {
  Log:any="loading..."
  ngOnInit(): void {
    const isNativePlatform = Capacitor.isNativePlatform(); // true nếu chạy trên Android/iOS, false nếu chạy trên web
    console.log(isNativePlatform);
    
    if (isNativePlatform) {
      this.Log="Native Platform"
      console.log("Plugin FingerprintAIO đã sẵn sàng!");
    } else {
      this.Log="Web Platform"
      console.error("Plugin FingerprintAIO không khả dụng!");
    }
  }
  async registerFingerprint() {
    try {
      const challenge = new Uint8Array(32); // Challenge giả lập (thực tế lấy từ backend)
      window.crypto.getRandomValues(challenge);

      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: { name: "Angular WebAuthn App" },
        user: {
          id: new Uint8Array(16),
          name: "user@example.com",
          displayName: "User Example"
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000
      };

      const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential;
      console.log("Đăng ký thành công!", credential);
      alert(`Đăng ký vân tay thành công! ${credential}`);
    } catch (error) {
      console.error("Đăng ký thất bại!", error);
      alert("Đăng ký thất bại!");
    }
  }

  async authenticateFingerprint() {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKey: PublicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: [],
        userVerification: "required",
        timeout: 60000
      };

      const credential = await navigator.credentials.get({ publicKey }) as PublicKeyCredential;
      console.log("Xác thực thành công!", credential);
      alert("Xác thực vân tay thành công!");
    } catch (error) {
      console.error("Xác thực thất bại!", error);
      alert("Xác thực thất bại!");
    }
  }
  
}
