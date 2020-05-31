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
Object.defineProperty(exports, "__esModule", { value: true });
exports.domc = void 0;
var particle_1 = require("../particle");
var defineOrganelleModuleCreate = function (incomingParticleNames, outgoingParticleNames, organelleName) {
    var _a;
    var createParticles = {
        incoming: incomingParticleNames.reduce(function (acc, curr) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[curr] = particle_1.cp.bind(undefined, curr), _a)));
        }, (_a = {}, _a["Sap"] = particle_1.cp.bind(undefined, "Sap"), _a)),
        outgoing: outgoingParticleNames.reduce(function (acc, curr) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[curr] = particle_1.cp.bind(undefined, curr), _a)));
        }, {})
    };
    var createOrganelleModule = function (createParticles, bindReactions, organelleName) {
        var createOrganelle = function (params) { return function (particle) { return __awaiter(void 0, void 0, void 0, function () {
            var name, reaction, t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = organelleName || (params === null || params === void 0 ? void 0 : params.name);
                        reaction = bindReactions[particle.meta.class];
                        if (!reaction) return [3 /*break*/, 2];
                        t = (params === null || params === void 0 ? void 0 : params.transmit) ? params === null || params === void 0 ? void 0 : params.transmit.bind(undefined, name) : undefined;
                        return [4 /*yield*/, reaction(particle, {
                                t: t,
                                cp: createParticles["outgoing"]
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        // return cps.Log(
                        //     `There is no reaction of ${name} for given particle ${JSON.stringify(particle.meta)}`,
                        //     "Error"
                        // );
                        console.error("There is no reaction of " + name + " for given particle " + JSON.stringify(particle.meta));
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); }; };
        return {
            /**
             * createParticles
             */
            cs: function (data, adds) {
                var sap = createParticles.incoming["Sap"](data, adds);
                return __assign(__assign({}, sap), { meta: __assign(__assign({}, sap.meta), { organelleName: organelleName }) });
            },
            /**
             * createOrganelle
             */
            co: createOrganelle
        };
    };
    return {
        com: organelleName
            ? function (bindReactions) {
                return createOrganelleModule(createParticles, bindReactions, organelleName);
            }
            : function (bindReactions) {
                return createOrganelleModule(createParticles, bindReactions);
            },
        cp: createParticles.incoming
    };
};
/**
 * defineOrganelleModuleCreate
 */
exports.domc = defineOrganelleModuleCreate;
//# sourceMappingURL=define-organelle-module-create.js.map