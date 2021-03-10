"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertRes = exports.abiplosData = exports.juuranData = exports.ippalData = exports.insertData = void 0;
var create_response_1 = __importDefault(require("../../shared/create-response"));
// FetchMock data for db insertion
var insertData = [
    {
        id: "0016516931359f9277205a0f",
        name: "ILLEAKOL METROPOLIS STAR",
        type: "beanies",
        manufacturer: "ippal",
        color: ["yellow", "grey"],
        price: 51,
    },
    {
        id: "003911ce74aeef0d5c6250",
        name: "TAIAKSOP BRIGHT BUCK",
        type: "beanies",
        manufacturer: "juuran",
        color: ["green"],
        price: 44,
    },
    {
        id: "91afd5d90ff9a173b5be",
        name: "REVUPVE BUCK",
        type: "beanies",
        manufacturer: "abiplos",
        color: ["grey"],
        price: 91,
    },
];
exports.insertData = insertData;
// Insert response to be tested
var insertRes = {
    beanies: create_response_1.default(insertData, "In Stock", "Out of Stock"),
};
exports.insertRes = insertRes;
// Fetchmock manufacturer availability data
var ippalData = {
    code: 200,
    response: [
        {
            id: "0016516931359F9277205A0F",
            DATAPAYLOAD: "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>INSTOCK</INSTOCKVALUE>\n</AVAILABILITY>",
        },
    ],
};
exports.ippalData = ippalData;
var juuranData = {
    code: 200,
    response: [
        {
            id: "003911CE74AEEF0D5C6250",
            DATAPAYLOAD: "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>OUTOFSTOCK</INSTOCKVALUE>\n</AVAILABILITY>",
        },
    ],
};
exports.juuranData = juuranData;
var abiplosData = {
    code: 200,
    response: [
        {
            id: "91AFD5D90FF9A173B5BE",
            DATAPAYLOAD: "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>OUTOFSTOCK</INSTOCKVALUE>\n</AVAILABILITY>",
        },
    ],
};
exports.abiplosData = abiplosData;
