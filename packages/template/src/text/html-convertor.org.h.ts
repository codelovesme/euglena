import { Particle, createOrganelleInteractions } from "@euglena/core";
import { Log } from "../log";
import { Html } from "./html.par.h";

export type ConvertToHtml = Particle<"ConvertToHtml", unknown>;

export type HtmlConvertor = createOrganelleInteractions<{
    in: [[ConvertToHtml, Html]];
    out: [Log];
}>;
