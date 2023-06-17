import { ComingParticleUnion, CreateParticleUnion, cp } from "@euglena/core";
import { Logger } from "./logger.org.h";


export const createLoggerComingParticle = cp as CreateParticleUnion<ComingParticleUnion<Logger>>;