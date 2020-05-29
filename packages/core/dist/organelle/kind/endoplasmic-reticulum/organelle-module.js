"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
        while (_) try {
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var create_organelle_module_1 = require("./create-organelle-module");
var nucleus_1 = require("../nucleus");
var endoplasmicReticulumName = "EndoplasmicReticulum";
var organelles;
var nucleusJsName = "Nucleus";
var transmit = function (source, particle, target) { return __awaiter(void 0, void 0, void 0, function () {
    var resp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!target) {
                    target = nucleusJsName;
                    particle = nucleus_1.nucleus.cp.incoming.ReceiveParticle({ particle: particle, source: source });
                }
                return [4 /*yield*/, organelles[endoplasmicReticulumName](create_organelle_module_1.endoplasmicReticulum.cp.incoming.TransmitParticle({ particle: particle, target: target }))];
            case 1:
                resp = (_a.sent());
                return [2 /*return*/, resp ? resp.data : undefined];
        }
    });
}); };
var t = function (particle) { return transmit(endoplasmicReticulumName, particle); };
var attachOrganelle = function (organelleInfoData) { return __awaiter(void 0, void 0, void 0, function () {
    var organelle, _a, e_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = organelleInfoData.location.type;
                switch (_a) {
                    case "FileSystemPath": return [3 /*break*/, 1];
                    case "NodeModules": return [3 /*break*/, 1];
                    case "Url": return [3 /*break*/, 1];
                    case "InMemory": return [3 /*break*/, 5];
                }
                return [3 /*break*/, 6];
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(organelleInfoData.location.path)); })];
            case 2:
                organelle = (_c.sent()).default;
                return [3 /*break*/, 4];
            case 3:
                e_1 = _c.sent();
                console.log("Error - While attaching " + organelleInfoData.name + " : " + e_1.message);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                organelle = organelleInfoData.location.organelle;
                return [3 /*break*/, 6];
            case 6:
                if (organelle) {
                    organelles = __assign(__assign({}, organelles), (_b = {}, _b[organelleInfoData.name] = organelle.co({ name: organelleInfoData.name, transmit: transmit }), _b));
                    console.log("Info - " + organelleInfoData.name + " attached to the body.");
                }
                return [2 /*return*/];
        }
    });
}); };
var endoplasmicReticulumJs = create_organelle_module_1.endoplasmicReticulum.com({
    Sap: function (particle, _a) {
        var cp = _a.cp;
        return __awaiter(void 0, void 0, void 0, function () {
            var _b, particles, reticulumReceive, organelleInfos, _i, organelleInfos_1, data, organelleSaps, _loop_1, _c, _d, _e, organelleName, organelleReceive;
            var _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _b = particle.data, particles = _b.particles, reticulumReceive = _b.reticulumReceive;
                        organelleInfos = particles.filter(function (x) { return x.meta.class === "OrganelleInfo"; });
                        organelles = (_f = {},
                            _f[endoplasmicReticulumName] = reticulumReceive,
                            _f[nucleusJsName] = nucleus_1.nucleusJs.co({ transmit: transmit }),
                            _f);
                        _i = 0, organelleInfos_1 = organelleInfos;
                        _g.label = 1;
                    case 1:
                        if (!(_i < organelleInfos_1.length)) return [3 /*break*/, 4];
                        data = organelleInfos_1[_i].data;
                        return [4 /*yield*/, attachOrganelle(data)];
                    case 2:
                        _g.sent();
                        _g.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        organelleSaps = particles.filter(function (x) { return x.meta.class === "Sap"; });
                        _loop_1 = function (organelleName, organelleReceive) {
                            var relatedSap = organelleSaps.find(function (x) { return x.meta.organelleName === organelleName; });
                            if (relatedSap)
                                organelleReceive(relatedSap);
                        };
                        for (_c = 0, _d = Object.entries(organelles); _c < _d.length; _c++) {
                            _e = _d[_c], organelleName = _e[0], organelleReceive = _e[1];
                            _loop_1(organelleName, organelleReceive);
                        }
                        /**
                         * Initial Organelles atttached let roll
                         */
                        t(cp.EuglenaHasBeenBorn(undefined));
                        return [2 /*return*/];
                }
            });
        });
    },
    OrganelleInfo: function (particle) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            attachOrganelle(particle.data);
            return [2 /*return*/];
        });
    }); },
    TransmitParticle: function (p, _a) {
        var cp = _a.cp;
        return __awaiter(void 0, void 0, void 0, function () {
            var _b, target, particle, organelleReceive, resp;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = p.data, target = _b.target, particle = _b.particle;
                        if (!organelles)
                            return [2 /*return*/, cp.Log({
                                    message: "Organelle " + endoplasmicReticulumName + " has not been initialized.",
                                    level: "Error"
                                })];
                        organelleReceive = organelles[target];
                        if (!organelleReceive)
                            return [2 /*return*/, cp.Log({ message: "Organelle " + target + " has not been connected yet!", level: "Error" })];
                        return [4 /*yield*/, organelleReceive(particle)];
                    case 1:
                        resp = _c.sent();
                        return [2 /*return*/, cp.TransmitResponse(resp)];
                }
            });
        });
    }
});
exports.endoplasmicReticulumJs = endoplasmicReticulumJs;
//# sourceMappingURL=organelle-module.js.map