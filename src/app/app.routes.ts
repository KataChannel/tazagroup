import { Routes,Router } from '@angular/router';
import { DynamicComponentResolver } from './dynamic-component.resolver';
import { AuthGuard } from './shared/common/users/guards/auth.guard';
import { GuestGuard } from './shared/common/users/guards/guest.guard';
import { PermissionGuard } from './shared/common/users/guards/permission.guard';
export const routes: Routes = [
    { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
    {
      path: '404',
      loadComponent: () => import('./site/notfound/notfound.component').then((c) => c.NotfoundComponent),
    },
    {
      path: 'admin',
      canActivate: [AuthGuard],
      loadComponent: () => import('./admin/adminmain/adminmain.component').then((c) => c.AdminmainComponent),
      children: [
        {
          path: 'dashboard',
          loadComponent: () => import('./admin/dashboard/dashboard.component').then((c) => c.DashboardComponent),
        },
        {
          path: 'menu',
          canActivate: [PermissionGuard],
          data: { permission: 'menu.view' },
          loadComponent: () => import('./admin/menu/menu/listmenu/listmenu.component').then((c) => c.ListMenuComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/menu/menu/listmenu/listmenu.component').then((c) => c.ListMenuComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/menu/menu/detailmenu/detailmenu.component').then((c) => c.DetailMenuComponent),
            },
          ],
        },
        {
          path: 'hotro',
          loadComponent: () => import('./admin/hotro/listhotro/listhotro.component').then((c) => c.ListHotroComponent),
          children: [
            {
              path: ':id',
              loadComponent: () => import('./admin/hotro/listhotro/detailhotro/detailhotro.component').then((c) => c.DetailHotroComponent),
            },
          ],
        },
        {
          path: 'nhomuser',
          canActivate: [PermissionGuard],
          data: { permission: 'nhomuser.view' },
          loadComponent: () => import('./admin/role/listrole/listrole.component').then((c) => c.ListRoleComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/role/listrole/listrole.component').then((c) => c.ListRoleComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/role/detailrole/detailrole.component').then((c) => c.DetailRoleComponent),
            },
          ],
        },
        {
          path: 'permission',
          canActivate: [PermissionGuard],
          data: { permission: 'permission.view' },
          loadComponent: () => import('./admin/permission/listpermission/listpermission.component').then((c) => c.ListPermissionComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/permission/listpermission/listpermission.component').then((c) => c.ListPermissionComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/permission/detailpermission/detailpermission.component').then((c) => c.DetailPermissionComponent),
            },
          ],
        },
        {
          path: 'danhmuc',
          loadComponent: () => import('./admin/listdanhmuc/listdanhmuc.component').then((c) => c.ListdanhmucComponent),
          children: [
            {
              path: ':id',
              loadComponent: () => import('./admin/listdanhmuc/detaildanhmuc/detaildanhmuc.component').then((c) => c.DetailDanhmucComponent),
            },
          ],
        },
        {
          path: 'baiviet',
          loadComponent: () => import('./admin/listbaiviet/listbaiviet.component').then((c) => c.ListbaivietComponent),
          children: [
            {
              path: ':id',
              loadComponent: () => import('./admin/listbaiviet/detailbaiviet/detailbaiviet.component').then((c) => c.DetailBaivietComponent),
            },
          ],
        },
        {
          path: 'goooglesheets',
          loadComponent: () => import('./shared/googlesheets/googlesheets.component').then((c) => c.GooglesheetsComponent),
        },
        {
          path: 'sanpham',
          canActivate: [PermissionGuard],
          data: { permission: 'sanpham.view' },
          loadComponent: () => import('./admin/sanpham/listsanpham/listsanpham.component').then((c) => c.ListSanphamComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/sanpham/listsanpham/listsanpham.component').then((c) => c.ListSanphamComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/sanpham/detailsanpham/detailsanpham.component').then((c) => c.DetailSanphamComponent),
            },
          ],
        },
        {
          path: 'banggia',
          canActivate: [PermissionGuard],
          data: { permission: 'banggia.view' },
          loadComponent: () => import('./admin/banggia/listbanggia/listbanggia.component').then((c) => c.ListBanggiaComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/banggia/listbanggia/listbanggia.component').then((c) => c.ListBanggiaComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/banggia/detailbanggia/detailbanggia.component').then((c) => c.DetailBanggiaComponent),
            },
          ],
        },
        {
          path: 'khachhang',
          canActivate: [PermissionGuard],
          data: { permission: 'khachhang.view' },
          loadComponent: () => import('./admin/khachhang/listkhachhang/listkhachhang.component').then((c) => c.ListKhachhangComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/khachhang/listkhachhang/listkhachhang.component').then((c) => c.ListKhachhangComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/khachhang/detailkhachhang/detailkhachhang.component').then((c) => c.DetailKhachhangComponent),
            },
          ],
        },
        {
          path: 'nhomkhachhang',
          canActivate: [PermissionGuard],
          data: { permission: 'nhomkhachhang.view' },
          loadComponent: () => import('./admin/nhomkhachhang/listnhomkhachhang/listnhomkhachhang.component').then((c) => c.ListNhomkhachhangComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/nhomkhachhang/listnhomkhachhang/listnhomkhachhang.component').then((c) => c.ListNhomkhachhangComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/nhomkhachhang/detailnhomkhachhang/detailnhomkhachhang.component').then((c) => c.DetailNhomkhachhangComponent),
            },
          ],
        },
        {
          path: 'nhacungcap',
          canActivate: [PermissionGuard],
          data: { permission: 'nhacungcap.view' },
          loadComponent: () => import('./admin/nhacungcap/listnhacungcap/listnhacungcap.component').then((c) => c.ListNhacungcapComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/nhacungcap/listnhacungcap/listnhacungcap.component').then((c) => c.ListNhacungcapComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/nhacungcap/detailnhacungcap/detailnhacungcap.component').then((c) => c.DetailNhacungcapComponent),
            },
          ],
        },
        {
          path: 'dathang',
          canActivate: [PermissionGuard],
          data: { permission: 'dathang.view' },
          loadComponent: () => import('./admin/dathang/listdathang/listdathang.component').then((c) => c.ListDathangComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/dathang/listdathang/listdathang.component').then((c) => c.ListDathangComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/dathang/detaildathang/detaildathang.component').then((c) => c.DetailDathangComponent),
            },
          ],
        },
        {
          path: 'donhang',
          canActivate: [PermissionGuard],
          data: { permission: 'donhang.view' },
          loadComponent: () => import('./admin/donhang/listdonhang/listdonhang.component').then((c) => c.ListDonhangComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/donhang/listdonhang/listdonhang.component').then((c) => c.ListDonhangComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/donhang/detaildonhang/detaildonhang.component').then((c) => c.DetailDonhangComponent),
            },
          ],
        },
        {
          path: 'vandon',
          canActivate: [PermissionGuard],
          data: { permission: 'vandon.view' },
          loadComponent: () => import('./admin/donhang/vandon/vandon.component').then((c) => c.VandonComponent),
        },
        {
          path: 'kho',
          loadComponent: () => import('./admin/kho/listkho/listkho.component').then((c) => c.ListKhoComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/kho/listkho/listkho.component').then((c) => c.ListKhoComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/kho/detailkho/detailkho.component').then((c) => c.DetailKhoComponent),
            },
          ],
        },
        {
          path: 'phieugiaohang',
          canActivate: [PermissionGuard],
          data: { permission: 'phieugiaohang.view' },
          loadComponent: () => import('./admin/phieugiaohang/listphieugiaohang/listphieugiaohang.component').then((c) => c.ListPhieugiaohangComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/phieugiaohang/listphieugiaohang/listphieugiaohang.component').then((c) => c.ListPhieugiaohangComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/phieugiaohang/detailphieugiaohang/detailphieugiaohang.component').then((c) => c.DetailPhieugiaohangComponent),
            },
          ],
        },
        {
          path: 'phieuchiahang',
          canActivate: [PermissionGuard],
          data: { permission: 'phieuchiahang.view' },
          loadComponent: () => import('./admin/phieuchiahang/listphieuchiahang/listphieuchiahang.component').then((c) => c.ListPhieuchiahangComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/phieuchiahang/listphieuchiahang/listphieuchiahang.component').then((c) => c.ListPhieuchiahangComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/phieuchiahang/detailphieuchiahang/detailphieuchiahang.component').then((c) => c.DetailPhieuchiahangComponent),
            },
          ],
        },
        {
          path: 'phieukho',
          canActivate: [PermissionGuard],
          data: { permission: 'phieukho.view' },
          loadComponent: () => import('./admin/phieukho/listphieukho/listphieukho.component').then((c) => c.ListPhieukhoComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/phieukho/listphieukho/listphieukho.component').then((c) => c.ListPhieukhoComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/phieukho/detailphieukho/detailphieukho.component').then((c) => c.DetailPhieukhoComponent),
            },
          ],
        },
        {
          path: 'xuatnhapton',
          canActivate: [PermissionGuard],
          data: { permission: 'xuatnhapton.view' },
          loadComponent: () => import('./admin/xuatnhapton/xuatnhapton.component').then((c) => c.XuatnhaptonComponent),
        },
        {
          path: 'congnokhachhang',
          canActivate: [PermissionGuard],
          data: { permission: 'congnokhachhang.view' },
          loadComponent: () => import('./admin/congnokhachhang/listcongnokhachhang/listcongnokhachhang.component').then((c) => c.ListcongnokhachhangComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/congnokhachhang/listcongnokhachhang/listcongnokhachhang.component').then((c) => c.ListcongnokhachhangComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/congnokhachhang/detailcongnokhachhang/detailcongnokhachhang.component').then((c) => c.DetailCongnokhachhangComponent),
            },
          ],
        },
        {
          path: 'congnoncc',
          canActivate: [PermissionGuard],
          data: { permission: 'congnoncc.view' },
          loadComponent: () => import('./admin/congnoncc/congnoncc.component').then((c) => c.CongnonccComponent),
        },
        {
          path: 'user',
          canActivate: [PermissionGuard],
          data: { permission: 'user.view' },
          loadComponent: () => import('./admin/user/listuser/listuser.component').then((c) => c.ListUserComponent),
          children: [
            {
              path: '',
              loadComponent: () => import('./admin/user/listuser/listuser.component').then((c) => c.ListUserComponent),
            },
            {
              path: ':id',
              loadComponent: () => import('./admin/user/detailuser/detailuser.component').then((c) => c.DetailUserComponent),
            },
          ],
        },
        {
          path: 'quanlyfile',
          canActivate: [PermissionGuard],
          data: { permission: 'quanlyfile.view' },
          loadComponent: () => import('./admin/listquanlyfile/listquanlyfile.component').then((c) => c.ListquanlyfileComponent),
          children: [
            {
              path: ':id',
              loadComponent: () => import('./admin/listquanlyfile/detailquanlyfile/detailquanlyfile.component').then((c) => c.DetailQuanlyfileComponent),
            }] 
          },
        {
          path: 'profile',
          canActivate: [PermissionGuard],
          data: { permission: 'profile.view' },
          loadComponent: () => import('./shared/common/users/profile/profile.component').then((c) => c.ProfileComponent),
          children:[
            {
              path: 'socialpage',
              loadComponent: () => import('./shared/common/users/profile/social/social.component').then((c) => c.SocialComponent),
            },
          ]
        },
        {
          path: 'account',
          redirectTo: 'account/general', // Chuyển hướng đến 'account/password'
          pathMatch: 'full', // Xác định khớp chính xác
        },
        {
          path: 'account',
          loadComponent: () => import('./shared/common/users/account/account.component').then((c) => c.AccountComponent),
          children:[
            {
              path: 'password',
              loadComponent: () => import('./shared/common/users/account/password/password.component').then((c) => c.PasswordComponent),
            },
            {
              path:'general',
              loadComponent: () => import('./shared/common/users/account/general/general.component').then((c) => c.GeneralComponent),
            }
          ]
        },
      ],
    },
    {
      path: 'login',
      canActivate: [GuestGuard],
      canActivateChild: [GuestGuard],
      loadComponent: () => import('./shared/common/users/login/login.component').then((c) => c.LoginComponent),
    },
    {
      path: 'register',
      canActivate: [GuestGuard],
      canActivateChild: [GuestGuard],
      loadComponent: () => import('./shared/common/users/register/register.component').then((c) => c.RegisterComponent),
    },
    {
      path: '',
      loadComponent: () =>import('./site/sitemain/sitemain.component').then((c) => c.SitemainComponent),
      // loadComponent: () =>import('./admin/hotro/listhotro/listhotro.component').then((c) => c.ListHotroComponent),
      // loadComponent: () =>import('./admin/vantay/vantay.component').then((c) => c.VantayComponent),
      //loadComponent: () =>import('./admin/facecomparison/facecomparison.component').then((c) => c.FacecomparisonComponent),
      children: [
        {
          path: '',
          loadComponent: () =>import('./site/home/home.component').then((c) => c.HomeComponent),
        },
        {
          path: 'lien-he',
          loadComponent: () =>import('./site/lienhe/lienhe.component').then((c) => c.LienheComponent),
        },
        {
          path: ':slug',
          resolve: { componentType: DynamicComponentResolver },
          loadComponent: async () => {
            const componentType = history?.state?.componentType; 
            if(componentType)
            {
              switch (componentType) {
                case 'danhmucbaiviet':
                  const c = await import('./site/danhmucbaiviet/danhmucbaiviet.component');
                  return c.DanhmucbaivietComponent;
                case 'baiviet':
                  const c_1 = await import('./site/baiviet/baiviet.component');
                  return c_1.BaivietComponent;
                case 'danhmuc':
                  const c_2 = await import('./site/danhmuc/danhmuc.component');
                  return c_2.DanhmucComponent;
                case 'sanpham':
                  const c_3 = await import('./site/sanpham/sanpham.component');
                  return c_3.SanphamComponent;
                case 'danhmucgioithieu':
                  const c_5 = await import('./site/danhmucgioithieu/danhmucgioithieu.component');
                  return c_5.DanhmucgioithieuComponent;
                case 'gioithieu':
                  const c_6 = await import('./site/gioithieu/gioithieu.component');
                  return c_6.GioithieuComponent;
                default:
                  const c_4 = await import('./site/notfound/notfound.component');
                  return c_4.NotfoundComponent; // Component mặc định
              }
            }
            else {
             return import('./site/home/home.component').then((c) => c.HomeComponent)
            }
          },
        },
      ],
    },
  ];
