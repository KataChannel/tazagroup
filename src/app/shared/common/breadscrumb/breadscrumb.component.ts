import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadscrumb',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './breadscrumb.component.html',
  styleUrl: './breadscrumb.component.scss'
})
export class BreadscrumbComponent {
  @Input() Breadcrumbs:any[]= [];
  constructor() { 
    console.log('Breadcrumbs',this.Breadcrumbs);
  }
}
