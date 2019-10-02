"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var organelle_nucleus_js_1 = require("@euglena/organelle.nucleus.js");
var organelle_logger_1 = __importDefault(require("@euglena/organelle.logger"));
exports.default = organelle_nucleus_js_1.createChromosome(function (add) {
    add("Write logs on console", { meta: { name: "Log" } }, function (p, s, _a) {
        var t = _a.t;
        return t(p, organelle_logger_1.default.n);
    });
    add("Write a log says Hello World", { meta: { name: "EuglenaHasBeenBorn" } }, function (p, s, _a) {
        var t = _a.t;
        return t(organelle_logger_1.default.cp.incoming.Log("Hello World", "Info"), organelle_logger_1.default.n);
    });
});
//# sourceMappingURL=chromosome.js.map