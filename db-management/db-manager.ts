import Mongoose = require('mongoose');
import { CustomerSchema } from '../db-schemas';
import { CustomerDocument } from '../models';

Mongoose.Promise = Promise;

let CustomerModel = Mongoose.model<CustomerDocument>('customers', 
    new Mongoose.Schema(CustomerSchema));

export {
    Mongoose,
    CustomerModel
};
