"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const VAR = '{var}';
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    constructor() {
        this.ctxPrefix = LoggingInterceptor_1.name;
        this.logger = new common_1.Logger(this.ctxPrefix);
        this.userPrefix = '';
    }
    parseBody(maskConfig, body, prefixKey) {
        const maskedBody = Object.keys(body).reduce((maskedBody, currentKey) => {
            var _a, _b;
            const mixedKey = prefixKey ? `${prefixKey}.${currentKey}` : currentKey;
            if (typeof body[currentKey] === 'string' || Array.isArray(body[currentKey])) {
                return Object.assign(Object.assign({}, maskedBody), { [currentKey]: ((_b = (_a = maskConfig === null || maskConfig === void 0 ? void 0 : maskConfig.request) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.find(param => param === mixedKey)) ? '****' : body[currentKey] });
            }
            const subBody = body[currentKey];
            return Object.assign(Object.assign({}, maskedBody), { [currentKey]: this.parseBody(maskConfig, subBody, mixedKey) });
        }, {});
        return maskedBody;
    }
    getPatternUrl(rawUrl = '', configUrl = '', pattern = VAR) {
        const rawUrlPieces = rawUrl.split("/");
        const constUrlPatternPieces = configUrl.split('/');
        const patternIndexs = constUrlPatternPieces.reduce((pieces, piece, index) => {
            if (piece === pattern) {
                pieces.push(index);
            }
            return pieces;
        }, []);
        patternIndexs.forEach(index => {
            rawUrlPieces[index] = pattern;
        });
        return rawUrlPieces.join('/');
    }
    setUserPrefix(prefix) {
        this.userPrefix = `${prefix} - `;
    }
    setMaskConfig(config) {
        this.maskConfigs = config;
    }
    intercept(context, call$) {
        var _a;
        const req = context.switchToHttp().getRequest();
        const { method, url, body, headers } = req;
        const ctx = `${this.userPrefix}${this.ctxPrefix} - ${method} - ${url}`;
        const message = `Incoming request - ${method} - ${url}`;
        let patternUrl = '';
        let maskedBody;
        const maskConfig = this.maskConfigs.find(config => {
            const temporaryPatternUrl = this.getPatternUrl(url, config === null || config === void 0 ? void 0 : config.request.url, config === null || config === void 0 ? void 0 : config.request.pattern);
            if (temporaryPatternUrl === (config === null || config === void 0 ? void 0 : config.request.url)) {
                patternUrl = temporaryPatternUrl;
                return true;
            }
            return false;
        });
        if (patternUrl === (maskConfig === null || maskConfig === void 0 ? void 0 : maskConfig.request.url) && method.toLowerCase() === ((_a = maskConfig === null || maskConfig === void 0 ? void 0 : maskConfig.request) === null || _a === void 0 ? void 0 : _a.method.toLowerCase())) {
            if (typeof body === 'object') {
                maskedBody = this.parseBody(maskConfig, body);
            }
            else {
                maskedBody = '****';
            }
        }
        else {
            maskedBody = body;
        }
        this.logger.log({
            message,
            method,
            body: maskedBody,
            headers,
        }, ctx);
        return call$.handle().pipe((0, operators_1.tap)({
            next: (val) => {
                this.logNext(val, context);
            },
            error: (err) => {
                this.logError(err, context);
            },
        }));
    }
    logNext(body, context) {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const { method, url } = req;
        const { statusCode } = res;
        const ctx = `${this.userPrefix}${this.ctxPrefix} - ${statusCode} - ${method} - ${url}`;
        const message = `Outgoing response - ${statusCode} - ${method} - ${url}`;
        this.logger.log({
            message,
            body,
        }, ctx);
    }
    logError(error, context) {
        const req = context.switchToHttp().getRequest();
        const { method, url, body } = req;
        if (error instanceof common_1.HttpException) {
            const statusCode = error.getStatus();
            const ctx = `${this.userPrefix}${this.ctxPrefix} - ${statusCode} - ${method} - ${url}`;
            const message = `Outgoing response - ${statusCode} - ${method} - ${url}`;
            if (statusCode >= common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
                this.logger.error({
                    method,
                    url,
                    body,
                    message,
                    error,
                }, error.stack, ctx);
            }
            else {
                this.logger.warn({
                    method,
                    url,
                    error,
                    body,
                    message,
                }, ctx);
            }
        }
        else {
            this.logger.error({
                message: `Outgoing response - ${method} - ${url}`,
            }, error.stack, `${this.userPrefix}${this.ctxPrefix} - ${method} - ${url}`);
        }
    }
};
LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
exports.LoggingInterceptor = LoggingInterceptor;
//# sourceMappingURL=logging.interceptor.js.map