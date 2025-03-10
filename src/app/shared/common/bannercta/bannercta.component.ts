import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bannercta',
  imports: [],
  templateUrl: './bannercta.component.html',
  styleUrl: './bannercta.component.scss'
})
export class BannerctaComponent {
  @Input() Heading:any
}
