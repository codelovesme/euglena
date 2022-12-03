import { Particle, nucleusJs as nucleus } from '@euglena/core';
import react from '@euglena/organelle.ui.react';
import timer from '@euglena/organelle.timer.js';
import chromosome from '../genes';
import { sys } from 'cessnalib';
import rootComponent from "../../components/app";

const now: sys.type.Time = sys.type.StaticTools.Time.fromJavascriptDate(
  new Date()
);

export default [
  nucleus.cs({
    type: 'InMemory',
    genes: chromosome,
  }),
  react.cs(
    { rootComponent: rootComponent, serviceWorker: false },
    { organelleName: uiReactName }
  ),
  timer.cs(now, { organelleName: timerJsName })
];
