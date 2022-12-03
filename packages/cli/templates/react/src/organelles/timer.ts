import {helpers,particle} from "@euglena/template";
import timer from '@euglena/organelle.timer.js';

const name = "Timer";

export default helpers.createOrganelleConfig(name,[
    particle.common.cp("OrganelleInfo",{
        name: name,
        location: {
          type: 'InMemory',
          organelle: timer,
        },
    })
])