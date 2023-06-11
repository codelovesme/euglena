import { createOrganelleInteractions } from "@euglena/core";
import { HttpImpulse } from "./http-impulse.par.h";
import { Log } from "../../../log";
import {Response} from "./response.par.h";

export type HttpClient = createOrganelleInteractions<{
    in: [[HttpImpulse, Response]];
    out: [Log];
}>;
