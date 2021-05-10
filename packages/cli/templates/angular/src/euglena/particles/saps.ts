import { Particle, nucleusJs as nucleus } from '@euglena/core';
import angular from '@euglena/organelle.ui.angular';
import timer from '@euglena/organelle.timer.js';
import { timerJsName, uiAngular } from '../constants';
import chromosome from '../chromosome';
import { context } from '../../app/context';
import { sys } from 'cessnalib';

const now: sys.type.Time = sys.type.StaticTools.Time.fromJavascriptDate(
  new Date()
);

export default [
  nucleus.cs({
    type: 'InMemory',
    genes: chromosome,
  }),
  angular.cs(
    {
      context,
    },
    {
      organelleName: uiAngular,
    }
  ),
  timer.cs(now, { organelleName: timerJsName }),
];
