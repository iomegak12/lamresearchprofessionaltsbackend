import { Mongoose, CustomerModel } from "./db-management";
import { Configuration } from "./config";

class MainClass {
    public static async main() {
        try {
            let connectionString = Configuration.getConfiguration().getConnectionString();

            await Mongoose.connect(connectionString, {
                useNewUrlParser: true
            });

            let filteredCustomers = await CustomerModel.find({ customerName: /Boll/i });

            for(let customer of filteredCustomers) {
                console.log(customer.customerId + ', ' +
                    customer.customerName);
            }

        } catch (error) {
            console.error(`Error Occurred, Details : ${JSON.stringify(error)}`);
        }
        finally {
            await Mongoose.disconnect();
        }
    }
}

MainClass.main();
