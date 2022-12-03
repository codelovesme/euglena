import * as core from "@euglena/core";
import * as template from "@euglena/template";

type Sap = template.particle.common.Sap<{
    printLevel: boolean;
}>;

let config: Sap["data"];

export default core.organelle.dco<template.organelle.logger.Logger, Sap>({
    Sap: async (p) => {
        config = p.data;
    },
    Log: async (p, { cp, t }) => {
        console.log(config.printLevel ? `${p.data.level} - ${p.data.message}` : p.data.message);
        return cp("ACK");
    }
});
