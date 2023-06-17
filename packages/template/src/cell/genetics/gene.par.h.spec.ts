import { Particle } from "@euglena/core";
import { EuglenaHasBeenBorn } from "..";
import { Nucleus } from "./nucleus.org.h";
import { createChromosome, dcg } from "./gene.u";
import { createNucleusComingParticle } from "./nucleus.org.u";
import { io } from "../../sys";

import NetServer = io.net.bare.NetServer;
const createNetServerComingParticle = io.net.bare.createNetServerComingParticle;

createChromosome((addGene) => {
    addGene<EuglenaHasBeenBorn, { nucleus: Nucleus; netServer: NetServer }>(
        "Once euglena has been born",
        { meta: { class: "EuglenaHasBeenBorn" } },
        async (p, s, { t, o }) => {
            t(createNetServerComingParticle("GetAlive"), "netServer");
            t(
                createNucleusComingParticle("ReceiveParticle", {
                    particle: {} as Particle,
                    source: ""
                }),
                "nucleus"
            );
        },
        { nucleus: "nucleus", netServer: "netServer" }
    );
});

dcg<EuglenaHasBeenBorn, { nucleus: Nucleus; netServer: NetServer }>(
    "Once euglena has been born",
    { meta: { class: "EuglenaHasBeenBorn" } },
    async (p, s, { t }) => {
        t(createNetServerComingParticle("GetAlive"), "netServer");
    }
);
