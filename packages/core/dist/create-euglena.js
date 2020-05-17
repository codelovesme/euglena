"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var organelle_1 = require("./organelle");
exports.createEuglena = function (particles) {
    var reticulumReceive = organelle_1.endoplasmicReticulumJs.createOrganelle();
    reticulumReceive(organelle_1.endoplasmicReticulumJs.cp.incoming.Sap({
        reticulumReceive: reticulumReceive,
        particles: particles
    }, { organelle: { name: organelle_1.endoplasmicReticulumJs.n } }));
};
/**
 * Alias for createEuglena
 */
exports.ce = exports.createEuglena;
//# sourceMappingURL=create-euglena.js.map