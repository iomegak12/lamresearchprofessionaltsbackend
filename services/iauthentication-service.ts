interface IAuthenticationService {
    authenticate(userName: string, password: string): Promise<boolean>;
}

export {
    IAuthenticationService
};
