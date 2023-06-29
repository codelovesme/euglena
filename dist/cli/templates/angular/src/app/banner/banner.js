"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banner = void 0;
var core_1 = require("@angular/core");
var characters_1 = require("./characters");
var Banner = /** @class */ (function () {
    function Banner() {
        this.defaultCharacters = [];
        this.characters = [];
        this._radius = 6;
        this.defaultCanvasWidth = 1530;
        this.defaultCanvasHeight = 220;
        this._borderWidth = 10;
        /**
         * Change this variable to change text size
         */
        this.preferredCanvasWidth = 800;
    }
    Object.defineProperty(Banner.prototype, "radius", {
        get: function () {
            return this._radius * this.scale;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Banner.prototype, "borderWidth", {
        get: function () {
            return this._borderWidth * this.scale;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Banner.prototype, "margin", {
        get: function () {
            var margin = (window.innerWidth - this.preferredCanvasWidth) / 2;
            return margin > 0 ? margin : 0;
        },
        enumerable: false,
        configurable: true
    });
    Banner.prototype.onResize = function () {
        clearInterval(this.interval);
        this.resize();
        this.draw.apply(this, this.characters);
    };
    Banner.prototype.ngOnInit = function () {
        this.defaultCharacters.push((0, characters_1.createE)(0));
        this.defaultCharacters.push((0, characters_1.createU)(200));
        this.defaultCharacters.push((0, characters_1.createG)(440));
        this.defaultCharacters.push((0, characters_1.createL)(680));
        this.defaultCharacters.push((0, characters_1.createE)(890));
        this.defaultCharacters.push((0, characters_1.createN)(1090));
        this.defaultCharacters.push((0, characters_1.createA)(1330));
    };
    Object.defineProperty(Banner.prototype, "canvasSize", {
        get: function () {
            return {
                width: this.defaultCanvasWidth * this.scale,
                height: this.defaultCanvasHeight * this.scale,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Banner.prototype, "printableSize", {
        get: function () {
            return {
                width: this.canvasSize.width - 2 * this.borderWidth,
                height: this.canvasSize.height - 2 * this.borderWidth,
            };
        },
        enumerable: false,
        configurable: true
    });
    Banner.prototype.resize = function () {
        var _this = this;
        var innerWidth = window.innerWidth - 10 - 2 * this.margin; /*buffer*/
        this.scale =
            innerWidth < this.defaultCanvasWidth
                ? innerWidth / this.defaultCanvasWidth
                : 1;
        this.canvas.nativeElement.width = this.canvasSize.width;
        this.canvas.nativeElement.height = this.canvasSize.height;
        /**
         * Resize characters
         */
        this.characters = this.defaultCharacters.map(function (c) { return ({
            offset: c.offset * _this.scale,
            parts: c.parts.map(function (p) { return ({
                x: p.x * _this.scale,
                y: p.y * _this.scale,
                w: p.w * _this.scale,
                h: p.h * _this.scale,
            }); }),
        }); });
    };
    Banner.prototype.ngAfterViewInit = function () {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.resize();
        this.draw.apply(this, this.characters);
    };
    Banner.prototype.draw = function () {
        var _this = this;
        var characters = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            characters[_i] = arguments[_i];
        }
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
        this.ctx.fillStyle = 'red';
        this.interval = setInterval(function () {
            var x = _this.borderWidth + Math.floor(Math.random() * _this.printableSize.width);
            var y = _this.borderWidth +
                Math.floor(Math.random() * _this.printableSize.height);
            if (contains(x, y)) {
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                _this.ctx.fillStyle = "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
                _this.drawCircle(x, y);
            }
        }, 10);
    };
    Banner.prototype.drawChar = function (_a) {
        var parts = _a.parts, offset = _a.offset;
        for (var _i = 0, parts_2 = parts; _i < parts_2.length; _i++) {
            var _b = parts_2[_i], x = _b.x, y = _b.y, w = _b.w, h = _b.h;
            this.ctx.fillRect(x + offset, y, w, h);
        }
    };
    Banner.prototype.drawCircle = function (x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'lightgray';
        this.ctx.stroke();
    };
    __decorate([
        (0, core_1.ViewChild)('canvas', { static: false })
    ], Banner.prototype, "canvas", void 0);
    __decorate([
        (0, core_1.Input)()
    ], Banner.prototype, "radius", null);
    __decorate([
        (0, core_1.HostListener)('window:resize', ['$event'])
    ], Banner.prototype, "onResize", null);
    Banner = __decorate([
        (0, core_1.Component)({
            selector: 'Banner',
            templateUrl: './banner.html',
            styleUrls: ['./banner.css'],
            providers: [],
        })
    ], Banner);
    return Banner;
}());
exports.Banner = Banner;
//# sourceMappingURL=banner.js.map