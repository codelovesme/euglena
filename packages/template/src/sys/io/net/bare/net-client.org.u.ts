import { ComingParticleUnion, CreateParticleUnion, cp as _cp } from "@euglena/core";
import { NetClient } from "./net-client.org.h";

export const createNetClientComingParticle = _cp as CreateParticleUnion<ComingParticleUnion<NetClient>>;