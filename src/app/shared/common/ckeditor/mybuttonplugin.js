// mybuttonplugin.js
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class MyButtonPlugin extends Plugin {
    init() {
        const editor = this.editor;

        // Add the "mybutton" button to the editor UI.
        editor.ui.componentFactory.add('mybutton', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: 'My Button',
                withText: true,
                tooltip: true
            });

            // Define the button action.
            view.on('execute', () => {
                // Your custom behavior here.
                // For example, display an alert:
                alert('My custom button was clicked!');
                // Or execute an existing command:
                // editor.execute('bold');
            });

            return view;
        });
    }
}
