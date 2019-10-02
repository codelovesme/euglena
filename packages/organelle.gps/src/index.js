var particle_1 = require("@euglena/particle");
var organelle_1 = require("@euglena/organelle");
var common_1 = require("@euglena/common");
exports["default"] = organelle_1.domc("Timer", {
    incoming: {
        ReadTime: function (adds) { return particle_1.cp("ReadTime", undefined, adds); },
        SetTime: function (time, adds) { return particle_1.cp("SetTime", time, adds); }
    },
    outgoing: {
        Time: function (time, adds) { return particle_1.cp("Time", time, adds); },
        ACK: common_1.ccp["ACK"]
    }
});
