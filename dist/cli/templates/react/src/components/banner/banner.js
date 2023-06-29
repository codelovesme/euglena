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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var characters_1 = require("./characters");
exports.default = (function () {
    var defaultCharacters = [];
    defaultCharacters.push((0, characters_1.createE)(0));
    defaultCharacters.push((0, characters_1.createU)(200));
    defaultCharacters.push((0, characters_1.createG)(440));
    defaultCharacters.push((0, characters_1.createL)(680));
    defaultCharacters.push((0, characters_1.createE)(890));
    defaultCharacters.push((0, characters_1.createN)(1090));
    defaultCharacters.push((0, characters_1.createA)(1330));
    var defaultCanvasWidth = 1530;
    var defaultCanvasHeight = 220;
    /**
     * Change this variable to change text size
     */
    var preferredCanvasWidth = 800;
    var getMargin = function () {
        var margin = (window.innerWidth - preferredCanvasWidth) / 2;
        return margin > 0 ? margin : 0;
    };
    var getScale = function () {
        var margin = getMargin();
        var innerWidth = window.innerWidth - 10 - 2 * margin; /*buffer*/
        return innerWidth < defaultCanvasWidth ? innerWidth / defaultCanvasWidth : 1;
    };
    var _a = (0, react_1.useState)({
        characters: [],
        resizeListenerAttached: false
    }), state = _a[0], setState = _a[1];
    var characters = state.characters, resizeListenerAttached = state.resizeListenerAttached;
    var canvasRef = (0, react_1.useRef)(null);
    var canvas = canvasRef.current;
    var scale = getScale();
    var _radius = 6;
    var getRadius = function () {
        return _radius * scale;
    };
    var _borderWidth = 10;
    var getBorderWidth = function () {
        return _borderWidth * scale;
    };
    var getCanvasSize = function (scale) { return ({
        width: defaultCanvasWidth * scale,
        height: defaultCanvasHeight * scale
    }); };
    (0, react_1.useEffect)(function () {
        if (canvas) {
            var updateSize_1 = function () {
                var _scale = getScale();
                /**
                 * Resize characters
                 */
                var _characters = defaultCharacters.map(function (c) { return ({
                    offset: c.offset * _scale,
                    parts: c.parts.map(function (p) { return ({
                        x: p.x * _scale,
                        y: p.y * _scale,
                        w: p.w * _scale,
                        h: p.h * _scale
                    }); })
                }); });
                setState(__assign(__assign({}, state), { characters: _characters }));
            };
            if (!resizeListenerAttached) {
                window.addEventListener("resize", updateSize_1);
                setState(__assign(__assign({}, state), { resizeListenerAttached: true }));
            }
            updateSize_1();
            return function () { return window.removeEventListener("resize", updateSize_1); };
        }
        return function () { return undefined; };
    }, [canvas]);
    var getPrintableSize = function (scale) {
        var borderWidth = getBorderWidth();
        var canvasSize = getCanvasSize(scale);
        return {
            width: canvasSize.width - 2 * borderWidth,
            height: canvasSize.height - 2 * borderWidth
        };
    };
    (0, react_1.useEffect)(function () {
        var contains = function (X, Y) {
            for (var _i = 0, characters_2 = characters; _i < characters_2.length; _i++) {
                var _a = characters_2[_i], parts = _a.parts, offset = _a.offset;
                for (var _b = 0, parts_1 = parts; _b < parts_1.length; _b++) {
                    var _c = parts_1[_b], x = _c.x, y = _c.y, w = _c.w, h = _c.h;
                    if (x + offset < X && y < Y && X < x + w + offset && Y < y + h) {
                        return true;
                    }
                }
            }
            return false;
        };
        var createArtist = function (ctx) { return ({
            drawCircle: function (x, y) {
                ctx.beginPath();
                ctx.arc(x, y, getRadius(), 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "lightgray";
                ctx.stroke();
            }
        }); };
        if (canvas) {
            var ctx_1 = canvas.getContext("2d");
            var artist_1 = createArtist(ctx_1);
            if (window.interval)
                clearInterval(window.interval);
            var _interval = setInterval(function () {
                var printableSize = getPrintableSize(scale);
                var borderWidth = getBorderWidth();
                var x = borderWidth + Math.floor(Math.random() * printableSize.width);
                var y = borderWidth + Math.floor(Math.random() * printableSize.height);
                if (contains(x, y)) {
                    var r = Math.floor(Math.random() * 255);
                    var g = Math.floor(Math.random() * 255);
                    var b = Math.floor(Math.random() * 255);
                    ctx_1.fillStyle = "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
                    artist_1.drawCircle(x, y);
                }
            }, 10);
            window.interval = _interval;
        }
    }, [characters]);
    var _scale = getScale();
    var canvasSize = getCanvasSize(_scale);
    return <canvas ref={canvasRef} {...canvasSize}/>;
});
//# sourceMappingURL=banner.js.map