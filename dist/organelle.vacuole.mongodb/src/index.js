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
var cessnalib = __importStar(require("cessnalib"));
var core_1 = require("@euglena/core");
var mongodb_1 = require("mongodb");
var db;
var sap;
exports.default = (0, core_1.dco)({
    Sap: function (p) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            sap = p.data;
            return [2 /*return*/];
        });
    }); },
    GetAlive: function (p, _a) {
        var cp = _a.cp, t = _a.t;
        return __awaiter(void 0, void 0, void 0, function () {
            var database, uri, client, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        database = sap.database, uri = sap.uri;
                        client = new mongodb_1.MongoClient(uri);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, client.connect()];
                    case 2:
                        _b.sent();
                        db = client.db(database);
                        t(cp("Log", { message: "Db is Online", level: "Info" }));
                        return [2 /*return*/, cp("ACK")];
                    case 3:
                        err_1 = _b.sent();
                        t(cp("Log", { message: "Couldn't connect to db", level: "Error" }));
                        return [2 /*return*/, cp("Exception", { message: JSON.stringify(err_1) })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    Hibernate: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    ReadParticle: function (p, _a) {
        var cp = _a.cp, t = _a.t;
        return __awaiter(void 0, void 0, void 0, function () {
            var query, collection, findResult, _b, _c, err_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        query = p.data.query;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        collection = db.collection("particles");
                        findResult = collection.find(cessnalib.js.Class.toDotNotation(query), { _id: 0 });
                        _b = cp;
                        _c = ["Particles"];
                        return [4 /*yield*/, findResult.toArray()];
                    case 2: return [2 /*return*/, _b.apply(void 0, _c.concat([_d.sent()]))];
                    case 3:
                        err_2 = _d.sent();
                        t(cp("Log", { message: "Couldn't connect to db", level: "Error" }));
                        return [2 /*return*/, cp("Exception", { message: JSON.stringify(err_2) })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    SaveParticle: function (p, _a) {
        var cp = _a.cp;
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var data = p.data;
                        if (data instanceof Array) {
                            db.collection("particles").insertMany(data, function (err, result) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (err)
                                        return [2 /*return*/, resolve(cp("Exception", { message: JSON.stringify(err) }))];
                                    return [2 /*return*/, resolve(cp("ACK"))];
                                });
                            }); });
                        }
                        else {
                            var _a = p.data, query = _a.query, particle = _a.particle, count = _a.count;
                            if (query) {
                                if (count === "all") {
                                    return db
                                        .collection("particles")
                                        .updateMany(cessnalib.js.Class.toDotNotation(query), particle, { upsert: true }, function (err, doc) { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            if (err)
                                                return [2 /*return*/, resolve(cp("Exception", { message: JSON.stringify(err) }))];
                                            return [2 /*return*/, resolve(cp("ACK"))];
                                        });
                                    }); });
                                }
                                else {
                                    return db
                                        .collection("particles")
                                        .replaceOne(cessnalib.js.Class.toDotNotation(query), particle, { upsert: true }, function (err, doc) {
                                        if (err)
                                            return resolve(cp("Exception", { message: JSON.stringify(err) }));
                                        return resolve(cp("ACK"));
                                    });
                                }
                            }
                            else {
                                return db.collection("particles").insertOne(particle, function (err) {
                                    if (err)
                                        return resolve(cp("Exception", { message: JSON.stringify(err) }));
                                    return resolve(cp("ACK"));
                                });
                            }
                        }
                    })];
            });
        });
    },
    RemoveParticle: function (p, _a) {
        var cp = _a.cp;
        return new Promise(function (resolve) {
            var _a = p.data, query = _a.query, count = _a.count;
            if (count === "all") {
                db.collection("particles").deleteMany(cessnalib.js.Class.toDotNotation(query), function (err, doc) {
                    if (err)
                        return resolve(cp("Exception", { message: JSON.stringify(err) }));
                    return resolve(cp("ACK"));
                });
            }
            else {
                db.collection("particles").deleteOne(cessnalib.js.Class.toDotNotation(query), function (err, doc) {
                    if (err)
                        return resolve(cp("Exception", { message: JSON.stringify(err) }));
                    return resolve(cp("ACK"));
                });
            }
        });
    }
});
//# sourceMappingURL=index.js.map