#!/usr/bin/env node

import * as path from "path";
import program from "commander";
import { mkdirSync, readFile, writeFile, exists } from "fs";
import { exec, spawn } from "child_process";
import beautify from "json-beautify";

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

function npm_install(name: string) {
    console.log("installing dependencies...");
    let child = spawn(isWin ? "npm.cmd" : "npm", ["install"], { cwd: name });
    child.on("error", console.error);
    child.on("exit", () => console.log("done."));
}

program
    .command("new <name>")
    .alias("n")
    .description("generate a new Euglena structed application")
    .option("-t, --type <type>", "Which environment Euglena work within\n\n" + typelist)
    .action((name: string, options: { type: string }) => {
        let templateFolder = path.join(__dirname, "../templates", options.type);
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
                        //Inserting dependencies into pacakge.json
                        readFile(name + "/package.json", "utf-8", (err, text) => {
                            let json = JSON.parse(text);
                            json.scripts.test = "gulp test";
                            json.scripts.build = "gulp build";
                            json.scripts.start = "gulp buildAndTest && gulp watch";
                            json.main = ".dist/src/index.js";
                            json.typings = ".dist/src/index.d.ts";
                            json.dependencies = {
                                cessnalib: "^0.7.0",
                                "@euglena/core": "^0.1.7",
                                "@euglena/template": "^2.0.0",
                                "@euglena/organelle.time.js": "^0.1.0",
                                jsonminify: "^0.4.1"
                            };
                            json.devDependencies = {
                                "@types/chai": "^4.0.10",
                                "@types/node": "^7.0.14",
                                "@types/mocha": "^2.2.40",
                                gulp: "github:gulpjs/gulp#4.0",
                                "gulp-mocha": "^4.3.1",
                                "gulp-typescript": "^3.0.1",
                                typescript: "^2.3.3",
                                "gulp-sourcemaps": "^2.6.1",
                                merge2: "^1.2.0",
                                chai: "^4.1.2"
                            };
                            json.files = [".dist/src/*"];
                            text = beautify(json, [], 2, 10);
                            writeFile(packageFile, text, { encoding: "utf-8" }, (err) => {
                                err_back(err, packageFile + " has been updated.");
                                /**
                                 *  install dependencies
                                 *  run npm install
                                 */
                                npm_install(name);
                            });
                        });
                    });
                    /**
                     * Generate package.json
                     */
                    spawn(isWin ? "npm.cmd" : "npm", ["init", "--force"], { cwd: name });
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
                        //Inserting dependencies into pacakge.json
                        readFile(packageFile, "utf-8", (err, text) => {
                            let json = JSON.parse(text);
                            json.name = name;
                            text = beautify(json, null as any, 2, 10);
                            writeFile(packageFile, text, { encoding: "utf-8" }, (err) => {
                                err_back(err, packageFile + " has been updated.");
                                /**
                                 *  install dependencies
                                 *  run npm install
                                 */
                                npm_install(name);
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
