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
const models_1 = require("../models");
const INVALID_UESR_PROFILE_ID = 'Invalid User Profile Id Specified!';
class UserProfileService {
    constructor() {
        this.userProfiles = new Set([
            new models_1.UserProfile('USER1011', 'admin@123', 'user1011@email-info.com', 'Executive', 'IT'),
            new models_1.UserProfile('USER1012', 'admin@123', 'user1012@email-info.com', 'Executive', 'IT'),
            new models_1.UserProfile('USER1013', 'admin@123', 'user1013@email-info.com', 'Executive', 'Business'),
            new models_1.UserProfile('USER1014', 'admin@123', 'user1014@email-info.com', 'Executive', 'Marketing'),
            new models_1.UserProfile('USER1015', 'admin@123', 'user1015@email-info.com', 'Executive', 'HR')
        ]);
    }
    getUserProfile(userProfileId) {
        return __awaiter(this, void 0, void 0, function* () {
            let filteredUserProfile = null;
            if (!userProfileId) {
                throw new Error(INVALID_UESR_PROFILE_ID);
            }
            for (let userProfile of this.userProfiles) {
                if (userProfile.userId === userProfileId) {
                    filteredUserProfile = userProfile;
                    break;
                }
            }
            return filteredUserProfile;
        });
    }
}
exports.UserProfileService = UserProfileService;
//# sourceMappingURL=user-profile-service.js.map