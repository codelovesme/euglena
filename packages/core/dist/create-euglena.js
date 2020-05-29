"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kind_1 = require("./organelle/kind");
exports.createEuglena = function (particles) {
    var reticulumReceive = kind_1.endoplasmicReticulumJs.co();
    reticulumReceive(kind_1.endoplasmicReticulumJs.cp.incoming.Sap({
        reticulumReceive: reticulumReceive,
        particles: particles
    }));
};
/**
 * Alias for createEuglena
 */
exports.ce = exports.createEuglena;
//# sourceMappingURL=create-euglena.js.map