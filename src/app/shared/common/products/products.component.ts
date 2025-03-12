import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  @Input() Heading:any
  @Input() Products:any[]=[
    {id:1,Title:'M1 Taza Group GLOSSY MTS SERUM',Mota:'Với 80mg HA/4ml giúp cấp ẩm sâu đa tầng, phục hồi da nám, mụn, lão hóa hiệu quả và duy trì lâu dài. Kết hợp Amino acid & Peptide, serum không chỉ trẻ hóa mà còn kéo dài hiệu quả vượt trội so với sản phẩm thông thường.',Image:'products/product.png',Slug:'',Ordering:1},
    {id:1,Title:'M2 Taza Group REJU FOCUS MTS SERUM',Mota:'Với 80mg HA/4ml giúp cấp ẩm sâu đa tầng, phục hồi da nám, mụn, lão hóa hiệu quả và duy trì lâu dài. Kết hợp Amino acid & Peptide, serum không chỉ trẻ hóa mà còn kéo dài hiệu quả vượt trội so với sản phẩm thông thường.',Image:'products/product.png',Slug:'',Ordering:1},
    {id:1,Title:'M3 Taza Group MELAX MTS SERUM',Mota:'Với 80mg HA/4ml giúp cấp ẩm sâu đa tầng, phục hồi da nám, mụn, lão hóa hiệu quả và duy trì lâu dài. Kết hợp Amino acid & Peptide, serum không chỉ trẻ hóa mà còn kéo dài hiệu quả vượt trội so với sản phẩm thông thường.',Image:'products/product.png',Slug:'',Ordering:1},
    {id:1,Title:'M4 Taza Group EXO POWDER',Mota:'Với 80mg HA/4ml giúp cấp ẩm sâu đa tầng, phục hồi da nám, mụn, lão hóa hiệu quả và duy trì lâu dài. Kết hợp Amino acid & Peptide, serum không chỉ trẻ hóa mà còn kéo dài hiệu quả vượt trội so với sản phẩm thông thường.',Image:'products/product.png',Slug:'',Ordering:1},
    {id:1,Title:'M5 Taza Group AQUA FOCUS MTS SERUM',Mota:'Với 80mg HA/4ml giúp cấp ẩm sâu đa tầng, phục hồi da nám, mụn, lão hóa hiệu quả và duy trì lâu dài. Kết hợp Amino acid & Peptide, serum không chỉ trẻ hóa mà còn kéo dài hiệu quả vượt trội so với sản phẩm thông thường.',Image:'products/product.png',Slug:'',Ordering:1},

  ]
}
