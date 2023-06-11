import { ComingParticleUnion, CreateParticleUnion, cp } from "@euglena/core";
import { HttpServer } from "./http-server.org.h";

export const createHttpServerComingParticle = cp as CreateParticleUnion<ComingParticleUnion<HttpServer>>;
