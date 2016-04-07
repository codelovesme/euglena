"use strict";
import {cessnalib_template} from "../node_modules/cessnalib/cessnalib_template/src/cessnalib_template";
import {cessnalib} from "../node_modules/cessnalib/cessnalib/src/cessnalib";
import Particle = cessnalib.being.Particle;

export class Organelle extends cessnalib_template.being.alive.organelles.TimeOrganelle {
    private time: cessnalib.sys.type.Time;
    constructor(){
        super("TimeOrganelleImplJs");
    }
    public receiveParticle(particle: Particle): void {
        switch (particle.name) {
            case cessnalib_template.being.ghost.euglena.time.constants.incomingparticles.SetTime:
                this.time = particle.content;
                break;
            case cessnalib_template.being.ghost.euglena.time.constants.incomingparticles.StartClock:
                setInterval(() => {
                    //let newDate = new Date(this.time.date.year, this.time.date.month - 1, this.time.date.day,
                    //    this.time.clock.hour, this.time.clock.minute, this.time.clock.second + 1);
                    let newDate = new Date();
                    if (newDate.getSeconds() != this.time.clock.second) {
                        this.time.clock.second = newDate.getSeconds();
                        //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Second(this.time.clock.second));
                        if (newDate.getMinutes() != this.time.clock.minute) {
                            this.time.clock.minute = newDate.getMinutes();
                            //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Minute(this.time.clock.minute));
                            if (newDate.getHours() != this.time.clock.hour) {
                                this.time.clock.hour = newDate.getHours();
                                //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Hour(this.time.clock.hour));
                                if (newDate.getDate() != this.time.date.day) {
                                    this.time.date.day = newDate.getDate();
                                    //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Day(this.time.date.day));
                                    if (newDate.getMonth() + 1 != this.time.date.month) {
                                        this.time.date.month = newDate.getMonth() + 1;
                                        //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Month(this.time.date.month));
                                        if (newDate.getFullYear() != this.time.date.year) {
                                            this.time.date.year = newDate.getFullYear();
                                            //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Year(this.time.date.year));
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.saveParticle(new cessnalib_template.being.alive.particles.Time(this.time, cessnalib_template.being.alive.constants.organelles.TimeOrganelle));
                }, 1000);
                break;
        }
    }
}