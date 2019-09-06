import { sys } from "cessnalib";
import { MetaAdditions } from "../../core/particle.h";
import { cp } from "../../core/particle";
import { com } from "../../core/organelle";
import { ccp } from "../common-particles";

declare function setInterval(callback: Function, timeout: number): void;

export const timer = com(
  "Timer",
  {
    incoming: {
      TimerReadTime: (adds?: MetaAdditions) => cp("TimerReadTime", undefined, adds),
      TimerSap: (time: sys.type.Time, adds?: MetaAdditions) => cp("TimerSap", time, adds),
      TimerSetTime: (time: sys.type.Time, adds?: MetaAdditions) => cp("TimerSetTime", time, adds)
    },
    outgoing: {
      TimerTime: (time: sys.type.Time, adds?: MetaAdditions) => cp("TimerTime", time, adds),
      ACK: ccp["ACK"]
    }
  },
  add => {
    add("TimerSap", async (sap, { r, cp }) => {
      let time: sys.type.Time = sap.data;
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
        r(cp.TimerTime(time));
      }, 1000);
      return cp.ACK();
    });
  }
);
