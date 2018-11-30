import { ICustomer, Customer } from "../models";

interface ICustomerService {
    getCustomers(): Promise<ICustomer[]>;
    getCustomerById(customerId: number): Promise<ICustomer | null>;
    getCustomersByName(searchString: string): Promise<ICustomer[]>;
    addNewCustomerRecord(customerRecord: Customer): Promise<boolean>; 
}

export {
    ICustomerService
};
