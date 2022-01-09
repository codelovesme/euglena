import vacuole from '@euglena/organelle.vacuole.js';
import ui from '@euglena/organelle.ui.react';
import logger from '@euglena/organelle.logger.console';
import timer from '@euglena/organelle.timer.js';

import { endoplasmicReticulum as reticulum } from '@euglena/core';
import {
  loggerConsoleName,
  uiReactName,
  vacuoleJsName,
  timerJsName,
} from '../constants';

export default [
  reticulum.cp.OrganelleInfo({
    name: vacuoleJsName,
    location: {
      type: 'InMemory',
      organelle: vacuole,
    },
  }),
  reticulum.cp.OrganelleInfo({
    name: uiReactName,
    location: {
      type: "InMemory",
      organelle: ui,
    },
  }),
  reticulum.cp.OrganelleInfo({
    name: loggerConsoleName,
    location: {
      type: 'InMemory',
      organelle: logger,
    },
  }),
  reticulum.cp.OrganelleInfo({
    name: timerJsName,
    location: {
      type: 'InMemory',
      organelle: timer,
    },
  }),
];
