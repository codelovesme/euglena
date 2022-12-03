import {helpers,particle} from "@euglena/template";
import vacuole from '@euglena/organelle.vacuole.js';

const name = "Vacuole";

export default helpers.createOrganelleConfig(name,[
    particle.common.cp("OrganelleInfo",{
        name: name,
        location: {
          type: 'InMemory',
          organelle: vacuole,
        },
    })
])