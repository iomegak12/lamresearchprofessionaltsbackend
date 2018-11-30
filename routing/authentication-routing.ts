import express from 'express';
import {
    IAuthenticationService, IUserProfileService,
    AuthenticationService, UserProfileService
} from '../services';
import { HttpStatusCodes } from '../constants';
import jwt from 'jsonwebtoken';

const INVALID_SECRET_KEY = 'Invalid Secret Key Specified for Signature!';
const TEN_MINUTES = '10m';

class AuthenticationRouting {
    private router: express.Router;
    private authenticationService: IAuthenticationService;
    private userProfileService: IUserProfileService;

    constructor(private globalSecretKey: string) {
        if (!this.globalSecretKey) {
            throw new Error(INVALID_SECRET_KEY);
        }

        this.router = express.Router();
        this.authenticationService = new AuthenticationService();
        this.userProfileService = new UserProfileService();

        this.initializeRouting();
    }

    private initializeRouting(): void {
        this.router.post('/', async (request, response) => {
            try {
                let body = request.body;
                let userProfileName = body.userName;
                let password = body.password;
                let validation = userProfileName !== null &&
                    password !== null && userProfileName !== password;

                if (!validation) {
                    response.status(HttpStatusCodes.BAD_REQUEST).send();

                    return;
                }

                let authenticationStatus = await this.authenticationService.authenticate(userProfileName, password);

                if (!authenticationStatus) {
                    response.status(HttpStatusCodes.UNAUTHORIZED).send();

                    return;
                }

                let userProfile = await this.userProfileService.getUserProfile(userProfileName);

                if (!userProfile) {
                    response.status(HttpStatusCodes.BAD_REQUEST);

                    return;
                }

                let { userId, email, title, department } = userProfile;
                let safeUserProfile = {
                    userId,
                    email,
                    title,
                    department
                };

                let token = jwt.sign(safeUserProfile, this.globalSecretKey, {
                    expiresIn: TEN_MINUTES
                });

                response.status(HttpStatusCodes.OK).send({
                    token
                });
            } catch (error) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send(error);
            }
        });
    }

    public get Router() {
        return this.router;
    }
}

export {
    AuthenticationRouting
};
