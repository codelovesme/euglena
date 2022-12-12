import { organelle, particle } from "@euglena/template";

import EuglenaHasBeenBorn = particle.common.EuglenaHasBeenBorn;
import * as core from "@euglena/core";
import { createChromosome, dcg } from "./gene";

createChromosome((addGene) => {
    addGene<EuglenaHasBeenBorn, { nucleus: organelle.nucleus.Nucleus; netServer: organelle.netServer.NetServer }>(
        "Once euglena has been born",
        { meta: { class: "EuglenaHasBeenBorn" } },
        async (p, s, { t, o }) => {
            t(organelle.netServer.cp("GetAlive"), "netServer");
            t(
                organelle.nucleus.cp("ReceiveParticle", {
                    particle: {} as core.particle.Particle,
                    source: ""
                }),
                "nucleus"
            );
        },
        { nucleus: "nucleus", netServer: "netServer" }
    );
});

dcg<EuglenaHasBeenBorn, { nucleus: organelle.nucleus.Nucleus; netServer: organelle.netServer.NetServer }>(
    "Once euglena has been born",
    { meta: { class: "EuglenaHasBeenBorn" } },
    async (p, s, { t }) => {
        t(organelle.netServer.cp("GetAlive"), "netServer");
    }
);
