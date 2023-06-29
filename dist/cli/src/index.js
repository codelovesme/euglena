#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var commander_1 = require("commander");
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var template_1 = require("@euglena/template");
var packageJson = require("../package.json");
process.title = "@euglena/cli";
var isWin = /^win/.test(process.platform);
var isLinux = /^linux/.test(process.platform);
var main = function () {
    var types = ["node", "react", "angular", "organelle"];
    commander_1.program.version(packageJson.version);
    commander_1.program
        .command("new <name>")
        .alias("n")
        .description("Generate a new Euglena structed application")
        .option("-t, --type <type>", "represents the environment where Euglena lives\n        Here is the supported types : \n        node        generates a Nodejs Application\n        react       generates a Reactjs Application\n        angular     generates an Angular Application\n        organelle   generates an Euglena Organelle")
        .action(function (name, _a) {
        var type = _a.type;
        if (!types.includes(type))
            throw "Unknown application type!";
        var templateFolder = path.join(__dirname, "../templates", type);
        console.log("Creating directory ".concat(name));
        (0, fs_1.mkdirSync)(name);
        console.log("Copying files into the new project " + name);
        (0, child_process_1.execSync)(isWin ? "xcopy ".concat(templateFolder, " ").concat(name, " /i /e") : "cp -a ".concat(templateFolder, "/* ").concat(name, "/"));
        console.log("Replacing placeholder with project name");
        if (isWin) {
            throw "Project creation in Windows is not implemented yet !";
        }
        if (isLinux) {
            (0, child_process_1.execSync)("find ".concat(name, " -type f -exec sed -i 's/must_be_replaced/").concat(name, "/g' {} +"));
        }
        else {
            /**
             * On BSD systems like macOS, you need to provide a backup extension like -i '.bak' or else "risk corruption or partial content" per the manpage.
             */
            (0, child_process_1.execSync)("find ".concat(name, " -type f -exec sed -i '.bak' 's/must_be_replaced/").concat(name, "/g' {} +"));
        }
    });
    commander_1.program
        .command("run <path>")
        .alias("r")
        .description("Initialize a euglena instance using a particles package")
        .action(function (path_) { return __awaiter(void 0, void 0, void 0, function () {
        var particlesModule, particles;
        return __generator(this, function (_a) {
            particlesModule = require(path.join(process.cwd(), path_));
            particles = "default" in particlesModule ? particlesModule.default : particlesModule;
            template_1.cell.ce(particles);
            return [2 /*return*/];
        });
    }); });
    commander_1.program.parse(process.argv);
};
if (isWin)
    throw "Project creation in Windows is not implemented yet !";
main();
//# sourceMappingURL=index.js.map