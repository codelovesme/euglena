#!/usr/bin/env node

import * as path from "path";
import program from "commander";
import { mkdirSync, readFile, writeFile, exists } from "fs";
import { exec } from "child_process";

const packageJson = require("../package.json");

process.title = "@euglena/cli";

var isWin = /^win/.test(process.platform);

// executes `pwd`
program.version(packageJson.version);

let typelist =
    "Here is the supported types : \n\n" +
    "\t node     generates a Nodejs Application\n" +
    "\t react     generates a Reactjs Application\n" +
    "\t organelle  generates an Euglena Organelle\n";

// function npm_install(name: string) {
//     console.log("installing dependencies...");
//     let child = spawn(isWin ? "npm.cmd" : "npm", ["install"], { cwd: name });
//     child.on("error", console.error);
//     child.on("exit", () => console.log("done."));
// }

program
    .command("new <name>")
    .alias("n")
    .description("generate a new Euglena structed application")
    .option("-t, --type <type>", "Which environment Euglena work within\n\n" + typelist)
    .action((name: string, options: { type: string }) => {
        let templateFolder = path.join(__dirname, "../dist/templates", options.type);
        let packageFile = path.join(`${name}`, "package.json");

        console.log("Generating directory structure.");
        mkdirSync(name);
        console.log("Copying files into the new project " + name);

        switch (options.type) {
            case "react":
                {
                    const child_process = exec(
                        isWin
                            ? "xcopy " + templateFolder + " " + name + " /i /e"
                            : "cp -a " + templateFolder + "/ " + name + "/",
                        (err, stdout, stderr) => {
                            if (err) console.error(err);
                        }
                    );
                    child_process.on("error", (err: any) => console.log(err));
                }
                break;
            case "organelle":
                {
                    const child_process = exec(
                        isWin
                            ? "xcopy " + templateFolder + " " + name + " /i /e"
                            : "cp -a " + templateFolder + "/ " + name + "/",
                        (err, stdout, stderr) => {
                            if (err) console.error(err);
                        }
                    );
                    child_process.on("error", (err: any) => console.log(err));
                    waitForPathToBeCreated(packageFile).then(() => {
                        //Inserting dependencies into package.json
                        readFile(name + "/package.json", "utf-8", (err, text) => {
                            text = text.replace("must_be_replaced", name);
                            writeFile(packageFile, text, { encoding: "utf-8" }, (err) => {
                                err_back(err, packageFile + " has been updated.");
                                // npm_install(name);
                            });
                        });
                    });
                }
                break;
            case "node":
                {
                    const child_process = exec(
                        isWin
                            ? "xcopy " + templateFolder + " " + name + " /i /e"
                            : "cp -a " + templateFolder + "/* " + name + "/",
                        (err, stdout, stderr) => {
                            if (err) console.error(err);
                        }
                    );
                    child_process.on("error", (err) => console.log(err));
                    /**
                     *  Wait for the package.json
                     */
                    waitForPathToBeCreated(packageFile).then(() => {
                        readFile(packageFile, "utf-8", (err, text) => {
                            text = text.replace("must_be_replaced", name);
                            writeFile(packageFile, text, { encoding: "utf-8" }, (err) => {
                                err_back(err, packageFile + " has been updated.");
                                // npm_install(name);
                            });
                        });
                    });
                }
                break;
        }
    });

program.parse(process.argv);

function err_back(err: Error | null, success?: string) {
    if (err) console.log(err);
    else if (success) console.log(success);
}

function waitForPathToBeCreated(path: string | string[]): Promise<{}> {
    if (path instanceof Array) {
        let promises = [];
        for (let p of path) {
            promises.push(waitForPathToBeCreated(p));
        }
        return Promise.all(promises);
    } else {
        return new Promise((next: any, reject: any) => {
            exists(path, (x) => {
                if (x) {
                    next();
                } else {
                    console.log("waiting for " + path + " to be created.");
                    setTimeout(() => waitForPathToBeCreated(path).then(next), 500);
                }
            });
        });
    }
}
