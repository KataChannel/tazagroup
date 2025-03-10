import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notfound',
  imports: [],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.scss'
})
export class NotfoundComponent {
  constructor(
    private route: ActivatedRoute
  ) { }
  message:any={};
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params['data'])
      {
        this.message = JSON.parse(params['data']);
      }

    });
  }
}
