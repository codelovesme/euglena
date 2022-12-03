import {helpers,particle} from "@euglena/template";
import reticulum from '@euglena/organelle.endoplasmic-reticulum.js';

const name = "EndoplasmicReticulum";

export default helpers.createOrganelleConfig(name,[
    particle.common.cp("OrganelleInfo",{
        name: name,
        location: {
          type: 'InMemory',
          organelle: reticulum,
        },
    })
])