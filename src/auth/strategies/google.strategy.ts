import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!, // Non-null assertion
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Non-null assertion
      callbackURL:`${process.env.SERVER_URL}/auth/google/callback`,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }
  async validate(    
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback) {
    const { id, emails } = profile;
    const user = await this.authService.validateOAuthLogin('google', id, emails[0]?.value);
    done(null, user);
  }
}
