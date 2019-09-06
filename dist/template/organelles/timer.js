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
Object.defineProperty(exports, "__esModule", { value: true });
var particle_1 = require("../../core/particle");
var organelle_1 = require("../../core/organelle");
var common_particles_1 = require("../common-particles");
exports.timer = organelle_1.com("Timer", {
    incoming: {
        TimerReadTime: function (adds) { return particle_1.cp("TimerReadTime", undefined, adds); },
        TimerSap: function (time, adds) { return particle_1.cp("TimerSap", time, adds); },
        TimerSetTime: function (time, adds) { return particle_1.cp("TimerSetTime", time, adds); }
    },
    outgoing: {
        TimerTime: function (time, adds) { return particle_1.cp("TimerTime", time, adds); },
        ACK: common_particles_1.ccp["ACK"]
    }
}, function (add) {
    add("TimerSap", function (sap, _a) {
        var r = _a.r, cp = _a.cp;
        return __awaiter(void 0, void 0, void 0, function () {
            var time;
            return __generator(this, function (_b) {
                time = sap.data;
                setInterval(function () {
                    //let newDate = new Date(this.time.date.year, this.time.date.month - 1, this.time.date.day,
                    //    this.time.clock.hour, this.time.clock.minute, this.time.clock.second + 1);
                    var newDate = new Date();
                    if (newDate.getSeconds() != time.clock.second) {
                        time.clock.second = newDate.getSeconds();
                        //nucleus.receiveParticle(new euglena_template.being.alive.particles.Second(time.clock.second));
                        if (newDate.getMinutes() != time.clock.minute) {
                            time.clock.minute = newDate.getMinutes();
                            //nucleus.receiveParticle(new euglena_template.being.alive.particles.Minute(time.clock.minute));
                            if (newDate.getHours() != time.clock.hour) {
                                time.clock.hour = newDate.getHours();
                                //nucleus.receiveParticle(new euglena_template.being.alive.particles.Hour(time.clock.hour));
                                if (newDate.getDate() != time.date.day) {
                                    time.date.day = newDate.getDate();
                                    //nucleus.receiveParticle(new euglena_template.being.alive.particles.Day(time.date.day));
                                    if (newDate.getMonth() + 1 != time.date.month) {
                                        time.date.month = newDate.getMonth() + 1;
                                        //nucleus.receiveParticle(new euglena_template.being.alive.particles.Month(time.date.month));
                                        if (newDate.getFullYear() != time.date.year) {
                                            time.date.year = newDate.getFullYear();
                                            //nucleus.receiveParticle(new euglena_template.being.alive.particles.Year(time.date.year));
                                        }
                                    }
                                }
                            }
                        }
                    }
                    r(cp.TimerTime(time));
                }, 1000);
                return [2 /*return*/, cp.ACK()];
            });
        });
    });
});
//# sourceMappingURL=timer.js.map