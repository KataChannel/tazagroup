import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import AlertBlock from './alert-block';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  standalone: true,
  selector: 'app-editorjs',
  templateUrl: './editorjs.component.html',
  styleUrls: ['./editorjs.component.scss']
})
export class EditorjsComponent implements OnInit, AfterViewInit, OnDestroy {
  // Reference to the DOM element that will host the editor.
  @ViewChild('editorHolder', { static: true }) editorHolder!: ElementRef;
  @Input() Detail:any;
  @Output() onEditorChange = new EventEmitter<any>();
  private editor!: EditorJS;

  constructor() { }

  ngOnInit(): void {
    // Initialization logic (if needed) goes here.
  }

  ngAfterViewInit(): void {
    // Initialize Editor.js after the view is rendered.
    this.editor = new EditorJS({
      holder: this.editorHolder.nativeElement,
      placeholder: 'Nhập nội dung...',
      autofocus: true,
      data: this.Detail,
      tools: {
        image: {
          class: ImageTool,
          config: {
            // Nếu bạn cần upload lên server, định nghĩa uploader ở đây
            // Ví dụ:
            // uploader: {
            //   uploadByFile(file) { ... },
            //   uploadByUrl(url) { ... }
            // }
          }
        },
        alert: 
        {
          class: AlertBlock as any,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+A'
        }
        // Add other tools as needed.
      },
      onReady: () => {
        console.log('Editor.js is ready to work!');
      },
      onChange: (api, event) => {
        console.log('Editor.js content changed!', api, event);
      }
    });
    this.listenForKeyPress();
  }
  listenForKeyPress() {
    const editorElement = this.editorHolder.nativeElement;
    editorElement.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Ngăn xuống dòng mặc định
        this.myCustomFunction();
      }
    });
  }
  myCustomFunction()
  {
    this.editor.clear();
    this.editor.focus();

    console.log('My custom function is called!');
  }
  // Method to save the content (for example, when a button is clicked).
  async saveContent() {
    try {
      const outputData = await this.editor.save();
      console.log('Saved content:', outputData);
      this.onEditorChange.emit(outputData);
    } catch (error) {
      console.error('Saving failed: ', error);
    }
  }

  ngOnDestroy(): void {
    // Always destroy the editor instance to free up resources.
    if (this.editor) {
      this.editor.destroy();
    }
  }
}
