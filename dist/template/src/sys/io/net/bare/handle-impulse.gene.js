"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGeneHandleImpulse = void 0;
var cessnalib = __importStar(require("cessnalib"));
var core_1 = require("@euglena/core");
var cell_1 = require("../../../../cell");
var auth_1 = require("../auth");
var exception_par_u_1 = require("../../../../exception.par.u");
var gene_u_1 = require("../../../../cell/genetics/gene.u");
var particles_par_u_1 = require("../../../../particles.par.u");
/**
 * Checks authorization / permissions
 * then creates a pulse from impulse
 */
exports.createGeneHandleImpulse = (0, gene_u_1.dcg)("Handle impulse", (0, gene_u_1.createTriggerByClass)("Impulse"), function (p, s, _a) {
    var t = _a.t, o = _a.o;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, particle, token, euglenaName, sender, getSenderResponse, senderPermissions, releaseParticle, response;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = p.data, particle = _b.particle, token = _b.token;
                    return [4 /*yield*/, (0, cell_1.getEuglenaName)(t, "temporaryVacuole")];
                case 1:
                    euglenaName = _c.sent();
                    if (!!euglenaName) return [3 /*break*/, 3];
                    return [4 /*yield*/, t((0, core_1.cp)("Log", {
                            level: "Error",
                            message: "No EuglenaName has been set"
                        }), "logger")];
                case 2:
                    _c.sent();
                    return [2 /*return*/, (0, core_1.cp)("Exception", new cessnalib.sys.Exception("Internal server error"))];
                case 3:
                    if ((0, exception_par_u_1.isException)(euglenaName))
                        return [2 /*return*/, euglenaName];
                    sender = undefined;
                    if (!token) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, auth_1.getSender)(t, "permanentVacuole", "jwt", token)];
                case 4:
                    getSenderResponse = _c.sent();
                    if ((0, exception_par_u_1.isException)(getSenderResponse))
                        return [2 /*return*/, getSenderResponse];
                    sender = getSenderResponse;
                    _c.label = 5;
                case 5: return [4 /*yield*/, (0, auth_1.getSenderPermissions)(t, "permanentVacuole", euglenaName.data, sender)];
                case 6:
                    senderPermissions = _c.sent();
                    if ((0, exception_par_u_1.isException)(senderPermissions))
                        return [2 /*return*/, senderPermissions];
                    if (!(0, auth_1.isSenderPermitted)(senderPermissions, particle.meta.class)) return [3 /*break*/, 8];
                    releaseParticle = (0, core_1.cp)("ReceiveParticle", {
                        particle: (0, core_1.cp)("Pulse", {
                            sender: sender,
                            particle: particle
                        }),
                        source: o.nucleus
                    });
                    return [4 /*yield*/, t(releaseParticle, "nucleus")];
                case 7:
                    response = _c.sent();
                    return [2 /*return*/, (0, particles_par_u_1.getFirstParticle)(response)];
                case 8: return [2 /*return*/, (0, core_1.cp)("Exception", new cessnalib.sys.Exception("Operation is unauthorized"))];
            }
        });
    });
});
//# sourceMappingURL=handle-impulse.gene.js.map