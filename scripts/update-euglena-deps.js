#!/usr/bin/env node
const { argv } = require("node:process");
const { join } = require("path");
const { readdirSync,readFileSync, statSync, writeFileSync } = require("fs");
const { execSync } = require("child_process");

execSync(`npm --prefix tmp install json-beautify`);
const beautify = require("../tmp/node_modules/json-beautify");

/**
 * TODO: Move this function into cessanlib.nodejs
 */
const getAllFiles = (dir, fileName, forbiddenFolders=[]) => {
    console.log(`Directory: ${dir}`);
    const items = readdirSync(dir);
    let files = [];
    for (const item of items) {
        console.log(`Check if item ${item} is directory or file`);
        const itemPath = join(dir, item);
        if (statSync(itemPath).isDirectory() && !forbiddenFolders.includes(item)) {
            try {
                files = files.concat(getAllFiles(itemPath,fileName, forbiddenFolders));
            } catch (error) {
                console.log(`Error occurred while reading dir: ${item}`);
                continue;
            }
        } else if (item.endsWith(fileName)) {
            files.push(itemPath);
        }
        console.log(`Item ${item} is nor a directory or a package.json file`);
    }
    return files;
}

const directory = "./packages";
const updateType = argv[2];

console.log("Updating euglena related dependency versions");
console.log(`Directory working in: ${directory}`)

const packageCore = join(directory,"core","package.json");
const corePackageJson= JSON.parse(readFileSync(packageCore));
let version = corePackageJson.version;

const [major,minor,patch] = version.split(".");
switch (updateType) {
    case "major": version = `${Number(major)+1}.0.0`; break;
    case "minor": version = `${major}.${Number(minor)+1}.0`; break;
    case "patch": version = `${major}.${minor}.${Number(patch)+1}`; break;
    default: 
        console.log(`Unknown version update type ${updateType}`);
        return 1;
}
console.log(`Update type: ${updateType}`);
console.log(`Version to set: ${version}`)
console.log("Finding package.json files")
const files = getAllFiles(directory,"package.json",["node_modules"]);
console.log(`Total found package.json files: ${files.length}`)

const updateDependencies = (dependencies) => {
    if(!dependencies) return dependencies;
    const packageNames = Object.keys(dependencies);
    const euglenaRelatedPackageNames = packageNames.filter(key => key.startsWith("@euglena/"));
    return euglenaRelatedPackageNames.reduce((acc,curr)=>{
        console.log(`Changing dependency ${curr} version from ${acc[curr]} to ^${version}`);
        return{
            ...acc,
            [curr]: `^${version}`
        }
    },{...dependencies});
}

const updateAllRelatedDependencies = (packageJson, dependenciesArr) => dependenciesArr.reduce((acc,curr)=>{
    console.log(`Updating packages under ${curr}`);
    return {
        ...acc,
        [curr]: updateDependencies(acc[curr])
    }
},{...packageJson});

console.log("Start updating...")
for(const file of files) {
    if(file.startsWith("packages/cli/")){
        console.log(`Ignoring ${file}`);
    }
    console.log(`Start working on ${file}`);
    try{
        const jsonString = readFileSync(file);
        const packageJson = JSON.parse(jsonString);
        const dependenciesArr = ["dependencies","peerDependencies","devDependencies"]; 
        const newPackageJson = updateAllRelatedDependencies(packageJson, dependenciesArr);
        console.log(`Writing file ${file}`);
        writeFileSync(file, beautify(newPackageJson,null,4,0));
    } catch(e) {
        console.log(`Error occurred while working on ${file} error: ${e.message}`);
    }
}

