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
exports.isSenderPermitted = exports.getPermission = exports.getSenderPermissions = exports.getSender = void 0;
var cessnalib = __importStar(require("cessnalib"));
var core_1 = require("@euglena/core");
var exception_par_u_1 = require("../../../../exception.par.u");
var getSender = function (t, vacuole, jwt, token) { return __awaiter(void 0, void 0, void 0, function () {
    var decryptResult, readSession, readSessionResult, sessionParticle, fetchUser, fetchUserResult, sender;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, t((0, core_1.cp)("Decrypt", token), jwt)];
            case 1:
                decryptResult = _a.sent();
                if ((0, core_1.isParticleClass)(decryptResult, "Exception"))
                    return [2 /*return*/, decryptResult];
                readSession = (0, core_1.cp)("ReadParticle", {
                    query: {
                        meta: { class: "Session" },
                        data: { encryptedToken: token, decryptedToken: { euglenaName: decryptResult.data.euglenaName } }
                    },
                    count: 1
                });
                return [4 /*yield*/, t(readSession, vacuole)];
            case 2:
                readSessionResult = (_a.sent());
                if ((0, core_1.isParticleClass)(readSessionResult, "Exception"))
                    return [2 /*return*/, readSessionResult];
                sessionParticle = readSessionResult.data[0];
                //check if there is session
                if (!sessionParticle)
                    return [2 /*return*/, (0, core_1.cp)("Exception", new cessnalib.sys.Exception("Not Authenticated"))];
                //Check if session expired
                if (sessionParticle.data.decryptedToken.expireAt < new Date().getTime())
                    return [2 /*return*/, (0, core_1.cp)("Exception", new cessnalib.sys.Exception("Authorization token is expired"))];
                fetchUser = (0, core_1.cp)("ReadParticle", {
                    count: 1,
                    query: {
                        meta: { class: "EuglenaInfo" },
                        data: { euglenaName: sessionParticle.data.decryptedToken.euglenaName }
                    }
                });
                return [4 /*yield*/, t(fetchUser, vacuole)];
            case 3:
                fetchUserResult = _a.sent();
                if ((0, core_1.isParticleClass)(fetchUserResult, "Exception"))
                    return [2 /*return*/, fetchUserResult];
                sender = fetchUserResult.data[0];
                if (!sender)
                    return [2 /*return*/, (0, core_1.cp)("Exception", new cessnalib.sys.Exception("There is no user related with this token"))];
                //check user is active
                if (sender.data.status !== "Active")
                    return [2 /*return*/, (0, core_1.cp)("Exception", new cessnalib.sys.Exception("User is not active"))];
                return [2 /*return*/, sender];
        }
    });
}); };
exports.getSender = getSender;
var getSenderPermissions = function (t, vacuole, receiverEuglenaName, sender) { return __awaiter(void 0, void 0, void 0, function () {
    var getPermissions, permissions, senderPermissionsData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getPermissions = (0, core_1.cp)("ReadParticle", {
                    query: { meta: { class: "Permission" }, data: { receiverEuglenaName: receiverEuglenaName } },
                    count: "all"
                });
                return [4 /*yield*/, t(getPermissions, vacuole)];
            case 1:
                permissions = _a.sent();
                if ((0, exception_par_u_1.isException)(permissions))
                    return [2 /*return*/, permissions];
                senderPermissionsData = permissions.data.filter(function (permission) {
                    return permission.data.sender === "*" ||
                        (sender &&
                            ("role" in permission.data.sender
                                ? sender.data.roles.includes(permission.data.sender.role)
                                : permission.data.sender.euglenaName == sender.data.euglenaName));
                });
                return [2 /*return*/, (0, core_1.cp)("Particles", senderPermissionsData)];
        }
    });
}); };
exports.getSenderPermissions = getSenderPermissions;
exports.getPermission = async;
var isSenderPermitted = function (senderPermissions, particleClass) {
    for (var _i = 0, _a = senderPermissions.data; _i < _a.length; _i++) {
        var permission = _a[_i];
        if (permission.data.particles.includes(particleClass)) {
            return true;
        }
    }
    return false;
};
exports.isSenderPermitted = isSenderPermitted;
//# sourceMappingURL=auth.u.js.map