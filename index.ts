import { SingleNodeHosting } from "./hosting";

const DEFAULT_LISTENER_PORT = 8899;
const DEFAULT_HTTP_ONLY = false;
const DEFAULT_KEY_FILE = './key.pem';
const DEFAULT_CERT_FILE = './cert.pem';
const DEFAULT_PASS_PHRASE = 'Prestige123$$/?';
const DEFAULT_GLOBAL_SECRET_KEY = "Lam Research, Bangalore";

class MainClass {
    public static main(): void {
        let portNumber = parseInt(process.env.LISTENER_PORT || '') || DEFAULT_LISTENER_PORT;
        let httpsEnabled = (process.env.ENABLE_HTTPS || '') === 'true' || DEFAULT_HTTP_ONLY;
        let certificateDetails = {
            KEY_FILE: process.env.KEY_FILE || DEFAULT_KEY_FILE,
            CERT_FILE: process.env.CERT_FILE || DEFAULT_CERT_FILE,
            PASS_PHRASE: process.env.PASS_PHRASE || DEFAULT_PASS_PHRASE
        };

        let authenticationDetails = {
            globalSecretKey: process.env.GLOBAL_SECRET_KEY || DEFAULT_GLOBAL_SECRET_KEY
        };

        let hosting = new SingleNodeHosting(
            portNumber, httpsEnabled, certificateDetails, authenticationDetails);

        let shutdown = () => {
            hosting
                .stop()
                .then(() => {
                    console.info('REST Service Stopped Successfully!');

                    process.exit();
                });
        };

        process.on('exit', shutdown);
        process.on('SIGINT', shutdown);

        hosting
            .start()
            .then(() => console.info('REST Service Started Successfully!'));
    }
}

MainClass.main();
