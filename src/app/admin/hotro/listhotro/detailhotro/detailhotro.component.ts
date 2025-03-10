import {
  Component,
  inject,
  ViewChild,
  Inject,
  PLATFORM_ID,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  Renderer2,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { conver, ListHotro, ListType } from '../listhotro';
import { HotrosService } from '../listhotro.service';
import { EditorjsComponent } from '../../../../shared/common/editorjs/editorjs.component';
import { ListHotroComponent } from '../listhotro.component';
import html2canvas from 'html2canvas';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { toVietnameseWords } from '../../../../shared/utils/tiente.utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadService } from '../../../../shared/uploadfile/uploadfile.service';
import {  NgxFileDropModule } from 'ngx-file-drop';
import { UserService } from '../../../user/user.service';
@Component({
  selector: 'app-detailhotro',
  templateUrl: './detailhotro.component.html',
  styleUrl: './detailhotro.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    NgxFileDropModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class DetailHotroComponent {
  Detail: any = {};
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  ColumnName: any = { STT: 'STT' };
  FilterColumns: any[] = [];
  Columns: any[] = [];
  Listhotro: any[] = ListHotro;
  toolbar: any[] = [
    'heading',
    'alignment',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    'blockQuote',
    'undo',
    'redo',
  ];
  tickets: any[] = conver.tickets;
  users: any[] = conver.users;
  channels: any[] = conver.channels;
  replies: any[] = conver.replies;
  ListItem: any[] = [{ Title: '', Thanhtien: 0, Ghichu: '' }];
  profile: any = {};
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private _breakpointObserver: BreakpointObserver,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.FilterColumns = JSON.parse(
        localStorage.getItem('hotro_FilterColumns') || '[]'
      );
    }
  }
  private _hotrosService: HotrosService = inject(HotrosService);
  _router: ActivatedRoute = inject(ActivatedRoute);
  _route: Router = inject(Router);
  _ListHotroComponent: ListHotroComponent = inject(ListHotroComponent);
  _UploadService: UploadService = inject(UploadService);
  _UserService: UserService = inject(UserService);
  _snackBar: MatSnackBar = inject(MatSnackBar);
  @ViewChild('editable') editable!: ElementRef;
  @ViewChildren('viewChat') viewChat!: QueryList<ElementRef>;
  @HostListener('window:keydown', ['$event'])
  handleShortcut(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === 'i') {
      event.preventDefault(); // Prevent default browser behavior

      if (this.editable) {
        this.editable.nativeElement.focus();
        this.moveCursorToEnd(this.editable.nativeElement);
      }
    }
  }
  scrollToBottom() {
    console.log(this.viewChat);
    
    setTimeout(() => {
      if (this.viewChat && this.viewChat.length > 0) {
        const lastChat = this.viewChat.last.nativeElement;
        lastChat.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
  async ngOnInit(): Promise<void> {
    this._router.paramMap.subscribe(async (data: any) => {
      const paramsId = data.get('id');
      if (paramsId) {
        await this._hotrosService.getHotroByid(paramsId).then((data) => {
          if (data) {
            this.Detail = this._hotrosService.Hotro();
            this.Detail.Dexuat.Chitiet = this.Detail.Dexuat.Chitiet || [];
            this.Detail.Dexuat.Tienbangchu =
              toVietnameseWords(this.Detail.Dexuat.TongChi) ||
              'Kiểm tra lại số tiền';
            this.Detail.Chat = this.Detail.idChat || [];
            console.log(this.Detail);
            this._UserService.getProfile().then((data) => {
              this.profile = data;
            });
            this._ListHotroComponent.drawer.open();
          }
        });
      } else {
        this._ListHotroComponent.drawer.close();
      }
    });
    // this.setupDrawer();
  }

  @ViewChild('editable') editableDiv!: ElementRef;
  editiorValue: string = '';

  ngAfterViewInit(): void {
    this.scrollToBottom();
    // Set giá trị ban đầu một lần duy nhất
    this.editableDiv.nativeElement.innerHTML = this.editiorValue;

    // Lắng nghe sự kiện keydown để xử lý phím Enter
    this.renderer.listen(
      this.editableDiv.nativeElement,
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          if (this.editiorValue.trim() === '') return;
          event.preventDefault(); // Ngăn hành động mặc định (chèn <div>)
          this.SendMess();
          // Chèn <br><br> để tạo dòng mới
          document.execCommand('insertHTML', false, '<br><br>');
        }
      }
    );

    // Lắng nghe sự kiện input để cập nhật giá trị
    this.renderer.listen(this.editableDiv.nativeElement, 'input', () => {
      let html = this.editableDiv.nativeElement.innerHTML;
      // Nếu nội dung chỉ chứa <br> hoặc chỉ khoảng trắng, đặt về chuỗi rỗng
      if (
        html.trim() === '<br>' ||
        html.trim() === '<br><br>' ||
        !this.editableDiv.nativeElement.innerText.trim()
      ) {
        html = '';
        this.editableDiv.nativeElement.innerHTML = html;
      }
      this.editiorValue = html;
    });
  }

  getUserName(userId: number): string {
    const user = this.users.find((u) => u.id === userId);
    return user ? user.username : 'Unknown';
  }
  GetNameType(item: any) {
    return ListType.find((type) => type.value === item);
  }
  printContent() {
    const element = document.getElementById('printContent');
    if (!element) return;

    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imageData = canvas.toDataURL('image/png');

      // Mở cửa sổ mới và in ảnh
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>${this.Detail?.Title}</title>
          </head>
          <body style="text-align: center;">
            <img src="${imageData}" style="max-width: 100%;"/>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() { window.close(); };
              };
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();
    });
  }
  CopyContent() {
    this._snackBar.open('Đang Coppy Đề Xuất', '', {
      duration: 1000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snackbar-warning'],
    });
    delete this.Detail.id;
    this.Detail.Title = `Copy ${this.Detail.Title}`;
    this._hotrosService.CreateHotro(this.Detail).then((data: any) => {
      console.log(data);

      setTimeout(() => {
        // window.location.href = `admin/hotro/${data.id}`;
      }, 1000);
    });
  }
  getChannelName(channelId: number): string {
    const channel = this.channels.find((c) => c.id === channelId);
    return channel ? channel.name : 'Unknown';
  }
  onEditorChange(event: any) {
    console.log(event);
  }
  RemoveItem(index: number) {
    this.Detail.Dexuat.Chitiet.splice(index, 1);
  }
  saveContent() {
    this.Detail.Dexuat.Tongtien = this.Detail.Dexuat.Chitiet.reduce(
      (sum: any, item: any) => sum + item.Thanhtien,
      0
    );
    this.Detail.Dexuat.TongChi =
      this.Detail.Dexuat.Tongtien - this.Detail.Dexuat.Tamung;
    this.drawer.close();
    this._hotrosService.updateOneHotro(this.Detail).then(() => {
      this.ngOnInit();
    });
  }
  DeleteItem() {
    this._hotrosService.DeleteHotro(this.Detail).then(() => {
      this._snackBar.open('Đã Xóa', '', {
        duration: 1000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'],
      });
      this._ListHotroComponent.drawer.close();
      this._route.navigate(['admin/hotro']);
    });
  }
  getReplies(ticketId: number): any[] {
    return this.replies.filter((reply) => reply.ticket_id === ticketId);
  }
  private setupDrawer(): void {
    this._breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        if (result.matches) {
          this.drawer.mode = 'side';
        } else {
          this.drawer.mode = 'side';
        }
      });
  }
  onContentChange(event: any) {
    this.Detail = event;
  }
  FilterListType: any[] = ListType;
  DoFindKhachhang(event: any) {
    const query = event.target.value.toLowerCase();
    this.FilterListType = ListType.filter((v) =>
      v.Title.toLowerCase().includes(query)
    );
  }
  uploadfile(event: any) {
    const file = event.target.files[0];

    // this._UploadService.uploadlocal(file).then((data) => {
    //   console.log(data);
    // });
  }
  filePreview: string | null = null;
  isImage = false;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.filePreview = e.target.result; // Base64 URL
      this.isImage = file.type.startsWith('image');
      this.TempMess('image', e.target.result);
    };
    reader.readAsDataURL(file);
  }
  uploadDriver(event: any) {
    const file = event.target.files[0];
    this._UploadService.uploadDriver(file).then((data) => {
      console.log(data);
    });
  }

  isDragging = false;

  onDragOver(event: DragEvent) {
    this.isDragging = true;
    event.preventDefault(); // Prevent default behavior (Prevent file from being opened)
  }

  onDragLeave(event: DragEvent) {
    this.isDragging = false;
  }

  ListtempsMess: any[] = [];

  TempMess(type: string, content: any) {
    const item = {
      idUser: this.profile?.id,
      Type: type || 'text',
      Content: content,
    };
    this.ListtempsMess.push(item);
  }

  SendMess() {
    if (this.editiorValue.trim() !== '') {
      this.ListtempsMess.push({
        idUser: this.profile?.id,
        Type: 'text',
        Content: this.editiorValue,
      });
    }
    if (this.ListtempsMess.length > 0) {
      this.Detail.Chat = [...this.Detail.Chat, ...this.ListtempsMess];
      this.Detail.idChat = [...this.Detail.idChat, ...this.ListtempsMess];
      this.ListtempsMess = [];
    }
    this.editableDiv.nativeElement.innerHTML = '';
    this.scrollToBottom();
    this._hotrosService.updateOneHotro(this.Detail).then(() => {
      this.ngOnInit();
    })
  }

  onInput(event: Event): void {
    const target = event.target as HTMLElement;
    this.editiorValue = target.innerHTML;
  }

  onDrop(event: DragEvent) {
    event.preventDefault(); // Prevent default behavior
    const items = event.dataTransfer?.items;
    const target = event.target as HTMLDivElement;
    if (!items) return;

    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          if (file.type.startsWith('image/')) {
            this.handleImageDrop(file, target);
          } else {
            this.handleFileUpload(file, target);
          }
        }
      } else if (item.kind === 'string') {
        item.getAsString((text) => {
          this.editableDiv.nativeElement.innerHTML += text;
          this.moveCursorToEnd(target);
        });
      }
    }
    this.isDragging = false;
  }

  handleImageDrop(file: File, target: HTMLDivElement) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target?.result as string;
      img.style.maxWidth = '100%';
      img.style.margin = '5px 0';
      target.appendChild(img);
      this.editableDiv.nativeElement.innerHTML += img;
      this.ListtempsMess.push({
        idUser: this.profile?.id,
        Type: 'image',
        Content: img.src,
      });
      this.moveCursorToEnd(target);
    };
    reader.readAsDataURL(file);
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const items = clipboardData.items;
    const target = event.target as HTMLDivElement;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement('img');
          img.src = e.target?.result as string;
          img.style.maxWidth = '100%';
          img.style.margin = '5px 0';
          target.appendChild(img);
          const space = document.createTextNode(' ');
          target.appendChild(space);
          this.ListtempsMess.push({
            idUser: this.profile?.id,
            Type: 'image',
            Content: img.src,
          });
          this.moveCursorToEnd(target);
        };
        reader.readAsDataURL(blob!);
      } else if (item.type === 'text/plain') {
        const plainText = clipboardData.getData('text/plain');
        this.editableDiv.nativeElement.innerHTML += plainText;
        this.moveCursorToEnd(target);
      } else if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          this.handleFileUpload(file, target);
        }
      }
    }
  }

  handleFileUpload(file: File, target: HTMLDivElement) {
    const fileLink = document.createElement('a');
    fileLink.href = URL.createObjectURL(file);
    fileLink.textContent = `📎 ${file.name}`;
    fileLink.download = file.name;
    fileLink.style.display = 'block';
    fileLink.style.margin = '5px 0';
    target.appendChild(fileLink);
    const space = document.createTextNode(' ');
    target.appendChild(space);
    this.ListtempsMess.push({
      idUser: this.profile?.id,
      Type: 'file',
      Content: fileLink.download,
    });
    this.moveCursorToEnd(target);
  }

  moveCursorToEnd(element: HTMLDivElement) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  goBack() {
    this._route.navigate(['admin/hotro']);
    this._ListHotroComponent.drawer.close();
  }
}
