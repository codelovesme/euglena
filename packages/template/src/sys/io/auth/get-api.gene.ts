import * as core from "@euglena/core";
import { dcg } from "@euglena/organelle.nucleus.js";
import { isException } from "../exception";
import { Pulse } from "./pulse.particle.h";
import { createGetEuglenaName, createGetSenderPermissions } from "./utils";

import Particle = core.particle.Particle;

const cp = core.particle.cp;

export default dcg<
    Pulse<template.particle.common.GetApi>,
    {
        permanentVacuole: vacuole.Vacuole;
        temporaryVacuole: vacuole.Vacuole;
        nucleus: nucleus.Nucleus;
        logger: logger.Logger;
    }
>(
    "Get Api",
    { meta: { class: "Pulse" }, data: { particle: { meta: { class: "GetApi" } } } },
    async (p, s, { t, o }) => {
        const getEuglenaName = createGetEuglenaName(t, { alias: "temporaryVacuole", name: o.temporaryVacuole });
        //read euglenaName
        const euglenaName = await getEuglenaName();
        if (isException(euglenaName)) return euglenaName;

        //log euglenaName
        await t(logger.cp("Log", { message: `EuglenaName: ${euglenaName.data}`, level: "Info" }), "logger");

        const getSenderPermissions = createGetSenderPermissions(t, euglenaName);
        //Read permissons of the euglena
        const permissions = await getSenderPermissions(p.data.sender);
        if (isException(permissions)) return permissions;
        return cp<template.particle.common.Api>(
            "Api",
            permissions.data.reduce((acc, curr) => [...acc, ...curr.data.particles], [] as Particle[])
        );
    }
);
