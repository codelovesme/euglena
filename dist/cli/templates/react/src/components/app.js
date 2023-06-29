"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var banner_1 = __importDefault(require("./banner/banner"));
require("./app.css");
var padIfUndefined = function (value, callback, pad) {
    if (pad === void 0) { pad = "-"; }
    return value === undefined ? pad : callback(value);
};
exports.default = (function (state) {
    var time = padIfUndefined(state.data, function (value) {
        var hour = "".concat(value.time.clock.hour).padStart(2, "0");
        var minute = "".concat(value.time.clock.minute).padStart(2, "0");
        var second = "".concat(value.time.clock.second).padStart(2, "0");
        return "".concat(hour, ":").concat(minute, ":").concat(second);
    }, "00:00:00");
    return (<div className="center">
            <div className="banner-container">
                <banner_1.default />
            </div>
            <div className="time-container">
                <span className="time">{time}</span>
            </div>
        </div>);
});
//# sourceMappingURL=app.js.map