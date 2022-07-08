#!/usr/bin/env node

import * as path from "path";
import { program } from "commander";
import { mkdirSync } from "fs";
import { execSync } from "child_process";
import { ce } from "@euglena/core";

const packageJson = require("../package.json");

process.title = "@euglena/cli";

const isWin = /^win/.test(process.platform);
const isLinux = /^linux/.test(process.platform);

const main = () => {
    const types = ["node", "react", "angular", "organelle"];
    program.version(packageJson.version);
    program
        .command("new <name>")
        .alias("n")
        .description("Generate a new Euglena structed application")
        .option(
            "-t, --type <type>",
            `represents the environment where Euglena lives
        Here is the supported types : 
        node        generates a Nodejs Application
        react       generates a Reactjs Application
        angular     generates an Angular Application
        organelle   generates an Euglena Organelle`
        )
        .action((name: string, { type }: { type: string }) => {
            if (!types.includes(type)) throw "Unknown application type!";

            const templateFolder = path.join(__dirname, "../dist/templates", type);

            console.log(`Creating directory ${name}`);
            mkdirSync(name);

            console.log("Copying files into the new project " + name);
            execSync(isWin ? `xcopy ${templateFolder} ${name} /i /e` : `cp -a ${templateFolder}/* ${name}/`);
            console.log("Replacing placeholder with project name");
            if (isWin) {
                throw "Project creation in Windows is not implemented yet !";
            }
            if (isLinux) {
                execSync(`find ${name} -type f -exec sed -i 's/must_be_replaced/${name}/g' {} +`);
            } else {
                /**
                 * On BSD systems like macOS, you need to provide a backup extension like -i '.bak' or else "risk corruption or partial content" per the manpage.
                 */
                execSync(`find ${name} -type f -exec sed -i '.bak' 's/must_be_replaced/${name}/g' {} +`);
            }
        });
    program
        .command("run <path>")
        .alias("r")
        .description("Initialize a euglena instance using a particles package")
        .action(async (path_: string) => {
            const particlesModule = require(path.join(process.cwd(), path_));
            const particles = "default" in particlesModule ? particlesModule.default : particlesModule;
            ce(particles);
        });

    program.parse(process.argv);
};

if (isWin) throw "Project creation in Windows is not implemented yet !";

main();
