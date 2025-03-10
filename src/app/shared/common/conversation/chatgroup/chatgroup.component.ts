import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatgroup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chatgroup.component.html',
  styleUrl: './chatgroup.component.scss'
})
export class ChatgroupComponent {
  groupName: string = '';
  searchQuery: string = '';
  selectedContact: any = null;
  selectedCategory: string = 'Tất cả';
  categories: string[] = ['Tất cả', 'Khách hàng', 'Gia đình', 'Công việc', 'Bạn bè', 'Zk Đẹp'];

  defaultAvatar: string = 'https://via.placeholder.com/40';
  contacts: any[] = [
    { name: 'Ba 79', avatar: 'https://via.placeholder.com/40' },
    { name: 'Nhật Sang', avatar: 'https://via.placeholder.com/40' },
    { name: 'Duyên Anh Sơn', avatar: 'https://via.placeholder.com/40' },
    { name: 'Corgi Iu', avatar: 'https://via.placeholder.com/40' },
    { name: 'Cằn', avatar: 'https://via.placeholder.com/40' },
    { name: '⊥hanhhải', avatar: 'https://via.placeholder.com/40' },
    { name: 'Ái Hán Kdata', avatar: 'https://via.placeholder.com/40' },
    { name: 'An An', avatar: 'https://via.placeholder.com/40' },
  ];
  filteredContacts: any[] = this.contacts;

  filterContacts() {
    this.filteredContacts = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    // Logic để lọc danh bạ theo category nếu cần
  }

  cancel() {
    console.log('Hủy tạo nhóm');
  }

  createGroup() {
    console.log('Tạo nhóm:', this.groupName, 'với liên hệ:', this.selectedContact);
  }

  closeModal() {
    console.log('Đóng modal');
  }
}
