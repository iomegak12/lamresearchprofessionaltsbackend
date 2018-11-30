import { UserProfile } from "../models";

interface IUserProfileService {
    getUserProfile(userProfileId: string): Promise<UserProfile | null>;
}

export {
    IUserProfileService
};
