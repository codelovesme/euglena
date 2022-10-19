#!/usr/bin/env node
const { argv } = require('node:process');
const { join } = require('path');
const { readdirSync, statSync } = require('fs');

/**
 * TODO: Move this function into cessanlib.nodejs
 */
const getAllFiles = (dir, extn, files, result = [], regex) => {
    files = files || readdirSync(dir);
    regex = regex || new RegExp(`\\${extn}$`);

    for (let i = 0; i < files.length; i++) {
        let file = join(dir, files[i]);
        if (statSync(file).isDirectory()) {
            try {
                result = getAllFiles(file, extn, readdirSync(file), result, regex);
            } catch (error) {
                continue;
            }
        } else {
            if (regex.test(file)) {
                result.push(file);
            }
        }
    }
    return result;
}

const directory = argv[1];
const version = argv[2];

const files = getAllFiles(directory,"package.json");

const updateDependencies = (dependencies) => {
    const packageNames = Object.keys(dependencies);
    const euglenaRelatedPackageNames = packageNames.filter(key => key.startsWith("@euglena/"));
    return euglenaRelatedPackageNames.reduce((acc,curr)=>({
        ...acc,
        [curr]: `^${version}`
    }),{...dependencies});
}

const updateAllRelatedDependencies = (packageJson, dependenciesArr) => dependenciesArr.reduce((acc,curr)=>({
    ...acc,
    [curr]: updateDependencies(acc[curr])
}),{...packageJson});

for(const file of files) {
    const packageJson = require(file);
    const dependenciesArr = ["dependencies","peerDependencies","devDependencies"]; 
    const newPackageJson = updateAllRelatedDependencies(packageJson, dependenciesArr);
    fs.writeFileSync(file, newPackageJson);
}

