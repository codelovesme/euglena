"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var particle_1 = require("@euglena/particle");
var organelle_1 = require("@euglena/organelle");
var common_1 = require("@euglena/common");
exports.default = organelle_1.domc("Logger", {
    incoming: {
        Log: function (message, level) { return particle_1.cp("Log", { message: message, level: level }); }
    },
    outgoing: {
        ACK: common_1.ccp.ACK,
        Exception: common_1.ccp.Exception
    }
});
//# sourceMappingURL=index.js.map