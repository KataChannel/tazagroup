import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class SocialComponent implements OnInit {
  socialLinks: { platform: string; url: string }[] = [];
  newSocialPlatform: string = '';
  availablePlatforms: string[] = ['Facebook', 'Twitter', 'LinkedIn', 'Instagram', 'YouTube'];

  constructor() { }

  ngOnInit() {
    // Initialize with some default social links if needed
    this.socialLinks = [
      { platform: 'Facebook', url: '' },
      { platform: 'Twitter', url: '' }
    ];
  }

  addSocialLink() {
    if (this.newSocialPlatform) {
      this.socialLinks.push({ platform: this.newSocialPlatform, url: '' });
      this.newSocialPlatform = '';
    }
  }

  removeSocialLink(index: number) {
    this.socialLinks.splice(index, 1);
  }

  saveSocialLinks() {
    // Implement the logic to save social links
    console.log('Saving social links:', this.socialLinks);
  }
}
