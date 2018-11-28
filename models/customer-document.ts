import {ICustomer } from './icustomer';
import { Mongoose } from '../db-management';

interface CustomerDocument extends ICustomer, Mongoose.Document {

}

export {
    CustomerDocument
};
