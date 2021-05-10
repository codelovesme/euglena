import vacuole from '@euglena/organelle.vacuole.js';
import ui from '@euglena/organelle.ui.angular';
import logger from '@euglena/organelle.logger.console';
import timer from '@euglena/organelle.timer.js';

import { endoplasmicReticulum as reticulum } from '@euglena/core';
import {
  loggerConsoleName,
  uiAngular,
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
    name: uiAngular,
    location: {
      type: 'InMemory',
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
