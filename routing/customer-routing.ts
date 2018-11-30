import express from 'express';
import { ICustomerService, CustomerService } from '../services';
import { HttpStatusCodes } from '../constants';
import { Customer } from '../models';
import socketio from 'socket.io';

const NEW_CUSTOMER_EVENT = 'NewCustomerRecord';

class CustomerRouting {
    private router: express.Router;
    private customerService: ICustomerService;

    constructor(private socketIOServer?: socketio.Server) {
        this.router = express.Router();
        this.customerService = new CustomerService();

        this.initializeRouteTable();
    }

    private initializeRouteTable(): void {
        this.router.get('/', async (request, response) => {
            try {
                let customers = await this.customerService.getCustomers();

                response
                    .status(HttpStatusCodes.OK)
                    .send(customers);
            } catch (error) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send(error);
            }
        });

        this.router.get('/:customerId', async (request, response) => {
            let customerId = parseInt(request.params.customerId);

            if (!customerId) {
                response.status(HttpStatusCodes.BAD_REQUEST).send();

                return;
            }

            try {
                let filteredCustomer = await this.customerService.getCustomerById(customerId);

                if (!filteredCustomer)
                    response.status(HttpStatusCodes.NOT_FOUND);
                else {
                    response
                        .status(HttpStatusCodes.OK)
                        .send(filteredCustomer);
                }
            } catch (error) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send(error);
            }
        });

        this.router.get('/search/:searchString', async (request, response) => {
            let searchString = request.params.searchString;

            if (!searchString) {
                response.status(HttpStatusCodes.BAD_REQUEST).send();

                return;
            }

            try {
                let filteredCustomers = await this.customerService.getCustomersByName(searchString);

                response
                    .status(HttpStatusCodes.OK)
                    .send(filteredCustomers);
            } catch (error) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send(error);
            }
        });

        this.router.post('/', async (request, response) => {
            let body = request.body;
            let customer: Customer = new Customer(
                body.customerId, body.customerName, body.address,
                body.email, body.phone, body.credit, body.status, body.remarks);

            if (!customer) {
                response.status(HttpStatusCodes.BAD_REQUEST).send();

                return;
            }

            try {
                let status = await this.customerService.addNewCustomerRecord(customer);

                if (status) {
                    if (this.socketIOServer) {
                        this.socketIOServer.emit(NEW_CUSTOMER_EVENT, customer);
                    }
                }

                response
                    .status(HttpStatusCodes.OK)
                    .send(status);
            } catch (error) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send(error);
            }
        });
    }

    public get Router() {
        return this.router;
    }
}

export {
    CustomerRouting
};
