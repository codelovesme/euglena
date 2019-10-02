"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../src/index");
var organelle_endoplasmic_reticulum_js_1 = __importDefault(require("@euglena/organelle.endoplasmic-reticulum.js"));
var organelle_vacuole_js_1 = __importDefault(require("@euglena/organelle.vacuole.js"));
var organelle_nucleus_js_1 = __importDefault(require("@euglena/organelle.nucleus.js"));
index_1.ce(function (reticulumReceive) {
    return organelle_endoplasmic_reticulum_js_1.default.cp.incoming.Sap({ name: organelle_endoplasmic_reticulum_js_1.default.n }, {
        reticulumReceive: reticulumReceive,
        particles: [
            organelle_endoplasmic_reticulum_js_1.default.cp.incoming.OrganelleInfo("Nucleus", {
                type: "NodeModules",
                path: "@euglena/organelle.nucleus.js"
            }),
            organelle_nucleus_js_1.default.cp.incoming.Sap({ name: organelle_nucleus_js_1.default.n }, {
                path: __dirname + "/chromosome.js",
                type: "FileSystemPath"
            }),
            organelle_endoplasmic_reticulum_js_1.default.cp.incoming.OrganelleInfo("Vacuole", {
                type: "NodeModules",
                path: "@euglena/organelle.vacuole.js"
            }),
            organelle_vacuole_js_1.default.cp.incoming.Sap({ name: organelle_vacuole_js_1.default.n }, {
                path: __dirname + "/particles.js",
                type: "FileSystemPath"
            }),
            organelle_endoplasmic_reticulum_js_1.default.cp.incoming.OrganelleInfo("Logger", {
                type: "NodeModules",
                path: "@euglena/organelle.logger.console"
            })
        ]
    });
});
//# sourceMappingURL=index.spec.js.map