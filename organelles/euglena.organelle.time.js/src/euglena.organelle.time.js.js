"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var euglena_template_1 = require("../node_modules/euglena/euglena_template/src/euglena_template");
var Organelle = (function (_super) {
    __extends(Organelle, _super);
    function Organelle() {
        _super.call(this, "TimeOrganelleImplJs");
    }
    Organelle.prototype.receive = function (particle, response) {
        var _this = this;
        switch (particle.name) {
            case euglena_template_1.euglena_template.being.ghost.organelle.time.constants.incomingparticles.SetTime:
                this.time = particle.content;
                break;
            case euglena_template_1.euglena_template.being.ghost.organelle.time.constants.incomingparticles.StartClock:
                setInterval(function () {
                    //let newDate = new Date(this.time.date.year, this.time.date.month - 1, this.time.date.day,
                    //    this.time.clock.hour, this.time.clock.minute, this.time.clock.second + 1);
                    var newDate = new Date();
                    if (newDate.getSeconds() != _this.time.clock.second) {
                        _this.time.clock.second = newDate.getSeconds();
                        //this.nucleus.receiveParticle(new euglena_template.being.alive.particles.Second(this.time.clock.second));
                        if (newDate.getMinutes() != _this.time.clock.minute) {
                            _this.time.clock.minute = newDate.getMinutes();
                            //this.nucleus.receiveParticle(new euglena_template.being.alive.particles.Minute(this.time.clock.minute));
                            if (newDate.getHours() != _this.time.clock.hour) {
                                _this.time.clock.hour = newDate.getHours();
                                //this.nucleus.receiveParticle(new euglena_template.being.alive.particles.Hour(this.time.clock.hour));
                                if (newDate.getDate() != _this.time.date.day) {
                                    _this.time.date.day = newDate.getDate();
                                    //this.nucleus.receiveParticle(new euglena_template.being.alive.particles.Day(this.time.date.day));
                                    if (newDate.getMonth() + 1 != _this.time.date.month) {
                                        _this.time.date.month = newDate.getMonth() + 1;
                                        //this.nucleus.receiveParticle(new euglena_template.being.alive.particles.Month(this.time.date.month));
                                        if (newDate.getFullYear() != _this.time.date.year) {
                                            _this.time.date.year = newDate.getFullYear();
                                        }
                                    }
                                }
                            }
                        }
                    }
                    _this.send(new euglena_template_1.euglena_template.being.alive.particles.Time(_this.time, "this"));
                }, 1000);
                break;
        }
    };
    return Organelle;
})(euglena_template_1.euglena_template.being.alive.organelles.TimeOrganelle);
exports.Organelle = Organelle;
//# sourceMappingURL=euglena.organelle.time.js.js.map