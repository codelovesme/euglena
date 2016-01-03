/// <reference path="../src/cessnalib_template.ts" />

import {cessnalib_template} from "../src/cessnalib_template";
import {cessnalib} from "../node_modules/cessnalib/cessnalib";

var injectionBank = new cessnalib.sys.type.Map<string, Object>();

cessnalib_template.being.alive.StaticTools.createEuglena(injectionBank);