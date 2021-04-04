"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt = void 0;
var organelle_1 = require("../../organelle");
var jwt = {
    v1: organelle_1.domc(["VerifyToken", "VerifyToken"], ["Token", "Exception", "ACK"])
};
exports.jwt = jwt;
//# sourceMappingURL=jwt.js.map