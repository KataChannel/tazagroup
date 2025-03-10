import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';

@Component({
  selector: 'app-tiptap',
  imports: [],
  templateUrl: './tiptap.component.html',
  styleUrl: './tiptap.component.scss',
})
export class TiptapComponent {
  editor!: Editor;

  @Input() content: string = ''; // Nhận nội dung từ cha
  @Output() contentChange = new EventEmitter<string>(); // Trả nội dung ra ngoài

  ngOnInit(): void {
    this.editor = new Editor({
      content: this.content, // Nội dung ban đầu
      extensions: [
        StarterKit,
        Placeholder.configure({ placeholder: 'Nhập nội dung...' }),
        Bold,
        Italic,
        Underline,
      ],
      editorProps: {
        attributes: {
          class: 'p-2 focus:border-none border-black border-t-2 outline-none',
          spellcheck: 'false',
        },
      },
      onUpdate: ({ editor }) => {
        this.contentChange.emit(editor.getHTML()); // Phát sự kiện khi nội dung thay đổi
      }
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
