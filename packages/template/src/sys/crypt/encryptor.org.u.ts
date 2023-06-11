import { ComingParticleUnion, CreateParticleUnion, cp } from "@euglena/core";
import { Encryptor } from "./encryptor.org.h";

export const createEncryptorComingParticle = cp as CreateParticleUnion<ComingParticleUnion<Encryptor>>;
