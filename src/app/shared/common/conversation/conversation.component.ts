import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ChatgroupComponent } from './chatgroup/chatgroup.component';
import { ChatuserComponent } from './chatuser/chatuser.component';
import { ChatboxdetailComponent } from './chatboxdetail/chatboxdetail.component';
import { FormsModule } from '@angular/forms';
import { ConversationService } from './conversation.service';
import { flattenData } from '../../utils/shared.utils';
import { AdminmainComponent } from '../../../admin/adminmain/adminmain.component';
import { UserService } from '../../../admin/user/user.service';
@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatIconModule, 
    CommonModule, 
    FormsModule,
    RouterModule,
    MatInputModule,
    MatSidenavModule,
    ChatboxdetailComponent,
  ],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent {
  ChatDetail:any={}
  Message:any=""
  _AdminmainComponent:AdminmainComponent = inject(AdminmainComponent)
  _ConversationService:ConversationService = inject(ConversationService)
  isFullscreen:boolean=false
  isSearch:boolean=false
  ShowSearch:boolean=false
  ListUser:any[]=[]
  FilterListUser:any[]=[]
  ListConversation:any[]=[]
  isLoading = true;
  Profile:any={}
  readonly dialog = inject(MatDialog);
  @ViewChild(ChatboxdetailComponent) chatContainer!: ChatboxdetailComponent;
  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer,
  ) { 
    
  }
  async ngOnInit() {    
    await Promise.all([
      this.userService.getAllUser(),
      this.userService.getAllUser(),
      this.userService.getProfile(),
    ]);
   await this._ConversationService.SearchConversation({
      idSender: this.Profile.id,
      idReceiver: this.Profile.id,
      typesearch:"OR",
      pageSize: 9999,
    });
    this.ListConversation = this._ConversationService.conversations()    
   this.ListConversation.forEach((v:any) => {
      v.User = this.Profile?.id == v.Sender?.id ? v?.Receiver : this.Profile?.id == v.Receiver?.id ? v?.Sender:{};
    })
    this._ConversationService.onMessage((msg) => 
      {
        this.ChatDetail.messages = [...this.ChatDetail.messages, msg];
        if (this.chatContainer) {
          this.chatContainer.scrollToBottom();
        }
      });
    setTimeout(() => (this.isLoading = false), 2000); // Simulate loading
   // this.isFullscreen = this._AdminmainComponent.isFullscreen;
  }
  
  UserFilter(event:any)
  {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if(filterValue.length>1)
    {
      this.ShowSearch =true
      this.FilterListUser = this.ListUser.filter((v)=>v.Hoten.toLowerCase().includes(filterValue)||v.email.toLowerCase().includes(filterValue))
    }
    else {
      this.ShowSearch = false
    }
    
  }
  CloseSearch()
  {
     this._AdminmainComponent.drawer1.close();
    this.isSearch=false
  }
  ToggleFullscreen()
  {
    this.isFullscreen  = this._AdminmainComponent.isFullscreen= !this._AdminmainComponent.isFullscreen;
    this.isSearch=false
  }
  async SearchChatUser(item:any)
  {
   await this._ConversationService.SearchConversation({
    idSender:this.Profile.id,
    idReceiver:item.id,
    pageSize:9999
    })
    const CheckConver = this._ConversationService.conversations()
    if(CheckConver.length>0)
    {
      this.SetChatDetail(CheckConver[0])
    }
    else{
      const newConver = {
        idConversation: (new Date()).getTime(),      
        idSender:this.Profile.id,
        idReceiver:item.id,
        timestamp: (new Date()).getTime(),
        Type:'private'
      }
      this._ConversationService.CreateConversation(newConver).then(async ()=>
      {
        await this._ConversationService.SearchConversation({
          idSender: this.Profile.id,
          idReceiver: this.Profile.id,
          typesearch:"OR",
          pageSize: 9999,
        });
        const UpdateConver = this._ConversationService.conversations()
        console.log(UpdateConver);
        this.SetChatDetail(UpdateConver[0])
      })
    }
  }
  async OpenChatDetail(item:any)
  {
    console.log(item);
   setTimeout(() => {
      this.isChat =false
      if (this.chatContainer) {
        this.chatContainer.scrollToBottom();
      }
    }, 100);
    this.isSearch=false
    this.SetChatDetail(item)
  }
  SetChatDetail(item:any)
  {
    console.log(item);  
    item.messages.forEach((v:any) => {
      if(v.idReceiver==this.Profile.id)
      {
      v.Status=2
      this._ConversationService.UpdateConversation(v).then(async ()=>{
        await this._ConversationService.SearchConversation({
          idSender: this.Profile.id,
          idReceiver: this.Profile.id,
          typesearch:"OR",
          pageSize: 9999,
        });
      })
    }
    });
    this.ChatDetail = item
    this.ChatDetail.User = this.Profile.id==item.Sender.id?item.Receiver:item.Sender
    this._ConversationService.joinChat(item.idConversation); 
  }
  isChat:boolean=false
  SendMessage()
  {
    console.log(this.ChatDetail);
    
    this.isChat=true
    if(this.Message&&this.ChatDetail.idConversation)
    {
      const newConver = {
        idConversation: this.ChatDetail.idConversation,      
        idSender:this.Profile.id,
        idReceiver:this.ChatDetail.User.id,
        timestamp: (new Date()).getTime(),
        message:this.Message,
        Type:this.ChatDetail.Type
      }
      this._ConversationService.sendMessage(newConver)
      this.Message = ""
    }   
    this.Message = ""
    this._ConversationService.onMessage(async (msg) => {
      console.log('Received Message:', msg);
    
      // Check for duplicates based on `id`
      const isDuplicate = this.ChatDetail.messages.some((message:any) => message.id === msg.id);
    
      if (!isDuplicate) {
        this.ChatDetail.messages = [...this.ChatDetail.messages, msg];
      }
      if (this.chatContainer) {
        this.chatContainer.scrollToBottom();
      }
    });
  }
  openDialogChatuser()
  {
    const dialogRef = this.dialog.open(ChatuserComponent,{
      data: {
        idUser: this.Profile?.id,
        ListUser:this.ListUser
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.Detail!=undefined) {        
        //console.log(result)
        this.ChatDetail = result.Detail      
      }
      // else {
      //   console.log(result.Detail)
      //   this.ChatDetail = result.Detail
      //   // this._SettingsService.CreateSetting(result.Detail).then((data)=>{
      //   //   console.log(data)
      //   // });
      // }
    });
  }
  openDialogChatgroup()
  {
    const dialogRef = this.dialog.open(ChatgroupComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  getTrustUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  flattenData(data:any)
  {    
    return flattenData(data)
  }
}
