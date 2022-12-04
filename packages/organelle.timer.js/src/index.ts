import { sys } from "cessnalib";
import * as core from "@euglena/core";
import { organelle, particle } from "@euglena/template";

import timer = organelle.timer;
import common = particle.common;

let time: sys.type.Time;

export type Sap = particle.common.Sap<sys.type.Time>;

export default core.organelle.dco<timer.Timer, Sap>({
    Sap: async (sap, { t, cp }) => {
        time = sap.data;
        setInterval(() => {
            //let newDate = new Date(this.time.date.year, this.time.date.month - 1, this.time.date.day,
            //    this.time.clock.hour, this.time.clock.minute, this.time.clock.second + 1);
            let newDate = new Date();
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
            t(cp("Time", time));
        }, 1000);
    },
    ReadTime: async (p, { cp }) => cp("Time", time),
    SetTime: async (p) => {
        time = p.data;
        return common.cp("ACK");
    }
});
