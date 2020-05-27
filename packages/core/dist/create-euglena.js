"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var organelle_1 = require("./organelle");
exports.createEuglena = function (particles) {
    var reticulumReceive = organelle_1.endoplasmicReticulumJs.co();
    reticulumReceive(organelle_1.endoplasmicReticulumJs.cp.incoming.Sap({
        reticulumReceive: reticulumReceive,
        particles: particles
    }));
};
/**
 * Alias for createEuglena
 */
exports.ce = exports.createEuglena;
//# sourceMappingURL=create-euglena.js.map