import { IUserProfileService } from "./iuser-profile-service";
import { UserProfile } from "../models";

const INVALID_UESR_PROFILE_ID = 'Invalid User Profile Id Specified!';

class UserProfileService implements IUserProfileService {
    private userProfiles: Set<UserProfile>;

    constructor() {
        this.userProfiles = new Set<UserProfile>(
            [
                new UserProfile('USER1011', 'admin@123', 'user1011@email-info.com', 'Executive', 'IT'),
                new UserProfile('USER1012', 'admin@123', 'user1012@email-info.com', 'Executive', 'IT'),
                new UserProfile('USER1013', 'admin@123', 'user1013@email-info.com', 'Executive', 'Business'),
                new UserProfile('USER1014', 'admin@123', 'user1014@email-info.com', 'Executive', 'Marketing'),
                new UserProfile('USER1015', 'admin@123', 'user1015@email-info.com', 'Executive', 'HR')
            ]);
    }

    async getUserProfile(userProfileId: string): Promise<UserProfile | null> {
        let filteredUserProfile: UserProfile | null = null;

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
    }
}

export {
    UserProfileService
};
