"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
exports.Mongoose = Mongoose;
const db_schemas_1 = require("../db-schemas");
Mongoose.Promise = Promise;
let CustomerModel = Mongoose.model('customers', new Mongoose.Schema(db_schemas_1.CustomerSchema));
exports.CustomerModel = CustomerModel;
//# sourceMappingURL=db-manager.js.map