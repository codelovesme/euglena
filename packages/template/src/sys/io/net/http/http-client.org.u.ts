import { ComingParticleUnion, CreateParticleUnion, cp } from "@euglena/core";
import { HttpClient } from "./http-client.org.h";

export const createHttpClientComingParticle = cp as CreateParticleUnion<ComingParticleUnion<HttpClient>>;
