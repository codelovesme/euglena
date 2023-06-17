import { ComingParticleUnion, CreateParticleUnion, cp } from "@euglena/core";
import { FS } from "./fs.org.h";


export const createFSComingParticle = cp as CreateParticleUnion<ComingParticleUnion<FS>>;