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
var node_fetch_1 = __importDefault(require("node-fetch"));
var fetch_availability_1 = __importDefault(require("./fetch-availability"));
var insert_product_1 = __importDefault(require("../db/insert-product"));
var delete_product_1 = __importDefault(require("../db/delete-product"));
var redis_client_1 = require("../shared/redis-client");
var process_colors_1 = __importDefault(require("../shared/process-colors"));
var constants_js_1 = require("../shared/constants.js");
var client = redis_client_1.getClient();
var fetchProductData = function (product) { return __awaiter(void 0, void 0, void 0, function () {
    var productIDs, manufacturers, url, data, response, listString, cache, result, manufacturersFetched, _i, manufacturers_1, manufacturer, err_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                productIDs = [];
                manufacturers = [];
                url = "" + constants_js_1.PRODUCT_URL + product;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 10, , 11]);
                return [4 /*yield*/, node_fetch_1.default(url)];
            case 2:
                response = _c.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                data = _c.sent();
                return [4 /*yield*/, Array.isArray(data)];
            case 4:
                if (!((_c.sent()) && data.length)) return [3 /*break*/, 7];
                // If response is an array and has length
                // Keep DB in sync with latest API call by deleting records
                delete_product_1.default(product, productIDs);
                return [4 /*yield*/, data.forEach(function (item) {
                        // Build manufacturers array
                        if (!manufacturers.includes(item.manufacturer))
                            constants_js_1.NODE_ENV === "test"
                                ? manufacturers.push(item.manufacturer + "_test")
                                : manufacturers.push(item.manufacturer);
                        // Build an array of product IDs
                        productIDs.push(item.id);
                        // Process colors
                        var colors = process_colors_1.default(item.color);
                        // Test if an ID exists in the product's DB, insert else update
                        insert_product_1.default(product, item, colors);
                    })];
            case 5:
                _c.sent();
                listString = constants_js_1.NODE_ENV === "test" ? "manufacturer-list_test" : "manufacturer-list";
                cache = constants_js_1.NODE_ENV === "test" ? constants_js_1.TEST_CACHE_TIMER : constants_js_1.CACHE_TIMER;
                return [4 /*yield*/, redis_client_1.getResult(listString)];
            case 6:
                result = _c.sent();
                manufacturersFetched = (result) ? JSON.parse(result) : undefined;
                for (_i = 0, manufacturers_1 = manufacturers; _i < manufacturers_1.length; _i++) {
                    manufacturer = manufacturers_1[_i];
                    if (!manufacturersFetched) {
                        manufacturersFetched = (_a = {},
                            _a[listString] = [],
                            _a);
                        console.log("init", manufacturersFetched);
                    }
                    if (!manufacturersFetched[listString].includes(manufacturer)) {
                        // IF not in Redis, fetch it
                        console.log("Calling to fetch", manufacturersFetched[listString], "does not include", manufacturer);
                        fetch_availability_1.default(manufacturer, product);
                        // Save manufacturer to Redis
                        manufacturersFetched[listString].push(manufacturer);
                        client.set(listString, JSON.stringify((_b = {},
                            _b[listString] = manufacturersFetched[listString],
                            _b)), "EX", cache);
                    }
                }
                return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, !Array.isArray(data.response)];
            case 8:
                if (_c.sent()) {
                    // Make the request again
                    console.log("failed to fetch " + product + " try again!");
                    fetchProductData(product);
                }
                _c.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                err_1 = _c.sent();
                fetchProductData(product);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.default = fetchProductData;
