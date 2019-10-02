"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var organelle_endoplasmic_reticulum_js_1 = __importDefault(require("@euglena/organelle.endoplasmic-reticulum.js"));
var organelle_nucleus_js_1 = __importDefault(require("@euglena/organelle.nucleus.js"));
index_1.ce(organelle_endoplasmic_reticulum_js_1.default.cp.incoming.Sap({ name: organelle_endoplasmic_reticulum_js_1.default.n }, [
    organelle_endoplasmic_reticulum_js_1.default.cp.incoming.OrganelleInfo("Nucleus", {
        type: "NodeModules",
        path: "@euglena/organelle.nucleus.js"
    }),
    organelle_nucleus_js_1.default.cp.incoming.Sap({ name: organelle_nucleus_js_1.default.n }, {
        path: "dist/test/chromosome.js",
        type: "FileSystemPath"
    }),
    organelle_endoplasmic_reticulum_js_1.default.cp.incoming.OrganelleInfo("Logger", {
        type: "NodeModules",
        path: "@euglena/organelle.logger.console"
    })
]));
//# sourceMappingURL=index.spec.js.map