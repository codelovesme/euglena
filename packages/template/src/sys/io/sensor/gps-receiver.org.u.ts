import { ComingParticleUnion, CreateParticleUnion, cp } from "@euglena/core";
import { GpsReceiver } from "./gps-receiver.org.h";

export const createGPSReceiverComingParticle = cp as CreateParticleUnion<ComingParticleUnion<GpsReceiver>>;
