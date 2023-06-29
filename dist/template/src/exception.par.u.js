"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createException = exports.isException = void 0;
var core_1 = require("@euglena/core");
var isException = function (particle) {
    return (0, core_1.isParticleClass)(particle, "Exception");
};
exports.isException = isException;
exports.createException = core_1.cp;
//# sourceMappingURL=exception.par.u.js.map