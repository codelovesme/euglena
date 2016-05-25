"use strict";
var euglena_template_1 = require("../node_modules/euglena/euglena_template/src/euglena_template");
class Organelle extends euglena_template_1.euglena_template.being.alive.organelles.TimeOrganelle {
    constructor() {
        super("TimeOrganelleImplJs");
    }
    receiveParticle(particle) {
        switch (particle.name) {
            case euglena_template_1.euglena_template.being.ghost.euglena.time.constants.incomingparticles.SetTime:
                this.time = particle.content;
                break;
            case euglena_template_1.euglena_template.being.ghost.euglena.time.constants.incomingparticles.StartClock:
                setInterval(() => {
                    //let newDate = new Date(this.time.date.year, this.time.date.month - 1, this.time.date.day,
                    //    this.time.clock.hour, this.time.clock.minute, this.time.clock.second + 1);
                    let newDate = new Date();
                    if (newDate.getSeconds() != this.time.clock.second) {
                        this.time.clock.second = newDate.getSeconds();
                        //this.nucleus.receiveParticle(new euglena_template.being.alive.particles.Second(this.time.clock.second));
                        if (newDate.getMinutes() != this.time.clock.minute) {
                            this.time.clock.minute = newDate.getMinutes();
                            //this.nucleus.receiveParticle(new euglena_template.being.alive.particles.Minute(this.time.clock.minute));
                            if (newDate.getHours() != this.time.clock.hour) {
                                this.time.clock.hour = newDate.getHours();
                                //this.nucleus.receiveParticle(new euglena_template.being.alive.particles.Hour(this.time.clock.hour));
                                if (newDate.getDate() != this.time.date.day) {
                                    this.time.date.day = newDate.getDate();
                                    //this.nucleus.receiveParticle(new euglena_template.being.alive.particles.Day(this.time.date.day));
                                    if (newDate.getMonth() + 1 != this.time.date.month) {
                                        this.time.date.month = newDate.getMonth() + 1;
                                        //this.nucleus.receiveParticle(new euglena_template.being.alive.particles.Month(this.time.date.month));
                                        if (newDate.getFullYear() != this.time.date.year) {
                                            this.time.date.year = newDate.getFullYear();
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.saveParticle(new euglena_template_1.euglena_template.being.alive.particles.Time(this.time, euglena_template_1.euglena_template.being.alive.constants.organelles.TimeOrganelle));
                }, 1000);
                break;
        }
    }
}
exports.Organelle = Organelle;
//# sourceMappingURL=euglena.organelle.time.js.js.map