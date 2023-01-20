import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '../../../src';

/**
 * Core module: This module sets the logging interceptor as a global interceptor
 */
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => {
        const interceptor: LoggingInterceptor = new LoggingInterceptor();
        interceptor.setMaskConfig([
          {
            request: {
              url: '/auth/login',
              method: 'post',
              params: ['password', 'arraySub', 'sub.one', 'sub.two.three']
            }
          },
          {
            request: {
              url: '/auth/sign',
              method: 'post',
              params: ['password']
            }
          }
        ])

        return interceptor;
      },
    },
  ],
})
export class CoreModule {}
