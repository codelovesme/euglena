"use strict";
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nucleusJs = void 0;
var cessnalib_1 = require("cessnalib");
var create_organelle_module_1 = require("./create-organelle-module");
var particle_1 = require("../../particle");
var genes = [];
var receive;
var createReceive = function (t) { return function (particle, source) { return __awaiter(void 0, void 0, void 0, function () {
    var triggerableReactions, i, triggers, reaction, reactions, names, _i, triggerableReactions_1, tr, doTrigger, _a, triggerableReactions_2, tr2, promises, i, reaction, geneName, allResults;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                triggerableReactions = new Array();
                for (i = 0; i < genes.length; i++) {
                    triggers = genes[i].data.triggers;
                    if (cessnalib_1.js.Class.doesMongoCover(particle, triggers)) {
                        reaction = genes[i].data.reaction;
                        triggerableReactions.push({
                            index: i,
                            triggers: Object.keys(triggers),
                            reaction: reaction
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
                        if (!cessnalib_1.sys.type.StaticTools.Array.containsArray(tr2.triggers, tr.triggers))
                            continue;
                        //then check if tr2 overrides tr
                        doTrigger = genes[tr2.index].data.override !== genes[tr.index].data.name;
                    }
                    if (doTrigger) {
                        reactions.push(tr.reaction);
                        names.push(genes[tr.index].data.name);
                    }
                }
                promises = [];
                for (i = 0; i < reactions.length; i++) {
                    reaction = reactions[i];
                    geneName = names[i];
                    console.log("Info - Triggering Gene: " + geneName + " Particle: " + JSON.stringify(particle.meta));
                    promises = __spreadArrays(promises, [
                        reaction(particle, source, {
                            t: t
                        })
                    ]);
                }
                return [4 /*yield*/, Promise.all(promises)];
            case 1:
                allResults = _b.sent();
                return [2 /*return*/, allResults.filter(function (x) { return x !== undefined; })];
        }
    });
}); }; };
var nucleusJs = create_organelle_module_1.nucleus.com({
    ReceiveParticle: function (p) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, particle, source, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = p.data, particle = _a.particle, source = _a.source;
                    return [4 /*yield*/, receive(particle, source)];
                case 1:
                    result = _b.sent();
                    if (result.length > 0) {
                        return [2 /*return*/, particle_1.ccp.Particles(result)];
                    }
                    return [2 /*return*/];
            }
        });
    }); },
    Sap: function (particle, _a) {
        var t = _a.t, cp = _a.cp;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                receive = createReceive(t);
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
                    return [2 /*return*/, cp.ACK()];
                }
                catch (error) {
                    return [2 /*return*/, cp.Exception(new cessnalib_1.sys.type.Exception(error.message))];
                }
                return [2 /*return*/];
            });
        });
    }
});
exports.nucleusJs = nucleusJs;
//# sourceMappingURL=organelle-module.js.map