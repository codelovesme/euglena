import * as core from "@euglena/core";
import {helpers,particle} from "@euglena/template";
import vacuole from '@euglena/organelle.vacuole.js';
import particles from "../particles";

const name = "Vacuole";

export default helpers.organelle.createOrganelleConfig(name,[
    particle.common.cp("OrganelleInfo",{
        name: name,
        location: {
          type: 'InMemory',
          organelle: vacuole as any,
        },
    }),
    core.particle.cp("Sap", {
      type: "InMemory",
      particles: particles
  })
])