export const ListDanhmuc:any[]=[
        {
          "id": "1a2b3c4d-1234-5678-9101-112131415161",
          "Title": "Danh mục 1",
          "Slug": "danh-muc-1",
          "CreatedAt": "2024-01-01T10:00:00Z"
        },
        {
          "id": "2b3c4d5e-2345-6789-1011-121314151617",
          "Title": "Danh mục 2",
          "Slug": "danh-muc-2",
          "CreatedAt": "2024-01-02T11:00:00Z"
        },
        {
          "id": "3c4d5e6f-3456-7891-0111-213141516171",
          "Title": "Danh mục 3",
          "Slug": "danh-muc-3",
          "CreatedAt": "2024-01-03T12:00:00Z"
        },
        {
          "id": "4d5e6f7g-4567-8910-1112-314151617181",
          "Title": "Danh mục 4",
          "Slug": "danh-muc-4",
          "CreatedAt": "2024-01-04T13:00:00Z"
        },
        {
          "id": "5e6f7g8h-5678-9101-1213-415161718191",
          "Title": "Danh mục 5",
          "Slug": "danh-muc-5",
          "CreatedAt": "2024-01-05T14:00:00Z"
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
            "Title": "Slug",
            "value": "Slug",
            "Type": "text",
            "required": true,
            "isShow": true
        },
        {
            "id": 3,
            "Title": "Ngày Tạo",
            "value": "createdAt",
            "Type": "date",
            "required": false,
            "isShow": true
        },
        {
            "id": 4,
            "Title": "Mô Tả",
            "value": "description",
            "Type": "textarea",
            "required": false,
            "isShow": true
        },
        {
            "id": 5,
            "Title": "Trạng Thái",
            "value": "status",
            "Type": "toggle",
            "required": true,
            "isShow": true
        }
    ];
    