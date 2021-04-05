"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpClient = void 0;
var define_organelle_module_create_1 = require("../../organelle/define-organelle-module-create");
var httpClient = {
    v1: define_organelle_module_create_1.domc(["Get", "Post", "Put", "Delete"], ["Log", "ACK", "Exception", "Response"])
};
exports.httpClient = httpClient;
//# sourceMappingURL=http-client.js.map