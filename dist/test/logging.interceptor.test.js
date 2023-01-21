"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const auth_module_1 = require("./test-app/auth/auth.module");
const cats_module_1 = require("./test-app/cats/cats.module");
const core_module_1 = require("./test-app/core/core.module");
describe('Logging interceptor', () => {
    let app;
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [core_module_1.CoreModule, cats_module_1.CatsModule, auth_module_1.AuthModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useLogger(common_1.Logger);
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('logs the input and output request details - OK status code', async () => {
        const logSpy = jest.spyOn(common_1.Logger.prototype, 'log');
        const url = `/cats/ok`;
        await request(app.getHttpServer()).get(url).expect(common_1.HttpStatus.OK);
        const ctx = `LoggingInterceptor - GET - ${url}`;
        const resCtx = `LoggingInterceptor - 200 - GET - ${url}`;
        const incomingMsg = `Incoming request - GET - ${url}`;
        const outgoingMsg = `Outgoing response - 200 - GET - ${url}`;
        expect(logSpy).toBeCalledTimes(2);
        expect(logSpy.mock.calls[0]).toEqual([
            {
                body: {},
                headers: expect.any(Object),
                message: incomingMsg,
                method: `GET`,
            },
            ctx,
        ]);
        expect(logSpy.mock.calls[1]).toEqual([
            {
                message: outgoingMsg,
                body: `This action returns all cats`,
            },
            resCtx,
        ]);
    });
    it('mask logs the input and output auth/login(body: object) - OK status code', async () => {
        const logSpy = jest.spyOn(common_1.Logger.prototype, 'log');
        const url = `/auth/login/123`;
        await request(app.getHttpServer()).post(url).send({
            email: 'test@test.com',
            password: 'test-password',
            sub: {
                one: "plain text",
                two: {
                    three: 'three'
                }
            },
            arraySub: [1, 2, 3]
        }).expect(common_1.HttpStatus.CREATED);
        const ctx = `LoggingInterceptor - POST - ${url}`;
        const resCtx = `LoggingInterceptor - 201 - POST - ${url}`;
        const incomingMsg = `Incoming request - POST - ${url}`;
        const outgoingMsg = `Outgoing response - 201 - POST - ${url}`;
        expect(logSpy).toBeCalledTimes(2);
        expect(logSpy.mock.calls[0]).toEqual([
            {
                body: {
                    email: 'test@test.com',
                    password: '****',
                    sub: {
                        one: '****',
                        two: {
                            three: '****',
                        }
                    },
                    arraySub: '****',
                },
                headers: expect.any(Object),
                message: incomingMsg,
                method: `POST`,
            },
            ctx,
        ]);
        expect(logSpy.mock.calls[1]).toEqual([
            {
                message: outgoingMsg,
                body: `This action returns login object`,
            },
            resCtx,
        ]);
    });
    it('logs the input and output auth/sign(body: object) details - OK status code', async () => {
        const logSpy = jest.spyOn(common_1.Logger.prototype, 'log');
        const url = `/auth/sign/f3456b-gh13r`;
        await request(app.getHttpServer()).post(url).send({
            userinfo: 'test@test.com',
            password: 'test-password',
            gender: 'male'
        }).expect(common_1.HttpStatus.CREATED);
        const ctx = `LoggingInterceptor - POST - ${url}`;
        const resCtx = `LoggingInterceptor - 201 - POST - ${url}`;
        const incomingMsg = `Incoming request - POST - ${url}`;
        const outgoingMsg = `Outgoing response - 201 - POST - ${url}`;
        expect(logSpy).toBeCalledTimes(2);
        expect(logSpy.mock.calls[0]).toEqual([
            {
                body: {
                    userinfo: 'test@test.com',
                    password: '****',
                    gender: 'male'
                },
                headers: expect.any(Object),
                message: incomingMsg,
                method: `POST`,
            },
            ctx,
        ]);
        expect(logSpy.mock.calls[1]).toEqual([
            {
                message: outgoingMsg,
                body: `This action returns sign object`,
            },
            resCtx,
        ]);
    });
    it('logs the input and output request details - BAD_REQUEST status code', async () => {
        const logSpy = jest.spyOn(common_1.Logger.prototype, 'log');
        const warnSpy = jest.spyOn(common_1.Logger.prototype, 'warn');
        const errorSpy = jest.spyOn(common_1.Logger.prototype, 'error');
        const url = `/cats/badrequest`;
        await request(app.getHttpServer()).get(url).expect(common_1.HttpStatus.BAD_REQUEST);
        const ctx = `LoggingInterceptor - GET - ${url}`;
        const resCtx = `LoggingInterceptor - 400 - GET - ${url}`;
        const incomingMsg = `Incoming request - GET - ${url}`;
        const outgoingMsg = `Outgoing response - 400 - GET - ${url}`;
        expect(logSpy).toBeCalledTimes(1);
        expect(logSpy.mock.calls[0]).toEqual([
            {
                body: {},
                headers: expect.any(Object),
                message: incomingMsg,
                method: `GET`,
            },
            ctx,
        ]);
        expect(warnSpy).toBeCalledTimes(1);
        expect(warnSpy.mock.calls[0]).toEqual([
            {
                message: outgoingMsg,
                method: 'GET',
                url: '/cats/badrequest',
                body: {},
                error: expect.any(common_1.BadRequestException),
            },
            resCtx,
        ]);
        expect(errorSpy).not.toHaveBeenCalled();
    });
    it('logs the input and output request details - INTERNAL_SERVER_ERROR status code', async () => {
        const logSpy = jest.spyOn(common_1.Logger.prototype, 'log');
        const warnSpy = jest.spyOn(common_1.Logger.prototype, 'warn');
        const errorSpy = jest.spyOn(common_1.Logger.prototype, 'error');
        const url = '/cats/internalerror';
        await request(app.getHttpServer()).get(url).expect(common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        const ctx = `LoggingInterceptor - GET - ${url}`;
        const resCtx = `LoggingInterceptor - 500 - GET - ${url}`;
        const incomingMsg = `Incoming request - GET - ${url}`;
        const outgoingMsg = `Outgoing response - 500 - GET - ${url}`;
        expect(logSpy).toBeCalledTimes(1);
        expect(logSpy.mock.calls[0]).toEqual([
            {
                body: {},
                headers: expect.any(Object),
                message: incomingMsg,
                method: `GET`,
            },
            ctx,
        ]);
        expect(errorSpy).toBeCalledTimes(1);
        expect(errorSpy.mock.calls[0]).toEqual([
            {
                message: outgoingMsg,
                method: 'GET',
                url: '/cats/internalerror',
                body: {},
                error: expect.any(common_1.InternalServerErrorException),
            },
            expect.any(String),
            resCtx,
        ]);
        expect(warnSpy).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=logging.interceptor.test.js.map