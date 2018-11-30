import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import https from 'https';
import net from 'net';
import fs from 'fs';
import socketio from 'socket.io';
import expressJwt from 'express-jwt';

import { CustomerRouting, AuthenticationRouting } from '../routing';
import { RandomGenerator } from '../utilities';
import { HttpStatusCodes } from '../constants';

const DEFAULT_HTTP_ONLY = false;
const INVALID_PORT_NUMBER = 'Invalid Listener Port Specified!';
const INVALID_SSL_CERT_DETAILS = 'Invalid SSL Certificate Detail Specified!';
const INVALID_AUTH_SECRET_KEY = 'Invalid Secret Key for Authentication Specified!';
const CUSTOMERS_API = '/api/customers';
const AUTH_API = '/authenticate';
const PUBLIC_ROOT = '/';

class SingleNodeHosting {
    private portNumber: number;
    private app: express.Application;
    private webServer: net.Server;
    private customerRouting: CustomerRouting;
    private authenticationRouting: AuthenticationRouting;
    private socketIOServer: socketio.Server;
    private noOfClients: number = 0;
    private globalSecretKey: string;

    constructor(portNumber: number, httpsEnabled: boolean = DEFAULT_HTTP_ONLY,
        certificateDetails?: any,
        authenticationDetails?: any) {

        if (!portNumber) {
            throw new Error(INVALID_PORT_NUMBER);
        }

        this.globalSecretKey = authenticationDetails.globalSecretKey;

        if (!this.globalSecretKey)
            throw new Error(INVALID_AUTH_SECRET_KEY);

        this.portNumber = portNumber;
        this.app = express();

        if (!httpsEnabled) {
            this.webServer = http.createServer(this.app);
        }
        else {
            let isCertificateValid = certificateDetails !== null &&
                certificateDetails.KEY_FILE && certificateDetails.CERT_FILE && certificateDetails.PASS_PHRASE;

            if (!isCertificateValid) {
                throw new Error(INVALID_SSL_CERT_DETAILS);
            }

            this.webServer = https.createServer({
                key: fs.readFileSync(certificateDetails.KEY_FILE),
                cert: fs.readFileSync(certificateDetails.CERT_FILE),
                passphrase: certificateDetails.PASS_PHRASE
            }, this.app);
        }

        this.socketIOServer = socketio.listen(this.webServer);
        this.customerRouting = new CustomerRouting(this.socketIOServer);
        this.authenticationRouting = new AuthenticationRouting(this.globalSecretKey);

        this.configureMiddleware();
        this.configureSocketIOServer();
    }

    private configureSocketIOServer(): void {
        if (this.socketIOServer) {
            this.socketIOServer.on('connection', socketClient => {
                let socketClientId = RandomGenerator.generate();

                this.noOfClients += 1;

                socketClient.id = socketClientId.toString();
                socketClient.on('disconnect', () => {
                    this.noOfClients -= 1;
                });
            });
        }
    }

    private configureMiddleware(): void {
        this.app.use(
            (error: any, request: any, response: any, next: any) => {
                if (error && error.constructor.name === 'UnauthorizedError') {
                    response.status(HttpStatusCodes.UNAUTHORIZED);

                    return;
                }

                next();
            });

        this.app.use(bodyParser.json());
        this.app.use(CUSTOMERS_API, expressJwt({
            secret: this.globalSecretKey
        }));

        this.app.use(CUSTOMERS_API, this.customerRouting.Router);
        this.app.use(AUTH_API, this.authenticationRouting.Router);
        this.app.use(PUBLIC_ROOT, express.static('public'));
    }

    start(): Promise<boolean> {
        let promise = new Promise<boolean>(
            (resolve, reject) => {
                this.webServer.listen(this.portNumber, () => {
                    resolve(true);
                });
            });

        return promise;
    }

    stop(): Promise<boolean> {
        let promise = new Promise<boolean>(
            (resolve, reject) => {
                this.webServer.close(() => {
                    resolve(true);
                });
            });

        return promise;
    }
}

export {
    SingleNodeHosting
};
