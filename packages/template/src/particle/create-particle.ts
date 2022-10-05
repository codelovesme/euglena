import { defineCreateCommonParticles } from "@euglena/core";
import { CommonParticle } from "./common.h";
import { AuthParticle } from "./auth.h";

export const createCommonParticle = defineCreateCommonParticles<CommonParticle>();
export const createAuthParticle = defineCreateCommonParticles<AuthParticle>();

export const ccp = createCommonParticle;
export const cap = createAuthParticle;
