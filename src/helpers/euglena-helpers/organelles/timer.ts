import { sys } from "cessnalib";
import { OrganelleDefaultExport, CreateOrganelle } from "../../../organelle";
import { ParticleV3, MetaV3Optionals } from "../../../particle";
import { createMetaV3, createParticle } from "../../particle-helpers";
import { defO } from "../../organelle-helpers";
import { createCommonParticle, commonParticles } from "../../common-particles";

export type TimerDefaultExport = OrganelleDefaultExport<typeof organelleName, typeof createOrganelle, typeof createTimerParticle, typeof timerParticles>;
namespace timerParticles {
  export const SetTime: "timer.SetTime" = "timer.SetTime";
  export type SetTime = ParticleV3<typeof SetTime, sys.type.Time>;

  export const ReadTime: "timer.ReadTime" = "timer.ReadTime";
  export type ReadTime = ParticleV3<typeof ReadTime, number>;

  export const Time: "timer.Time" = "timer.Time";
  export type Time = ParticleV3<typeof Time, sys.type.Time>;

  export const Sap: "timer.Sap" = "timer.Sap";
  export type Sap = ParticleV3<typeof Sap, sys.type.Time>;
}

function createTimerParticle(name: typeof timerParticles.SetTime, time: sys.type.Time, optionals?: MetaV3Optionals): timerParticles.SetTime;
function createTimerParticle(name: typeof timerParticles.ReadTime, optionals?: MetaV3Optionals): timerParticles.ReadTime;
function createTimerParticle(name: typeof timerParticles.Time, time: sys.type.Time, optionals?: MetaV3Optionals): timerParticles.Time;
function createTimerParticle(name: typeof timerParticles.Sap, time: sys.type.Time, optionals?: MetaV3Optionals): timerParticles.Sap;
function createTimerParticle(name: typeof timerParticles[keyof typeof timerParticles], ...remains: any): ParticleV3<typeof timerParticles[keyof typeof timerParticles], unknown> {
  switch (name) {
    case timerParticles.Time:
      const [time1, optionals1]: [sys.type.Time, MetaV3Optionals] = remains;
      return createParticle(createMetaV3(name, optionals1), time1);
    case timerParticles.SetTime:
      const [time2, optionals2]: [sys.type.Time, MetaV3Optionals] = remains;
      return createParticle(createMetaV3(name, optionals2), time2);
    case timerParticles.Sap:
      const [time3, optionals3]: [sys.type.Time, MetaV3Optionals] = remains;
      return createParticle(createMetaV3(name, optionals3), time3);
    case timerParticles.ReadTime:
      const [optionals4]: [MetaV3Optionals] = remains;
      return createParticle(createMetaV3(name, optionals4));
  }
}

declare function setInterval(callback: Function, timeout: number): void;
const organelleName: "timer" = "timer";
const createOrganelle: CreateOrganelle = defO(organelleName, addReaction => {
  addReaction(timerParticles.Sap, async (sap: timerParticles.Sap, { receive }) => {
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
      receive(createTimerParticle(timerParticles.Time, time));
    }, 1000);
    return createCommonParticle(commonParticles.ACK);
  });
});

const defaultExport: TimerDefaultExport = [organelleName, createOrganelle, createTimerParticle, timerParticles];
export default defaultExport;
