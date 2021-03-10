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
var update_availability_1 = __importDefault(require("../db/update-availability"));
var redis_client_1 = require("./redis-client");
var constants_1 = require("./constants");
var redis_1 = __importDefault(require("redis"));
var subscriber = redis_1.default.createClient({ url: constants_1.REDIS_URL });
var client = redis_client_1.getClient();
var subscriberInit = function () {
    var listString = constants_1.NODE_ENV === "test" ? "manufacturer-list_test" : "manufacturer-list";
    var updateString = constants_1.NODE_ENV === "test" ? "update-ready_test" : "update-ready";
    var cache = constants_1.NODE_ENV === "test" ? constants_1.TEST_CACHE_TIMER : constants_1.CACHE_TIMER;
    // Redis subscriber to determine when to update availability column
    subscriber.on("pmessage", function (pattern, channel, message) { return __awaiter(void 0, void 0, void 0, function () {
        var manufacturerResult, manufacturers_1, updateResult, updateReady;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("(" +
                        pattern +
                        ")" +
                        " client received message on " +
                        channel +
                        ": " +
                        message);
                    if (!(channel === constants_1.KEY_EVENT_SET && !constants_1.IGNORE_LIST.includes(message))) return [3 /*break*/, 3];
                    return [4 /*yield*/, redis_client_1.getResult(listString)];
                case 1:
                    manufacturerResult = _b.sent();
                    manufacturers_1 = manufacturerResult
                        ? JSON.parse(manufacturerResult)
                        : undefined;
                    return [4 /*yield*/, redis_client_1.getResult(updateString)];
                case 2:
                    updateResult = _b.sent();
                    updateReady = updateResult
                        ? JSON.parse(updateResult)
                        : undefined;
                    if (manufacturers_1) {
                        if (manufacturers_1[listString].includes(message)) {
                            if (!updateReady) {
                                updateReady = (_a = {}, _a[updateString] = [message], _a);
                                console.log("init updateReady:", updateReady);
                            }
                            else if (!updateReady[updateString].includes(message)) {
                                updateReady[updateString].push(message);
                                console.log("push", updateReady);
                            }
                            client.set(updateString, JSON.stringify(updateReady), "EX", cache);
                        }
                        if (updateReady) {
                            if (message === updateString && updateReady[updateString].length === manufacturers_1[listString].length) {
                                console.log("Update is a go", manufacturers_1[listString], updateReady[updateString]);
                                constants_1.PRODUCT_LIST.forEach(function (product, index) {
                                    return setTimeout(update_availability_1.default, 100 * index, manufacturers_1[listString], product);
                                });
                            }
                        }
                    }
                    _b.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); });
    subscriber.psubscribe("__key*__:*");
    return subscriber;
};
exports.default = subscriberInit;
