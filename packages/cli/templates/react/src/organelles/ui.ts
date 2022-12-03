import {helpers,particle} from "@euglena/template";
import ui from '@euglena/organelle.ui.react';

const name = "UI";

export default helpers.createOrganelleConfig(name,[
    particle.common.cp("OrganelleInfo",{
        name: name,
        location: {
          type: 'InMemory',
          organelle: ui,
        },
    })
])