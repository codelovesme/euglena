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
var cessnalib = __importStar(require("cessnalib"));
var core_1 = require("@euglena/core");
var particles = [];
exports.default = (0, core_1.dco)({
    Sap: function (particle) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (particle.data.type) {
                case "FileSystemPath":
                case "NodeModules":
                case "Url":
                    try {
                        particles = require(particle.data.path).default;
                    }
                    catch (error) {
                        return [2 /*return*/, (0, core_1.cp)("Exception", new cessnalib.sys.Exception(error.message))];
                    }
                    break;
                case "InMemory":
                    particles = particle.data.particles;
                    break;
            }
            return [2 /*return*/, (0, core_1.cp)("ACK")];
        });
    }); },
    GetAlive: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, core_1.cp)("ACK")];
        });
    }); },
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
                    if (cessnalib.js.Class.doesMongoCover(particles[i], query)) {
                        retVal.push(particles[i]);
                        len++;
                    }
                }
                return [2 /*return*/, cp("Particles", retVal)];
            });
        });
    },
    SaveParticle: function (p) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, query, count, particle, overrideCount, i;
        return __generator(this, function (_b) {
            if (p.data instanceof Array) {
                particles = __spreadArray(__spreadArray([], particles, true), p.data, true);
            }
            else {
                _a = p.data, query = _a.query, count = _a.count, particle = _a.particle;
                if (query) {
                    overrideCount = 0;
                    for (i = 0; i < particles.length && (count === "all" || overrideCount < count); i++) {
                        if (cessnalib.js.Class.doesMongoCover(particles[i], query)) {
                            particles[i] = particle;
                            overrideCount++;
                        }
                    }
                }
                else {
                    particles = __spreadArray(__spreadArray([], particles, true), [particle], false);
                }
            }
            return [2 /*return*/, (0, core_1.cp)("ACK")];
        });
    }); },
    RemoveParticle: function (p) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, query, count, removeCount, i;
        return __generator(this, function (_b) {
            _a = p.data, query = _a.query, count = _a.count;
            if (query) {
                removeCount = 0;
                for (i = 0; i < particles.length && (count === "all" || removeCount < count); i++) {
                    if (cessnalib.js.Class.doesMongoCover(particles[i], query)) {
                        particles.splice(i, 1);
                        removeCount++;
                    }
                }
            }
            return [2 /*return*/, (0, core_1.cp)("ACK")];
        });
    }); }
});
//# sourceMappingURL=index.js.map