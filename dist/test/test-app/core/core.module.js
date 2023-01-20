"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const src_1 = require("../../../src");
let CoreModule = class CoreModule {
};
CoreModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useFactory: () => {
                    const interceptor = new src_1.LoggingInterceptor();
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
                    ]);
                    return interceptor;
                },
            },
        ],
    })
], CoreModule);
exports.CoreModule = CoreModule;
//# sourceMappingURL=core.module.js.map