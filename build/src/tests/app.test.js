"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jest_fetch_mock_1 = require("jest-fetch-mock");
jest_fetch_mock_1.enableFetchMocks();
var http_1 = __importDefault(require("http"));
var index_1 = __importDefault(require("../index"));
var supertest_1 = __importDefault(require("supertest"));
var redis_client_1 = require("../shared/redis-client");
var constants_1 = require("../shared/constants");
var setup_jest_1 = require("./config/setup-jest");
var fetch_products_1 = __importDefault(require("../fetch/fetch-products"));
var subscriber_init_1 = __importDefault(require("../shared/subscriber-init"));
var insert_data_1 = require("./data/insert-data");
var delete_data_1 = require("./data/delete-data");
var product_data_1 = require("./data/product-data");
var update_data_1 = require("./data/update-data");
var client = redis_client_1.getClient();
var server = http_1.default.createServer(index_1.default);
server.listen(3020);
var subscriber;
var reset = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, setup_jest_1.truncTables()];
            case 1:
                _a.sent();
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { return resolve("Done"); }, 500); })];
            case 2:
                _a.sent();
                return [4 /*yield*/, setup_jest_1.insertRows()];
            case 3:
                _a.sent();
                return [4 /*yield*/, client.flushall()];
            case 4:
                _a.sent();
                return [2 /*return*/, 1];
        }
    });
}); };
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, subscriber_init_1.default()];
            case 1:
                subscriber = _a.sent();
                return [4 /*yield*/, reset()];
            case 2:
                _a.sent();
                return [2 /*return*/, 1];
        }
    });
}); });
afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { return resolve("Done"); }, 500); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, client.quit()];
            case 2:
                _a.sent();
                return [4 /*yield*/, subscriber.quit()];
            case 3:
                _a.sent();
                return [4 /*yield*/, server.close()];
            case 4:
                _a.sent();
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { return resolve("Done"); }, 500); })];
            case 5:
                _a.sent();
                return [2 /*return*/, 1];
        }
    });
}); });
describe("GET product data should fail", function () {
    test("Request with no token", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(index_1.default)
                        .get("/")
                        .set({
                        "X-VERSION": "v2",
                        "X-PRODUCT": "beanies",
                    })
                        .expect(401)
                        .expect("Proper authorization credentials were not provided.")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test("Request with the wrong token", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(index_1.default)
                        .get("/")
                        .set({
                        "X-WEB-TOKEN": "Squirrel1",
                        "X-VERSION": "v2",
                        "X-PRODUCT": "beanies",
                    })
                        .expect(403)
                        .expect("Invalid authentication credentials.")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test("Right credentials, nonexistent product", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(index_1.default)
                        .get("/")
                        .set({
                        "X-WEB-TOKEN": constants_1.ACCESS_TOKEN_SECRET,
                        "X-VERSION": "v2",
                        "X-PRODUCT": "tophats",
                    })
                        .expect(404)
                        .expect("The requested product tophats does not exist.")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("GET product data should succeed", function () {
    test("Request beanies product data succeeds", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(index_1.default)
                        .get("/")
                        .set({
                        "X-WEB-TOKEN": constants_1.ACCESS_TOKEN_SECRET,
                        "X-VERSION": "v2",
                        "X-PRODUCT": "beanies",
                    })
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .expect(product_data_1.beaniesRes)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test("Requesting beanies again gives a res from Redis", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(index_1.default)
                        .get("/")
                        .set({
                        "X-WEB-TOKEN": constants_1.ACCESS_TOKEN_SECRET,
                        "X-VERSION": "v2",
                        "X-PRODUCT": "beanies",
                    })
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .expect(product_data_1.beaniesRedisRes)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test("Request facemasks product data succeeds", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(index_1.default)
                        .get("/")
                        .set({
                        "X-WEB-TOKEN": constants_1.ACCESS_TOKEN_SECRET,
                        "X-VERSION": "v2",
                        "X-PRODUCT": "facemasks",
                    })
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .expect(product_data_1.facemasksRes)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test("Requesting facemasks again gives a res from Redis", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(index_1.default)
                        .get("/")
                        .set({
                        "X-WEB-TOKEN": constants_1.ACCESS_TOKEN_SECRET,
                        "X-VERSION": "v2",
                        "X-PRODUCT": "facemasks",
                    })
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .expect(product_data_1.facemasksRedisRes)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test("Request gloves product data succeeds", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(index_1.default)
                        .get("/")
                        .set({
                        "X-WEB-TOKEN": constants_1.ACCESS_TOKEN_SECRET,
                        "X-VERSION": "v2",
                        "X-PRODUCT": "gloves",
                    })
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .expect(product_data_1.glovesRes)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test("Requesting gloves again gives a res from Redis", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(index_1.default)
                        .get("/")
                        .set({
                        "X-WEB-TOKEN": constants_1.ACCESS_TOKEN_SECRET,
                        "X-VERSION": "v2",
                        "X-PRODUCT": "gloves",
                    })
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .expect(product_data_1.glovesRedisRes)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("DB actions should succeed", function () {
    test("INSERT data, UPDATE product availability", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Product data by default has no availability set, so an update is required as part of this test
                    fetchMock.mockResponses([JSON.stringify(insert_data_1.insertData), { status: 200 }], [JSON.stringify(insert_data_1.ippalData), { status: 200 }], [JSON.stringify(insert_data_1.juuranData), { status: 200 }], [JSON.stringify(insert_data_1.abiplosData), { status: 200 }]);
                    // Flush Redis
                    client.flushall();
                    // Insert a new value into DB
                    return [4 /*yield*/, fetch_products_1.default("beanies")];
                case 1:
                    // Insert a new value into DB
                    _a.sent();
                    // Give time for Insert/Update
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { return resolve("Done"); }, 150); })];
                case 2:
                    // Give time for Insert/Update
                    _a.sent();
                    // Test response
                    return [4 /*yield*/, supertest_1.default(index_1.default)
                            .get("/")
                            .set({
                            "X-WEB-TOKEN": constants_1.ACCESS_TOKEN_SECRET,
                            "X-VERSION": "v2",
                            "X-PRODUCT": "beanies",
                        })
                            .expect("Content-Type", /json/)
                            .expect(200)
                            .expect(insert_data_1.insertRes)];
                case 3:
                    // Test response
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test("DELETE data", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reset()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { return resolve("Done"); }, 100); })];
                case 2:
                    _a.sent();
                    fetchMock.mockResponses([JSON.stringify(delete_data_1.deleteData), { status: 200 }], [JSON.stringify(insert_data_1.ippalData), { status: 200 }]);
                    // Insert a new value into DB
                    return [4 /*yield*/, fetch_products_1.default("beanies")];
                case 3:
                    // Insert a new value into DB
                    _a.sent();
                    // Give time for Delete
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { return resolve("Done"); }, 100); })];
                case 4:
                    // Give time for Delete
                    _a.sent();
                    // Test response
                    return [4 /*yield*/, supertest_1.default(index_1.default)
                            .get("/")
                            .set({
                            "X-WEB-TOKEN": constants_1.ACCESS_TOKEN_SECRET,
                            "X-VERSION": "v2",
                            "X-PRODUCT": "beanies",
                        })
                            .expect("Content-Type", /json/)
                            .expect(200)
                            .expect(delete_data_1.deleteRes)];
                case 5:
                    // Test response
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test("UPDATE product name, manufacturer, price, colors", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reset()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { return resolve("Done"); }, 100); })];
                case 2:
                    _a.sent();
                    fetchMock.mockResponses([JSON.stringify(update_data_1.updateData), { status: 200 }], [JSON.stringify(update_data_1.hennexData), { status: 200 }], [JSON.stringify(update_data_1.abiFData), { status: 200 }]);
                    // Update values
                    return [4 /*yield*/, fetch_products_1.default("facemasks")];
                case 3:
                    // Update values
                    _a.sent();
                    // Give time for Update
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { return resolve("Done"); }, 100); })];
                case 4:
                    // Give time for Update
                    _a.sent();
                    // Test response
                    return [4 /*yield*/, supertest_1.default(index_1.default)
                            .get("/")
                            .set({
                            "X-WEB-TOKEN": constants_1.ACCESS_TOKEN_SECRET,
                            "X-VERSION": "v2",
                            "X-PRODUCT": "facemasks",
                        })
                            .expect("Content-Type", /json/)
                            .expect(200)
                            .expect(update_data_1.updateRes)];
                case 5:
                    // Test response
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
