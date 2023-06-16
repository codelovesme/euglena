#!/usr/bin/env node
import { Exception, cell } from "@euglena/template";
import particles from "../euglena";

cell.ce(particles).catch((err: Exception) => {
    console.error(`Error - ${err.data.message}`);
});
