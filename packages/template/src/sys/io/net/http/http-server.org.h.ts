import { createOrganelleInteractions } from "@euglena/core";
import { AddRoute } from "./add-route.par.h";
import { HttpImpulse } from "./http-impulse.par.h";
import { organelle } from "../../../../cell";
import { Particles } from "../../../../type";
import { Log } from "../../../log";

export type HttpServer = createOrganelleInteractions<{
    in: [organelle.GetAlive, AddRoute];
    out: [[HttpImpulse, Particles], Log];
}>;