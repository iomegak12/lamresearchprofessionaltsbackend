"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const constants_1 = require("../constants");
const models_1 = require("../models");
const NEW_CUSTOMER_EVENT = 'NewCustomerRecord';
class CustomerRouting {
    constructor(socketIOServer) {
        this.socketIOServer = socketIOServer;
        this.router = express_1.default.Router();
        this.customerService = new services_1.CustomerService();
        this.initializeRouteTable();
    }
    initializeRouteTable() {
        this.router.get('/', (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let customers = yield this.customerService.getCustomers();
                response
                    .status(constants_1.HttpStatusCodes.OK)
                    .send(customers);
            }
            catch (error) {
                response
                    .status(constants_1.HttpStatusCodes.SERVER_ERROR)
                    .send(error);
            }
        }));
        this.router.get('/:customerId', (request, response) => __awaiter(this, void 0, void 0, function* () {
            let customerId = parseInt(request.params.customerId);
            if (!customerId) {
                response.status(constants_1.HttpStatusCodes.BAD_REQUEST).send();
                return;
            }
            try {
                let filteredCustomer = yield this.customerService.getCustomerById(customerId);
                if (!filteredCustomer)
                    response.status(constants_1.HttpStatusCodes.NOT_FOUND);
                else {
                    response
                        .status(constants_1.HttpStatusCodes.OK)
                        .send(filteredCustomer);
                }
            }
            catch (error) {
                response
                    .status(constants_1.HttpStatusCodes.SERVER_ERROR)
                    .send(error);
            }
        }));
        this.router.get('/search/:searchString', (request, response) => __awaiter(this, void 0, void 0, function* () {
            let searchString = request.params.searchString;
            if (!searchString) {
                response.status(constants_1.HttpStatusCodes.BAD_REQUEST).send();
                return;
            }
            try {
                let filteredCustomers = yield this.customerService.getCustomersByName(searchString);
                response
                    .status(constants_1.HttpStatusCodes.OK)
                    .send(filteredCustomers);
            }
            catch (error) {
                response
                    .status(constants_1.HttpStatusCodes.SERVER_ERROR)
                    .send(error);
            }
        }));
        this.router.post('/', (request, response) => __awaiter(this, void 0, void 0, function* () {
            let body = request.body;
            let customer = new models_1.Customer(body.customerId, body.customerName, body.address, body.email, body.phone, body.credit, body.status, body.remarks);
            if (!customer) {
                response.status(constants_1.HttpStatusCodes.BAD_REQUEST).send();
                return;
            }
            try {
                let status = yield this.customerService.addNewCustomerRecord(customer);
                if (status) {
                    if (this.socketIOServer) {
                        this.socketIOServer.emit(NEW_CUSTOMER_EVENT, customer);
                    }
                }
                response
                    .status(constants_1.HttpStatusCodes.OK)
                    .send(status);
            }
            catch (error) {
                response
                    .status(constants_1.HttpStatusCodes.SERVER_ERROR)
                    .send(error);
            }
        }));
    }
    get Router() {
        return this.router;
    }
}
exports.CustomerRouting = CustomerRouting;
