"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var processColors = function (colorArray) {
    var colors = "";
    if (colorArray.length > 1) {
        colorArray.forEach(function (color, index) {
            colorArray.length - 1 === index
                ? (colors += "" + color)
                : (colors += color + ", ");
        });
    }
    else {
        colors = colorArray[0];
    }
    return colors;
};
exports.default = processColors;
