"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextProvider = exports.context = void 0;
var organelle_ui_angular_1 = require("@euglena/organelle.ui.angular");
exports.context = new organelle_ui_angular_1.Context();
exports.contextProvider = { provide: organelle_ui_angular_1.Context, useValue: exports.context };
//# sourceMappingURL=context.js.map