"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponent = exports.MyService = void 0;
var core_1 = require("@angular/core");
var context_1 = require("./context");
var rxjs_1 = require("rxjs");
var MyService = /** @class */ (function () {
    function MyService() {
    }
    MyService.prototype.getCounter = function (tick) {
        return (0, rxjs_1.timer)(0, tick);
    };
    MyService = __decorate([
        (0, core_1.Injectable)()
    ], MyService);
    return MyService;
}());
exports.MyService = MyService;
var padIfUndefined = function (value, callback, pad) {
    if (pad === void 0) { pad = '-'; }
    return (value === undefined ? pad : callback(value));
};
var AppComponent = /** @class */ (function () {
    function AppComponent(context, ref) {
        this.context = context;
        this.ref = ref;
        this.title = 'must_be_replaced';
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        var subscribe = function () {
            _this.timeSubscriber = _this.context.stateEmitter.subscribe(function (state) {
                _this.time = padIfUndefined(state.data, function (value) {
                    var hour = "".concat(value.time.clock.hour).padStart(2, '0');
                    var minute = "".concat(value.time.clock.minute).padStart(2, '0');
                    var second = "".concat(value.time.clock.second).padStart(2, '0');
                    return "".concat(hour, ":").concat(minute, ":").concat(second);
                }, '00:00:00');
                _this.ref.detectChanges();
            });
            console.log('stateEmitter subscription has been done !');
        };
        if (!this.context.stateEmitter) {
            var interval_1 = setInterval(function () {
                if (_this.context.stateEmitter) {
                    subscribe();
                    clearInterval(interval_1);
                    console.log('stateEmitter subscription interval has been removed !');
                }
            }, 100);
            console.log('stateEmitter subscription interval has been created !');
        }
        else {
            subscribe();
        }
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this.timeSubscriber.unsubscribe();
    };
    AppComponent = __decorate([
        (0, core_1.Component)({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css'],
            providers: [context_1.contextProvider, MyService],
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map