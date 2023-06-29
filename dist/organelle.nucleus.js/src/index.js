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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@euglena/core");
var template_1 = require("@euglena/template");
var cessnalib = __importStar(require("cessnalib"));
var genes = [];
var receive = function (particle, source) { return __awaiter(void 0, void 0, void 0, function () {
    var triggerableReactions, i, triggers, reaction, reactions, names, _i, triggerableReactions_1, tr, doTrigger, _a, triggerableReactions_2, tr2, promises, _loop_1, i, allResults, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("Info - Received particle ".concat(JSON.stringify(particle.meta), " inside the Nucleus"));
                triggerableReactions = new Array();
                for (i = 0; i < genes.length; i++) {
                    triggers = genes[i].data.triggers;
                    if (cessnalib.js.Class.doesMongoCover(particle, triggers)) {
                        reaction = genes[i].data.reaction;
                        triggerableReactions.push({
                            index: i,
                            triggers: Object.keys(triggers),
                            reaction: reaction,
                            organelles: genes[i].data.organelles
                        });
                    }
                }
                reactions = Array();
                names = Array();
                for (_i = 0, triggerableReactions_1 = triggerableReactions; _i < triggerableReactions_1.length; _i++) {
                    tr = triggerableReactions_1[_i];
                    doTrigger = true;
                    //Check if the tr is contained by others, if true
                    for (_a = 0, triggerableReactions_2 = triggerableReactions; _a < triggerableReactions_2.length; _a++) {
                        tr2 = triggerableReactions_2[_a];
                        //if it is the same object, do nothing
                        if (tr.index === tr2.index)
                            continue;
                        //then if triggers of tr2 does not contain triggers of tr, do nothing
                        if (!cessnalib.sys.StaticTools.Array.containsArray(tr2.triggers, tr.triggers))
                            continue;
                        //then check if tr2 overrides tr
                        doTrigger = genes[tr2.index].data.override !== genes[tr.index].data.name;
                    }
                    if (doTrigger) {
                        reactions.push([tr.reaction, tr.organelles]);
                        names.push(genes[tr.index].data.name);
                    }
                }
                promises = [];
                _loop_1 = function (i) {
                    var _c = reactions[i], reaction = _c[0], organelles = _c[1];
                    var geneName = names[i];
                    console.log("Info - Triggering Gene: ".concat(geneName, " Particle: ").concat(JSON.stringify(particle)));
                    promises = __spreadArray(__spreadArray([], promises, true), [
                        reaction(particle, source, {
                            t: function (particle, target) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, template_1.cell.transmit(particle, organelles[target])];
                                        case 1: return [2 /*return*/, (_a.sent())];
                                    }
                                });
                            }); },
                            o: organelles
                        })
                    ], false);
                };
                for (i = 0; i < reactions.length; i++) {
                    _loop_1(i);
                }
                return [4 /*yield*/, Promise.all(promises)];
            case 1:
                allResults = _b.sent();
                console.log(JSON.stringify(allResults));
                result = allResults.filter(function (x) { return x !== undefined; });
                return [2 /*return*/, (0, core_1.cp)("Particles", result)];
        }
    });
}); };
exports.default = (0, core_1.dco)({
    ReceiveParticle: function (p) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, particle, source;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = p.data, particle = _a.particle, source = _a.source;
                    return [4 /*yield*/, receive(particle, source)];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    }); },
    Sap: function (particle) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                switch (particle.data.type) {
                    case "FileSystemPath":
                    case "NodeModules":
                    case "Url":
                        genes = require(particle.data.path).default;
                        break;
                    case "InMemory":
                        genes = particle.data.genes;
                        break;
                }
                return [2 /*return*/, (0, core_1.cp)("ACK")];
            }
            catch (error) {
                return [2 /*return*/, (0, core_1.cp)("Exception", new cessnalib.sys.Exception(error.message))];
            }
            return [2 /*return*/];
        });
    }); },
    GetGenes: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, core_1.cp)("Particles", genes)];
        });
    }); }
});
//# sourceMappingURL=index.js.map