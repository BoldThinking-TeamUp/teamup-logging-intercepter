import { Controller, Post } from '@nestjs/common';

/**
 * Controller: /auth
 */
@Controller('auth')
export class AuthController {
  /**
   * Post login ok
   */
  @Post('login')
  public login(): string {
    return 'This action returns login object';
  }

  /**
   * Post sign ok
   */
  @Post('sign')
  public sign(): string {
    return 'This action returns sign object';
  }
}
