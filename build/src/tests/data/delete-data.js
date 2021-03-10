"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRes = exports.deleteData = void 0;
var create_response_1 = __importDefault(require("../../shared/create-response"));
var deleteData = [
    {
        id: "0016516931359f9277205a0f",
        name: "ILLEAKOL METROPOLIS STAR",
        type: "beanies",
        manufacturer: "ippal",
        color: ["yellow", "grey"],
        price: 51,
    },
];
exports.deleteData = deleteData;
var deleteRes = {
    beanies: create_response_1.default(deleteData, "In Stock", "Out of Stock"),
};
exports.deleteRes = deleteRes;
