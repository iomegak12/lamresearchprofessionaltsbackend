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
const db_management_1 = require("./db-management");
const config_1 = require("./config");
class MainClass {
    static main() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let connectionString = config_1.Configuration.getConfiguration().getConnectionString();
                yield db_management_1.Mongoose.connect(connectionString, {
                    useNewUrlParser: true
                });
                let filteredCustomers = yield db_management_1.CustomerModel.find({ customerName: /Boll/i });
                for (let customer of filteredCustomers) {
                    console.log(customer.customerId + ', ' +
                        customer.customerName);
                }
            }
            catch (error) {
                console.error(`Error Occurred, Details : ${JSON.stringify(error)}`);
            }
            finally {
                yield db_management_1.Mongoose.disconnect();
            }
        });
    }
}
MainClass.main();
//# sourceMappingURL=index.js.map