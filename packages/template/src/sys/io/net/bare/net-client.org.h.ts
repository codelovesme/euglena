import { TransmitParticle } from "./transmit-particle.par.h";
import { Log } from "../../../log";
import { createOrganelleInteractions } from "@euglena/core";
import { ACK, Exception } from "../../../../type";

export type NetClient = createOrganelleInteractions<{
    in: [[TransmitParticle, ACK | Exception]];
    out: [Log];
}>;
