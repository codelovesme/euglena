import { ComingParticleUnion, CreateParticleUnion, cp } from "@euglena/core";
import { MatterSensor } from "./matter-sensor.org.h"

export const createMatterSensorComingParticle = cp as CreateParticleUnion<ComingParticleUnion<MatterSensor>>;
