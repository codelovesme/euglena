/// <reference path="../src/euglena_template.ts" />

import {euglena_template} from "../src/euglena_template";
import {euglena} from "../node_modules/euglena/euglena";

var injectionBank = new euglena.sys.type.Map<string, Object>();

euglena_template.being.alive.StaticTools.createEuglena(injectionBank);