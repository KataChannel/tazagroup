import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contactform',
  imports: [],
  templateUrl: './contactform.component.html',
  styleUrl: './contactform.component.scss'
})
export class ContactformComponent {
  @Input() Heading:any
}
