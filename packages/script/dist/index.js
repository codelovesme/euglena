#!/usr/bin/env node
"use strict";
/**
 *  Sample code block
 * ------------------
 *
 *
 * >> file .chr
 *
 * gene Write a log says Hello World
 * resp = transmit Log({ message:"Hello World", level:"Info" }) to logger
 * if (resp.meta.class === "Log") {
 *      transmit resp to logger
 * } else {
 *      transmit Log({ message:resp.data.message, level:"Error" }) logger
 * }
 * resp2 = transmit GetAlive() nedb
 * t Log({message:"JSON.stringify(resp2)",level:"Info"}) logger
 * resp3 = transmit Listen() temperature
 * t Log({message:"JSON.stringify(resp3)",level:"Info"}) logger
 *
 *
 *
 * --------suggests--------
 * resp = transmit Log({ message:"Hello World", level:"Info" }) to logger
 * console.log(resp)
 * ------------------------
 * resp = t Log({ message:"Hello World", level:"Info" }) to logger
 * ------------------------
 * resp = t Log({ message:"Hello World", level:"Info" }) logger
 * ------------------------
 * transmit Log({ message:"Hello World", level:"Info" }) logger
 * receive resp
 *      console.log(resp)
 * ------------------------
 * const log = Log({ message:"Hello World", level:"Info" });
 * t log logger => resp
 * console.log(resp)
 * ------------------------
 * transmit log to logger get resp
 * ------------------------
 * transmit log to logger => resp
 * ------------------------
 * log => logger
 * log => logger => resp
 *
 *
 * --------suggests--------
 * Write a log says Hello World
 * const log = Log({ message:"Hello World", level:"Info" });
 * log => logger => resp
 *
 * >> file .par
 *
 * const nucleusSap = ...
 * const reticulumSap = ...
 * const loggerSap = ...
 * const loggerOrganelleInfo = ...
 *
 *
 *
 *
 * >> file .eug
 *
 *
 *
 *
 *
 * >> file .org
 *
 */
console.log();
//# sourceMappingURL=index.js.map