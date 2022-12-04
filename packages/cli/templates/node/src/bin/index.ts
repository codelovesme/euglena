#!/usr/bin/env node
import { ce, particle } from "@euglena/template";
import particles from "../euglena";

ce(particles).catch((err: particle.common.Exception) => {
    console.error(`Error - ${err.data.message}`);
});
