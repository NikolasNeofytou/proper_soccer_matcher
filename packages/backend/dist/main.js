/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(5);
const typeorm_1 = __webpack_require__(6);
const auth_module_1 = __webpack_require__(7);
const users_module_1 = __webpack_require__(22);
const pitches_module_1 = __webpack_require__(28);
const bookings_module_1 = __webpack_require__(36);
const payments_module_1 = __webpack_require__(44);
const reviews_module_1 = __webpack_require__(52);
const matches_module_1 = __webpack_require__(61);
const notifications_module_1 = __webpack_require__(71);
const admin_module_1 = __webpack_require__(76);
const assistant_module_1 = __webpack_require__(81);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '../../.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DATABASE_HOST'),
                    port: configService.get('DATABASE_PORT'),
                    username: configService.get('DATABASE_USER'),
                    password: configService.get('DATABASE_PASSWORD'),
                    database: configService.get('DATABASE_NAME'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: configService.get('NODE_ENV') === 'development',
                    logging: configService.get('NODE_ENV') === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            pitches_module_1.PitchesModule,
            bookings_module_1.BookingsModule,
            payments_module_1.PaymentsModule,
            reviews_module_1.ReviewsModule,
            matches_module_1.MatchesModule,
            notifications_module_1.NotificationsModule,
            admin_module_1.AdminModule,
            assistant_module_1.AssistantModule,
        ],
    })
], AppModule);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(8);
const passport_1 = __webpack_require__(9);
const config_1 = __webpack_require__(5);
const auth_service_1 = __webpack_require__(10);
const auth_controller_1 = __webpack_require__(17);
const users_module_1 = __webpack_require__(22);
const jwt_strategy_1 = __webpack_require__(24);
const local_strategy_1 = __webpack_require__(26);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN') || '15m',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(8);
const users_service_1 = __webpack_require__(11);
const bcrypt = __webpack_require__(16);
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && user.passwordHash) {
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (isPasswordValid) {
                const { passwordHash, ...result } = user;
                return result;
            }
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }
    async register(email, password, firstName, lastName) {
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new common_1.UnauthorizedException('User with this email already exists');
        }
        const user = await this.usersService.create(email, password);
        await this.usersService.createPlayerProfile(user.id, {
            firstName,
            lastName,
        });
        return this.login(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(12);
const user_entity_1 = __webpack_require__(13);
const player_profile_entity_1 = __webpack_require__(15);
const bcrypt = __webpack_require__(16);
let UsersService = class UsersService {
    constructor(usersRepository, playerProfilesRepository) {
        this.usersRepository = usersRepository;
        this.playerProfilesRepository = playerProfilesRepository;
    }
    async create(email, password, role = 'player') {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            email,
            passwordHash,
            role: role,
        });
        return this.usersRepository.save(user);
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['playerProfile'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({
            where: { email },
            relations: ['playerProfile'],
        });
    }
    async findAll() {
        return this.usersRepository.find({
            relations: ['playerProfile'],
        });
    }
    async update(id, updateData) {
        await this.usersRepository.update(id, updateData);
        return this.findOne(id);
    }
    async createPlayerProfile(userId, profileData) {
        const profile = this.playerProfilesRepository.create({
            ...profileData,
            userId,
        });
        return this.playerProfilesRepository.save(profile);
    }
    async updatePlayerProfile(userId, profileData) {
        const profile = await this.playerProfilesRepository.findOne({ where: { userId } });
        if (!profile) {
            throw new common_1.NotFoundException(`Player profile for user ${userId} not found`);
        }
        await this.playerProfilesRepository.update(profile.id, profileData);
        const updatedProfile = await this.playerProfilesRepository.findOne({ where: { userId } });
        if (!updatedProfile) {
            throw new common_1.NotFoundException(`Player profile for user ${userId} not found after update`);
        }
        return updatedProfile;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(player_profile_entity_1.PlayerProfile)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], UsersService);


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = exports.UserStatus = exports.UserRole = void 0;
const typeorm_1 = __webpack_require__(12);
const class_transformer_1 = __webpack_require__(14);
const player_profile_entity_1 = __webpack_require__(15);
var UserRole;
(function (UserRole) {
    UserRole["PLAYER"] = "player";
    UserRole["OWNER"] = "owner";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["SUSPENDED"] = "suspended";
    UserStatus["DELETED"] = "deleted";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserRole,
        default: UserRole.PLAYER,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "emailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "phoneVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => player_profile_entity_1.PlayerProfile, (profile) => profile.user),
    __metadata("design:type", typeof (_e = typeof player_profile_entity_1.PlayerProfile !== "undefined" && player_profile_entity_1.PlayerProfile) === "function" ? _e : Object)
], User.prototype, "playerProfile", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);


/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerProfile = void 0;
const typeorm_1 = __webpack_require__(12);
const user_entity_1 = __webpack_require__(13);
let PlayerProfile = class PlayerProfile {
};
exports.PlayerProfile = PlayerProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PlayerProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.playerProfile),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], PlayerProfile.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PlayerProfile.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PlayerProfile.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PlayerProfile.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PlayerProfile.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], PlayerProfile.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PlayerProfile.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 3 }),
    __metadata("design:type", Number)
], PlayerProfile.prototype, "skillLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PlayerProfile.prototype, "preferredPosition", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: '[]' }),
    __metadata("design:type", Array)
], PlayerProfile.prototype, "playStyle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PlayerProfile.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PlayerProfile.prototype, "heightCm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PlayerProfile.prototype, "weightKg", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PlayerProfile.prototype, "totalMatches", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PlayerProfile.prototype, "wins", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PlayerProfile.prototype, "losses", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PlayerProfile.prototype, "draws", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PlayerProfile.prototype, "goalsScored", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PlayerProfile.prototype, "assists", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PlayerProfile.prototype, "cleanSheets", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], PlayerProfile.prototype, "notificationsEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], PlayerProfile.prototype, "locationPublic", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], PlayerProfile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], PlayerProfile.prototype, "updatedAt", void 0);
exports.PlayerProfile = PlayerProfile = __decorate([
    (0, typeorm_1.Entity)('player_profiles')
], PlayerProfile);


/***/ }),
/* 16 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const auth_service_1 = __webpack_require__(10);
const local_auth_guard_1 = __webpack_require__(18);
const register_dto_1 = __webpack_require__(19);
const login_dto_1 = __webpack_require__(21);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(req) {
        return this.authService.login(req.user);
    }
    async register(registerDto) {
        return this.authService.register(registerDto.email, registerDto.password, registerDto.firstName, registerDto.lastName);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login with email and password' }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof register_dto_1.RegisterDto !== "undefined" && register_dto_1.RegisterDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalAuthGuard = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(9);
let LocalAuthGuard = class LocalAuthGuard extends (0, passport_1.AuthGuard)('local') {
};
exports.LocalAuthGuard = LocalAuthGuard;
exports.LocalAuthGuard = LocalAuthGuard = __decorate([
    (0, common_1.Injectable)()
], LocalAuthGuard);


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SecurePass123!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);


/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SecurePass123!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const users_controller_1 = __webpack_require__(23);
const users_service_1 = __webpack_require__(11);
const user_entity_1 = __webpack_require__(13);
const player_profile_entity_1 = __webpack_require__(15);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, player_profile_entity_1.PlayerProfile])],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const users_service_1 = __webpack_require__(11);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAll() {
        return this.usersService.findAll();
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const passport_jwt_1 = __webpack_require__(25);
const passport_1 = __webpack_require__(9);
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(5);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
        this.configService = configService;
    }
    async validate(payload) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const passport_local_1 = __webpack_require__(27);
const passport_1 = __webpack_require__(9);
const common_1 = __webpack_require__(2);
const auth_service_1 = __webpack_require__(10);
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super({ usernameField: 'email' });
        this.authService = authService;
    }
    async validate(email, password) {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
};
exports.LocalStrategy = LocalStrategy;
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);


/***/ }),
/* 27 */
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PitchesModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const pitches_service_1 = __webpack_require__(29);
const pitches_controller_1 = __webpack_require__(31);
const pitch_entity_1 = __webpack_require__(30);
let PitchesModule = class PitchesModule {
};
exports.PitchesModule = PitchesModule;
exports.PitchesModule = PitchesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([pitch_entity_1.Pitch])],
        controllers: [pitches_controller_1.PitchesController],
        providers: [pitches_service_1.PitchesService],
        exports: [pitches_service_1.PitchesService],
    })
], PitchesModule);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PitchesService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(12);
const pitch_entity_1 = __webpack_require__(30);
let PitchesService = class PitchesService {
    constructor(pitchesRepository) {
        this.pitchesRepository = pitchesRepository;
    }
    async create(ownerId, createPitchDto) {
        const pitch = this.pitchesRepository.create({
            ...createPitchDto,
            ownerId,
        });
        return this.pitchesRepository.save(pitch);
    }
    async findAll(searchDto) {
        const { city, country, latitude, longitude, radius, surfaceType, minCapacity, minPrice, maxPrice, indoor, lighting, amenities, status = pitch_entity_1.PitchStatus.ACTIVE, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', } = searchDto;
        const queryBuilder = this.pitchesRepository.createQueryBuilder('pitch');
        queryBuilder.where('pitch.status = :status', { status });
        queryBuilder.andWhere('pitch.deletedAt IS NULL');
        if (city) {
            queryBuilder.andWhere('LOWER(pitch.city) LIKE LOWER(:city)', { city: `%${city}%` });
        }
        if (country) {
            queryBuilder.andWhere('LOWER(pitch.country) LIKE LOWER(:country)', { country: `%${country}%` });
        }
        if (latitude && longitude && radius) {
            const latDiff = radius / 111;
            const lonDiff = radius / (111 * Math.cos(latitude * Math.PI / 180));
            queryBuilder.andWhere('pitch.latitude BETWEEN :minLat AND :maxLat', { minLat: latitude - latDiff, maxLat: latitude + latDiff });
            queryBuilder.andWhere('pitch.longitude BETWEEN :minLon AND :maxLon', { minLon: longitude - lonDiff, maxLon: longitude + lonDiff });
        }
        if (surfaceType) {
            queryBuilder.andWhere('pitch.surfaceType = :surfaceType', { surfaceType });
        }
        if (minCapacity) {
            queryBuilder.andWhere('pitch.capacity >= :minCapacity', { minCapacity });
        }
        if (indoor !== undefined) {
            queryBuilder.andWhere('pitch.indoor = :indoor', { indoor });
        }
        if (lighting !== undefined) {
            queryBuilder.andWhere('pitch.lighting = :lighting', { lighting });
        }
        if (minPrice !== undefined) {
            queryBuilder.andWhere('pitch.hourlyRate >= :minPrice', { minPrice });
        }
        if (maxPrice !== undefined) {
            queryBuilder.andWhere('pitch.hourlyRate <= :maxPrice', { maxPrice });
        }
        if (amenities) {
            const amenitiesList = amenities.split(',').map(a => a.trim());
            amenitiesList.forEach((amenity, index) => {
                queryBuilder.andWhere(`LOWER(CAST(pitch.amenities AS text)) LIKE LOWER(:amenity${index})`, { [`amenity${index}`]: `%${amenity}%` });
            });
        }
        const allowedSortFields = ['name', 'hourlyRate', 'averageRating', 'createdAt'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
        queryBuilder.orderBy(`pitch.${sortField}`, sortOrder);
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        const [data, total] = await queryBuilder.getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
        };
    }
    async findOne(id) {
        const pitch = await this.pitchesRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
            relations: ['owner'],
        });
        if (!pitch) {
            throw new common_1.NotFoundException(`Pitch with ID ${id} not found`);
        }
        return pitch;
    }
    async findByOwner(ownerId) {
        return this.pitchesRepository.find({
            where: { ownerId, deletedAt: (0, typeorm_2.IsNull)() },
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, ownerId, updatePitchDto) {
        const pitch = await this.findOne(id);
        if (pitch.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You do not have permission to update this pitch');
        }
        await this.pitchesRepository.update(id, updatePitchDto);
        return this.findOne(id);
    }
    async remove(id, ownerId) {
        const pitch = await this.findOne(id);
        if (pitch.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You do not have permission to delete this pitch');
        }
        await this.pitchesRepository.update(id, { deletedAt: new Date() });
    }
    async updateStatus(id, ownerId, status) {
        const pitch = await this.findOne(id);
        if (pitch.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You do not have permission to update this pitch');
        }
        await this.pitchesRepository.update(id, { status });
        return this.findOne(id);
    }
};
exports.PitchesService = PitchesService;
exports.PitchesService = PitchesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pitch_entity_1.Pitch)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], PitchesService);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Pitch = exports.PitchStatus = exports.SurfaceType = void 0;
const typeorm_1 = __webpack_require__(12);
const user_entity_1 = __webpack_require__(13);
var SurfaceType;
(function (SurfaceType) {
    SurfaceType["NATURAL_GRASS"] = "natural_grass";
    SurfaceType["ARTIFICIAL_TURF"] = "artificial_turf";
    SurfaceType["INDOOR"] = "indoor";
    SurfaceType["HYBRID"] = "hybrid";
})(SurfaceType || (exports.SurfaceType = SurfaceType = {}));
var PitchStatus;
(function (PitchStatus) {
    PitchStatus["ACTIVE"] = "active";
    PitchStatus["INACTIVE"] = "inactive";
    PitchStatus["MAINTENANCE"] = "maintenance";
})(PitchStatus || (exports.PitchStatus = PitchStatus = {}));
let Pitch = class Pitch {
};
exports.Pitch = Pitch;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Pitch.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pitch.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Pitch.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Pitch.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'ownerId' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], Pitch.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pitch.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pitch.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pitch.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Pitch.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 7 }),
    __metadata("design:type", Number)
], Pitch.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 7 }),
    __metadata("design:type", Number)
], Pitch.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SurfaceType,
        default: SurfaceType.ARTIFICIAL_TURF,
    }),
    __metadata("design:type", String)
], Pitch.prototype, "surfaceType", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Pitch.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Pitch.prototype, "length", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Pitch.prototype, "width", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Pitch.prototype, "indoor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Pitch.prototype, "lighting", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Pitch.prototype, "amenities", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Pitch.prototype, "hourlyRate", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Pitch.prototype, "peakHourRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'EUR' }),
    __metadata("design:type", String)
], Pitch.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], Pitch.prototype, "businessHours", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Pitch.prototype, "rules", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Pitch.prototype, "cancellationPolicy", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 24 }),
    __metadata("design:type", Number)
], Pitch.prototype, "minCancellationHours", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Pitch.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Pitch.prototype, "videoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pitch.prototype, "averageRating", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Pitch.prototype, "totalReviews", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Pitch.prototype, "totalBookings", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PitchStatus,
        default: PitchStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Pitch.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Pitch.prototype, "verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Pitch.prototype, "instantBooking", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Pitch.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Pitch.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Pitch.prototype, "deletedAt", void 0);
exports.Pitch = Pitch = __decorate([
    (0, typeorm_1.Entity)('pitches')
], Pitch);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PitchesController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const pitches_service_1 = __webpack_require__(29);
const create_pitch_dto_1 = __webpack_require__(32);
const update_pitch_dto_1 = __webpack_require__(33);
const search_pitch_dto_1 = __webpack_require__(34);
const jwt_auth_guard_1 = __webpack_require__(35);
const pitch_entity_1 = __webpack_require__(30);
let PitchesController = class PitchesController {
    constructor(pitchesService) {
        this.pitchesService = pitchesService;
    }
    create(req, createPitchDto) {
        return this.pitchesService.create(req.user.userId, createPitchDto);
    }
    findAll(searchDto) {
        return this.pitchesService.findAll(searchDto);
    }
    findMyPitches(req) {
        return this.pitchesService.findByOwner(req.user.userId);
    }
    findOne(id) {
        return this.pitchesService.findOne(id);
    }
    update(id, req, updatePitchDto) {
        return this.pitchesService.update(id, req.user.userId, updatePitchDto);
    }
    updateStatus(id, req, status) {
        return this.pitchesService.updateStatus(id, req.user.userId, status);
    }
    remove(id, req) {
        return this.pitchesService.remove(id, req.user.userId);
    }
};
exports.PitchesController = PitchesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new pitch (pitch owners only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Pitch created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_pitch_dto_1.CreatePitchDto !== "undefined" && create_pitch_dto_1.CreatePitchDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search pitches with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of pitches' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof search_pitch_dto_1.SearchPitchDto !== "undefined" && search_pitch_dto_1.SearchPitchDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-pitches'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get pitches owned by the current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of owned pitches' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "findMyPitches", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pitch details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pitch details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pitch not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update pitch details (owners only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pitch updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pitch not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_d = typeof update_pitch_dto_1.UpdatePitchDto !== "undefined" && update_pitch_dto_1.UpdatePitchDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update pitch status (owners only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_e = typeof pitch_entity_1.PitchStatus !== "undefined" && pitch_entity_1.PitchStatus) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete pitch (soft delete, owners only)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Pitch deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pitch not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PitchesController.prototype, "remove", null);
exports.PitchesController = PitchesController = __decorate([
    (0, swagger_1.ApiTags)('pitches'),
    (0, common_1.Controller)('pitches'),
    __metadata("design:paramtypes", [typeof (_a = typeof pitches_service_1.PitchesService !== "undefined" && pitches_service_1.PitchesService) === "function" ? _a : Object])
], PitchesController);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePitchDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
const pitch_entity_1 = __webpack_require__(30);
class CreatePitchDto {
}
exports.CreatePitchDto = CreatePitchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Downtown Soccer Arena' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePitchDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Premium artificial turf pitch with excellent lighting' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePitchDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main Street' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePitchDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'London' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePitchDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'UK' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePitchDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'SW1A 1AA' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePitchDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 51.5074 }),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreatePitchDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -0.1278 }),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreatePitchDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: pitch_entity_1.SurfaceType, example: pitch_entity_1.SurfaceType.ARTIFICIAL_TURF }),
    (0, class_validator_1.IsEnum)(pitch_entity_1.SurfaceType),
    __metadata("design:type", typeof (_a = typeof pitch_entity_1.SurfaceType !== "undefined" && pitch_entity_1.SurfaceType) === "function" ? _a : Object)
], CreatePitchDto.prototype, "surfaceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Number of players (e.g., 10 for 5v5)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(4),
    __metadata("design:type", Number)
], CreatePitchDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 40, description: 'Length in meters' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(10),
    __metadata("design:type", Number)
], CreatePitchDto.prototype, "length", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20, description: 'Width in meters' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(10),
    __metadata("design:type", Number)
], CreatePitchDto.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePitchDto.prototype, "indoor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePitchDto.prototype, "lighting", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['changing_rooms', 'parking', 'showers'],
        type: [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePitchDto.prototype, "amenities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50.00 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePitchDto.prototype, "hourlyRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 75.00 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePitchDto.prototype, "peakHourRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'EUR' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePitchDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: {
            monday: { open: '08:00', close: '22:00' },
            tuesday: { open: '08:00', close: '22:00' },
            wednesday: { open: '08:00', close: '22:00' },
            thursday: { open: '08:00', close: '22:00' },
            friday: { open: '08:00', close: '22:00' },
            saturday: { open: '09:00', close: '20:00' },
            sunday: { open: '09:00', close: '20:00' },
        },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePitchDto.prototype, "businessHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'No smoking. Football boots required.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePitchDto.prototype, "rules", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Free cancellation up to 24 hours before booking' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePitchDto.prototype, "cancellationPolicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 24 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePitchDto.prototype, "minCancellationHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['https://example.com/image1.jpg'],
        type: [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePitchDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://youtube.com/video' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePitchDto.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePitchDto.prototype, "instantBooking", void 0);


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePitchDto = void 0;
const swagger_1 = __webpack_require__(3);
const create_pitch_dto_1 = __webpack_require__(32);
class UpdatePitchDto extends (0, swagger_1.PartialType)(create_pitch_dto_1.CreatePitchDto) {
}
exports.UpdatePitchDto = UpdatePitchDto;


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchPitchDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
const class_transformer_1 = __webpack_require__(14);
const pitch_entity_1 = __webpack_require__(30);
class SearchPitchDto {
}
exports.SearchPitchDto = SearchPitchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'London' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchPitchDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'UK' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchPitchDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 51.5074 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchPitchDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: -0.1278 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchPitchDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5, description: 'Radius in kilometers' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchPitchDto.prototype, "radius", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: pitch_entity_1.SurfaceType }),
    (0, class_validator_1.IsEnum)(pitch_entity_1.SurfaceType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof pitch_entity_1.SurfaceType !== "undefined" && pitch_entity_1.SurfaceType) === "function" ? _a : Object)
], SearchPitchDto.prototype, "surfaceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(4),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchPitchDto.prototype, "minCapacity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchPitchDto.prototype, "minPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchPitchDto.prototype, "maxPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], SearchPitchDto.prototype, "indoor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], SearchPitchDto.prototype, "lighting", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'parking,changing_rooms' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchPitchDto.prototype, "amenities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: pitch_entity_1.PitchStatus, default: pitch_entity_1.PitchStatus.ACTIVE }),
    (0, class_validator_1.IsEnum)(pitch_entity_1.PitchStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof pitch_entity_1.PitchStatus !== "undefined" && pitch_entity_1.PitchStatus) === "function" ? _b : Object)
], SearchPitchDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchPitchDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, default: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchPitchDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'name', enum: ['name', 'hourlyRate', 'averageRating', 'createdAt'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchPitchDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'ASC', enum: ['ASC', 'DESC'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchPitchDto.prototype, "sortOrder", void 0);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(9);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingsModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const bookings_service_1 = __webpack_require__(37);
const bookings_controller_1 = __webpack_require__(39);
const booking_entity_1 = __webpack_require__(38);
const pitches_module_1 = __webpack_require__(28);
let BookingsModule = class BookingsModule {
};
exports.BookingsModule = BookingsModule;
exports.BookingsModule = BookingsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([booking_entity_1.Booking]), pitches_module_1.PitchesModule],
        controllers: [bookings_controller_1.BookingsController],
        providers: [bookings_service_1.BookingsService],
        exports: [bookings_service_1.BookingsService],
    })
], BookingsModule);


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(12);
const booking_entity_1 = __webpack_require__(38);
const pitches_service_1 = __webpack_require__(29);
let BookingsService = class BookingsService {
    constructor(bookingsRepository, pitchesService) {
        this.bookingsRepository = bookingsRepository;
        this.pitchesService = pitchesService;
    }
    async create(userId, createBookingDto) {
        const { pitchId, bookingDate, startTime, endTime, notes, numberOfPlayers } = createBookingDto;
        const pitch = await this.pitchesService.findOne(pitchId);
        const start = this.parseTime(startTime);
        const end = this.parseTime(endTime);
        if (end <= start) {
            throw new common_1.BadRequestException('End time must be after start time');
        }
        const durationHours = (end - start) / (1000 * 60 * 60);
        const hasConflict = await this.checkBookingConflict(pitchId, bookingDate, startTime, endTime);
        if (hasConflict) {
            throw new common_1.BadRequestException('This time slot is already booked');
        }
        const totalAmount = this.calculateBookingAmount(pitch.hourlyRate, durationHours);
        const booking = this.bookingsRepository.create({
            userId,
            pitchId,
            bookingDate: new Date(bookingDate),
            startTime,
            endTime,
            durationHours,
            totalAmount,
            currency: pitch.currency,
            notes,
            numberOfPlayers,
            status: booking_entity_1.BookingStatus.PENDING,
            paymentStatus: booking_entity_1.PaymentStatus.PENDING,
        });
        return this.bookingsRepository.save(booking);
    }
    async findAll(userId, searchDto) {
        const { status, paymentStatus, fromDate, toDate, pitchId, page = 1, limit = 10, } = searchDto;
        const queryBuilder = this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.pitch', 'pitch')
            .leftJoinAndSelect('booking.user', 'user')
            .where('booking.userId = :userId', { userId });
        if (status) {
            queryBuilder.andWhere('booking.status = :status', { status });
        }
        if (paymentStatus) {
            queryBuilder.andWhere('booking.paymentStatus = :paymentStatus', { paymentStatus });
        }
        if (fromDate) {
            queryBuilder.andWhere('booking.bookingDate >= :fromDate', { fromDate });
        }
        if (toDate) {
            queryBuilder.andWhere('booking.bookingDate <= :toDate', { toDate });
        }
        if (pitchId) {
            queryBuilder.andWhere('booking.pitchId = :pitchId', { pitchId });
        }
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        queryBuilder.orderBy('booking.bookingDate', 'DESC');
        queryBuilder.addOrderBy('booking.startTime', 'DESC');
        const [data, total] = await queryBuilder.getManyAndCount();
        return { data, total, page, limit };
    }
    async findByPitchOwner(ownerId, searchDto) {
        const { status, paymentStatus, fromDate, toDate, pitchId, page = 1, limit = 10, } = searchDto;
        const queryBuilder = this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.pitch', 'pitch')
            .leftJoinAndSelect('booking.user', 'user')
            .where('pitch.ownerId = :ownerId', { ownerId });
        if (status) {
            queryBuilder.andWhere('booking.status = :status', { status });
        }
        if (paymentStatus) {
            queryBuilder.andWhere('booking.paymentStatus = :paymentStatus', { paymentStatus });
        }
        if (fromDate) {
            queryBuilder.andWhere('booking.bookingDate >= :fromDate', { fromDate });
        }
        if (toDate) {
            queryBuilder.andWhere('booking.bookingDate <= :toDate', { toDate });
        }
        if (pitchId) {
            queryBuilder.andWhere('booking.pitchId = :pitchId', { pitchId });
        }
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        queryBuilder.orderBy('booking.bookingDate', 'DESC');
        queryBuilder.addOrderBy('booking.startTime', 'DESC');
        const [data, total] = await queryBuilder.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id, userId) {
        const booking = await this.bookingsRepository.findOne({
            where: { id },
            relations: ['pitch', 'user'],
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        const pitch = await this.pitchesService.findOne(booking.pitchId);
        if (booking.userId !== userId && pitch.ownerId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to view this booking');
        }
        return booking;
    }
    async update(id, userId, updateBookingDto) {
        const booking = await this.findOne(id, userId);
        if (booking.status !== booking_entity_1.BookingStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending bookings can be updated');
        }
        if (booking.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to update this booking');
        }
        await this.bookingsRepository.update(id, updateBookingDto);
        return this.findOne(id, userId);
    }
    async cancel(id, userId, cancelDto) {
        const booking = await this.findOne(id, userId);
        if (booking.status === booking_entity_1.BookingStatus.CANCELLED) {
            throw new common_1.BadRequestException('Booking is already cancelled');
        }
        if (booking.status === booking_entity_1.BookingStatus.COMPLETED) {
            throw new common_1.BadRequestException('Completed bookings cannot be cancelled');
        }
        const pitch = await this.pitchesService.findOne(booking.pitchId);
        const bookingDateTime = this.combineDateAndTime(booking.bookingDate, booking.startTime);
        const hoursUntilBooking = (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
        if (hoursUntilBooking < pitch.minCancellationHours) {
            throw new common_1.BadRequestException(`Cancellation must be made at least ${pitch.minCancellationHours} hours before booking`);
        }
        await this.bookingsRepository.update(id, {
            status: booking_entity_1.BookingStatus.CANCELLED,
            cancelledAt: new Date(),
            cancelledBy: userId,
            cancellationReason: cancelDto.reason,
        });
        return this.findOne(id, userId);
    }
    async confirm(id, ownerId) {
        const booking = await this.bookingsRepository.findOne({
            where: { id },
            relations: ['pitch'],
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        const pitch = await this.pitchesService.findOne(booking.pitchId);
        if (pitch.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('Only the pitch owner can confirm bookings');
        }
        if (booking.status !== booking_entity_1.BookingStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending bookings can be confirmed');
        }
        await this.bookingsRepository.update(id, {
            status: booking_entity_1.BookingStatus.CONFIRMED,
            confirmedAt: new Date(),
        });
        const confirmedBooking = await this.bookingsRepository.findOne({
            where: { id },
            relations: ['pitch', 'user'],
        });
        if (!confirmedBooking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found after confirmation`);
        }
        return confirmedBooking;
    }
    async complete(id, ownerId) {
        const booking = await this.bookingsRepository.findOne({
            where: { id },
            relations: ['pitch'],
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        const pitch = await this.pitchesService.findOne(booking.pitchId);
        if (pitch.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('Only the pitch owner can complete bookings');
        }
        if (booking.status !== booking_entity_1.BookingStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Only confirmed bookings can be completed');
        }
        await this.bookingsRepository.update(id, {
            status: booking_entity_1.BookingStatus.COMPLETED,
            completedAt: new Date(),
        });
        await this.pitchesService.update(booking.pitchId, ownerId, {
            totalBookings: pitch.totalBookings + 1,
        });
        const completedBooking = await this.bookingsRepository.findOne({
            where: { id },
            relations: ['pitch', 'user'],
        });
        if (!completedBooking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found after completion`);
        }
        return completedBooking;
    }
    parseTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date.getTime();
    }
    combineDateAndTime(date, time) {
        const [hours, minutes] = time.split(':').map(Number);
        const result = new Date(date);
        result.setHours(hours, minutes, 0, 0);
        return result;
    }
    calculateBookingAmount(hourlyRate, durationHours) {
        return Number((hourlyRate * durationHours).toFixed(2));
    }
    async checkBookingConflict(pitchId, bookingDate, startTime, endTime, excludeBookingId) {
        const queryBuilder = this.bookingsRepository
            .createQueryBuilder('booking')
            .where('booking.pitchId = :pitchId', { pitchId })
            .andWhere('booking.bookingDate = :bookingDate', { bookingDate })
            .andWhere('booking.status NOT IN (:...statuses)', {
            statuses: [booking_entity_1.BookingStatus.CANCELLED, booking_entity_1.BookingStatus.NO_SHOW],
        })
            .andWhere('(booking.startTime < :endTime AND booking.endTime > :startTime)', { startTime, endTime });
        if (excludeBookingId) {
            queryBuilder.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
        }
        const count = await queryBuilder.getCount();
        return count > 0;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof pitches_service_1.PitchesService !== "undefined" && pitches_service_1.PitchesService) === "function" ? _b : Object])
], BookingsService);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Booking = exports.PaymentStatus = exports.BookingStatus = void 0;
const typeorm_1 = __webpack_require__(12);
const user_entity_1 = __webpack_require__(13);
const pitch_entity_1 = __webpack_require__(30);
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["CANCELLED"] = "cancelled";
    BookingStatus["COMPLETED"] = "completed";
    BookingStatus["NO_SHOW"] = "no_show";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["REFUNDED"] = "refunded";
    PaymentStatus["FAILED"] = "failed";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let Booking = class Booking {
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Booking.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], Booking.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Booking.prototype, "pitchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pitch_entity_1.Pitch, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'pitchId' }),
    __metadata("design:type", typeof (_b = typeof pitch_entity_1.Pitch !== "undefined" && pitch_entity_1.Pitch) === "function" ? _b : Object)
], Booking.prototype, "pitch", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Booking.prototype, "bookingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Booking.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Booking.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Booking.prototype, "durationHours", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'EUR' }),
    __metadata("design:type", String)
], Booking.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING,
    }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], Booking.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Booking.prototype, "numberOfPlayers", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Booking.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "paymentIntentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "refundId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Booking.prototype, "refundAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Booking.prototype, "confirmedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Booking.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], Booking.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_h = typeof Date !== "undefined" && Date) === "function" ? _h : Object)
], Booking.prototype, "updatedAt", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)('bookings')
], Booking);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const bookings_service_1 = __webpack_require__(37);
const create_booking_dto_1 = __webpack_require__(40);
const update_booking_dto_1 = __webpack_require__(41);
const cancel_booking_dto_1 = __webpack_require__(42);
const search_booking_dto_1 = __webpack_require__(43);
const jwt_auth_guard_1 = __webpack_require__(35);
let BookingsController = class BookingsController {
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    create(req, createBookingDto) {
        return this.bookingsService.create(req.user.userId, createBookingDto);
    }
    findAll(req, searchDto) {
        return this.bookingsService.findAll(req.user.userId, searchDto);
    }
    findByOwner(req, searchDto) {
        return this.bookingsService.findByPitchOwner(req.user.userId, searchDto);
    }
    findOne(id, req) {
        return this.bookingsService.findOne(id, req.user.userId);
    }
    update(id, req, updateBookingDto) {
        return this.bookingsService.update(id, req.user.userId, updateBookingDto);
    }
    cancel(id, req, cancelDto) {
        return this.bookingsService.cancel(id, req.user.userId, cancelDto);
    }
    confirm(id, req) {
        return this.bookingsService.confirm(id, req.user.userId);
    }
    complete(id, req) {
        return this.bookingsService.complete(id, req.user.userId);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new booking' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Booking created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request (time conflict or invalid data)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pitch not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_booking_dto_1.CreateBookingDto !== "undefined" && create_booking_dto_1.CreateBookingDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user bookings with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of user bookings' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof search_booking_dto_1.SearchBookingDto !== "undefined" && search_booking_dto_1.SearchBookingDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('owner'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bookings for pitch owner' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of bookings for owned pitches' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof search_booking_dto_1.SearchBookingDto !== "undefined" && search_booking_dto_1.SearchBookingDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "findByOwner", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking details' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update booking details (pending bookings only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_e = typeof update_booking_dto_1.UpdateBookingDto !== "undefined" && update_booking_dto_1.UpdateBookingDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request (cancellation policy violation)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_f = typeof cancel_booking_dto_1.CancelBookingDto !== "undefined" && cancel_booking_dto_1.CancelBookingDto) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm a booking (pitch owners only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking confirmed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - only pitch owner can confirm' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark booking as completed (pitch owners only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - only pitch owner can complete' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "complete", null);
exports.BookingsController = BookingsController = __decorate([
    (0, swagger_1.ApiTags)('bookings'),
    (0, common_1.Controller)('bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof bookings_service_1.BookingsService !== "undefined" && bookings_service_1.BookingsService) === "function" ? _a : Object])
], BookingsController);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateBookingDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
class CreateBookingDto {
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "pitchId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-01', description: 'Booking date (YYYY-MM-DD)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "bookingDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '14:00', description: 'Start time (HH:mm)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Start time must be in format HH:mm',
    }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '16:00', description: 'End time (HH:mm)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'End time must be in format HH:mm',
    }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Team practice session' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "numberOfPlayers", void 0);


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateBookingDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
class UpdateBookingDto {
}
exports.UpdateBookingDto = UpdateBookingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Updated notes for the booking' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBookingDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateBookingDto.prototype, "numberOfPlayers", void 0);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CancelBookingDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
class CancelBookingDto {
}
exports.CancelBookingDto = CancelBookingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Unable to attend due to weather conditions' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CancelBookingDto.prototype, "reason", void 0);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchBookingDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
const class_transformer_1 = __webpack_require__(14);
const booking_entity_1 = __webpack_require__(38);
class SearchBookingDto {
}
exports.SearchBookingDto = SearchBookingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: booking_entity_1.BookingStatus }),
    (0, class_validator_1.IsEnum)(booking_entity_1.BookingStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof booking_entity_1.BookingStatus !== "undefined" && booking_entity_1.BookingStatus) === "function" ? _a : Object)
], SearchBookingDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: booking_entity_1.PaymentStatus }),
    (0, class_validator_1.IsEnum)(booking_entity_1.PaymentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof booking_entity_1.PaymentStatus !== "undefined" && booking_entity_1.PaymentStatus) === "function" ? _b : Object)
], SearchBookingDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-12-01' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchBookingDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-12-31' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchBookingDto.prototype, "toDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchBookingDto.prototype, "pitchId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchBookingDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, default: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchBookingDto.prototype, "limit", void 0);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const payments_service_1 = __webpack_require__(45);
const payments_controller_1 = __webpack_require__(48);
const payment_entity_1 = __webpack_require__(47);
const booking_entity_1 = __webpack_require__(38);
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([payment_entity_1.Payment, booking_entity_1.Booking])],
        controllers: [payments_controller_1.PaymentsController],
        providers: [payments_service_1.PaymentsService],
        exports: [payments_service_1.PaymentsService],
    })
], PaymentsModule);


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(12);
const config_1 = __webpack_require__(5);
const stripe_1 = __webpack_require__(46);
const payment_entity_1 = __webpack_require__(47);
const booking_entity_1 = __webpack_require__(38);
let PaymentsService = class PaymentsService {
    constructor(paymentsRepository, bookingsRepository, configService) {
        this.paymentsRepository = paymentsRepository;
        this.bookingsRepository = bookingsRepository;
        this.configService = configService;
        const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (!stripeSecretKey || stripeSecretKey.includes('your_')) {
            console.warn('⚠️  Stripe secret key not configured. Payment functionality will be limited.');
            this.stripe = new stripe_1.default('sk_test_dummy', { apiVersion: '2025-10-29.clover' });
        }
        else {
            this.stripe = new stripe_1.default(stripeSecretKey, { apiVersion: '2025-10-29.clover' });
        }
    }
    async createPaymentIntent(userId, createPaymentIntentDto) {
        const { bookingId, paymentMethodId } = createPaymentIntentDto;
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId },
            relations: ['pitch'],
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${bookingId} not found`);
        }
        if (booking.userId !== userId) {
            throw new common_1.ForbiddenException('You can only pay for your own bookings');
        }
        if (booking.paymentStatus === 'paid') {
            throw new common_1.BadRequestException('This booking has already been paid');
        }
        const existingPayment = await this.paymentsRepository.findOne({
            where: { bookingId, status: payment_entity_1.PaymentStatus.SUCCEEDED },
        });
        if (existingPayment) {
            throw new common_1.BadRequestException('Payment already exists for this booking');
        }
        const amount = Math.round(booking.totalAmount * 100);
        let paymentIntent;
        try {
            paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency: booking.currency.toLowerCase(),
                payment_method: paymentMethodId,
                automatic_payment_methods: paymentMethodId ? undefined : { enabled: true },
                metadata: {
                    bookingId: booking.id,
                    userId,
                    pitchId: booking.pitchId,
                },
            });
        }
        catch (error) {
            console.error('Stripe payment intent creation error:', error);
            throw new common_1.BadRequestException('Failed to create payment intent');
        }
        const payment = this.paymentsRepository.create({
            userId,
            bookingId,
            amount: booking.totalAmount,
            currency: booking.currency,
            paymentMethod: payment_entity_1.PaymentMethod.CARD,
            status: payment_entity_1.PaymentStatus.PENDING,
            stripePaymentIntentId: paymentIntent.id,
            description: `Payment for booking ${booking.id}`,
        });
        await this.paymentsRepository.save(payment);
        await this.bookingsRepository.update(bookingId, {
            paymentIntentId: paymentIntent.id,
        });
        return {
            clientSecret: paymentIntent.client_secret,
            payment,
        };
    }
    async confirmPayment(paymentIntentId) {
        const payment = await this.paymentsRepository.findOne({
            where: { stripePaymentIntentId: paymentIntentId },
            relations: ['booking'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        let paymentIntent;
        try {
            paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        }
        catch (error) {
            console.error('Stripe payment intent retrieval error:', error);
            throw new common_1.BadRequestException('Failed to retrieve payment status');
        }
        if (paymentIntent.status === 'succeeded') {
            await this.paymentsRepository.update(payment.id, {
                status: payment_entity_1.PaymentStatus.SUCCEEDED,
                succeededAt: new Date(),
                stripeChargeId: paymentIntent.latest_charge,
            });
            await this.bookingsRepository.update(payment.bookingId, {
                paymentStatus: booking_entity_1.PaymentStatus.PAID,
                status: booking_entity_1.BookingStatus.CONFIRMED,
                confirmedAt: new Date(),
            });
        }
        else if (paymentIntent.status === 'processing') {
            await this.paymentsRepository.update(payment.id, {
                status: payment_entity_1.PaymentStatus.PROCESSING,
            });
        }
        else if (paymentIntent.status === 'requires_payment_method') {
            await this.paymentsRepository.update(payment.id, {
                status: payment_entity_1.PaymentStatus.FAILED,
                failedAt: new Date(),
                failureMessage: 'Payment method required',
            });
        }
        else {
            await this.paymentsRepository.update(payment.id, {
                status: payment_entity_1.PaymentStatus.FAILED,
                failedAt: new Date(),
                failureMessage: paymentIntent.last_payment_error?.message || 'Payment failed',
            });
        }
        return this.paymentsRepository.findOne({
            where: { id: payment.id },
            relations: ['booking'],
        });
    }
    async createRefund(userId, createRefundDto) {
        const { paymentId, amount, reason } = createRefundDto;
        const payment = await this.paymentsRepository.findOne({
            where: { id: paymentId },
            relations: ['booking', 'booking.pitch'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.userId !== userId && payment.booking.pitch.ownerId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to refund this payment');
        }
        if (payment.status !== payment_entity_1.PaymentStatus.SUCCEEDED) {
            throw new common_1.BadRequestException('Only successful payments can be refunded');
        }
        const refundAmount = amount || payment.amount - payment.refundedAmount;
        if (refundAmount <= 0) {
            throw new common_1.BadRequestException('Invalid refund amount');
        }
        if (refundAmount > payment.amount - payment.refundedAmount) {
            throw new common_1.BadRequestException('Refund amount exceeds available amount');
        }
        let refund;
        try {
            refund = await this.stripe.refunds.create({
                payment_intent: payment.stripePaymentIntentId,
                amount: Math.round(refundAmount * 100),
                reason: 'requested_by_customer',
                metadata: {
                    reason: reason || 'No reason provided',
                },
            });
        }
        catch (error) {
            console.error('Stripe refund creation error:', error);
            throw new common_1.BadRequestException('Failed to create refund');
        }
        const newRefundedAmount = payment.refundedAmount + refundAmount;
        const refundIds = [...(payment.refundIds || []), refund.id];
        const newStatus = newRefundedAmount >= payment.amount
            ? payment_entity_1.PaymentStatus.REFUNDED
            : payment_entity_1.PaymentStatus.PARTIALLY_REFUNDED;
        await this.paymentsRepository.update(paymentId, {
            refundedAmount: newRefundedAmount,
            refundIds,
            refundedAt: new Date(),
            status: newStatus,
        });
        await this.bookingsRepository.update(payment.bookingId, {
            paymentStatus: newStatus === payment_entity_1.PaymentStatus.REFUNDED
                ? booking_entity_1.PaymentStatus.REFUNDED
                : booking_entity_1.PaymentStatus.PAID,
            refundAmount: newRefundedAmount,
            refundId: refund.id,
        });
        return this.paymentsRepository.findOne({
            where: { id: paymentId },
            relations: ['booking'],
        });
    }
    async findByUser(userId) {
        return this.paymentsRepository.find({
            where: { userId },
            relations: ['booking', 'booking.pitch'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const payment = await this.paymentsRepository.findOne({
            where: { id },
            relations: ['booking', 'booking.pitch'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.userId !== userId && payment.booking.pitch.ownerId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to view this payment');
        }
        return payment;
    }
    async handleWebhook(signature, rawBody) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret || webhookSecret.includes('your_')) {
            console.warn('⚠️  Stripe webhook secret not configured. Skipping webhook verification.');
            return;
        }
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook signature verification failed: ${err.message}`);
        }
        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentIntentSucceeded(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await this.handlePaymentIntentFailed(event.data.object);
                break;
            case 'charge.refunded':
                await this.handleChargeRefunded(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    }
    async handlePaymentIntentSucceeded(paymentIntent) {
        await this.confirmPayment(paymentIntent.id);
    }
    async handlePaymentIntentFailed(paymentIntent) {
        const payment = await this.paymentsRepository.findOne({
            where: { stripePaymentIntentId: paymentIntent.id },
        });
        if (payment) {
            await this.paymentsRepository.update(payment.id, {
                status: payment_entity_1.PaymentStatus.FAILED,
                failedAt: new Date(),
                failureMessage: paymentIntent.last_payment_error?.message || 'Payment failed',
            });
        }
    }
    async handleChargeRefunded(charge) {
        const payment = await this.paymentsRepository.findOne({
            where: { stripeChargeId: charge.id },
        });
        if (payment) {
            const refundedAmount = charge.amount_refunded / 100;
            const status = refundedAmount >= payment.amount
                ? payment_entity_1.PaymentStatus.REFUNDED
                : payment_entity_1.PaymentStatus.PARTIALLY_REFUNDED;
            await this.paymentsRepository.update(payment.id, {
                refundedAmount,
                status,
                refundedAt: new Date(),
            });
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], PaymentsService);


/***/ }),
/* 46 */
/***/ ((module) => {

module.exports = require("stripe");

/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Payment = exports.PaymentStatus = exports.PaymentMethod = void 0;
const typeorm_1 = __webpack_require__(12);
const user_entity_1 = __webpack_require__(13);
const booking_entity_1 = __webpack_require__(38);
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CARD"] = "card";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["WALLET"] = "wallet";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PROCESSING"] = "processing";
    PaymentStatus["SUCCEEDED"] = "succeeded";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
    PaymentStatus["PARTIALLY_REFUNDED"] = "partially_refunded";
    PaymentStatus["CANCELLED"] = "cancelled";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let Payment = class Payment {
};
exports.Payment = Payment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Payment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], Payment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Payment.prototype, "bookingId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => booking_entity_1.Booking, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'bookingId' }),
    __metadata("design:type", typeof (_b = typeof booking_entity_1.Booking !== "undefined" && booking_entity_1.Booking) === "function" ? _b : Object)
], Payment.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'EUR' }),
    __metadata("design:type", String)
], Payment.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.CARD,
    }),
    __metadata("design:type", String)
], Payment.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "stripePaymentIntentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "stripeChargeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "stripeCustomerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "stripePaymentMethodId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Payment.prototype, "refundedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Payment.prototype, "refundIds", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Payment.prototype, "refundedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], Payment.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "failureMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Payment.prototype, "succeededAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Payment.prototype, "failedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Payment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], Payment.prototype, "updatedAt", void 0);
exports.Payment = Payment = __decorate([
    (0, typeorm_1.Entity)('payments')
], Payment);


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const payments_service_1 = __webpack_require__(45);
const create_payment_intent_dto_1 = __webpack_require__(49);
const create_refund_dto_1 = __webpack_require__(50);
const confirm_payment_dto_1 = __webpack_require__(51);
const jwt_auth_guard_1 = __webpack_require__(35);
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    createPaymentIntent(req, createPaymentIntentDto) {
        return this.paymentsService.createPaymentIntent(req.user.userId, createPaymentIntentDto);
    }
    confirmPayment(confirmPaymentDto) {
        return this.paymentsService.confirmPayment(confirmPaymentDto.paymentIntentId);
    }
    createRefund(req, createRefundDto) {
        return this.paymentsService.createRefund(req.user.userId, createRefundDto);
    }
    findAll(req) {
        return this.paymentsService.findByUser(req.user.userId);
    }
    findOne(id, req) {
        return this.paymentsService.findOne(id, req.user.userId);
    }
    async handleWebhook(signature, request) {
        const rawBody = request.rawBody;
        if (!rawBody) {
            throw new Error('Raw body is required for webhook verification');
        }
        return this.paymentsService.handleWebhook(signature, rawBody);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('create-intent'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a payment intent for a booking' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Payment intent created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_payment_intent_dto_1.CreatePaymentIntentDto !== "undefined" && create_payment_intent_dto_1.CreatePaymentIntentDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "createPaymentIntent", null);
__decorate([
    (0, common_1.Post)('confirm'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm a payment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment confirmed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Payment not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof confirm_payment_dto_1.ConfirmPaymentDto !== "undefined" && confirm_payment_dto_1.ConfirmPaymentDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "confirmPayment", null);
__decorate([
    (0, common_1.Post)('refund'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a refund for a payment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Refund created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Payment not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof create_refund_dto_1.CreateRefundDto !== "undefined" && create_refund_dto_1.CreateRefundDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "createRefund", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user payment history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of payments' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment details' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Payment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof common_1.RawBodyRequest !== "undefined" && common_1.RawBodyRequest) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleWebhook", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [typeof (_a = typeof payments_service_1.PaymentsService !== "undefined" && payments_service_1.PaymentsService) === "function" ? _a : Object])
], PaymentsController);


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePaymentIntentDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
class CreatePaymentIntentDto {
}
exports.CreatePaymentIntentDto = CreatePaymentIntentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePaymentIntentDto.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'pm_1234567890' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePaymentIntentDto.prototype, "paymentMethodId", void 0);


/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateRefundDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
class CreateRefundDto {
}
exports.CreateRefundDto = CreateRefundDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRefundDto.prototype, "paymentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 50.00, description: 'Amount to refund (leave empty for full refund)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateRefundDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Customer requested cancellation' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRefundDto.prototype, "reason", void 0);


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfirmPaymentDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
class ConfirmPaymentDto {
}
exports.ConfirmPaymentDto = ConfirmPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pi_1234567890' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfirmPaymentDto.prototype, "paymentIntentId", void 0);


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewsModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const reviews_service_1 = __webpack_require__(53);
const reviews_controller_1 = __webpack_require__(55);
const review_entity_1 = __webpack_require__(54);
const pitch_entity_1 = __webpack_require__(30);
const booking_entity_1 = __webpack_require__(38);
let ReviewsModule = class ReviewsModule {
};
exports.ReviewsModule = ReviewsModule;
exports.ReviewsModule = ReviewsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([review_entity_1.Review, review_entity_1.ReviewHelpfulness, pitch_entity_1.Pitch, booking_entity_1.Booking])],
        controllers: [reviews_controller_1.ReviewsController],
        providers: [reviews_service_1.ReviewsService],
        exports: [reviews_service_1.ReviewsService],
    })
], ReviewsModule);


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(12);
const review_entity_1 = __webpack_require__(54);
const pitch_entity_1 = __webpack_require__(30);
const booking_entity_1 = __webpack_require__(38);
let ReviewsService = class ReviewsService {
    constructor(reviewsRepository, helpfulnessRepository, pitchesRepository, bookingsRepository) {
        this.reviewsRepository = reviewsRepository;
        this.helpfulnessRepository = helpfulnessRepository;
        this.pitchesRepository = pitchesRepository;
        this.bookingsRepository = bookingsRepository;
    }
    async create(userId, createReviewDto) {
        const { pitchId, bookingId, rating, comment, ...detailedRatings } = createReviewDto;
        const pitch = await this.pitchesRepository.findOne({ where: { id: pitchId } });
        if (!pitch) {
            throw new common_1.NotFoundException('Pitch not found');
        }
        const existingReview = await this.reviewsRepository.findOne({
            where: { userId, pitchId, deletedAt: (0, typeorm_2.IsNull)() },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('You have already reviewed this pitch');
        }
        let verified = false;
        if (bookingId) {
            const booking = await this.bookingsRepository.findOne({
                where: { id: bookingId, userId },
            });
            if (!booking) {
                throw new common_1.NotFoundException('Booking not found');
            }
            if (booking.pitchId !== pitchId) {
                throw new common_1.BadRequestException('Booking does not match the pitch');
            }
            if (booking.status !== booking_entity_1.BookingStatus.COMPLETED) {
                throw new common_1.BadRequestException('You can only review completed bookings');
            }
            verified = true;
        }
        const review = this.reviewsRepository.create({
            userId,
            pitchId,
            bookingId,
            rating,
            comment,
            ...detailedRatings,
            verified,
        });
        const savedReview = await this.reviewsRepository.save(review);
        await this.updatePitchRating(pitchId);
        return savedReview;
    }
    async findAll(searchDto) {
        const { pitchId, userId, minRating, page = 1, limit = 10 } = searchDto;
        const queryBuilder = this.reviewsRepository
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.user', 'user')
            .leftJoinAndSelect('review.pitch', 'pitch')
            .where('review.deletedAt IS NULL');
        if (pitchId) {
            queryBuilder.andWhere('review.pitchId = :pitchId', { pitchId });
        }
        if (userId) {
            queryBuilder.andWhere('review.userId = :userId', { userId });
        }
        if (minRating) {
            queryBuilder.andWhere('review.rating >= :minRating', { minRating });
        }
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        queryBuilder.orderBy('review.createdAt', 'DESC');
        const [data, total] = await queryBuilder.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const review = await this.reviewsRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
            relations: ['user', 'pitch', 'booking'],
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        return review;
    }
    async update(id, userId, updateReviewDto) {
        const review = await this.findOne(id);
        if (review.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own reviews');
        }
        await this.reviewsRepository.update(id, updateReviewDto);
        if (updateReviewDto.rating) {
            await this.updatePitchRating(review.pitchId);
        }
        return this.findOne(id);
    }
    async remove(id, userId) {
        const review = await this.findOne(id);
        if (review.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own reviews');
        }
        await this.reviewsRepository.update(id, { deletedAt: new Date() });
        await this.updatePitchRating(review.pitchId);
    }
    async addOwnerResponse(id, ownerId, ownerResponseDto) {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['pitch'],
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.pitch.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('Only the pitch owner can respond to reviews');
        }
        await this.reviewsRepository.update(id, {
            ownerResponse: ownerResponseDto.response,
            ownerRespondedAt: new Date(),
        });
        return this.findOne(id);
    }
    async markHelpful(id, userId, helpfulnessDto) {
        const review = await this.findOne(id);
        const existingVote = await this.helpfulnessRepository.findOne({
            where: { reviewId: id, userId },
        });
        if (existingVote) {
            await this.helpfulnessRepository.update(existingVote.id, {
                helpful: helpfulnessDto.helpful,
            });
        }
        else {
            const vote = this.helpfulnessRepository.create({
                reviewId: id,
                userId,
                helpful: helpfulnessDto.helpful,
            });
            await this.helpfulnessRepository.save(vote);
        }
        await this.updateHelpfulCounts(id);
        return this.findOne(id);
    }
    async updatePitchRating(pitchId) {
        const result = await this.reviewsRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'averageRating')
            .addSelect('COUNT(review.id)', 'totalReviews')
            .where('review.pitchId = :pitchId', { pitchId })
            .andWhere('review.deletedAt IS NULL')
            .getRawOne();
        const averageRating = result.averageRating ? parseFloat(result.averageRating) : 0;
        const totalReviews = result.totalReviews ? parseInt(result.totalReviews, 10) : 0;
        await this.pitchesRepository.update(pitchId, {
            averageRating: parseFloat(averageRating.toFixed(2)),
            totalReviews,
        });
    }
    async updateHelpfulCounts(reviewId) {
        const helpfulCount = await this.helpfulnessRepository.count({
            where: { reviewId, helpful: true },
        });
        const notHelpfulCount = await this.helpfulnessRepository.count({
            where: { reviewId, helpful: false },
        });
        await this.reviewsRepository.update(reviewId, {
            helpfulCount,
            notHelpfulCount,
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(review_entity_1.ReviewHelpfulness)),
    __param(2, (0, typeorm_1.InjectRepository)(pitch_entity_1.Pitch)),
    __param(3, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object])
], ReviewsService);


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewHelpfulness = exports.Review = void 0;
const typeorm_1 = __webpack_require__(12);
const user_entity_1 = __webpack_require__(13);
const pitch_entity_1 = __webpack_require__(30);
const booking_entity_1 = __webpack_require__(38);
let Review = class Review {
};
exports.Review = Review;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Review.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Review.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], Review.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Review.prototype, "pitchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pitch_entity_1.Pitch, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'pitchId' }),
    __metadata("design:type", typeof (_b = typeof pitch_entity_1.Pitch !== "undefined" && pitch_entity_1.Pitch) === "function" ? _b : Object)
], Review.prototype, "pitch", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Review.prototype, "bookingId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => booking_entity_1.Booking, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'bookingId' }),
    __metadata("design:type", typeof (_c = typeof booking_entity_1.Booking !== "undefined" && booking_entity_1.Booking) === "function" ? _c : Object)
], Review.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Review.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Review.prototype, "facilitiesRating", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Review.prototype, "locationRating", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Review.prototype, "valueRating", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Review.prototype, "surfaceQualityRating", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Review.prototype, "helpfulCount", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Review.prototype, "notHelpfulCount", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Review.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Review.prototype, "verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Review.prototype, "flagged", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Review.prototype, "flaggedReason", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Review.prototype, "ownerResponse", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Review.prototype, "ownerRespondedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Review.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Review.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], Review.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ReviewHelpfulness, (helpfulness) => helpfulness.review),
    __metadata("design:type", Array)
], Review.prototype, "helpfulnessVotes", void 0);
exports.Review = Review = __decorate([
    (0, typeorm_1.Entity)('reviews')
], Review);
let ReviewHelpfulness = class ReviewHelpfulness {
};
exports.ReviewHelpfulness = ReviewHelpfulness;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReviewHelpfulness.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ReviewHelpfulness.prototype, "reviewId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Review, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'reviewId' }),
    __metadata("design:type", Review)
], ReviewHelpfulness.prototype, "review", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ReviewHelpfulness.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_h = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _h : Object)
], ReviewHelpfulness.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], ReviewHelpfulness.prototype, "helpful", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_j = typeof Date !== "undefined" && Date) === "function" ? _j : Object)
], ReviewHelpfulness.prototype, "createdAt", void 0);
exports.ReviewHelpfulness = ReviewHelpfulness = __decorate([
    (0, typeorm_1.Entity)('review_helpfulness')
], ReviewHelpfulness);


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const reviews_service_1 = __webpack_require__(53);
const create_review_dto_1 = __webpack_require__(56);
const update_review_dto_1 = __webpack_require__(57);
const search_review_dto_1 = __webpack_require__(58);
const owner_response_dto_1 = __webpack_require__(59);
const review_helpfulness_dto_1 = __webpack_require__(60);
const jwt_auth_guard_1 = __webpack_require__(35);
let ReviewsController = class ReviewsController {
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    create(req, createReviewDto) {
        return this.reviewsService.create(req.user.userId, createReviewDto);
    }
    findAll(searchDto) {
        return this.reviewsService.findAll(searchDto);
    }
    findOne(id) {
        return this.reviewsService.findOne(id);
    }
    update(id, req, updateReviewDto) {
        return this.reviewsService.update(id, req.user.userId, updateReviewDto);
    }
    remove(id, req) {
        return this.reviewsService.remove(id, req.user.userId);
    }
    addOwnerResponse(id, req, ownerResponseDto) {
        return this.reviewsService.addOwnerResponse(id, req.user.userId, ownerResponseDto);
    }
    markHelpful(id, req, helpfulnessDto) {
        return this.reviewsService.markHelpful(id, req.user.userId, helpfulnessDto);
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new review' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Review created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request (already reviewed or invalid booking)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pitch or booking not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_review_dto_1.CreateReviewDto !== "undefined" && create_review_dto_1.CreateReviewDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search reviews with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of reviews' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof search_review_dto_1.SearchReviewDto !== "undefined" && search_review_dto_1.SearchReviewDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get review details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Review not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update review (author only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not the author' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Review not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_d = typeof update_review_dto_1.UpdateReviewDto !== "undefined" && update_review_dto_1.UpdateReviewDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete review (soft delete, author only)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Review deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not the author' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Review not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/response'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add owner response to review (pitch owners only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Response added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not the pitch owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Review not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_e = typeof owner_response_dto_1.OwnerResponseDto !== "undefined" && owner_response_dto_1.OwnerResponseDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "addOwnerResponse", null);
__decorate([
    (0, common_1.Post)(':id/helpful'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mark review as helpful or not helpful' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Helpfulness vote recorded' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Review not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_f = typeof review_helpfulness_dto_1.ReviewHelpfulnessDto !== "undefined" && review_helpfulness_dto_1.ReviewHelpfulnessDto) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "markHelpful", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, swagger_1.ApiTags)('reviews'),
    (0, common_1.Controller)('reviews'),
    __metadata("design:paramtypes", [typeof (_a = typeof reviews_service_1.ReviewsService !== "undefined" && reviews_service_1.ReviewsService) === "function" ? _a : Object])
], ReviewsController);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateReviewDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
class CreateReviewDto {
}
exports.CreateReviewDto = CreateReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "pitchId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Great pitch with excellent facilities!' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "facilitiesRating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "locationRating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "valueRating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "surfaceQualityRating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['https://example.com/image1.jpg'], type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateReviewDto.prototype, "images", void 0);


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateReviewDto = void 0;
const swagger_1 = __webpack_require__(3);
const create_review_dto_1 = __webpack_require__(56);
class UpdateReviewDto extends (0, swagger_1.PartialType)(create_review_dto_1.CreateReviewDto) {
}
exports.UpdateReviewDto = UpdateReviewDto;


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchReviewDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
const class_transformer_1 = __webpack_require__(14);
class SearchReviewDto {
}
exports.SearchReviewDto = SearchReviewDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchReviewDto.prototype, "pitchId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchReviewDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4, minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchReviewDto.prototype, "minRating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchReviewDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, default: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchReviewDto.prototype, "limit", void 0);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OwnerResponseDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
class OwnerResponseDto {
}
exports.OwnerResponseDto = OwnerResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Thank you for your feedback! We appreciate your visit.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OwnerResponseDto.prototype, "response", void 0);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewHelpfulnessDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
class ReviewHelpfulnessDto {
}
exports.ReviewHelpfulnessDto = ReviewHelpfulnessDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'true for helpful, false for not helpful' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ReviewHelpfulnessDto.prototype, "helpful", void 0);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MatchesModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const matches_service_1 = __webpack_require__(62);
const matches_controller_1 = __webpack_require__(64);
const match_entity_1 = __webpack_require__(63);
const player_profile_entity_1 = __webpack_require__(15);
const pitch_entity_1 = __webpack_require__(30);
const booking_entity_1 = __webpack_require__(38);
let MatchesModule = class MatchesModule {
};
exports.MatchesModule = MatchesModule;
exports.MatchesModule = MatchesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([match_entity_1.Match, match_entity_1.MatchParticipant, player_profile_entity_1.PlayerProfile, pitch_entity_1.Pitch, booking_entity_1.Booking])],
        controllers: [matches_controller_1.MatchesController],
        providers: [matches_service_1.MatchesService],
        exports: [matches_service_1.MatchesService],
    })
], MatchesModule);


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MatchesService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(12);
const match_entity_1 = __webpack_require__(63);
const player_profile_entity_1 = __webpack_require__(15);
const pitch_entity_1 = __webpack_require__(30);
const booking_entity_1 = __webpack_require__(38);
let MatchesService = class MatchesService {
    constructor(matchesRepository, participantsRepository, playerProfilesRepository, pitchesRepository, bookingsRepository) {
        this.matchesRepository = matchesRepository;
        this.participantsRepository = participantsRepository;
        this.playerProfilesRepository = playerProfilesRepository;
        this.pitchesRepository = pitchesRepository;
        this.bookingsRepository = bookingsRepository;
    }
    async create(organizerId, createMatchDto) {
        const { pitchId, bookingId, ...matchData } = createMatchDto;
        const pitch = await this.pitchesRepository.findOne({ where: { id: pitchId } });
        if (!pitch) {
            throw new common_1.NotFoundException('Pitch not found');
        }
        if (bookingId) {
            const booking = await this.bookingsRepository.findOne({
                where: { id: bookingId, userId: organizerId },
            });
            if (!booking) {
                throw new common_1.NotFoundException('Booking not found');
            }
            if (booking.pitchId !== pitchId) {
                throw new common_1.BadRequestException('Booking does not match the pitch');
            }
        }
        const match = this.matchesRepository.create({
            ...matchData,
            organizerId,
            pitchId,
            bookingId,
            currentPlayers: 1,
        });
        const savedMatch = await this.matchesRepository.save(match);
        await this.addParticipant(savedMatch.id, organizerId, {});
        return this.findOne(savedMatch.id);
    }
    async findAll(searchDto) {
        const { pitchId, fromDate, toDate, status = match_entity_1.MatchStatus.OPEN, format, matchType, skillLevel, page = 1, limit = 10, } = searchDto;
        const queryBuilder = this.matchesRepository
            .createQueryBuilder('match')
            .leftJoinAndSelect('match.pitch', 'pitch')
            .leftJoinAndSelect('match.organizer', 'organizer')
            .where('match.deletedAt IS NULL');
        if (status) {
            queryBuilder.andWhere('match.status = :status', { status });
        }
        if (pitchId) {
            queryBuilder.andWhere('match.pitchId = :pitchId', { pitchId });
        }
        if (fromDate) {
            queryBuilder.andWhere('match.matchDate >= :fromDate', { fromDate });
        }
        if (toDate) {
            queryBuilder.andWhere('match.matchDate <= :toDate', { toDate });
        }
        if (format) {
            queryBuilder.andWhere('match.format = :format', { format });
        }
        if (matchType) {
            queryBuilder.andWhere('match.matchType = :matchType', { matchType });
        }
        if (skillLevel) {
            queryBuilder.andWhere('(match.minSkillLevel IS NULL OR match.minSkillLevel <= :skillLevel)', { skillLevel });
            queryBuilder.andWhere('(match.maxSkillLevel IS NULL OR match.maxSkillLevel >= :skillLevel)', { skillLevel });
        }
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        queryBuilder.orderBy('match.matchDate', 'ASC');
        queryBuilder.addOrderBy('match.startTime', 'ASC');
        const [data, total] = await queryBuilder.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const match = await this.matchesRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
            relations: ['pitch', 'organizer', 'participants', 'participants.player'],
        });
        if (!match) {
            throw new common_1.NotFoundException('Match not found');
        }
        return match;
    }
    async update(id, userId, updateMatchDto) {
        const match = await this.findOne(id);
        if (match.organizerId !== userId) {
            throw new common_1.ForbiddenException('Only the match organizer can update the match');
        }
        if (match.status === match_entity_1.MatchStatus.COMPLETED || match.status === match_entity_1.MatchStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot update completed or cancelled matches');
        }
        await this.matchesRepository.update(id, updateMatchDto);
        return this.findOne(id);
    }
    async cancel(id, userId) {
        const match = await this.findOne(id);
        if (match.organizerId !== userId) {
            throw new common_1.ForbiddenException('Only the match organizer can cancel the match');
        }
        await this.matchesRepository.update(id, {
            status: match_entity_1.MatchStatus.CANCELLED,
        });
        return this.findOne(id);
    }
    async joinMatch(matchId, playerId, joinDto) {
        const match = await this.findOne(matchId);
        if (match.status !== match_entity_1.MatchStatus.OPEN) {
            throw new common_1.BadRequestException('Match is not open for joining');
        }
        if (match.currentPlayers >= match.maxPlayers) {
            throw new common_1.BadRequestException('Match is full');
        }
        const existingParticipant = await this.participantsRepository.findOne({
            where: { matchId, playerId },
        });
        if (existingParticipant) {
            throw new common_1.BadRequestException('You have already joined this match');
        }
        const playerProfile = await this.playerProfilesRepository.findOne({
            where: { userId: playerId },
        });
        if (playerProfile) {
            if (match.minSkillLevel && playerProfile.skillLevel < match.minSkillLevel) {
                throw new common_1.BadRequestException('Your skill level is below the minimum requirement');
            }
            if (match.maxSkillLevel && playerProfile.skillLevel > match.maxSkillLevel) {
                throw new common_1.BadRequestException('Your skill level is above the maximum requirement');
            }
        }
        await this.addParticipant(matchId, playerId, joinDto);
        const newPlayerCount = match.currentPlayers + 1;
        const newStatus = newPlayerCount >= match.maxPlayers ? match_entity_1.MatchStatus.FULL : match_entity_1.MatchStatus.OPEN;
        await this.matchesRepository.update(matchId, {
            currentPlayers: newPlayerCount,
            status: newStatus,
        });
        return this.findOne(matchId);
    }
    async leaveMatch(matchId, playerId) {
        const match = await this.findOne(matchId);
        if (match.organizerId === playerId) {
            throw new common_1.BadRequestException('Match organizer cannot leave. Cancel the match instead.');
        }
        if (match.status === match_entity_1.MatchStatus.IN_PROGRESS || match.status === match_entity_1.MatchStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot leave a match that is in progress or completed');
        }
        const participant = await this.participantsRepository.findOne({
            where: { matchId, playerId },
        });
        if (!participant) {
            throw new common_1.NotFoundException('You are not a participant of this match');
        }
        await this.participantsRepository.remove(participant);
        const newPlayerCount = match.currentPlayers - 1;
        await this.matchesRepository.update(matchId, {
            currentPlayers: newPlayerCount,
            status: newPlayerCount < match.maxPlayers ? match_entity_1.MatchStatus.OPEN : match.status,
        });
        return this.findOne(matchId);
    }
    async invitePlayers(matchId, organizerId, inviteDto) {
        const match = await this.findOne(matchId);
        if (match.organizerId !== organizerId) {
            throw new common_1.ForbiddenException('Only the match organizer can invite players');
        }
        for (const playerId of inviteDto.playerIds) {
            const existingParticipant = await this.participantsRepository.findOne({
                where: { matchId, playerId },
            });
            if (!existingParticipant) {
                const participant = this.participantsRepository.create({
                    matchId,
                    playerId,
                    status: match_entity_1.ParticipantStatus.INVITED,
                });
                await this.participantsRepository.save(participant);
            }
        }
        return this.findOne(matchId);
    }
    async respondToInvitation(matchId, playerId, accept) {
        const participant = await this.participantsRepository.findOne({
            where: { matchId, playerId, status: match_entity_1.ParticipantStatus.INVITED },
        });
        if (!participant) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        if (accept) {
            const match = await this.findOne(matchId);
            if (match.currentPlayers >= match.maxPlayers) {
                throw new common_1.BadRequestException('Match is full');
            }
            await this.participantsRepository.update(participant.id, {
                status: match_entity_1.ParticipantStatus.CONFIRMED,
            });
            await this.matchesRepository.update(matchId, {
                currentPlayers: match.currentPlayers + 1,
                status: match.currentPlayers + 1 >= match.maxPlayers ? match_entity_1.MatchStatus.FULL : match.status,
            });
        }
        else {
            await this.participantsRepository.update(participant.id, {
                status: match_entity_1.ParticipantStatus.DECLINED,
            });
        }
        return this.findOne(matchId);
    }
    async balanceTeams(matchId, organizerId) {
        const match = await this.findOne(matchId);
        if (match.organizerId !== organizerId) {
            throw new common_1.ForbiddenException('Only the match organizer can balance teams');
        }
        const participants = await this.participantsRepository.find({
            where: { matchId, status: match_entity_1.ParticipantStatus.CONFIRMED },
            relations: ['player', 'player.playerProfile'],
        });
        if (participants.length < 2) {
            throw new common_1.BadRequestException('Need at least 2 players to balance teams');
        }
        const sortedParticipants = participants.sort((a, b) => {
            const skillA = a.player.playerProfile?.skillLevel || 3;
            const skillB = b.player.playerProfile?.skillLevel || 3;
            return skillB - skillA;
        });
        for (let i = 0; i < sortedParticipants.length; i++) {
            const team = i % 2 === 0 ? match_entity_1.Team.TEAM_A : match_entity_1.Team.TEAM_B;
            await this.participantsRepository.update(sortedParticipants[i].id, { team });
        }
        await this.matchesRepository.update(matchId, { teamsAssigned: true });
        return this.findOne(matchId);
    }
    async recordResult(matchId, organizerId, resultDto) {
        const match = await this.findOne(matchId);
        if (match.organizerId !== organizerId) {
            throw new common_1.ForbiddenException('Only the match organizer can record the result');
        }
        await this.matchesRepository.update(matchId, {
            teamAScore: resultDto.teamAScore,
            teamBScore: resultDto.teamBScore,
            status: match_entity_1.MatchStatus.COMPLETED,
            completedAt: new Date(),
        });
        await this.updatePlayerStatistics(matchId);
        return this.findOne(matchId);
    }
    async addParticipant(matchId, playerId, joinDto) {
        const participant = this.participantsRepository.create({
            matchId,
            playerId,
            status: match_entity_1.ParticipantStatus.CONFIRMED,
            position: joinDto.position,
            team: joinDto.preferredTeam || match_entity_1.Team.UNASSIGNED,
        });
        await this.participantsRepository.save(participant);
    }
    async updatePlayerStatistics(matchId) {
        const match = await this.findOne(matchId);
        if (!match.teamAScore || !match.teamBScore) {
            return;
        }
        const participants = match.participants.filter((p) => p.status === match_entity_1.ParticipantStatus.CONFIRMED);
        for (const participant of participants) {
            const profile = await this.playerProfilesRepository.findOne({
                where: { userId: participant.playerId },
            });
            if (profile) {
                const isTeamA = participant.team === match_entity_1.Team.TEAM_A;
                const teamScore = isTeamA ? match.teamAScore : match.teamBScore;
                const opponentScore = isTeamA ? match.teamBScore : match.teamAScore;
                const won = teamScore > opponentScore;
                const draw = teamScore === opponentScore;
                await this.playerProfilesRepository.update(profile.id, {
                    totalMatches: profile.totalMatches + 1,
                    wins: won ? profile.wins + 1 : profile.wins,
                    draws: draw ? profile.draws + 1 : profile.draws,
                    losses: !won && !draw ? profile.losses + 1 : profile.losses,
                    goalsScored: profile.goalsScored + participant.goals,
                    assists: profile.assists + participant.assists,
                    cleanSheets: participant.cleanSheet ? profile.cleanSheets + 1 : profile.cleanSheets,
                });
            }
        }
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __param(1, (0, typeorm_1.InjectRepository)(match_entity_1.MatchParticipant)),
    __param(2, (0, typeorm_1.InjectRepository)(player_profile_entity_1.PlayerProfile)),
    __param(3, (0, typeorm_1.InjectRepository)(pitch_entity_1.Pitch)),
    __param(4, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object])
], MatchesService);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MatchParticipant = exports.Team = exports.ParticipantStatus = exports.Match = exports.MatchFormat = exports.MatchStatus = exports.MatchType = void 0;
const typeorm_1 = __webpack_require__(12);
const user_entity_1 = __webpack_require__(13);
const pitch_entity_1 = __webpack_require__(30);
const booking_entity_1 = __webpack_require__(38);
var MatchType;
(function (MatchType) {
    MatchType["PUBLIC"] = "public";
    MatchType["PRIVATE"] = "private";
    MatchType["INVITE_ONLY"] = "invite_only";
})(MatchType || (exports.MatchType = MatchType = {}));
var MatchStatus;
(function (MatchStatus) {
    MatchStatus["OPEN"] = "open";
    MatchStatus["FULL"] = "full";
    MatchStatus["IN_PROGRESS"] = "in_progress";
    MatchStatus["COMPLETED"] = "completed";
    MatchStatus["CANCELLED"] = "cancelled";
})(MatchStatus || (exports.MatchStatus = MatchStatus = {}));
var MatchFormat;
(function (MatchFormat) {
    MatchFormat["FIVE_V_FIVE"] = "5v5";
    MatchFormat["SEVEN_V_SEVEN"] = "7v7";
    MatchFormat["ELEVEN_V_ELEVEN"] = "11v11";
    MatchFormat["FUTSAL"] = "futsal";
})(MatchFormat || (exports.MatchFormat = MatchFormat = {}));
let Match = class Match {
};
exports.Match = Match;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Match.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Match.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Match.prototype, "organizerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'organizerId' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], Match.prototype, "organizer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Match.prototype, "pitchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pitch_entity_1.Pitch, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'pitchId' }),
    __metadata("design:type", typeof (_b = typeof pitch_entity_1.Pitch !== "undefined" && pitch_entity_1.Pitch) === "function" ? _b : Object)
], Match.prototype, "pitch", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "bookingId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => booking_entity_1.Booking, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'bookingId' }),
    __metadata("design:type", typeof (_c = typeof booking_entity_1.Booking !== "undefined" && booking_entity_1.Booking) === "function" ? _c : Object)
], Match.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Match.prototype, "matchDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Match.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Match.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MatchFormat,
        default: MatchFormat.FIVE_V_FIVE,
    }),
    __metadata("design:type", String)
], Match.prototype, "format", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MatchType,
        default: MatchType.PUBLIC,
    }),
    __metadata("design:type", String)
], Match.prototype, "matchType", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Match.prototype, "maxPlayers", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Match.prototype, "currentPlayers", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Match.prototype, "minSkillLevel", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Match.prototype, "maxSkillLevel", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Match.prototype, "costPerPlayer", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'EUR', nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MatchStatus,
        default: MatchStatus.OPEN,
    }),
    __metadata("design:type", String)
], Match.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Match.prototype, "teamAScore", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Match.prototype, "teamBScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Match.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Match.prototype, "autoBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Match.prototype, "teamsAssigned", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Match.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], Match.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_h = typeof Date !== "undefined" && Date) === "function" ? _h : Object)
], Match.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => MatchParticipant, (participant) => participant.match),
    __metadata("design:type", Array)
], Match.prototype, "participants", void 0);
exports.Match = Match = __decorate([
    (0, typeorm_1.Entity)('matches')
], Match);
var ParticipantStatus;
(function (ParticipantStatus) {
    ParticipantStatus["INVITED"] = "invited";
    ParticipantStatus["CONFIRMED"] = "confirmed";
    ParticipantStatus["DECLINED"] = "declined";
    ParticipantStatus["CANCELLED"] = "cancelled";
})(ParticipantStatus || (exports.ParticipantStatus = ParticipantStatus = {}));
var Team;
(function (Team) {
    Team["TEAM_A"] = "team_a";
    Team["TEAM_B"] = "team_b";
    Team["UNASSIGNED"] = "unassigned";
})(Team || (exports.Team = Team = {}));
let MatchParticipant = class MatchParticipant {
};
exports.MatchParticipant = MatchParticipant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MatchParticipant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MatchParticipant.prototype, "matchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Match, (match) => match.participants, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'matchId' }),
    __metadata("design:type", Match)
], MatchParticipant.prototype, "match", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MatchParticipant.prototype, "playerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'playerId' }),
    __metadata("design:type", typeof (_j = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _j : Object)
], MatchParticipant.prototype, "player", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ParticipantStatus,
        default: ParticipantStatus.CONFIRMED,
    }),
    __metadata("design:type", String)
], MatchParticipant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Team,
        default: Team.UNASSIGNED,
    }),
    __metadata("design:type", String)
], MatchParticipant.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MatchParticipant.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], MatchParticipant.prototype, "goals", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], MatchParticipant.prototype, "assists", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MatchParticipant.prototype, "cleanSheet", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MatchParticipant.prototype, "mvp", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_k = typeof Date !== "undefined" && Date) === "function" ? _k : Object)
], MatchParticipant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_l = typeof Date !== "undefined" && Date) === "function" ? _l : Object)
], MatchParticipant.prototype, "updatedAt", void 0);
exports.MatchParticipant = MatchParticipant = __decorate([
    (0, typeorm_1.Entity)('match_participants')
], MatchParticipant);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MatchesController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const matches_service_1 = __webpack_require__(62);
const create_match_dto_1 = __webpack_require__(65);
const update_match_dto_1 = __webpack_require__(66);
const search_match_dto_1 = __webpack_require__(67);
const join_match_dto_1 = __webpack_require__(68);
const invite_players_dto_1 = __webpack_require__(69);
const record_match_result_dto_1 = __webpack_require__(70);
const jwt_auth_guard_1 = __webpack_require__(35);
let MatchesController = class MatchesController {
    constructor(matchesService) {
        this.matchesService = matchesService;
    }
    create(req, createMatchDto) {
        return this.matchesService.create(req.user.userId, createMatchDto);
    }
    findAll(searchDto) {
        return this.matchesService.findAll(searchDto);
    }
    findOne(id) {
        return this.matchesService.findOne(id);
    }
    update(id, req, updateMatchDto) {
        return this.matchesService.update(id, req.user.userId, updateMatchDto);
    }
    cancel(id, req) {
        return this.matchesService.cancel(id, req.user.userId);
    }
    joinMatch(id, req, joinDto) {
        return this.matchesService.joinMatch(id, req.user.userId, joinDto);
    }
    leaveMatch(id, req) {
        return this.matchesService.leaveMatch(id, req.user.userId);
    }
    invitePlayers(id, req, inviteDto) {
        return this.matchesService.invitePlayers(id, req.user.userId, inviteDto);
    }
    respondToInvitation(id, accept, req) {
        return this.matchesService.respondToInvitation(id, req.user.userId, accept === 'true');
    }
    balanceTeams(id, req) {
        return this.matchesService.balanceTeams(id, req.user.userId);
    }
    recordResult(id, req, resultDto) {
        return this.matchesService.recordResult(id, req.user.userId, resultDto);
    }
};
exports.MatchesController = MatchesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new match' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Match created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pitch or booking not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_match_dto_1.CreateMatchDto !== "undefined" && create_match_dto_1.CreateMatchDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search matches with filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of matches' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof search_match_dto_1.SearchMatchDto !== "undefined" && search_match_dto_1.SearchMatchDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get match details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Match details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Match not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update match details (organizer only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Match updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not the organizer' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Match not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_d = typeof update_match_dto_1.UpdateMatchDto !== "undefined" && update_match_dto_1.UpdateMatchDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a match (organizer only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Match cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not the organizer' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Match not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/join'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Join a match' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully joined the match' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request (match full, already joined, skill mismatch)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Match not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_e = typeof join_match_dto_1.JoinMatchDto !== "undefined" && join_match_dto_1.JoinMatchDto) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "joinMatch", null);
__decorate([
    (0, common_1.Post)(':id/leave'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Leave a match' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully left the match' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request (organizer cannot leave, match in progress)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Match or participation not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "leaveMatch", null);
__decorate([
    (0, common_1.Post)(':id/invite'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Invite players to match (organizer only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Players invited successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not the organizer' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Match not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_f = typeof invite_players_dto_1.InvitePlayersDto !== "undefined" && invite_players_dto_1.InvitePlayersDto) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "invitePlayers", null);
__decorate([
    (0, common_1.Post)(':id/invitation/:accept'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Respond to match invitation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invitation response recorded' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request (match full)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Invitation not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('accept')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "respondToInvitation", null);
__decorate([
    (0, common_1.Post)(':id/balance-teams'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Auto-balance teams by skill level (organizer only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Teams balanced successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request (not enough players)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not the organizer' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Match not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "balanceTeams", null);
__decorate([
    (0, common_1.Post)(':id/result'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Record match result (organizer only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Result recorded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not the organizer' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Match not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_g = typeof record_match_result_dto_1.RecordMatchResultDto !== "undefined" && record_match_result_dto_1.RecordMatchResultDto) === "function" ? _g : Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "recordResult", null);
exports.MatchesController = MatchesController = __decorate([
    (0, swagger_1.ApiTags)('matches'),
    (0, common_1.Controller)('matches'),
    __metadata("design:paramtypes", [typeof (_a = typeof matches_service_1.MatchesService !== "undefined" && matches_service_1.MatchesService) === "function" ? _a : Object])
], MatchesController);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateMatchDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
const match_entity_1 = __webpack_require__(63);
class CreateMatchDto {
}
exports.CreateMatchDto = CreateMatchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Friendly 5v5 Match' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Looking for players for a friendly match' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "pitchId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-15', description: 'Match date (YYYY-MM-DD)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "matchDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '18:00', description: 'Start time (HH:mm)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Start time must be in format HH:mm',
    }),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '20:00', description: 'End time (HH:mm)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'End time must be in format HH:mm',
    }),
    __metadata("design:type", String)
], CreateMatchDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: match_entity_1.MatchFormat, example: match_entity_1.MatchFormat.FIVE_V_FIVE }),
    (0, class_validator_1.IsEnum)(match_entity_1.MatchFormat),
    __metadata("design:type", typeof (_a = typeof match_entity_1.MatchFormat !== "undefined" && match_entity_1.MatchFormat) === "function" ? _a : Object)
], CreateMatchDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: match_entity_1.MatchType, example: match_entity_1.MatchType.PUBLIC }),
    (0, class_validator_1.IsEnum)(match_entity_1.MatchType),
    __metadata("design:type", typeof (_b = typeof match_entity_1.MatchType !== "undefined" && match_entity_1.MatchType) === "function" ? _b : Object)
], CreateMatchDto.prototype, "matchType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Maximum number of players' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(4),
    (0, class_validator_1.Max)(30),
    __metadata("design:type", Number)
], CreateMatchDto.prototype, "maxPlayers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, minimum: 1, maximum: 7 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(7),
    __metadata("design:type", Number)
], CreateMatchDto.prototype, "minSkillLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 7, minimum: 1, maximum: 7 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(7),
    __metadata("design:type", Number)
], CreateMatchDto.prototype, "maxSkillLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10.00 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMatchDto.prototype, "costPerPlayer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateMatchDto.prototype, "autoBalance", void 0);


/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateMatchDto = void 0;
const swagger_1 = __webpack_require__(3);
const create_match_dto_1 = __webpack_require__(65);
class UpdateMatchDto extends (0, swagger_1.PartialType)(create_match_dto_1.CreateMatchDto) {
}
exports.UpdateMatchDto = UpdateMatchDto;


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchMatchDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
const class_transformer_1 = __webpack_require__(14);
const match_entity_1 = __webpack_require__(63);
class SearchMatchDto {
}
exports.SearchMatchDto = SearchMatchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchMatchDto.prototype, "pitchId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-12-01' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchMatchDto.prototype, "fromDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-12-31' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchMatchDto.prototype, "toDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: match_entity_1.MatchStatus }),
    (0, class_validator_1.IsEnum)(match_entity_1.MatchStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof match_entity_1.MatchStatus !== "undefined" && match_entity_1.MatchStatus) === "function" ? _a : Object)
], SearchMatchDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: match_entity_1.MatchFormat }),
    (0, class_validator_1.IsEnum)(match_entity_1.MatchFormat),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof match_entity_1.MatchFormat !== "undefined" && match_entity_1.MatchFormat) === "function" ? _b : Object)
], SearchMatchDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: match_entity_1.MatchType }),
    (0, class_validator_1.IsEnum)(match_entity_1.MatchType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_c = typeof match_entity_1.MatchType !== "undefined" && match_entity_1.MatchType) === "function" ? _c : Object)
], SearchMatchDto.prototype, "matchType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(7),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchMatchDto.prototype, "skillLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchMatchDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, default: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchMatchDto.prototype, "limit", void 0);


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JoinMatchDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
const match_entity_1 = __webpack_require__(63);
class JoinMatchDto {
}
exports.JoinMatchDto = JoinMatchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Midfielder' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JoinMatchDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: match_entity_1.Team }),
    (0, class_validator_1.IsEnum)(match_entity_1.Team),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof match_entity_1.Team !== "undefined" && match_entity_1.Team) === "function" ? _a : Object)
], JoinMatchDto.prototype, "preferredTeam", void 0);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvitePlayersDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
class InvitePlayersDto {
}
exports.InvitePlayersDto = InvitePlayersDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['123e4567-e89b-12d3-a456-426614174000'],
        type: [String],
        description: 'Array of player user IDs to invite'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], InvitePlayersDto.prototype, "playerIds", void 0);


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecordMatchResultDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
class RecordMatchResultDto {
}
exports.RecordMatchResultDto = RecordMatchResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], RecordMatchResultDto.prototype, "teamAScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], RecordMatchResultDto.prototype, "teamBScore", void 0);


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const notifications_service_1 = __webpack_require__(72);
const notifications_controller_1 = __webpack_require__(74);
const notification_entity_1 = __webpack_require__(73);
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([notification_entity_1.Notification])],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [notifications_service_1.NotificationsService],
        exports: [notifications_service_1.NotificationsService],
    })
], NotificationsModule);


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(12);
const notification_entity_1 = __webpack_require__(73);
let NotificationsService = class NotificationsService {
    constructor(notificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }
    async create(createNotificationDto) {
        const notification = this.notificationsRepository.create(createNotificationDto);
        return this.notificationsRepository.save(notification);
    }
    async createForUser(userId, type, title, message, data, actionUrl) {
        const notification = this.notificationsRepository.create({
            userId,
            type,
            title,
            message,
            data,
            actionUrl,
        });
        return this.notificationsRepository.save(notification);
    }
    async findAll(userId, searchDto) {
        const { type, read, page = 1, limit = 20 } = searchDto;
        const queryBuilder = this.notificationsRepository
            .createQueryBuilder('notification')
            .where('notification.userId = :userId', { userId });
        if (type) {
            queryBuilder.andWhere('notification.type = :type', { type });
        }
        if (read !== undefined) {
            queryBuilder.andWhere('notification.read = :read', { read });
        }
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        queryBuilder.orderBy('notification.createdAt', 'DESC');
        const [data, total] = await queryBuilder.getManyAndCount();
        const unreadCount = await this.notificationsRepository.count({
            where: { userId, read: false },
        });
        return { data, total, unreadCount, page, limit };
    }
    async findOne(id, userId) {
        const notification = await this.notificationsRepository.findOne({
            where: { id, userId },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return notification;
    }
    async markAsRead(id, userId) {
        const notification = await this.findOne(id, userId);
        if (!notification.read) {
            await this.notificationsRepository.update(id, {
                read: true,
                readAt: new Date(),
            });
        }
        return this.findOne(id, userId);
    }
    async markAllAsRead(userId) {
        const result = await this.notificationsRepository.update({ userId, read: false }, { read: true, readAt: new Date() });
        return { affected: result.affected || 0 };
    }
    async delete(id, userId) {
        const notification = await this.findOne(id, userId);
        await this.notificationsRepository.remove(notification);
    }
    async deleteAll(userId) {
        const result = await this.notificationsRepository.delete({ userId });
        return { affected: result.affected || 0 };
    }
    async getUnreadCount(userId) {
        return this.notificationsRepository.count({
            where: { userId, read: false },
        });
    }
    async notifyBookingConfirmed(userId, bookingId, pitchName, date) {
        return this.createForUser(userId, notification_entity_1.NotificationType.BOOKING_CONFIRMED, 'Booking Confirmed', `Your booking at ${pitchName} for ${date} has been confirmed.`, { bookingId }, `/bookings/${bookingId}`);
    }
    async notifyMatchInvitation(userId, matchId, organizerName) {
        return this.createForUser(userId, notification_entity_1.NotificationType.MATCH_INVITATION, 'Match Invitation', `${organizerName} has invited you to join a match.`, { matchId }, `/matches/${matchId}`);
    }
    async notifyReviewReceived(userId, reviewId, pitchName, rating) {
        return this.createForUser(userId, notification_entity_1.NotificationType.REVIEW_RECEIVED, 'New Review', `Your pitch ${pitchName} received a ${rating}-star review.`, { reviewId }, `/reviews/${reviewId}`);
    }
    async notifyPaymentSuccess(userId, paymentId, amount, currency) {
        return this.createForUser(userId, notification_entity_1.NotificationType.PAYMENT_SUCCESS, 'Payment Successful', `Your payment of ${amount} ${currency} was successful.`, { paymentId }, `/payments/${paymentId}`);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], NotificationsService);


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Notification = exports.NotificationType = void 0;
const typeorm_1 = __webpack_require__(12);
const user_entity_1 = __webpack_require__(13);
var NotificationType;
(function (NotificationType) {
    NotificationType["BOOKING_CONFIRMED"] = "booking_confirmed";
    NotificationType["BOOKING_CANCELLED"] = "booking_cancelled";
    NotificationType["BOOKING_REMINDER"] = "booking_reminder";
    NotificationType["PAYMENT_SUCCESS"] = "payment_success";
    NotificationType["PAYMENT_FAILED"] = "payment_failed";
    NotificationType["PAYMENT_REFUND"] = "payment_refund";
    NotificationType["MATCH_INVITATION"] = "match_invitation";
    NotificationType["MATCH_CONFIRMED"] = "match_confirmed";
    NotificationType["MATCH_CANCELLED"] = "match_cancelled";
    NotificationType["MATCH_REMINDER"] = "match_reminder";
    NotificationType["MATCH_RESULT"] = "match_result";
    NotificationType["REVIEW_RECEIVED"] = "review_received";
    NotificationType["REVIEW_RESPONSE"] = "review_response";
    NotificationType["SYSTEM_ANNOUNCEMENT"] = "system_announcement";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
let Notification = class Notification {
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], Notification.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NotificationType,
    }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "actionUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "read", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Notification.prototype, "readAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "sent", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Notification.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "pushSent", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "emailSent", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "smsSent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Notification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Notification.prototype, "expiresAt", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications')
], Notification);


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const notifications_service_1 = __webpack_require__(72);
const search_notification_dto_1 = __webpack_require__(75);
const jwt_auth_guard_1 = __webpack_require__(35);
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    findAll(req, searchDto) {
        return this.notificationsService.findAll(req.user.userId, searchDto);
    }
    async getUnreadCount(req) {
        const count = await this.notificationsService.getUnreadCount(req.user.userId);
        return { unreadCount: count };
    }
    findOne(id, req) {
        return this.notificationsService.findOne(id, req.user.userId);
    }
    markAsRead(id, req) {
        return this.notificationsService.markAsRead(id, req.user.userId);
    }
    markAllAsRead(req) {
        return this.notificationsService.markAllAsRead(req.user.userId);
    }
    remove(id, req) {
        return this.notificationsService.delete(id, req.user.userId);
    }
    deleteAll(req) {
        return this.notificationsService.deleteAll(req.user.userId);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user notifications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of notifications with unread count' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof search_notification_dto_1.SearchNotificationDto !== "undefined" && search_notification_dto_1.SearchNotificationDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread notification count' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unread notification count' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get notification details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification details' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark notification as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification marked as read' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('mark-all-read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All notifications marked as read' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete notification' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Notification deleted' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete all notifications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All notifications deleted' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "deleteAll", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _a : Object])
], NotificationsController);


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchNotificationDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
const class_transformer_1 = __webpack_require__(14);
const notification_entity_1 = __webpack_require__(73);
class SearchNotificationDto {
}
exports.SearchNotificationDto = SearchNotificationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: notification_entity_1.NotificationType }),
    (0, class_validator_1.IsEnum)(notification_entity_1.NotificationType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof notification_entity_1.NotificationType !== "undefined" && notification_entity_1.NotificationType) === "function" ? _a : Object)
], SearchNotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], SearchNotificationDto.prototype, "read", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchNotificationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 20, default: 20 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchNotificationDto.prototype, "limit", void 0);


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const admin_service_1 = __webpack_require__(77);
const admin_controller_1 = __webpack_require__(78);
const user_entity_1 = __webpack_require__(13);
const pitch_entity_1 = __webpack_require__(30);
const booking_entity_1 = __webpack_require__(38);
const payment_entity_1 = __webpack_require__(47);
const review_entity_1 = __webpack_require__(54);
const match_entity_1 = __webpack_require__(63);
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, pitch_entity_1.Pitch, booking_entity_1.Booking, payment_entity_1.Payment, review_entity_1.Review, match_entity_1.Match])],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
        exports: [admin_service_1.AdminService],
    })
], AdminModule);


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(12);
const user_entity_1 = __webpack_require__(13);
const pitch_entity_1 = __webpack_require__(30);
const booking_entity_1 = __webpack_require__(38);
const payment_entity_1 = __webpack_require__(47);
const review_entity_1 = __webpack_require__(54);
const match_entity_1 = __webpack_require__(63);
let AdminService = class AdminService {
    constructor(usersRepository, pitchesRepository, bookingsRepository, paymentsRepository, reviewsRepository, matchesRepository) {
        this.usersRepository = usersRepository;
        this.pitchesRepository = pitchesRepository;
        this.bookingsRepository = bookingsRepository;
        this.paymentsRepository = paymentsRepository;
        this.reviewsRepository = reviewsRepository;
        this.matchesRepository = matchesRepository;
    }
    async getAllUsers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [users, total] = await this.usersRepository.findAndCount({
            relations: ['playerProfile'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { data: users, total, page, limit };
    }
    async updateUserStatus(userId, status) {
        await this.usersRepository.update(userId, { status });
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['playerProfile'],
        });
        return user;
    }
    async updateUserRole(userId, role) {
        await this.usersRepository.update(userId, { role });
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['playerProfile'],
        });
        return user;
    }
    async deleteUser(userId) {
        await this.usersRepository.update(userId, {
            status: user_entity_1.UserStatus.DELETED,
            deletedAt: new Date(),
        });
    }
    async getAllPitches(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [pitches, total] = await this.pitchesRepository.findAndCount({
            relations: ['owner'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { data: pitches, total, page, limit };
    }
    async verifyPitch(pitchId, verified) {
        await this.pitchesRepository.update(pitchId, { verified });
        const pitch = await this.pitchesRepository.findOne({
            where: { id: pitchId },
            relations: ['owner'],
        });
        return pitch;
    }
    async getPlatformStatistics() {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const [totalUsers, activeUsers, totalPitches, verifiedPitches, totalBookings, recentBookings, totalPayments, totalRevenue, totalMatches, totalReviews, averageRating,] = await Promise.all([
            this.usersRepository.count(),
            this.usersRepository.count({ where: { status: user_entity_1.UserStatus.ACTIVE } }),
            this.pitchesRepository.count(),
            this.pitchesRepository.count({ where: { verified: true } }),
            this.bookingsRepository.count(),
            this.bookingsRepository.count({
                where: {
                    createdAt: (0, typeorm_2.Between)(thirtyDaysAgo, now),
                },
            }),
            this.paymentsRepository.count(),
            this.paymentsRepository
                .createQueryBuilder('payment')
                .select('SUM(payment.amount)', 'total')
                .where('payment.status = :status', { status: 'succeeded' })
                .getRawOne()
                .then((result) => parseFloat(result.total || '0')),
            this.matchesRepository.count(),
            this.reviewsRepository.count(),
            this.reviewsRepository
                .createQueryBuilder('review')
                .select('AVG(review.rating)', 'average')
                .getRawOne()
                .then((result) => parseFloat(result.average || '0')),
        ]);
        return {
            users: {
                total: totalUsers,
                active: activeUsers,
                suspended: totalUsers - activeUsers,
            },
            pitches: {
                total: totalPitches,
                verified: verifiedPitches,
                unverified: totalPitches - verifiedPitches,
            },
            bookings: {
                total: totalBookings,
                last30Days: recentBookings,
            },
            payments: {
                total: totalPayments,
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
            },
            matches: {
                total: totalMatches,
            },
            reviews: {
                total: totalReviews,
                averageRating: parseFloat(averageRating.toFixed(2)),
            },
        };
    }
    async getRecentActivity() {
        const limit = 20;
        const [recentUsers, recentBookings, recentPayments, recentReviews] = await Promise.all([
            this.usersRepository.find({
                order: { createdAt: 'DESC' },
                take: limit,
            }),
            this.bookingsRepository.find({
                relations: ['user', 'pitch'],
                order: { createdAt: 'DESC' },
                take: limit,
            }),
            this.paymentsRepository.find({
                relations: ['user', 'booking'],
                order: { createdAt: 'DESC' },
                take: limit,
            }),
            this.reviewsRepository.find({
                relations: ['user', 'pitch'],
                order: { createdAt: 'DESC' },
                take: limit,
            }),
        ]);
        return {
            recentUsers,
            recentBookings,
            recentPayments,
            recentReviews,
        };
    }
    async getFlaggedReviews(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [reviews, total] = await this.reviewsRepository.findAndCount({
            where: { flagged: true },
            relations: ['user', 'pitch'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { data: reviews, total, page, limit };
    }
    async moderateReview(reviewId, flagged, reason) {
        await this.reviewsRepository.update(reviewId, {
            flagged,
            flaggedReason: reason,
        });
        const review = await this.reviewsRepository.findOne({
            where: { id: reviewId },
            relations: ['user', 'pitch'],
        });
        return review;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(pitch_entity_1.Pitch)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(3, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(4, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(5, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, typeof (_f = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _f : Object])
], AdminService);


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const admin_service_1 = __webpack_require__(77);
const jwt_auth_guard_1 = __webpack_require__(35);
const admin_guard_1 = __webpack_require__(79);
const admin_dto_1 = __webpack_require__(80);
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    getAllUsers(page, limit) {
        return this.adminService.getAllUsers(page, limit);
    }
    updateUserStatus(id, updateStatusDto) {
        return this.adminService.updateUserStatus(id, updateStatusDto.status);
    }
    updateUserRole(id, updateRoleDto) {
        return this.adminService.updateUserRole(id, updateRoleDto.role);
    }
    deleteUser(id) {
        return this.adminService.deleteUser(id);
    }
    getAllPitches(page, limit) {
        return this.adminService.getAllPitches(page, limit);
    }
    verifyPitch(id, verifyDto) {
        return this.adminService.verifyPitch(id, verifyDto.verified);
    }
    getPlatformStatistics() {
        return this.adminService.getPlatformStatistics();
    }
    getRecentActivity() {
        return this.adminService.getRecentActivity();
    }
    getFlaggedReviews(page, limit) {
        return this.adminService.getFlaggedReviews(page, limit);
    }
    moderateReview(id, moderateDto) {
        return this.adminService.moderateReview(id, moderateDto.flagged, moderateDto.reason);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all users' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin access required' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user status (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User status updated' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin access required' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof admin_dto_1.UpdateUserStatusDto !== "undefined" && admin_dto_1.UpdateUserStatusDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Patch)('users/:id/role'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user role (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User role updated' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin access required' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof admin_dto_1.UpdateUserRoleDto !== "undefined" && admin_dto_1.UpdateUserRoleDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'User deleted' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin access required' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('pitches'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all pitches (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all pitches' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin access required' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllPitches", null);
__decorate([
    (0, common_1.Post)('pitches/:id/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify or unverify pitch (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pitch verification status updated' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin access required' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof admin_dto_1.VerifyPitchDto !== "undefined" && admin_dto_1.VerifyPitchDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "verifyPitch", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get platform statistics (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Platform statistics' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin access required' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPlatformStatistics", null);
__decorate([
    (0, common_1.Get)('activity'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent platform activity (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recent activity' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin access required' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRecentActivity", null);
__decorate([
    (0, common_1.Get)('reviews/flagged'),
    (0, swagger_1.ApiOperation)({ summary: 'Get flagged reviews (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of flagged reviews' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin access required' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getFlaggedReviews", null);
__decorate([
    (0, common_1.Post)('reviews/:id/moderate'),
    (0, swagger_1.ApiOperation)({ summary: 'Moderate review (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review moderated' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - admin access required' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "moderateReview", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof admin_service_1.AdminService !== "undefined" && admin_service_1.AdminService) === "function" ? _a : Object])
], AdminController);


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminGuard = void 0;
const common_1 = __webpack_require__(2);
const user_entity_1 = __webpack_require__(13);
let AdminGuard = class AdminGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        return true;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)()
], AdminGuard);


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VerifyPitchDto = exports.UpdateUserRoleDto = exports.UpdateUserStatusDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
const user_entity_1 = __webpack_require__(13);
class UpdateUserStatusDto {
}
exports.UpdateUserStatusDto = UpdateUserStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_entity_1.UserStatus }),
    (0, class_validator_1.IsEnum)(user_entity_1.UserStatus),
    __metadata("design:type", typeof (_a = typeof user_entity_1.UserStatus !== "undefined" && user_entity_1.UserStatus) === "function" ? _a : Object)
], UpdateUserStatusDto.prototype, "status", void 0);
class UpdateUserRoleDto {
}
exports.UpdateUserRoleDto = UpdateUserRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_entity_1.UserRole }),
    (0, class_validator_1.IsEnum)(user_entity_1.UserRole),
    __metadata("design:type", typeof (_b = typeof user_entity_1.UserRole !== "undefined" && user_entity_1.UserRole) === "function" ? _b : Object)
], UpdateUserRoleDto.prototype, "role", void 0);
class VerifyPitchDto {
}
exports.VerifyPitchDto = VerifyPitchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], VerifyPitchDto.prototype, "verified", void 0);


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssistantModule = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const assistant_service_1 = __webpack_require__(82);
const assistant_controller_1 = __webpack_require__(84);
const assistant_entity_1 = __webpack_require__(83);
const pitch_entity_1 = __webpack_require__(30);
const booking_entity_1 = __webpack_require__(38);
let AssistantModule = class AssistantModule {
};
exports.AssistantModule = AssistantModule;
exports.AssistantModule = AssistantModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([assistant_entity_1.AssistantConversation, assistant_entity_1.AssistantMessage, pitch_entity_1.Pitch, booking_entity_1.Booking])],
        controllers: [assistant_controller_1.AssistantController],
        providers: [assistant_service_1.AssistantService],
        exports: [assistant_service_1.AssistantService],
    })
], AssistantModule);


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssistantService = void 0;
const common_1 = __webpack_require__(2);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(12);
const assistant_entity_1 = __webpack_require__(83);
const pitch_entity_1 = __webpack_require__(30);
const booking_entity_1 = __webpack_require__(38);
let AssistantService = class AssistantService {
    constructor(conversationsRepository, messagesRepository, pitchesRepository, bookingsRepository) {
        this.conversationsRepository = conversationsRepository;
        this.messagesRepository = messagesRepository;
        this.pitchesRepository = pitchesRepository;
        this.bookingsRepository = bookingsRepository;
    }
    async sendMessage(userId, sendMessageDto) {
        const { message, pitchId, conversationId } = sendMessageDto;
        let conversation;
        if (conversationId) {
            const existing = await this.conversationsRepository.findOne({
                where: { id: conversationId, userId },
            });
            if (!existing) {
                throw new common_1.NotFoundException('Conversation not found');
            }
            conversation = existing;
        }
        else {
            conversation = this.conversationsRepository.create({
                userId,
                pitchId,
                title: message.substring(0, 50),
                status: assistant_entity_1.ConversationStatus.ACTIVE,
            });
            conversation = await this.conversationsRepository.save(conversation);
        }
        const userMessage = this.messagesRepository.create({
            conversationId: conversation.id,
            role: assistant_entity_1.MessageRole.USER,
            content: message,
        });
        await this.messagesRepository.save(userMessage);
        const responseContent = await this.generateResponse(message, pitchId, userId);
        const assistantMessage = this.messagesRepository.create({
            conversationId: conversation.id,
            role: assistant_entity_1.MessageRole.ASSISTANT,
            content: responseContent.message,
            metadata: responseContent.metadata,
        });
        await this.messagesRepository.save(assistantMessage);
        await this.conversationsRepository.update(conversation.id, {
            messageCount: conversation.messageCount + 2,
            lastMessageAt: new Date(),
        });
        const messages = await this.messagesRepository.find({
            where: { conversationId: conversation.id },
            order: { createdAt: 'ASC' },
        });
        return { conversation, messages };
    }
    async getConversation(userId, conversationId) {
        const conversation = await this.conversationsRepository.findOne({
            where: { id: conversationId, userId },
            relations: ['pitch'],
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const messages = await this.messagesRepository.find({
            where: { conversationId },
            order: { createdAt: 'ASC' },
        });
        return { conversation, messages };
    }
    async getUserConversations(userId) {
        return this.conversationsRepository.find({
            where: { userId },
            relations: ['pitch'],
            order: { lastMessageAt: 'DESC' },
        });
    }
    async checkAvailability(checkDto) {
        const { pitchId, date, startTime, endTime } = checkDto;
        const pitch = await this.pitchesRepository.findOne({
            where: { id: pitchId },
        });
        if (!pitch) {
            throw new common_1.NotFoundException('Pitch not found');
        }
        const bookings = await this.bookingsRepository.find({
            where: {
                pitchId,
                bookingDate: new Date(date),
                status: (0, typeorm_2.Between)(booking_entity_1.BookingStatus.PENDING, booking_entity_1.BookingStatus.CONFIRMED),
            },
        });
        const availableSlots = [];
        const startHour = 8;
        const endHour = 22;
        for (let hour = startHour; hour < endHour; hour += 2) {
            const slotStart = `${hour.toString().padStart(2, '0')}:00`;
            const slotEnd = `${(hour + 2).toString().padStart(2, '0')}:00`;
            const hasConflict = bookings.some((booking) => {
                return ((booking.startTime < slotEnd && booking.endTime > slotStart));
            });
            availableSlots.push({
                startTime: slotStart,
                endTime: slotEnd,
                available: !hasConflict,
                price: pitch.hourlyRate * 2,
            });
        }
        const availableCount = availableSlots.filter(s => s.available).length;
        let message = `For ${pitch.name} on ${date}, there are ${availableCount} available time slots:\n\n`;
        availableSlots.forEach((slot) => {
            if (slot.available) {
                message += `✅ ${slot.startTime} - ${slot.endTime} (${pitch.currency} ${slot.price})\n`;
            }
        });
        if (availableCount === 0) {
            message = `Unfortunately, ${pitch.name} is fully booked on ${date}. Please try another date or check our other available pitches.`;
        }
        return { pitch, date, availableSlots, message };
    }
    async generateResponse(message, pitchId, userId) {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('available') ||
            lowerMessage.includes('availability') ||
            lowerMessage.includes('free') ||
            lowerMessage.includes('book')) {
            if (pitchId) {
                const pitch = await this.pitchesRepository.findOne({
                    where: { id: pitchId },
                });
                if (pitch) {
                    return {
                        message: `I'd be happy to help you check availability for ${pitch.name}! 

To see available time slots, please let me know:
- Which date you're interested in (e.g., "tomorrow" or "December 15th")
- Your preferred time (morning, afternoon, or evening)

You can also use our availability checker to see real-time booking slots.

${pitch.name} Details:
📍 Location: ${pitch.city}, ${pitch.country}
💰 Hourly Rate: ${pitch.currency} ${pitch.hourlyRate}
⚽ Surface: ${pitch.surfaceType}
👥 Capacity: ${pitch.capacity} players
⭐ Rating: ${pitch.averageRating || 'New'}/5

How can I assist you further?`,
                        metadata: { intent: 'availability_check', pitchId },
                    };
                }
            }
            return {
                message: `I can help you check pitch availability! Please let me know which pitch you're interested in, and I'll show you all available time slots. You can browse our pitches and I'll provide real-time availability information.`,
                metadata: { intent: 'availability_check' },
            };
        }
        if (lowerMessage.includes('price') ||
            lowerMessage.includes('cost') ||
            lowerMessage.includes('fee') ||
            lowerMessage.includes('how much')) {
            if (pitchId) {
                const pitch = await this.pitchesRepository.findOne({
                    where: { id: pitchId },
                });
                if (pitch) {
                    return {
                        message: `Pricing for ${pitch.name}:

💰 Hourly Rate: ${pitch.currency} ${pitch.hourlyRate}
📅 Minimum Booking: 1 hour
⏰ Cancellation: Free cancellation up to ${pitch.minCancellationHours} hours before booking

For longer bookings, the total cost is calculated based on the duration:
- 2 hours: ${pitch.currency} ${pitch.hourlyRate * 2}
- 3 hours: ${pitch.currency} ${pitch.hourlyRate * 3}

We accept all major payment methods through our secure payment system. Would you like to make a booking?`,
                        metadata: { intent: 'pricing_query', pitchId },
                    };
                }
            }
            return {
                message: `I can provide pricing information for our pitches! Each pitch has its own hourly rate. To see specific pricing, please select a pitch and I'll provide detailed cost information including any special offers or packages available.`,
                metadata: { intent: 'pricing_query' },
            };
        }
        if (lowerMessage.includes('facilities') ||
            lowerMessage.includes('amenities') ||
            lowerMessage.includes('features')) {
            if (pitchId) {
                const pitch = await this.pitchesRepository.findOne({
                    where: { id: pitchId },
                });
                if (pitch) {
                    const amenities = pitch.amenities || [];
                    const amenitiesList = amenities.length > 0
                        ? amenities.map(a => `✓ ${a}`).join('\n')
                        : 'Standard facilities';
                    return {
                        message: `${pitch.name} - Facilities & Features:

${amenitiesList}

Surface Type: ${pitch.surfaceType}
${pitch.indoor ? '🏠 Indoor facility' : '🌤️ Outdoor facility'}
${pitch.lighting ? '💡 Floodlit for evening games' : ''}

Additional Information:
- Capacity: ${pitch.capacity} players
- Location: ${pitch.city}, ${pitch.country}

Would you like to know anything else about this pitch?`,
                        metadata: { intent: 'facilities_query', pitchId },
                    };
                }
            }
            return {
                message: `Our pitches come with various amenities including changing rooms, parking, showers, and more. Please select a specific pitch to see its complete list of facilities and features.`,
                metadata: { intent: 'facilities_query' },
            };
        }
        if (lowerMessage.includes('cancel') ||
            lowerMessage.includes('policy') ||
            lowerMessage.includes('refund')) {
            if (pitchId) {
                const pitch = await this.pitchesRepository.findOne({
                    where: { id: pitchId },
                });
                if (pitch) {
                    return {
                        message: `Booking & Cancellation Policy for ${pitch.name}:

📋 Booking Process:
1. Select your desired date and time
2. Complete secure payment
3. Receive instant confirmation

❌ Cancellation Policy:
- Free cancellation up to ${pitch.minCancellationHours} hours before your booking
- Cancellations within ${pitch.minCancellationHours} hours are non-refundable
- Full refund processed within 5-7 business days

💳 Payment:
- Secure payment via Stripe
- All major cards accepted
- Instant booking confirmation

Need help with a booking or cancellation?`,
                        metadata: { intent: 'policy_query', pitchId },
                    };
                }
            }
            return {
                message: `Our booking policy ensures fair treatment for both customers and pitch owners:

- Free cancellation with adequate notice (varies by pitch)
- Secure payment processing
- Instant booking confirmations
- Full refunds for eligible cancellations

Would you like to know about a specific pitch's cancellation policy?`,
                metadata: { intent: 'policy_query' },
            };
        }
        if (lowerMessage.includes('hello') ||
            lowerMessage.includes('hi') ||
            lowerMessage.includes('help')) {
            return {
                message: `Hello! 👋 I'm your 24/7 soccer pitch assistant. I'm here to help you with:

📅 **Check Availability** - Real-time booking slots
💰 **Pricing Information** - Transparent pricing and rates
🏟️ **Facility Details** - Amenities and features
📋 **Booking Assistance** - Help with reservations
❓ **Answer Questions** - General inquiries

What would you like to know? Feel free to ask about availability, pricing, facilities, or anything else!`,
                metadata: { intent: 'greeting' },
            };
        }
        return {
            message: `I'm here to assist you with pitch bookings! I can help you with:

- 🕐 Checking availability for specific dates
- 💵 Pricing and payment information
- 🏟️ Facility details and amenities
- 📝 Booking policies and cancellations
- ⚽ Match organization assistance

Please let me know what you'd like to know, or select a pitch to get started!`,
            metadata: { intent: 'general' },
        };
    }
    async resolveConversation(userId, conversationId) {
        const conversation = await this.conversationsRepository.findOne({
            where: { id: conversationId, userId },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        await this.conversationsRepository.update(conversationId, {
            status: assistant_entity_1.ConversationStatus.RESOLVED,
            resolvedAt: new Date(),
        });
        return this.conversationsRepository.findOne({
            where: { id: conversationId },
            relations: ['pitch'],
        });
    }
};
exports.AssistantService = AssistantService;
exports.AssistantService = AssistantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assistant_entity_1.AssistantConversation)),
    __param(1, (0, typeorm_1.InjectRepository)(assistant_entity_1.AssistantMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(pitch_entity_1.Pitch)),
    __param(3, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object])
], AssistantService);


/***/ }),
/* 83 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssistantMessage = exports.AssistantConversation = exports.ConversationStatus = exports.MessageRole = void 0;
const typeorm_1 = __webpack_require__(12);
const user_entity_1 = __webpack_require__(13);
const pitch_entity_1 = __webpack_require__(30);
var MessageRole;
(function (MessageRole) {
    MessageRole["USER"] = "user";
    MessageRole["ASSISTANT"] = "assistant";
    MessageRole["SYSTEM"] = "system";
})(MessageRole || (exports.MessageRole = MessageRole = {}));
var ConversationStatus;
(function (ConversationStatus) {
    ConversationStatus["ACTIVE"] = "active";
    ConversationStatus["RESOLVED"] = "resolved";
    ConversationStatus["ESCALATED"] = "escalated";
})(ConversationStatus || (exports.ConversationStatus = ConversationStatus = {}));
let AssistantConversation = class AssistantConversation {
};
exports.AssistantConversation = AssistantConversation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssistantConversation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AssistantConversation.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], AssistantConversation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AssistantConversation.prototype, "pitchId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pitch_entity_1.Pitch, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'pitchId' }),
    __metadata("design:type", typeof (_b = typeof pitch_entity_1.Pitch !== "undefined" && pitch_entity_1.Pitch) === "function" ? _b : Object)
], AssistantConversation.prototype, "pitch", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ConversationStatus,
        default: ConversationStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], AssistantConversation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AssistantConversation.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AssistantConversation.prototype, "messageCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], AssistantConversation.prototype, "lastMessageAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], AssistantConversation.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], AssistantConversation.prototype, "createdAt", void 0);
exports.AssistantConversation = AssistantConversation = __decorate([
    (0, typeorm_1.Entity)('assistant_conversations')
], AssistantConversation);
let AssistantMessage = class AssistantMessage {
};
exports.AssistantMessage = AssistantMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssistantMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AssistantMessage.prototype, "conversationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => AssistantConversation, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'conversationId' }),
    __metadata("design:type", AssistantConversation)
], AssistantMessage.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MessageRole,
    }),
    __metadata("design:type", String)
], AssistantMessage.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], AssistantMessage.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], AssistantMessage.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], AssistantMessage.prototype, "createdAt", void 0);
exports.AssistantMessage = AssistantMessage = __decorate([
    (0, typeorm_1.Entity)('assistant_messages')
], AssistantMessage);


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssistantController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const assistant_service_1 = __webpack_require__(82);
const assistant_dto_1 = __webpack_require__(85);
const jwt_auth_guard_1 = __webpack_require__(35);
let AssistantController = class AssistantController {
    constructor(assistantService) {
        this.assistantService = assistantService;
    }
    sendMessage(req, sendMessageDto) {
        return this.assistantService.sendMessage(req.user.userId, sendMessageDto);
    }
    getUserConversations(req) {
        return this.assistantService.getUserConversations(req.user.userId);
    }
    getConversation(id, req) {
        return this.assistantService.getConversation(req.user.userId, id);
    }
    resolveConversation(id, req) {
        return this.assistantService.resolveConversation(req.user.userId, id);
    }
    checkAvailability(checkDto) {
        return this.assistantService.checkAvailability(checkDto);
    }
};
exports.AssistantController = AssistantController;
__decorate([
    (0, common_1.Post)('message'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send message to AI assistant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message sent and response received' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof assistant_dto_1.SendMessageDto !== "undefined" && assistant_dto_1.SendMessageDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AssistantController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('conversations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user conversations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of conversations' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AssistantController.prototype, "getUserConversations", null);
__decorate([
    (0, common_1.Get)('conversations/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get conversation details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Conversation details with messages' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AssistantController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Post)('conversations/:id/resolve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Mark conversation as resolved' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Conversation resolved' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AssistantController.prototype, "resolveConversation", null);
__decorate([
    (0, common_1.Post)('check-availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Check pitch availability for specific date/time' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability information' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pitch not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof assistant_dto_1.CheckAvailabilityDto !== "undefined" && assistant_dto_1.CheckAvailabilityDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AssistantController.prototype, "checkAvailability", null);
exports.AssistantController = AssistantController = __decorate([
    (0, swagger_1.ApiTags)('assistant'),
    (0, common_1.Controller)('assistant'),
    __metadata("design:paramtypes", [typeof (_a = typeof assistant_service_1.AssistantService !== "undefined" && assistant_service_1.AssistantService) === "function" ? _a : Object])
], AssistantController);


/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckAvailabilityDto = exports.SendMessageDto = void 0;
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(20);
class SendMessageDto {
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'What are the available time slots for tomorrow?' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "pitchId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "conversationId", void 0);
class CheckAvailabilityDto {
}
exports.CheckAvailabilityDto = CheckAvailabilityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CheckAvailabilityDto.prototype, "pitchId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-15' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckAvailabilityDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '14:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CheckAvailabilityDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '16:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CheckAvailabilityDto.prototype, "endTime", void 0);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const app_module_1 = __webpack_require__(4);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1');
    app.enableCors({
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Proper Soccer Matcher API')
        .setDescription('API documentation for the soccer booking platform')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management')
        .addTag('pitches', 'Pitch management')
        .addTag('bookings', 'Booking management')
        .addTag('payments', 'Payment processing')
        .addTag('reviews', 'Review and rating system')
        .addTag('matches', 'Player matching system')
        .addTag('notifications', 'Notification system')
        .addTag('admin', 'Admin dashboard and management')
        .addTag('assistant', '24/7 AI pitch receptionist')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();

})();

/******/ })()
;