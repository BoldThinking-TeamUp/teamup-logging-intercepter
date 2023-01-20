import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
type MaskConfigType = {
    request?: {
        url: string;
        method: string;
        params?: string[];
    };
};
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly ctxPrefix;
    private readonly logger;
    private userPrefix;
    private maskConfigs?;
    private parseBody;
    setUserPrefix(prefix: string): void;
    setMaskConfig(config?: MaskConfigType[]): void;
    intercept(context: ExecutionContext, call$: CallHandler): Observable<unknown>;
    private logNext;
    private logError;
}
export {};
