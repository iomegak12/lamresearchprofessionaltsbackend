"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const socket_io_1 = __importDefault(require("socket.io"));
const express_jwt_1 = __importDefault(require("express-jwt"));
const routing_1 = require("../routing");
const utilities_1 = require("../utilities");
const constants_1 = require("../constants");
const DEFAULT_HTTP_ONLY = false;
const INVALID_PORT_NUMBER = 'Invalid Listener Port Specified!';
const INVALID_SSL_CERT_DETAILS = 'Invalid SSL Certificate Detail Specified!';
const INVALID_AUTH_SECRET_KEY = 'Invalid Secret Key for Authentication Specified!';
const CUSTOMERS_API = '/api/customers';
const AUTH_API = '/authenticate';
const PUBLIC_ROOT = '/';
class SingleNodeHosting {
    constructor(portNumber, httpsEnabled = DEFAULT_HTTP_ONLY, certificateDetails, authenticationDetails) {
        this.noOfClients = 0;
        if (!portNumber) {
            throw new Error(INVALID_PORT_NUMBER);
        }
        this.globalSecretKey = authenticationDetails.globalSecretKey;
        if (!this.globalSecretKey)
            throw new Error(INVALID_AUTH_SECRET_KEY);
        this.portNumber = portNumber;
        this.app = express_1.default();
        if (!httpsEnabled) {
            this.webServer = http_1.default.createServer(this.app);
        }
        else {
            let isCertificateValid = certificateDetails !== null &&
                certificateDetails.KEY_FILE && certificateDetails.CERT_FILE && certificateDetails.PASS_PHRASE;
            if (!isCertificateValid) {
                throw new Error(INVALID_SSL_CERT_DETAILS);
            }
            this.webServer = https_1.default.createServer({
                key: fs_1.default.readFileSync(certificateDetails.KEY_FILE),
                cert: fs_1.default.readFileSync(certificateDetails.CERT_FILE),
                passphrase: certificateDetails.PASS_PHRASE
            }, this.app);
        }
        this.socketIOServer = socket_io_1.default.listen(this.webServer);
        this.customerRouting = new routing_1.CustomerRouting(this.socketIOServer);
        this.authenticationRouting = new routing_1.AuthenticationRouting(this.globalSecretKey);
        this.configureMiddleware();
        this.configureSocketIOServer();
    }
    configureSocketIOServer() {
        if (this.socketIOServer) {
            this.socketIOServer.on('connection', socketClient => {
                let socketClientId = utilities_1.RandomGenerator.generate();
                this.noOfClients += 1;
                socketClient.id = socketClientId.toString();
                socketClient.on('disconnect', () => {
                    this.noOfClients -= 1;
                });
            });
        }
    }
    configureMiddleware() {
        this.app.use((error, request, response, next) => {
            if (error && error.constructor.name === 'UnauthorizedError') {
                response.status(constants_1.HttpStatusCodes.UNAUTHORIZED);
                return;
            }
            next();
        });
        this.app.use(body_parser_1.default.json());
        this.app.use(CUSTOMERS_API, express_jwt_1.default({
            secret: this.globalSecretKey
        }));
        this.app.use(CUSTOMERS_API, this.customerRouting.Router);
        this.app.use(AUTH_API, this.authenticationRouting.Router);
        this.app.use(PUBLIC_ROOT, express_1.default.static('public'));
    }
    start() {
        let promise = new Promise((resolve, reject) => {
            this.webServer.listen(this.portNumber, () => {
                resolve(true);
            });
        });
        return promise;
    }
    stop() {
        let promise = new Promise((resolve, reject) => {
            this.webServer.close(() => {
                resolve(true);
            });
        });
        return promise;
    }
}
exports.SingleNodeHosting = SingleNodeHosting;
//# sourceMappingURL=single-node-hosting.js.map