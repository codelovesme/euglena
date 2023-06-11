import { SaveParticle } from "./save-particle.par.h";
import { RemoveParticle } from "./remove-particle.par.h";
import { ReadParticle } from "./read-particle.par.h";
import { Hibernate } from "./hibernate.par.h";
import { Log } from "../../../log";
import { Particle, createOrganelleInteractions } from "@euglena/core";
import { ACK, Exception } from "../../../../type";
import { organelle } from "../../../../cell";

export type Vacuole = createOrganelleInteractions<{
    in: [
        [SaveParticle, ACK | Exception],
        [ReadParticle, Particle<"Particles", Particle[]> | Exception],
        [RemoveParticle, ACK | Exception],
        [organelle.GetAlive, ACK | Exception],
        Hibernate
    ];
    out: [Log];
}>;


