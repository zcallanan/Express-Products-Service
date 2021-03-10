"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Convert fetchMock data to getProduct API response format
var process_colors_1 = __importDefault(require("./process-colors"));
var createResponse = function (array, val, val_two) {
    return array.map(function (_a, index) {
        var item = __rest(_a, []);
        // Create a copy or TypeScript complains
        var copy = {
            id: "",
            type: "",
            name: "",
            color: "",
            manufacturer: "",
            price: 0
        };
        Object.assign(copy, item);
        index === 0
            ? (copy["availability"] = val)
            : (copy["availability"] = val_two);
        copy["color"] = process_colors_1.default(item.color);
        return copy;
    });
};
exports.default = createResponse;
