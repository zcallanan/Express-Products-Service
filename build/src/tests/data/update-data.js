"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.abiFData = exports.hennexData = exports.updateRes = exports.updateData = void 0;
var create_response_1 = __importDefault(require("../../shared/create-response"));
var updateData = [
    {
        id: "01fe877cbe49cd19a45a",
        name: "OOTGINKOL ANIMAL UPDATED",
        type: "facemasks",
        manufacturer: "hennex",
        color: ["black", "blue"],
        price: 100,
    },
    {
        id: "077a1b3093954816e5fd",
        name: "NYYYOOT RAIN",
        type: "facemasks",
        manufacturer: "abiplos",
        color: ["green"],
        price: 79,
    },
];
exports.updateData = updateData;
var hennexData = {
    code: 200,
    response: [
        {
            id: "01FE877CBE49CD19A45A",
            DATAPAYLOAD: "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>LESSTHAN10</INSTOCKVALUE>\n</AVAILABILITY>",
        },
    ],
};
exports.hennexData = hennexData;
var abiFData = {
    code: 200,
    response: [
        {
            id: "077A1B3093954816E5FD",
            DATAPAYLOAD: "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>OUTOFSTOCK</INSTOCKVALUE>\n</AVAILABILITY>",
        },
    ],
};
exports.abiFData = abiFData;
var updateRes = {
    facemasks: create_response_1.default(updateData, "Less Than 10", "Out of Stock"),
};
exports.updateRes = updateRes;
