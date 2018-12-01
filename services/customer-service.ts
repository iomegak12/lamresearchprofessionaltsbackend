import { ICustomerService } from "./icustomer-service";
import { Configuration } from "../config";
import { ICustomer, Customer } from "../models";
import { Mongoose, CustomerModel } from "../db-management";

const INVALID_ARGUMENTS = "Invalid Argument(s) Specified!";
const BUSINESS_VALIDATION_FAILED = "Business Validation Failed for Search String!";
const MIN_CREDIT = 1000;
const MIN_LENGTH = 3;

class CustomerService implements ICustomerService {
    private connectionString: string;
    private badKeywords: Set<string> = new Set<string>();

    constructor() {
        this.connectionString = Configuration.getConfiguration().getConnectionString();

        this.badKeywords.add('worse');
        this.badKeywords.add('not-good');
        this.badKeywords.add('bad');
    }

    async getCustomers(): Promise<ICustomer[]> {
        let customers: ICustomer[];

        try {
            await Mongoose.connect(this.connectionString, {
                useNewUrlParser: true
            });

            customers = await CustomerModel.find({});
        } catch (error) {
            throw error;
        } finally {
            await Mongoose.disconnect();
        }

        return customers;
    }

    async getCustomerById(customerId: number): Promise<ICustomer | null> {
        let filteredCustomer: ICustomer | null;

        if (!customerId)
            throw new Error(INVALID_ARGUMENTS);

        try {
            await Mongoose.connect(this.connectionString, {
                useNewUrlParser: true
            });

            filteredCustomer = await CustomerModel.findOne({ customerId: customerId });
        } catch (error) {
            throw error;
        } finally {
            await Mongoose.disconnect();
        }

        return filteredCustomer;
    }

    async getCustomersByName(searchString: string): Promise<ICustomer[]> {
        let filteredCustomers: ICustomer[];

        let validation = searchString && searchString.length >= MIN_LENGTH &&
            !this.badKeywords.has(searchString);

        if (!validation)
            throw new Error(BUSINESS_VALIDATION_FAILED);

        try {
            await Mongoose.connect(this.connectionString, {
                useNewUrlParser: true
            });

            filteredCustomers = await CustomerModel.find({
                customerName: {
                    $regex: searchString,
                    $options: '-i'
                }
            });
        } catch (error) {
            throw error;
        } finally {
            await Mongoose.disconnect();
        }

        return filteredCustomers;
    }

    async addNewCustomerRecord(customerRecord: Customer): Promise<boolean> {
        let status: boolean = false;

        let validation = customerRecord !== null &&
            customerRecord.customerId && customerRecord.customerName && customerRecord.credit >= MIN_CREDIT;

        if (!validation)
            throw new Error(BUSINESS_VALIDATION_FAILED);

        try {
            await Mongoose.connect(this.connectionString, {
                useNewUrlParser: true
            });

            let addedRecord = await CustomerModel.create(customerRecord);

            status = addedRecord !== null && addedRecord._id != null;
        } catch (error) {
            throw error;
        } finally {
            await Mongoose.disconnect();
        }

        return status;
    }
}

export {
    CustomerService
};
