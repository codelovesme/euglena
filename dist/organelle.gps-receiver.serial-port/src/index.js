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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var serialport_1 = __importDefault(require("serialport"));
var gps_1 = __importDefault(require("gps"));
var core_1 = require("@euglena/core");
var gps;
var buffer = [];
var sap;
exports.default = (0, core_1.dco)({
    Sap: function (p) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            sap = p.data;
            return [2 /*return*/];
        });
    }); },
    Listen: function (p, _a) {
        var t = _a.t;
        return __awaiter(void 0, void 0, void 0, function () {
            var path, interval, port, avg_1;
            return __generator(this, function (_b) {
                try {
                    gps = new gps_1.default();
                    path = sap.path, interval = sap.interval;
                    console.log("connection via serialport");
                    port = new serialport_1.default(path, {
                        baudRate: 4800
                    });
                    console.log("listening");
                    port.on("data", function (data) {
                        // console.log("gps update");
                        gps.updatePartial(data);
                    });
                    gps.on("data", function () {
                        // console.log("on gps data");
                        if (typeof gps.state.lat !== undefined && typeof gps.state.lon !== undefined) {
                            // console.log("on gps data inner");
                            buffer = __spreadArray(__spreadArray([], buffer, true), [{ lat: Number(gps.state.lat), lng: Number(gps.state.lon) }], false);
                        }
                    });
                    avg_1 = function (coordinates) {
                        if (coordinates instanceof Array && coordinates.length <= 0)
                            return undefined;
                        var sum = coordinates.reduce(function (acc, curr) { return ({ lat: acc.lat + curr.lat, lng: acc.lng + curr.lng }); }, {
                            lat: 0,
                            lng: 0
                        });
                        return {
                            lat: sum.lat / coordinates.length,
                            lng: sum.lng / coordinates.length
                        };
                    };
                    setInterval(function () {
                        var result = avg_1(buffer);
                        if (result) {
                            t((0, core_1.cp)("Coordinate", result));
                            buffer = [];
                        }
                    }, interval);
                    t((0, core_1.cp)("Log", { message: "Listening GPS", level: "Info" }));
                    return [2 /*return*/, (0, core_1.cp)("ACK")];
                }
                catch (e) {
                    return [2 /*return*/, (0, core_1.cp)("Exception", { message: JSON.stringify(e) })];
                }
                return [2 /*return*/];
            });
        });
    }
});
//# sourceMappingURL=index.js.map