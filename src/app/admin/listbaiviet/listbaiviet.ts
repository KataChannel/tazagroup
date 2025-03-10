export const ListBaiviet:any[]=
[
    {
      "id": "1a2b3c4d-1234-5678-9101-112131415161",
      "Title": "Bài viết 1",
      "Slug": "bai-viet-1",
      "content": "Nội dung của bài viết 1.",
      "author": "Nguyễn Văn A",
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-02T08:00:00Z",
      "category": "Công Nghệ",
      "tags": ["Công nghệ", "AI", "Phát triển phần mềm"],
      "status": "published",
      "thumbnail": "https://example.com/images/bai-viet-1.jpg"
    },
    {
      "id": "2b3c4d5e-2345-6789-1011-121314151617",
      "Title": "Bài viết 2",
      "Slug": "bai-viet-2",
      "content": "Nội dung của bài viết 2.",
      "author": "Trần Thị B",
      "createdAt": "2024-01-02T11:00:00Z",
      "updatedAt": "2024-01-03T09:00:00Z",
      "category": "Giáo Dục",
      "tags": ["Học tập", "Kỹ năng mềm"],
      "status": "draft",
      "thumbnail": "https://example.com/images/bai-viet-2.jpg"
    },
    {
      "id": "3c4d5e6f-3456-7891-0111-213141516171",
      "Title": "Bài viết 3",
      "Slug": "bai-viet-3",
      "content": "Nội dung của bài viết 3.",
      "author": "Lê Văn C",
      "createdAt": "2024-01-03T12:00:00Z",
      "updatedAt": "2024-01-04T10:00:00Z",
      "category": "Giải Trí",
      "tags": ["Âm nhạc", "Phim ảnh"],
      "status": "published",
      "thumbnail": "https://example.com/images/bai-viet-3.jpg"
    }
  ]  
  export const Forms = [
    {
        "id": 1,
        "Title": "Tiêu Đề",
        "value": "Title",
        "Type": "text",
        "required": true,
        "isShow": true
    },
    {
        "id": 2,
        "Title": "Tác Giả",
        "value": "author",
        "Type": "text",
        "required": true,
        "isShow": true
    },
    {
        "id": 3,
        "Title": "Danh Mục",
        "value": "category",
        "Type": "select",
        "required": true,
        "isShow": true
    },
    {
        "id": 4,
        "Title": "Ngày Tạo",
        "value": "createdAt",
        "Type": "date",
        "required": true,
        "isShow": true
    },
    {
        "id": 5,
        "Title": "Trạng Thái",
        "value": "status",
        "Type": "select",
        "required": true,
        "isShow": true
    },
    {
        "id": 6,
        "Title": "Nội Dung",
        "value": "content",
        "Type": "editor",
        "required": true,
        "isShow": false
    },
    {
        "id": 7,
        "Title": "Ảnh Đại Diện",
        "value": "thumbnail",
        "Type": "file",
        "required": false,
        "isShow": true
    }
];
