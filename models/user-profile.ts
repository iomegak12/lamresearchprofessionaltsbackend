import { ObjectFormatter } from "../utilities";

class UserProfile {
    constructor(public userId: string, public password: string, public email: string,
        public title: string, public department: string) {
    }

    toString() {
        return ObjectFormatter.format(this);
    }
}

export {
    UserProfile
};
