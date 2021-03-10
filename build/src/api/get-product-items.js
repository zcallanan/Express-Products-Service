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
var query = require("../db/query.js");
var format = require("pg-format");
var _a = require("../shared/constants.js"), PRODUCT_LIST = _a.PRODUCT_LIST, CACHE_TIMER = _a.CACHE_TIMER, TEST_CACHE_TIMER = _a.TEST_CACHE_TIMER, NODE_ENV = _a.NODE_ENV;
var _b = require("../shared/redis-client.js"), getRedisValue = _b.getRedisValue, getResult = _b.getResult, client = _b.client;
var getProductItems = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productReq, product_1, result, _a, _b, _c, _d, _e, resValue, id, queryString, cache, rename, err_1;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 10, , 11]);
                productReq = req.header("X-PRODUCT");
                product_1 = PRODUCT_LIST.includes(productReq) ? productReq : null;
                if (!!product_1) return [3 /*break*/, 1];
                res
                    .status(404)
                    .send("The requested product " + productReq + " does not exist.");
                return [3 /*break*/, 9];
            case 1:
                if (!(NODE_ENV === "test")) return [3 /*break*/, 3];
                _c = (_b = JSON).parse;
                return [4 /*yield*/, getResult(product_1 + "_test")];
            case 2:
                _a = _c.apply(_b, [_f.sent()]);
                return [3 /*break*/, 5];
            case 3:
                _e = (_d = JSON).parse;
                return [4 /*yield*/, getResult(product_1)];
            case 4:
                _a = _e.apply(_d, [_f.sent()]);
                _f.label = 5;
            case 5:
                result = _a;
                resValue = {};
                if (!!result) return [3 /*break*/, 7];
                id = "id";
                queryString = format("SELECT * FROM %I ORDER BY %I", product_1, id);
                return [4 /*yield*/, query(queryString)];
            case 6:
                result = _f.sent();
                resValue[product_1] = result.rows;
                cache = NODE_ENV === "test" ? TEST_CACHE_TIMER : CACHE_TIMER;
                // Add _test to product
                if (NODE_ENV === "test")
                    product_1 = product_1 + "_test";
                // Save object to redis as a hash
                client.set(product_1, JSON.stringify(resValue), "EX", cache);
                return [3 /*break*/, 8];
            case 7:
                // If there is a hash
                if (NODE_ENV === "test") {
                    rename = void 0;
                    if (product_1 === "beanies") {
                        rename = function (_a) {
                            var _b = product_1, beanies_test = _a[_b];
                            return ({ beanies_test: beanies_test });
                        };
                    }
                    else if (product_1 === "facemasks") {
                        rename = function (_a) {
                            var _b = product_1, facemasks_test = _a[_b];
                            return ({ facemasks_test: facemasks_test });
                        };
                    }
                    else if (product_1 === "gloves") {
                        rename = function (_a) {
                            var _b = product_1, gloves_test = _a[_b];
                            return ({ gloves_test: gloves_test });
                        };
                    }
                    resValue = rename(result);
                }
                else {
                    resValue = result;
                }
                _f.label = 8;
            case 8:
                res.json(resValue);
                _f.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                err_1 = _f.sent();
                console.log("getProduct failed!");
                console.log(err_1);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
module.exports = getProductItems;
