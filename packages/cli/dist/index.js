#!/usr/bin/env node
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var commander_1 = __importDefault(require("commander"));
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var packageJson = require("../package.json");
process.title = "@euglena/cli";
var isWin = /^win/.test(process.platform);
// executes `pwd`
commander_1.default.version(packageJson.version);
var typelist = "Here is the supported types : \n\n" +
    "\t node     generates a Nodejs Application\n" +
    "\t react     generates a Reactjs Application\n" +
    "\t organelle  generates an Euglena Organelle\n";
// function npm_install(name: string) {
//     console.log("installing dependencies...");
//     let child = spawn(isWin ? "npm.cmd" : "npm", ["install"], { cwd: name });
//     child.on("error", console.error);
//     child.on("exit", () => console.log("done."));
// }
commander_1.default
    .command("new <name>")
    .alias("n")
    .description("generate a new Euglena structed application")
    .option("-t, --type <type>", "Which environment Euglena work within\n\n" + typelist)
    .action(function (name, options) {
    var templateFolder = path.join(__dirname, "../templates", options.type);
    var packageFile = path.join("" + name, "package.json");
    console.log("Generating directory structure.");
    fs_1.mkdirSync(name);
    console.log("Copying files into the new project " + name);
    switch (options.type) {
        case "react":
            {
                var child_process = child_process_1.exec(isWin
                    ? "xcopy " + templateFolder + " " + name + " /i /e"
                    : "cp -a " + templateFolder + "/ " + name + "/", function (err, stdout, stderr) {
                    if (err)
                        console.error(err);
                });
                child_process.on("error", function (err) { return console.log(err); });
            }
            break;
        case "organelle":
            {
                var child_process = child_process_1.exec(isWin
                    ? "xcopy " + templateFolder + " " + name + " /i /e"
                    : "cp -a " + templateFolder + "/ " + name + "/", function (err, stdout, stderr) {
                    if (err)
                        console.error(err);
                });
                child_process.on("error", function (err) { return console.log(err); });
                waitForPathToBeCreated(packageFile).then(function () {
                    //Inserting dependencies into package.json
                    fs_1.readFile(name + "/package.json", "utf-8", function (err, text) {
                        text = text.replace("must_be_replaced", name);
                        fs_1.writeFile(packageFile, text, { encoding: "utf-8" }, function (err) {
                            err_back(err, packageFile + " has been updated.");
                            // npm_install(name);
                        });
                    });
                });
            }
            break;
        case "node":
            {
                var child_process = child_process_1.exec(isWin
                    ? "xcopy " + templateFolder + " " + name + " /i /e"
                    : "cp -a " + templateFolder + "/* " + name + "/", function (err, stdout, stderr) {
                    if (err)
                        console.error(err);
                });
                child_process.on("error", function (err) { return console.log(err); });
                /**
                 *  Wait for the package.json
                 */
                waitForPathToBeCreated(packageFile).then(function () {
                    fs_1.readFile(packageFile, "utf-8", function (err, text) {
                        text = text.replace("must_be_replaced", name);
                        fs_1.writeFile(packageFile, text, { encoding: "utf-8" }, function (err) {
                            err_back(err, packageFile + " has been updated.");
                            // npm_install(name);
                        });
                    });
                });
            }
            break;
    }
});
commander_1.default.parse(process.argv);
function err_back(err, success) {
    if (err)
        console.log(err);
    else if (success)
        console.log(success);
}
function waitForPathToBeCreated(path) {
    if (path instanceof Array) {
        var promises = [];
        for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
            var p = path_1[_i];
            promises.push(waitForPathToBeCreated(p));
        }
        return Promise.all(promises);
    }
    else {
        return new Promise(function (next, reject) {
            fs_1.exists(path, function (x) {
                if (x) {
                    next();
                }
                else {
                    console.log("waiting for " + path + " to be created.");
                    setTimeout(function () { return waitForPathToBeCreated(path).then(next); }, 500);
                }
            });
        });
    }
}
//# sourceMappingURL=index.js.map