// custom-editor.js
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import MyButtonPlugin from './mybuttonplugin'; // Adjust the path as needed

export default class ClassicEditor extends ClassicEditorBase {}

// Specify the plugins to include in your build.
ClassicEditor.builtinPlugins = [
    Essentials,
    Bold,
    Italic,
    MyButtonPlugin  // <-- include your custom plugin here.
];

// Define default configuration (toolbar, language, etc.).
ClassicEditor.defaultConfig = {
    toolbar: {
        items: [
            'mybutton', 'bold', 'italic'
        ]
    },
    language: 'en'
};
