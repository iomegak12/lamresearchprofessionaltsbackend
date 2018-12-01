"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_MONGO_SERVER = 'localhost';
const DEFAULT_MONGO_PORT = 27017;
const DEFAULT_MONGO_DB = 'lamresearchdb';
class Configuration {
    static getConfiguration() {
        let settings = {
            mongoServerName: process.env.MONGO_SERVER || DEFAULT_MONGO_SERVER,
            mongoPort: process.env.MONGO_PORT || DEFAULT_MONGO_PORT,
            mongoDbName: process.env.MONGO_DB || DEFAULT_MONGO_DB,
            getConnectionString: function () {
                let connectionString = `mongodb://${this.mongoServerName}:${this.mongoPort}/${this.mongoDbName}`;
                return connectionString;
            }
        };
        return settings;
    }
}
exports.Configuration = Configuration;
