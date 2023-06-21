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
exports.ce = exports.createEuglena = exports.transmit = exports.attachOrganelle = exports.reviveOrganelle = exports.getOrganelles = void 0;
var cessnalib_1 = require("cessnalib");
var core_1 = require("@euglena/core");
var genetics_1 = require("./genetics");
var exception_par_u_1 = require("../exception.par.u");
var reticulumName = "Reticulum";
var nucleusName = "Nucleus";
var organelles = {};
var getOrganelles = function () { return organelles; };
exports.getOrganelles = getOrganelles;
var reviveOrganelle = function (_a) {
    var data = _a.data;
    return __awaiter(void 0, void 0, void 0, function () {
        var organelle, _b, e_1;
        return __generator(this, function (_c) {
            var _d;
            switch (_c.label) {
                case 0:
                    organelle = undefined;
                    _b = data.location.type;
                    switch (_b) {
                        case "FileSystemPath": return [3 /*break*/, 1];
                        case "NodeModules": return [3 /*break*/, 1];
                        case "Url": return [3 /*break*/, 1];
                        case "InMemory": return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 6];
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (_d = data.location.path, Promise.resolve().then(function () { return __importStar(require(_d)); }))];
                case 2:
                    organelle = (_c.sent()).default;
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _c.sent();
                    console.log("Error - While reviving organelle ".concat(data.name, " : ").concat(e_1.message));
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    organelle = data.location.organelle;
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, organelle];
            }
        });
    });
};
exports.reviveOrganelle = reviveOrganelle;
var attachOrganelle = function (organelleInfo, transmit) { return __awaiter(void 0, void 0, void 0, function () {
    var createOrganelle, organelleInfoData, revivedOrganelle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.reviveOrganelle)(organelleInfo)];
            case 1:
                createOrganelle = _a.sent();
                organelleInfoData = organelleInfo.data;
                if (!createOrganelle) return [3 /*break*/, 3];
                return [4 /*yield*/, createOrganelle({ name: organelleInfoData.name, transmit: transmit })];
            case 2:
                revivedOrganelle = _a.sent();
                if (revivedOrganelle) {
                    organelles[organelleInfoData.name] = revivedOrganelle;
                    console.log("Info - ".concat(organelleInfoData.name, " attached to the body."));
                }
                else {
                    throw "Error - ".concat(organelleInfoData.name, " can not be revived.");
                }
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.attachOrganelle = attachOrganelle;
var transmit = function (particle, target) { return __awaiter(void 0, void 0, void 0, function () {
    var organelleReceive, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Info - Transmitting ".concat(JSON.stringify(particle), " to ").concat(target));
                organelleReceive = organelles[target];
                if (!organelleReceive) {
                    return [2 /*return*/, (0, exception_par_u_1.createException)("Exception", new cessnalib_1.sys.Exception("Organelle ".concat(target, " has not been connected yet!")))];
                }
                return [4 /*yield*/, organelleReceive(particle)];
            case 1:
                response = _a.sent();
                if ((0, core_1.isParticle)(response)) {
                    console.log("Info - Transmitting ".concat(JSON.stringify(response), " from ").concat(target));
                }
                else {
                    console.error("Un identified value returned from last organelleReceive call: ".concat(response));
                }
                return [2 /*return*/, response];
        }
    });
}); };
exports.transmit = transmit;
var createEuglena = function (particles) { return __awaiter(void 0, void 0, void 0, function () {
    var organelleInfos, _loop_1, _i, organelleInfos_1, organelleInfo, euglenaHasBeenBorn, resp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                organelleInfos = particles.filter(function (x) { return x.meta.class === "OrganelleInfo"; });
                _loop_1 = function (organelleInfo) {
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, exports.attachOrganelle)(organelleInfo, function (p) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                p = (0, genetics_1.createNucleusComingParticle)("ReceiveParticle", { particle: p, source: organelleInfo.data.name });
                                                return [4 /*yield*/, (0, exports.transmit)(p, nucleusName)];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    });
                                }); })];
                            case 1:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, organelleInfos_1 = organelleInfos;
                _a.label = 1;
            case 1:
                if (!(_i < organelleInfos_1.length)) return [3 /*break*/, 4];
                organelleInfo = organelleInfos_1[_i];
                return [5 /*yield**/, _loop_1(organelleInfo)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: 
            /**
             * Send their saps
             */
            return [4 /*yield*/, Promise.all(Object.entries(organelles).map(function (_a) {
                    var organelleName = _a[0], organelleReceive = _a[1];
                    return __awaiter(void 0, void 0, void 0, function () {
                        var relatedSap;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    relatedSap = particles.find(function (x) { return x.meta.class === "Sap" && x.meta.organelleName === organelleName; });
                                    if (!relatedSap) return [3 /*break*/, 2];
                                    return [4 /*yield*/, organelleReceive(relatedSap)];
                                case 1:
                                    _b.sent();
                                    _b.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    });
                }))];
            case 5:
                /**
                 * Send their saps
                 */
                _a.sent();
                euglenaHasBeenBorn = (0, core_1.cp)("EuglenaHasBeenBorn");
                return [4 /*yield*/, (0, exports.transmit)((0, genetics_1.createNucleusComingParticle)("ReceiveParticle", {
                        particle: euglenaHasBeenBorn,
                        source: reticulumName
                    }), nucleusName)];
            case 6:
                resp = _a.sent();
                if (resp && (0, core_1.isParticleClass)(resp, "Exception"))
                    throw resp;
                return [2 /*return*/];
        }
    });
}); };
exports.createEuglena = createEuglena;
/**
 * createEuglena
 */
exports.ce = exports.createEuglena;
//# sourceMappingURL=cell.u.js.map