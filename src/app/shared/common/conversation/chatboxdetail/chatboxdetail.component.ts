import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import moment from 'moment';
import 'moment/locale/vi';
moment.locale('vi');
@Component({
  selector: 'app-chatboxdetail',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './chatboxdetail.component.html',
  styleUrl: './chatboxdetail.component.scss'
})
export class ChatboxdetailComponent {
  @Input() ChatDetail:any={}
  @Input() isChat:boolean=false


// Cài đặt locale tiếng Việt (nếu cần)
 getTimeNow(time:any)
 {
  const CTime = new Date(time*1)
  const sentTime = moment(CTime); // Định dạng ISO 8601 hoặc Date
  const now = moment();
  return sentTime.from(now)
 }
 @ViewChild('chatContainer') chatContainer!: ElementRef;

 messages: any[] = []; // Chat messages stored here 
 scrollToBottom(): void {
   if (this.chatContainer) {
     this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    //  console.log(this.chatContainer.nativeElement.scrollTop);
     
   }
 }
}
