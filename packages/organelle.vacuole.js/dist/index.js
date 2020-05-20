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
var organelle_1 = require("@euglena/organelle");
var cessnalib_1 = require("cessnalib");
var particles = [];
exports.default = organelle_1.vacuole.v1.com({
    Sap: function (particle, _a) {
        var cp = _a.cp;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                try {
                    switch (particle.data.type) {
                        case "FileSystemPath":
                        case "NodeModules":
                        case "Url":
                            particles = require(particle.data.path).default;
                            break;
                        case "InMemory":
                            particles = particle.data.particles;
                            break;
                    }
                    return [2 /*return*/, cp.ACK()];
                }
                catch (error) {
                    return [2 /*return*/, cp.Exception(error.message)];
                }
                return [2 /*return*/];
            });
        });
    },
    GetAlive: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    Hibernate: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    ReadParticle: function (p, _a) {
        var cp = _a.cp;
        return __awaiter(void 0, void 0, void 0, function () {
            var _b, query, count, retVal, i, len;
            return __generator(this, function (_c) {
                _b = p.data, query = _b.query, count = _b.count;
                retVal = [];
                for (i = 0, len = 0; i < particles.length && (count === "all" || len < count); i++) {
                    if (cessnalib_1.js.Class.doesMongoCover(particles[i], query)) {
                        retVal.push(particles[i]);
                        len++;
                    }
                }
                return [2 /*return*/, cp.Particles(retVal)];
            });
        });
    },
    SaveParticle: function (p, _a) {
        var cp = _a.cp;
        return __awaiter(void 0, void 0, void 0, function () {
            var overridedParticles, _b, query, count, particle, overrideCount, i;
            return __generator(this, function (_c) {
                if (p.data instanceof Array) {
                    particles = __spreadArrays(particles, p.data);
                    return [2 /*return*/, cp.Metas([])];
                }
                else {
                    overridedParticles = [];
                    _b = p.data, query = _b.query, count = _b.count, particle = _b.particle;
                    if (query) {
                        overrideCount = 0;
                        for (i = 0; i < particles.length && (count === "all" || overrideCount < count); i++) {
                            if (cessnalib_1.js.Class.doesMongoCover(particles[i], query)) {
                                overridedParticles.push(particles[i].meta);
                                particles[i] = particle;
                                overrideCount++;
                            }
                        }
                    }
                    else {
                        particles = __spreadArrays(particles, [particle]);
                    }
                    return [2 /*return*/, cp.Metas(overridedParticles)];
                }
                return [2 /*return*/];
            });
        });
    },
    RemoveParticle: function (p, _a) {
        var cp = _a.cp;
        return __awaiter(void 0, void 0, void 0, function () {
            var _b, query, count, removedParticles, removeCount, i, removed;
            return __generator(this, function (_c) {
                _b = p.data, query = _b.query, count = _b.count;
                removedParticles = [];
                if (query) {
                    removeCount = 0;
                    for (i = 0; i < particles.length && (count === "all" || removeCount < count); i++) {
                        if (cessnalib_1.js.Class.doesMongoCover(particles[i], query)) {
                            removed = particles.splice(i--, 1)[0];
                            removedParticles.push(removed.meta);
                            removeCount++;
                        }
                    }
                }
                return [2 /*return*/, cp.Metas(removedParticles)];
            });
        });
    }
});
//# sourceMappingURL=index.js.map