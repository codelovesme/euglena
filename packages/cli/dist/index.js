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
var json_beautify_1 = __importDefault(require("json-beautify"));
var packageJson = require("../package.json");
process.title = "@euglena/cli";
var isWin = /^win/.test(process.platform);
// executes `pwd`
commander_1.default.version(packageJson.version);
var typelist = "Here is the supported types : \n\n" +
    "\t node     generates a Nodejs Application\n" +
    "\t react     generates a Reactjs Application\n" +
    "\t organelle  generates an Euglena Organelle\n";
function npm_install(name) {
    console.log("installing dependencies...");
    var child = child_process_1.spawn(isWin ? "npm.cmd" : "npm", ["install"], { cwd: name });
    child.on("exit", function () { return console.log("done."); });
}
commander_1.default
    .command("new <name>")
    .alias("n")
    .description("generate a new Euglena structed application")
    .option("-t, --type <type>", "Which environment Euglena work within\n\n" + typelist)
    .action(function (name, options) {
    var templateFolder = path.join(__dirname, "../src", options.type);
    var packageFile = "";
    var child_process;
    switch (options.type) {
        case "react":
            console.log("Generating directory structure.");
            fs_1.mkdirSync(name);
            console.log("Copying files into the new project " + name);
            child_process = child_process_1.exec(isWin
                ? "xcopy " + templateFolder + " " + name + " /i /e"
                : "cp -a " + templateFolder + "/ " + name + "/", function (err, stdout, stderr) {
                if (err)
                    console.error(err);
            });
            child_process.on("error", function (err) { return console.log(err); });
            break;
        case "organelle":
            //bar.tick(10);
            console.log("Generating directory structure.");
            fs_1.mkdirSync(name);
            //bar.tick(20);
            //copy sample files into new app folder
            console.log("Copying files into the new project " + name);
            child_process = child_process_1.exec(isWin
                ? "xcopy " + templateFolder + " " + name + " /i /e"
                : "cp -a " + templateFolder + "/ " + name + "/", function (err, stdout, stderr) {
                if (err)
                    console.error(err);
            });
            child_process.on("error", function (err) { return console.log(err); });
            //bar.tick(40);
            /**
             *  Wait for the package.json
             */
            packageFile = name + "/package.json";
            waitForPathToBeCreated(packageFile).then(function () {
                //Inserting dependencies into pacakge.json
                fs_1.readFile(name + "/package.json", "utf-8", function (err, text) {
                    var json = JSON.parse(text);
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
                    text = json_beautify_1.default(json, [], 2, 10);
                    fs_1.writeFile(packageFile, text, { encoding: "utf-8" }, function (err) {
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
            child_process_1.spawn(isWin ? "npm.cmd" : "npm", ["init", "--force"], { cwd: name });
            break;
        case "node":
            console.log("Generating directory structure.");
            fs_1.mkdirSync(name);
            //copy sample files into new app folder
            console.log("Copying files into the new project " + name);
            child_process = child_process_1.exec(isWin
                ? "xcopy " + templateFolder + " " + name + " /i /e"
                : "cp -a " + templateFolder + "/* " + name + "/", function (err, stdout, stderr) {
                if (err)
                    console.error(err);
            });
            child_process.on("error", function (err) { return console.log(err); });
            /**
             *  Wait for the package.json
             */
            packageFile = name + "/package.json";
            waitForPathToBeCreated(packageFile).then(function () {
                //Inserting dependencies into pacakge.json
                fs_1.readFile(packageFile, "utf-8", function (err, text) {
                    var json = JSON.parse(text);
                    json.name = name;
                    text = json_beautify_1.default(json, null, 2, 10);
                    fs_1.writeFile(packageFile, text, { encoding: "utf-8" }, function (err) {
                        err_back(err, packageFile + " has been updated.");
                        /**
                         *  install dependencies
                         *  run npm install
                         */
                        npm_install(name);
                    });
                });
            });
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