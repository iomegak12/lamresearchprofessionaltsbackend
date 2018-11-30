import { IAuthenticationService } from "./iauthentication-service";
import { UserProfileService } from "./user-profile-service";

const INVALID_CREDENTIALS = 'Invalid Credentials Specified!';
const INVALID_USER_PROFILE = 'Invalid User Profile Details Specified!';

class AuthenticationService implements IAuthenticationService {
    async authenticate(userName: string, password: string): Promise<boolean> {
        let validation = userName !== null && password !== null;

        if (!validation)
            throw new Error(INVALID_CREDENTIALS);

        let userProfileService = new UserProfileService();
        let userProfile = await userProfileService.getUserProfile(userName);

        if (!userProfile) {
            throw new Error(INVALID_USER_PROFILE);
        }

        let authenticationStatus = userProfile.password === password;

        return authenticationStatus;
    }
}

export {
    AuthenticationService
};
