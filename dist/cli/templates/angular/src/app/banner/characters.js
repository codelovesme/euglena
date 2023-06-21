"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createA = exports.createN = exports.createL = exports.createG = exports.createU = exports.createE = void 0;
var createCharacterCreate = function (parts) { return function (offset) { return ({
    parts: parts,
    offset: offset,
}); }; };
exports.createE = createCharacterCreate([
    { x: 10, y: 10, w: 40, h: 200 },
    { x: 50, y: 10, w: 120, h: 40 },
    { x: 50, y: 90, w: 80, h: 40 },
    { x: 50, y: 170, w: 120, h: 40 },
]);
exports.createU = createCharacterCreate([
    { x: 10, y: 10, w: 40, h: 200 },
    { x: 50, y: 170, w: 120, h: 40 },
    { x: 170, y: 10, w: 40, h: 200 },
]);
exports.createG = createCharacterCreate([
    { x: 10, y: 10, w: 40, h: 200 },
    { x: 50, y: 10, w: 160, h: 40 },
    { x: 50, y: 170, w: 120, h: 40 },
    { x: 170, y: 90, w: 40, h: 120 },
    { x: 90, y: 90, w: 80, h: 40 },
]);
exports.createL = createCharacterCreate([
    { x: 10, y: 10, w: 40, h: 200 },
    { x: 50, y: 170, w: 130, h: 40 },
]);
exports.createN = createCharacterCreate([
    { x: 10, y: 10, w: 40, h: 200 },
    { x: 170, y: 10, w: 40, h: 200 },
    { x: 50, y: 10, w: 40, h: 40 },
    { x: 50, y: 50, w: 60, h: 40 },
    { x: 70, y: 90, w: 80, h: 40 },
    { x: 110, y: 130, w: 60, h: 40 },
    { x: 130, y: 170, w: 40, h: 40 },
]);
exports.createA = createCharacterCreate([
    { x: 10, y: 10, w: 40, h: 200 },
    { x: 150, y: 10, w: 40, h: 200 },
    { x: 50, y: 10, w: 100, h: 40 },
    { x: 50, y: 90, w: 100, h: 40 },
]);
//# sourceMappingURL=characters.js.map