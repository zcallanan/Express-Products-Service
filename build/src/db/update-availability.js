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
var query_1 = __importDefault(require("./query"));
var pg_format_1 = __importDefault(require("pg-format"));
var redis_client_1 = require("../shared/redis-client");
var updateAvailability = function (manufacturers, product) { return __awaiter(void 0, void 0, void 0, function () {
    var productsQuery, tableIDs_1, datapayload_1, ind_1, availability_1, i_1, _i, manufacturers_1, manufacturer, result, manufacturerData, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                productsQuery = pg_format_1.default("SELECT %I, %I FROM %I", "id", "availability", product);
                return [4 /*yield*/, query_1.default(productsQuery)];
            case 1:
                tableIDs_1 = _a.sent();
                i_1 = 0;
                _i = 0, manufacturers_1 = manufacturers;
                _a.label = 2;
            case 2:
                if (!(_i < manufacturers_1.length)) return [3 /*break*/, 5];
                manufacturer = manufacturers_1[_i];
                return [4 /*yield*/, redis_client_1.getResult(manufacturer)];
            case 3:
                result = _a.sent();
                manufacturerData = result
                    ? JSON.parse(result)
                    : undefined;
                if (manufacturerData) {
                    manufacturerData[manufacturer].forEach(function (value) {
                        // Each value found in manufacturer's availability data
                        ind_1 = tableIDs_1.rows.findIndex(function (x) { return x.id === value.id.toLowerCase(); });
                        if (ind_1 !== -1) {
                            // ind equals -1 if id not found in data response (product records)
                            datapayload_1 = value.DATAPAYLOAD.match(/<INSTOCKVALUE>(.*)<\/INSTOCKVALUE>/);
                            if (datapayload_1) {
                                if (datapayload_1[1] === "OUTOFSTOCK") {
                                    availability_1 = "Out of Stock";
                                }
                                else if (datapayload_1[1] === "INSTOCK") {
                                    availability_1 = "In Stock";
                                }
                                else if (datapayload_1[1] === "LESSTHAN10") {
                                    availability_1 = "Less Than 10";
                                }
                            }
                            // If API response's availability differs from what is in the DB
                            if (availability_1 !== tableIDs_1.rows[ind_1].availability) {
                                i_1++;
                                var availabilityUpdate = pg_format_1.default("UPDATE %I SET %I = %L WHERE %I = %L", product, "availability", availability_1, "id", value.id.toLowerCase());
                                query_1.default(availabilityUpdate);
                            }
                        }
                    });
                }
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                console.log("Total availability updates for " + product + ": " + i_1);
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.default = updateAvailability;
