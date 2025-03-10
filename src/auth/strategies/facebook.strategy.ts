import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'emails'],
    });
  }

  async validate(profile: any, done: Function) {
    const { id, displayName, emails } = profile;
    const user = await this.authService.validateOAuthLogin('facebook', id, emails[0]?.value);
    done(null, user);
  }
}
