"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../utilities");
class Customer {
    constructor(customerId, customerName, address, email, phone, credit, status, remarks) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.credit = credit;
        this.status = status;
        this.remarks = remarks;
    }
    toString() {
        return utilities_1.ObjectFormatter.format(this);
    }
}
exports.Customer = Customer;
//# sourceMappingURL=customer.js.map