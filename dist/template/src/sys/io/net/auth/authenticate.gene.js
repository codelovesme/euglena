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
exports.createGeneAuthenticate = void 0;
var cessnalib = __importStar(require("cessnalib"));
var core_1 = require("@euglena/core");
var gene_u_1 = require("../../../../cell/genetics/gene.u");
exports.createGeneAuthenticate = (0, gene_u_1.dcg)("Authenticate", { meta: { class: "Pulse" }, data: { particle: { meta: { class: "Authenticate" } } } }, function (pulse, s, _a) {
    var t = _a.t, o = _a.o;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, euglenaName, password, fetchEuglenaInfo, fetchEuglenaInfoResult, euglenaInfo, comparePassword, encryptPasswordResult, createdAt, expireAt, decryptedToken, generateToken, generateTokenResult, removeSessions, removeSessionsResult, session, saveSession, saveSessionResult;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = pulse.data.particle.data, euglenaName = _b.euglenaName, password = _b.password;
                    /**
                     * Check username and password is not empty
                     */
                    if (!euglenaName || !password)
                        return [2 /*return*/, (0, core_1.cp)("Exception", new cessnalib.sys.Exception("Username and password can not be empty"))];
                    fetchEuglenaInfo = (0, core_1.cp)("ReadParticle", {
                        query: { meta: { class: "EuglenaInfo" }, data: { euglenaName: euglenaName } },
                        count: 1
                    });
                    return [4 /*yield*/, t(fetchEuglenaInfo, "vacuole")];
                case 1:
                    fetchEuglenaInfoResult = _c.sent();
                    if ((0, core_1.isParticleClass)(fetchEuglenaInfoResult, "Exception"))
                        return [2 /*return*/, fetchEuglenaInfoResult];
                    euglenaInfo = fetchEuglenaInfoResult.data[0];
                    if (!euglenaInfo)
                        return [2 /*return*/, (0, core_1.cp)("Exception", new cessnalib.sys.Exception("There is no user with ".concat(euglenaName)))];
                    /**
                     * Check user is active
                     */
                    if (euglenaInfo.data.status !== "Active")
                        return [2 /*return*/, (0, core_1.cp)("Exception", new cessnalib.sys.Exception("This user is not Active."))];
                    comparePassword = (0, core_1.cp)("Compare", {
                        hash: (0, core_1.cp)("Hash", euglenaInfo.data.password),
                        plain: (0, core_1.cp)("Plain", password)
                    });
                    return [4 /*yield*/, t(comparePassword, "bcrypt")];
                case 2:
                    encryptPasswordResult = (_c.sent());
                    if ((0, core_1.isParticleClass)(encryptPasswordResult, "Exception"))
                        return [2 /*return*/, encryptPasswordResult];
                    if (!encryptPasswordResult.data)
                        return [2 /*return*/, (0, core_1.cp)("Exception", new cessnalib.sys.Exception("Username and password mismatch"))];
                    createdAt = new Date().getTime();
                    expireAt = createdAt + cessnalib.sys.StaticTools.TimeSpan.toUnixTimestamp(new cessnalib.sys.TimeSpan(1, 1, 1, 1, 1));
                    decryptedToken = {
                        euglenaName: euglenaName,
                        createdAt: createdAt,
                        expireAt: expireAt,
                        type: "Session",
                        roles: euglenaInfo.data.roles,
                        status: euglenaInfo.data.status
                    };
                    generateToken = (0, core_1.cp)("Encrypt", decryptedToken, {
                        version: "2.0"
                    });
                    return [4 /*yield*/, t(generateToken, "jwt")];
                case 3:
                    generateTokenResult = _c.sent();
                    removeSessions = (0, core_1.cp)("RemoveParticle", {
                        count: "all",
                        query: {
                            meta: { class: "Session" },
                            data: { decryptedToken: { euglenaName: decryptedToken.euglenaName } }
                        }
                    });
                    return [4 /*yield*/, t(removeSessions, "vacuole")];
                case 4:
                    removeSessionsResult = _c.sent();
                    if ((0, core_1.isParticleClass)(removeSessionsResult, "Exception"))
                        return [2 /*return*/, removeSessionsResult];
                    session = (0, core_1.cp)("Session", {
                        decryptedToken: decryptedToken,
                        encryptedToken: generateTokenResult.data
                    });
                    saveSession = (0, core_1.cp)("SaveParticle", {
                        count: 1,
                        particle: session,
                        query: {
                            meta: { class: "Session" },
                            data: { decryptedToken: { euglenaName: euglenaName } }
                        }
                    });
                    return [4 /*yield*/, t(saveSession, "vacuole")];
                case 5:
                    saveSessionResult = _c.sent();
                    if ((0, core_1.isParticleClass)(saveSessionResult, "Exception"))
                        return [2 /*return*/, saveSessionResult];
                    //Return session
                    return [2 /*return*/, session];
            }
        });
    });
});
//# sourceMappingURL=authenticate.gene.js.map