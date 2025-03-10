import { environment } from "../../../environments/environment.development";

export function GetImage(data:any) {
  if(data)
  {
  //  const checkdomain =  data?.toLowerCase().includes('hderma')
   const checkhttp =  data?.toLowerCase().includes('http')
   const result = checkhttp?data:`${environment.ImageURL+data}`
  //  const result = checkhttp?data:checkdomain?`${environment.ImageURL+data}`:`${environment.ImageURL+data}`
   return result
  }
  else {
    return environment.ImageURL+"assets/image/logo.svg";
  }

}

export function ConvertDriveData(data:any){
  const keys = data[0];
  const convertedData = data.slice(2).map((row:any) => {
    return row.reduce((acc:any, value:any, index:any) => {
      const key = keys[index];
      acc[key] = (value === "null" ? null : value);
      // acc[key] = key === "STT" ? parseInt(value, 10) : (value === "null" ? null : value);
      return acc;
    }, {});
  });
  return convertedData
}

export function ConvertDriveColumnName(data:any){
  const convertedData = data[0].reduce((acc:any, key:any, index:any) => {
    acc[key] = data[1][index];
    return acc;
  }, {});
  return convertedData
}



export function genMaDonhang(startNumber:any) {
  let code = startNumber.toString();
  while (code.length < 3) {
    code = "0" + code;
  }
  code = "TGO-AA" + code;
  startNumber++;
  return code;
}

export interface SearchParams {
  idChinhanh?: string;
  Dateranger?: {};
  SDT?: string;
  take?: number;
  skip?: number;
}
export const LIST_CHI_NHANH:any[] =
[
  {id:'268b7a06-d2c5-4c98-af1d-334144ae280f',BranchCode: 'Q_T',idtempdanhgia:'304742',idtemp:'301891',idtoken:'9e148d63-1716-4aa8-b760-ad3700393d4c',idVttech:3,Title:'Taza Skin Clinic Gò Vấp'},
  {id:'f54de1e1-66bd-4690-8015-ad7315d6f14e',BranchCode: 'PVD',idtempdanhgia:'304997',idtemp:'302261',idtoken:'22ddea78-f244-4dea-838a-c4c5d8e40a16',idVttech:1,Title:'Taza Skin Clinic Thủ Đức'},
  {id:'ca725bf4-4810-4ea2-8ef2-520b2a3121cc',BranchCode: 'C_T',idtempdanhgia:'304942',idtemp:'302259',idtoken:'e4d7426e-53df-4285-be74-aba10259e188',idVttech:2,Title:'Taza Skin Clinic Quận 10'},
  {id:'e173b1c0-fbdb-4eeb-a00c-b56664068515',BranchCode: 'NHH',idtempdanhgia:'305001',idtemp:'303760',idtoken:'d046cec3-ea49-4117-9a1c-f67959406443',idVttech:4,Title:'Taza Skin Clinic Nha Trang'},
  {id:'9887ad61-4b2c-4db1-83e6-570f33cb540a',BranchCode: 'H_V',idtempdanhgia:'304998',idtemp:'302281',idtoken:'b3b61395-1760-49ae-b5e7-70c310c1c2fb',idVttech:6,Title:'Taza Skin Clinic Đà Nẵng'},
  {id:'ca725bf4-4810-4ea2-8ef2-520b2a3121cc',BranchCode: 'VPC',idtempdanhgia:'304942',idtemp:'302259',idtoken:'e4d7426e-53df-4285-be74-aba10259e188',idVttech:7,Title:'Văn Phòng'},
  {id:'',idtemp:'',idtoken:'',idVttech:14,Title:'Timona Academy Quận 10'},
  {id:'',idtemp:'',idtoken:'',idVttech:15,Title:'Timona Academy Thủ Đức'},
  {id:'',idtemp:'',idtoken:'',idVttech:16,Title:'Timona Academy Gò Vấp'},
  {id:'',idtemp:'',idtoken:'',idVttech:17,Title:'Timona Academy Nha Trang'},
  {id:'',idtemp:'',idtoken:'',idVttech:18,Title:'Timona Academy Đà Nẵng'},
  {id:'',idtemp:'',idtoken:'',idVttech:19,Title:'HR Tazagroup'},
  {id:'',idtemp:'',idtoken:'',idVttech:20,Title:'Timona Academy Hà Nội'},
  {id:'',idtemp:'',idtoken:'',idVttech:21,Title:'Building Timona CMT8'},
]

export const ListTrangthailichhen: any[] = [
    {id:0,Title:"Chờ Xác Nhận",Class:"text-yellow-400"},
    {id:1,Title:"Đã Đặt Lịch",Class:"text-blue-400"},
    {id:2,Title:"Đã Đến",Class:"text-green-400"},
    {id:3,Title:"Đang Tham Khám",Class:"text-blue-400"},
    {id:4,Title:"Đang Tư Vấn",Class:"text-blue-400"},
    {id:5,Title:"Đang Lên phòng dịch vụ",Class:"text-blue-400"}
  ]
export const ListHinhthucthanhtoan: any[] = [
    {id:"MOMO",Title:"MOMO",  Class:"text-white bg-[#A52167]"},
    {id:"COD",Title:"Tiền Mặt",    Class:"text-white bg-[#439c30]"},
    {id:"BANK",Title:"Chuyển Khoản",  Class:"text-white bg-[#ED860A]"},
  ]
export const ListTrangThaiDonhang: any[] = [
    {id:0,Title:"Đơn Mới",    Class:"text-white bg-[#44C8F5]"},
    {id:1,Title:"Xác Nhận",   Class:"text-white bg-[#ED860A]"},
    {id:2,Title:"Đang xử lý", Class:"text-white bg-[#632B85]"},
    {id:3,Title:"Đang Giao",  Class:"text-white bg-[#FBCD18]"},
    {id:4,Title:"Hoàn Thành", Class:"text-white bg-[#32A649]"},
    {id:5,Title:"Huỷ",        Class:"text-white bg-[#E1232A]"}
  ]
export const ListRole: any[] =[
  {id:'admin',value:'Admin'},
  {id:'manager',value:'Quản Lý'},
  {id:'user',value:'Nhân Viên'},
  {id:'customer',value:'Khách Hàng'},
  {id:'nhanvienkho',value:'Nhân Viên Kho'},
  {id:'nhanvienbanhang',value:'Nhân Viên Bán Hàng'},
  {id:'nhanvienketoan',value:'Nhân Viên Kế Toán'},
]

export const ListNotifyType: any ={
  success:'check_circle',
  danger:'dangerous',
  warning:'warning',
  info:'info'
}
  export const TYPE_TEMPLATE: any = {
      user_received_message: "Sự kiện người dùng nhận thông báo ZNS",
      change_template_quota: "Thông báo thay đổi quota mẫu ZNS rủi ro",
      change_template_quality: "Thông báo thay đổi về chất lượng gửi của mẫu tin ZNS",
      change_oa_template_tags: "Thông báo thay đổi về loại nội dung ZNS có thể gửi",
      change_oa_daily_quota: "Thông báo về thay đổi hạn mức gửi ZNS",
      user_feedback: "Sự kiện người dùng phản hồi template đánh giá dịch vụ",
    }

export function Trangthai_Lichhen(item: any) {
  const ListType: any[] = [
    {id:0,Title:"Chờ Xác Nhận",Class:"text-yellow-400"},
    {id:1,Title:"Đã Đặt Lịch",Class:"text-blue-400"},
    {id:2,Title:"Đã Đến",Class:"text-green-400"},
    {id:3,Title:"Đang Tham Khám",Class:"text-blue-400"},
    {id:4,Title:"Đang Tư Vấn",Class:"text-blue-400"},
    {id:5,Title:"Đang Lên phòng dịch vụ",Class:"text-blue-400"},
  ]

  return ListType.find((v:any)=>v.id==item)
}
export function TYPE_ZNS(item: any) {
  const ListType: any = {
    user_received_message: "Sự kiện người dùng nhận thông báo ZNS",
    change_template_quota: "Thông báo thay đổi quota mẫu ZNS rủi ro",
    change_template_quality: "Thông báo thay đổi về chất lượng gửi của mẫu tin ZNS",
    change_oa_template_tags: "Thông báo thay đổi về loại nội dung ZNS có thể gửi",
    change_oa_daily_quota: "Thông báo về thay đổi hạn mức gửi ZNS",
    user_feedback: "Sự kiện người dùng phản hồi template đánh giá dịch vụ",
  }
  return ListType[item]
}
export function ZALO_OA(item: any) {
  const ListType: any = {
    "3605866963832105989": "Taza Skin Clinic Quận 10",
    "4353626177205058888": "Taza Skin Clinic Gò Vấp",
  }
  return ListType[item]
}
export function CHI_NHANH(item: any) {
  const ListType: any = {
    "268b7a06-d2c5-4c98-af1d-334144ae280f": "Gò Vấp",
    "f54de1e1-66bd-4690-8015-ad7315d6f14e": "Thủ Đức",
    "ca725bf4-4810-4ea2-8ef2-520b2a3121cc": "Quận 10",
    "e173b1c0-fbdb-4eeb-a00c-b56664068515": "Nha Trang",
    "9887ad61-4b2c-4db1-83e6-570f33cb540a": "Đà Nẵng",
    "d516ed9c-5453-4c1e-9c05-40de3cd0e7b1": "Bình Thạnh"
  }
  return ListType[item]
}
export function convertPhoneNum(phoneNumber: any) {
  if (phoneNumber.startsWith("0")) {
    return phoneNumber.replace(/^0/, "84");
  } else if (phoneNumber.length === 10) {
    return `84${phoneNumber}`;
  } else {
    throw new Error("Invalid phone number format");
  }
}
export function Phone_To_0(phoneNumber: any) {
  if (phoneNumber.startsWith("84")) {
    return "0" + phoneNumber.slice(2);
  } else {
    return phoneNumber;
  }
}
export function nest(items: any[], id: any = '', link: any = 'pid'): any {
  if (items) {
    return items.filter((item) => item[link] === id)
      .map((item) => ({
        ...item,
        children: nest(items, item.id),
      }));
  };
}

export function getInitials(name: any): any {
  const words = name.split(' ');
  const initials = words.map((word: any) => word[0].toUpperCase()).join('');
  return initials;
}
export function convertToSlug(str: any): any {
  return str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[àáảạãâầấẩậẫăằắẳặẵ]/g, 'a')
    .replace(/[èéẻẹẽêềếểệễ]/g, 'e')
    .replace(/[ìíỉịĩ]/g, 'i')
    .replace(/[òóỏọõôồốổộỗơờớởợỡ]/g, 'o')
    .replace(/[ùúủụũưừứửựữ]/g, 'u')
    .replace(/[ỳýỷỵỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9-]/g, '');
}
export function GenId(length: number, onlynumber: boolean = true) {
  let result = '';
  let characters = ''
  if (onlynumber) {
    characters = '0123456789';
  }
  else {
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  }

  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
export function mergeNoDup(arr1: any, arr2: any, key: any) {
  const mergedArray = arr1.concat(arr2);
  const uniqueItems = mergedArray.reduce((acc: any, item: any) => {
    if (!acc[item[key]]) {
      acc[item[key]] = item;
    }
    return acc;
  }, {});
  return Object.values(uniqueItems);
}

export function groupAndCreateChild(data: any[], byField: string, childrenField: string) {
    return Object.values(
      data.reduce((acc: any, curr: any) => {        
        const groupValue = curr[byField];
        const { [byField]: _,Receiver,Sender,Type, ...rest } = curr;  
        if (!acc[groupValue]) {
          acc[groupValue] = {
            [byField]: groupValue,
            [childrenField]: [],
             ...Receiver ? {Receiver} : {},
             ...Sender ? {Sender} : {},
             ...Type ? {Type} : {},
          };
        }
  
        acc[groupValue][childrenField].push(rest);
        return acc;
      }, {})
    );
  }

export function dateVNPAY(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
export function sortObject(obj: Record<string, any>): Record<string, string> {
  let sorted: Record<string, string> = {};
  let str: string[] = [];
  let key: any;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}
export function groupBy(data: any) {
  if (data) {
    return Object.values(data.reduce((result: any, currentItem: any) => {
      const group = currentItem.Nhom;
      if (!result[group]) {
        result[group] = { Nhom: group, items: [] };
      }
      result[group].items.push({ id: currentItem.id, Cauhoi: currentItem.Cauhoi, Dapan: currentItem.Dapan });
      return result;
    }, {}));
  }
  else return null
};

export function groupByfield(data: any[]):any[] {
  const convertedData: any = {};
  data.forEach((item: any) => {
    const nhomId = item.idSP;
    if (!convertedData[nhomId]) {
      convertedData[nhomId] = {
        idSP: item.idSP,
        children: [],
      };
    }
    const { idSP, ...transitem } = item;
    convertedData[nhomId]?.children.push(transitem);
  });
  return Object.values(convertedData);
};
export function groupByCustomfield(data: any[],field:any):any[] {
  const convertedData: any = {};
  data.forEach((item: any) => {
    const nhomId = item[field];
    if (!convertedData[nhomId]) {
      convertedData[nhomId] = {
        [field]: item[field],
        children: [],
      };
    }
    const { idSP, ...transitem } = item;
    convertedData[nhomId]?.children.push(transitem);
  });
  return Object.values(convertedData);
};

export function flattenData(data:any) {
    const flattenedData:any[] = [];
    data.forEach((item:any) => {
      flattenedData.push(item);
      if (item?.children) {
        flattenedData.push(...flattenData(item?.children));
      }
    });
    return flattenedData;
};




function readGroup(group:any) {
  const readDigit = ["Không", "Một", "Hai", "Ba", "Bốn", "Năm", "Sáu", "Bảy", "Tám", "Chín"];
  let temp = "";
  // Handle cases where the group is all zeros or has a trailing zero
  if (group === "000" || group.endsWith("0")) {
    return "";
  }

  temp += readDigit[parseInt(group.substring(0, 1))] + " Trăm";

  // Handle cases where the tens and units digits are zero
  if (group.substring(1, 2) === "0" && group.substring(2, 3) === "0") {
    return temp;
  }

  // Handle cases where the tens digit is "0" but the units digit is not
  if (group.substring(1, 2) === "0") {
    temp += " Lẻ" + readDigit[parseInt(group.substring(2, 3))];
    return temp;
  }

  temp += readDigit[parseInt(group.substring(1, 2))] + " Mươi";

  // Handle cases where the units digit is "5"
  if (group.substring(2, 3) === "5") {
    temp += " Lăm";
  } else if (group.substring(2, 3) !== "0") {
    temp += readDigit[parseInt(group.substring(2, 3))];
  }

  return temp;
}
export function readMoney(num:any) {
  if (num === null || num === "") {
    return "";
  }

  let temp = "";

  // Pad leading zeros to ensure consistent length
  while (num.length < 18) {
    num = "0" + num;
  }

  const groups = [
    num.substring(0, 3),
    num.substring(3, 6),
    num.substring(6, 9),
    num.substring(9, 12),
    num.substring(12, 15),
    num.substring(15, 18)
  ];

  // Iterate through groups in reverse order (largest to smallest)
  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i];

    // Only add non-zero groups
    if (group !== "000") {
      temp += readGroup(group);

      // Add appropriate unit (triệu, tỷ, nghìn) based on group position
      if (i === 0) {
        temp += " đồng chẵn";
      } else if (i === 1 || i === 4) {
        temp += " Nghìn";
      } else if (i === 2 || i === 3) {
        temp += " Triệu";
      } else { // i === 5
        temp += " Tỷ";
      }
    }
  }

  // Remove redundant spaces and capitalization
  temp = temp.trim();
  temp = temp.replace(/\s+/g, " "); // Replace multiple spaces with single spaces
  temp = temp.replace(/\b[a-z]/g, (char) => char.toUpperCase()); // Capitalize first letter of each word

  // Handle specific edge cases
  temp = temp.replace("Một Mươi", "Mười");
  temp = temp.replace("Không Trăm", "");
  temp = temp.replace("Mười Không", "Mười");
  temp = temp.replace("Mươi Một", "Mười Mốt");

  return temp;
}