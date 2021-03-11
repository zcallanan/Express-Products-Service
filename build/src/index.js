"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var get_product_items_1 = __importDefault(require("./api/get-product-items"));
var cron_fetch_1 = __importDefault(require("./jobs/cron-fetch"));
var subscriber_init_1 = __importDefault(require("./shared/subscriber-init"));
var constants_1 = require("./shared/constants");
var app = express_1.default();
// Port
var port = constants_1.NODE_ENV === "test" ? 3020 : constants_1.PORT;
app.set("port", port);
if (constants_1.NODE_ENV !== "test")
    app.listen(app.get("port"), function () {
        console.log("Server listening on port " + app.get("port"));
    });
// Handle CORS
app.use(cors_1.default());
if (constants_1.NODE_ENV === "development") {
    // Run DB update Job every CRON_IN_MINUTES
    cron_fetch_1.default();
    // Subscribe to Redis keyspace channels
    subscriber_init_1.default();
}
// Auth
app.get("*", function (req, res, next) {
    var token = req.header("X-WEB-TOKEN");
    if (!token) {
        return res
            .status(401)
            .send("Proper authorization credentials were not provided."); // If there isn't any token
    }
    else if (token !== constants_1.ACCESS_TOKEN_SECRET) {
        return res.status(403).send("Invalid authentication credentials."); // If wrong token
    }
    else {
        next();
    }
});
// Return custom API response from DB
app.get("/", function (req, res) {
    get_product_items_1.default(req, res);
});
exports.default = app;
