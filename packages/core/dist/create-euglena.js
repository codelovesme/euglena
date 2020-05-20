"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var organelle_1 = require("./organelle");
var reticulumName = "EndoplasmicReticulum";
exports.createEuglena = function (particles) {
    var reticulumReceive = organelle_1.endoplasmicReticulumJs.createOrganelle(reticulumName);
    reticulumReceive(organelle_1.endoplasmicReticulumJs.cp.incoming.Sap({
        reticulumReceive: reticulumReceive,
        particles: particles
    }, { organelleName: reticulumName }));
};
/**
 * Alias for createEuglena
 */
exports.ce = exports.createEuglena;
//# sourceMappingURL=create-euglena.js.map