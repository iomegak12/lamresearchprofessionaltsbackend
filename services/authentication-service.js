"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_profile_service_1 = require("./user-profile-service");
const INVALID_CREDENTIALS = 'Invalid Credentials Specified!';
const INVALID_USER_PROFILE = 'Invalid User Profile Details Specified!';
class AuthenticationService {
    authenticate(userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let validation = userName !== null && password !== null;
            if (!validation)
                throw new Error(INVALID_CREDENTIALS);
            let userProfileService = new user_profile_service_1.UserProfileService();
            let userProfile = yield userProfileService.getUserProfile(userName);
            if (!userProfile) {
                throw new Error(INVALID_USER_PROFILE);
            }
            let authenticationStatus = userProfile.password === password;
            return authenticationStatus;
        });
    }
}
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication-service.js.map