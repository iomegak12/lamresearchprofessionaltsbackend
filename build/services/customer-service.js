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
const config_1 = require("../config");
const db_management_1 = require("../db-management");
const INVALID_ARGUMENTS = "Invalid Argument(s) Specified!";
const BUSINESS_VALIDATION_FAILED = "Business Validation Failed for Search String!";
const MIN_CREDIT = 1000;
const MIN_LENGTH = 3;
class CustomerService {
    constructor() {
        this.badKeywords = new Set();
        this.connectionString = config_1.Configuration.getConfiguration().getConnectionString();
        this.badKeywords.add('worse');
        this.badKeywords.add('not-good');
        this.badKeywords.add('bad');
    }
    getCustomers() {
        return __awaiter(this, void 0, void 0, function* () {
            let customers;
            try {
                yield db_management_1.Mongoose.connect(this.connectionString, {
                    useNewUrlParser: true
                });
                customers = yield db_management_1.CustomerModel.find({});
            }
            catch (error) {
                throw error;
            }
            finally {
                yield db_management_1.Mongoose.disconnect();
            }
            return customers;
        });
    }
    getCustomerById(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let filteredCustomer;
            if (!customerId)
                throw new Error(INVALID_ARGUMENTS);
            try {
                yield db_management_1.Mongoose.connect(this.connectionString, {
                    useNewUrlParser: true
                });
                filteredCustomer = yield db_management_1.CustomerModel.findOne({ customerId: customerId });
            }
            catch (error) {
                throw error;
            }
            finally {
                yield db_management_1.Mongoose.disconnect();
            }
            return filteredCustomer;
        });
    }
    getCustomersByName(searchString) {
        return __awaiter(this, void 0, void 0, function* () {
            let filteredCustomers;
            let validation = searchString && searchString.length >= MIN_LENGTH &&
                !this.badKeywords.has(searchString);
            if (!validation)
                throw new Error(BUSINESS_VALIDATION_FAILED);
            try {
                yield db_management_1.Mongoose.connect(this.connectionString, {
                    useNewUrlParser: true
                });
                filteredCustomers = yield db_management_1.CustomerModel.find({
                    customerName: {
                        $regex: searchString,
                        $options: '-i'
                    }
                });
            }
            catch (error) {
                throw error;
            }
            finally {
                yield db_management_1.Mongoose.disconnect();
            }
            return filteredCustomers;
        });
    }
    addNewCustomerRecord(customerRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            let status = false;
            let validation = customerRecord !== null &&
                customerRecord.customerId && customerRecord.customerName && customerRecord.credit >= MIN_CREDIT;
            if (!validation)
                throw new Error(BUSINESS_VALIDATION_FAILED);
            try {
                yield db_management_1.Mongoose.connect(this.connectionString, {
                    useNewUrlParser: true
                });
                let addedRecord = yield db_management_1.CustomerModel.create(customerRecord);
                status = addedRecord !== null && addedRecord._id != null;
            }
            catch (error) {
                throw error;
            }
            finally {
                yield db_management_1.Mongoose.disconnect();
            }
            return status;
        });
    }
}
exports.CustomerService = CustomerService;
