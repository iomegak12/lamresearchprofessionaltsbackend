import { ObjectFormatter } from "../utilities";
import { ICustomer } from "./icustomer";

class Customer implements ICustomer {
    constructor(public customerId: number,
        public customerName: string, public address: string,
        public email: string, public phone: string,
        public credit: number, public status: boolean, public remarks: string) {
    }
        
    toString() {
        return ObjectFormatter.format(this);
    }
}

export {
    Customer
};
