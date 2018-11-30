"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const constants_1 = require("../constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const INVALID_SECRET_KEY = 'Invalid Secret Key Specified for Signature!';
const TEN_MINUTES = '10m';
class AuthenticationRouting {
    constructor(globalSecretKey) {
        this.globalSecretKey = globalSecretKey;
        if (!this.globalSecretKey) {
            throw new Error(INVALID_SECRET_KEY);
        }
        this.router = express_1.default.Router();
        this.authenticationService = new services_1.AuthenticationService();
        this.userProfileService = new services_1.UserProfileService();
        this.initializeRouting();
    }
    initializeRouting() {
        this.router.post('/', (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let body = request.body;
                let userProfileName = body.userName;
                let password = body.password;
                let validation = userProfileName !== null &&
                    password !== null && userProfileName !== password;
                if (!validation) {
                    response.status(constants_1.HttpStatusCodes.BAD_REQUEST).send();
                    return;
                }
                let authenticationStatus = yield this.authenticationService.authenticate(userProfileName, password);
                if (!authenticationStatus) {
                    response.status(constants_1.HttpStatusCodes.UNAUTHORIZED).send();
                    return;
                }
                let userProfile = yield this.userProfileService.getUserProfile(userProfileName);
                if (!userProfile) {
                    response.status(constants_1.HttpStatusCodes.BAD_REQUEST);
                    return;
                }
                let { userId, email, title, department } = userProfile;
                let safeUserProfile = {
                    userId,
                    email,
                    title,
                    department
                };
                let token = jsonwebtoken_1.default.sign(safeUserProfile, this.globalSecretKey, {
                    expiresIn: TEN_MINUTES
                });
                response.status(constants_1.HttpStatusCodes.OK).send({
                    token
                });
            }
            catch (error) {
                response
                    .status(constants_1.HttpStatusCodes.SERVER_ERROR)
                    .send(error);
            }
        }));
    }
    get Router() {
        return this.router;
    }
}
exports.AuthenticationRouting = AuthenticationRouting;
//# sourceMappingURL=authentication-routing.js.map