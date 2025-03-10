import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { Bold, Essentials, Italic, Mention, Paragraph, Undo, InlineEditor, Image, Table, ImageUpload, LinkImage, MediaEmbed,Clipboard, Underline, SourceEditing, Markdown, ClassicEditor, ImageResize, CodeBlock, List, FullPage, Heading, BlockQuote, ImageTextAlternative, CKBoxImageEdit, PictureEditing, ImageCaption, Alignment } from 'ckeditor5';
import { MyUploadAdapter } from "./uploadadapter";
import { UploadService } from "../../uploadfile/uploadfile.service";
@Component({
  selector: 'app-ckeditor',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    CKEditorModule
  ],
  templateUrl: './ckeditor.component.html',
  styleUrl: './ckeditor.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CkeditorComponent {
    @Input() Detail: any = 'Vui lòng nhập nội dung';
    @Input() toolbar:any[]= [];  
    @Output() contentChange = new EventEmitter<any>();
    constructor(private _UploadService: UploadService) { 
      console.log(this.toolbar);
      this.config.toolbar = this.toolbar.length > 0 ? this.toolbar : this.config.toolbar;
    }
    public Editor = ClassicEditor;   
    public config:any ={  
      // extraAllowedContent: 'iframe[*];',
      toolbar: [
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
        'insertImage',
        'mediaEmbed',
        'toggleImageCaption',
        'imageTextAlternative',
          ],
      plugins: [
        Alignment,List,Heading,BlockQuote,ImageTextAlternative,ImageCaption,
         Bold, Essentials, Italic,Underline, Mention, Paragraph, Undo, Image, 
         Table,MediaEmbed,LinkImage,ImageUpload,Clipboard,
         SourceEditing,ImageResize,CodeBlock
     ],
      // extraPlugins: [CustomButtonPlugin]
      // licenseKey: 'M2IzZUd3ZDJhTGZhZDN4ejJaSnBTa2k5UlpWVURway9KQStTNCtuZSsvQWtMakpzelIzMzBMQVBHMndka3c9PS1NakF5TkRFeE1UTT0=',
      // mention: {
      //     Mention configuration
      // }
    }
    onReady(editor: any) {
       console.log(editor);
        editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
          const result =  new MyUploadAdapter(loader,'local', this._UploadService);
          console.log(result);
          return result;
        };

        editor.editing.view.document.on('keydown', (event: any, data: any) => {
          console.log(data);
          
          if (data.ctrlKey && data.keyCode === 13) {
            // Ctrl + End -> keyCode 35
            this.SendFuncion(editor);
            data.preventDefault(); // Ngăn chặn hành vi mặc định
          }
        });
    }
    SendFuncion(editor:any) {
      console.log('Ctrl + End được nhấn!');
      console.log(editor.getData());
    }
    onChange(event: any) {
       this.contentChange.emit(event.editor.getData());
        // editor.model.document.on('change:data', () => {
        //     this.contentChange.emit(editor.getData());
        // });
    }
}
