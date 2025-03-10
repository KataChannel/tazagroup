import { Controller, Post, Body, UseGuards, Req, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    if (!req.user) {
      return res.redirect(`${process.env.BASE_URL}/login`);
    }
    return res.redirect(`${process.env.BASE_URL}/login?token=${req.user.token}`);
  }

  @Get('facebook')
  async facebookLogin() {}

  @Get('facebook/callback')
  facebookCallback(@Req() req, @Res() res) {
    const token = req.user.token;
    return res.redirect(`${process.env.BASE_URL}/oauth-callback?token=${token}`);
  }
  @Get('zalo')
  async zaloLogin() {}

  @Get('zalo/callback')
  zaloCallback(@Req() req, @Res() res) {
    const token = req.user.token;
    return res.redirect(`${process.env.BASE_URL}/oauth-callback?token=${token}`);
  }



  @Post('register')
  register(@Body() body: { email: string; password: string; name: string }) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: {SDT:string; email: string; password: string }) {
    console.log(body);
    
    return this.authService.login(body.SDT, body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @Req() req,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(req.user.id, body.oldPassword, body.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('random-password')
  randomPassword(@Req() req) {
    return this.authService.generateRandomPassword(req.user.id);
  }
  
}
