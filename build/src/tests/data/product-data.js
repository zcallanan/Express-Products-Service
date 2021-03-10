"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.glovesData = exports.facemasksData = exports.beaniesData = exports.glovesRedisRes = exports.facemasksRedisRes = exports.beaniesRedisRes = exports.glovesRes = exports.facemasksRes = exports.beaniesRes = void 0;
// getProduct array data
var beaniesData = [
    {
        id: "0016516931359f9277205a0f",
        name: "ILLEAKOL METROPOLIS STAR",
        type: "beanies",
        manufacturer: "ippal",
        color: "yellow, grey",
        price: 51,
        availability: "In Stock",
    },
    {
        id: "003911ce74aeef0d5c6250",
        name: "TAIAKSOP BRIGHT BUCK",
        type: "beanies",
        manufacturer: "juuran",
        color: "green",
        price: 44,
        availability: "Availability Unknown",
    },
];
exports.beaniesData = beaniesData;
var facemasksData = [
    {
        id: "01fe877cbe49cd19a45a",
        name: "OOTGINKOL ANIMAL FANTASY",
        type: "facemasks",
        manufacturer: "umpante",
        color: "black",
        price: 62,
        availability: "Less Than 10",
    },
    {
        id: "077a1b3093954816e5fd",
        name: "NYYYOOT RAIN",
        type: "facemasks",
        manufacturer: "abiplos",
        color: "green",
        price: 79,
        availability: "Out of Stock",
    },
];
exports.facemasksData = facemasksData;
var glovesData = [
    {
        id: "001ffc6816f71dbdc0d59",
        name: "SOPIL BOON",
        type: "gloves",
        manufacturer: "niksleh",
        color: "green, purple",
        price: 65,
        availability: "In Stock",
    },
    {
        id: "3d4706451baa173f5ae12b0",
        name: "UPSOPAK CITY ROOM",
        type: "gloves",
        manufacturer: "laion",
        color: "red",
        price: 51,
        availability: "Out of Stock",
    },
];
exports.glovesData = glovesData;
// getProduct DB query responses
var beaniesRes = {
    beanies: beaniesData,
};
exports.beaniesRes = beaniesRes;
var facemasksRes = {
    facemasks: facemasksData,
};
exports.facemasksRes = facemasksRes;
var glovesRes = {
    gloves: glovesData,
};
exports.glovesRes = glovesRes;
// getProduct Redis responses
var beaniesRedisRes = {
    beanies_test: beaniesData,
};
exports.beaniesRedisRes = beaniesRedisRes;
var facemasksRedisRes = {
    facemasks_test: facemasksData,
};
exports.facemasksRedisRes = facemasksRedisRes;
var glovesRedisRes = {
    gloves_test: glovesData,
};
exports.glovesRedisRes = glovesRedisRes;
