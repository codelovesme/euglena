"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcrypt = void 0;
var organelle_1 = require("../../organelle");
var bcrypt = {
    v1: organelle_1.domc(["Hash", "Compare"], ["Exception", "ACK", "HashedPassword", "CompareResult"])
};
exports.bcrypt = bcrypt;
//# sourceMappingURL=bcrypt.js.map