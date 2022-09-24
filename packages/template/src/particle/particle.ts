import { defineCreateCommonParticles } from "@euglena/core";
import { ACK, NACK, Log, Exception, GetAlive, OrganelleInfo, Particles, Sap } from "./particle.h";

export type CommonParticles = ACK | NACK | Log | Exception | GetAlive | OrganelleInfo | Particles | Sap;

export const createCommonParticles = defineCreateCommonParticles<CommonParticles>();
export const ccp = createCommonParticles;
