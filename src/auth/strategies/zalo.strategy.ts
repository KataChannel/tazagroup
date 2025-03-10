import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { AuthService } from '../auth.service';

@Injectable()
export class ZaloStrategy extends PassportStrategy(Strategy, 'zalo') {
  constructor(private authService: AuthService) {
    super({
      authorizationURL: 'https://oauth.zaloapp.com/v4/permission',
      tokenURL: 'https://oauth.zaloapp.com/v4/access_token',
      clientID: process.env.ZALO_APP_ID!,
      clientSecret: process.env.ZALO_APP_SECRET!,
      callbackURL: `${process.env.SERVER_URL}/auth/zalo/callback`,
      scope: ['profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const { id, name } = profile;
    const user = await this.authService.validateOAuthLogin('zalo', id, name);
    done(null, user);
  }
}
