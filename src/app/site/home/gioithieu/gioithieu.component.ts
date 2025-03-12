import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-gioithieu',
  imports: [],
  templateUrl: './gioithieu.component.html',
  styleUrl: './gioithieu.component.scss'
})
export class GioithieuComponent {
  @Input() Heading:any
  Detail:any={
    Title:"GIỚI THIỆU",
    Content:"<p><span>H.Derma &ndash; Độc quyền mang Taza Group, thương hiệu nội địa H&agrave;n Quốc, đến Việt Nam<br><br>H.Derma tự h&agrave;o ph&acirc;n phối độc quyền Taza Group &ndash; thương hiệu mỹ phẩm nội địa H&agrave;n Quốc, được tin d&ugrave;ng tại c&aacute;c bệnh viện v&agrave; thẩm mỹ viện h&agrave;ng đầu. Ph&aacute;t triển dựa tr&ecirc;n nghi&ecirc;n cứu chuy&ecirc;n s&acirc;u từ c&aacute;c chuy&ecirc;n gia da liễu, Taza Group kh&ocirc;ng chỉ đ&aacute;p ứng ti&ecirc;u chuẩn khắt khe của xứ sở l&agrave;m đẹp m&agrave; c&ograve;n đặc biệt ph&ugrave; hợp với l&agrave;n da Việt Nam.</span></p><p><span><br>Kh&aacute;m ph&aacute; ngay để cảm nhận sự kh&aacute;c biệt v&agrave; hiệu quả vượt trội!<br></span><span>XEM TH&Ecirc;M</span></p>",
    Image:"gioithieu/gioithieu.png",
    Video:"https://www.youtube.com/watch?v=RyNEwlb57ZY&t=73s"
  }
}
