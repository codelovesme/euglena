"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var particle_1 = require("@euglena/particle");
var organelle_1 = require("@euglena/organelle");
var common_1 = require("@euglena/common");
exports.default = organelle_1.domc("GPS", {
    incoming: {},
    outgoing: {
        Coordinate: function (lat, lng, adds) { return particle_1.cp("Coordinate", { lat: lat, lng: lng }, adds); },
        Log: common_1.ccp.Log
    }
});
//# sourceMappingURL=index.js.map