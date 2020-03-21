"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var organelle_1 = require("./organelle");
exports.createEuglena = function (createSap) {
    var reticulumReceive = organelle_1.endoplasmicReticulumJs.createOrganelle();
    var reticulumSap = createSap(reticulumReceive);
    reticulumReceive(reticulumSap);
};
/**
 * Alias for createEuglena
 */
exports.ce = exports.createEuglena;
//# sourceMappingURL=create-euglena.js.map