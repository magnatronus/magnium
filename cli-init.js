#!/usr/bin/env node
const   args = require("yargs").argv,
        chalk = require('chalk'),
        fs = require("fs-extra"),
        spawn = require( 'child_process' ).spawnSync,
        log = console.log,
        wsfile = `${process.cwd()}/.magniumrc`,
        configfile = `${process.cwd()}/tidefaults.json`
/**
 * cli-init
 * This module is used to generate the required .magniumrc file in the current directory to set it up as an Magnium workspace
 * It requires no params and assumes the current directory will be the root of the workspace
 */
log(chalk.green("[INFO] - Creating a Magnium Workspace......."));


// lets test for the Ti command line - if not there warn the user
try {
    const cmd = spawn( 'ti', ['-q']);
    console.log( `${cmd.stdout.toString()}` );
}
catch(ex){
    console.log(chalk.yellow("[WARN] - Unable to access Titanium CLI. Please check that the CLI is installed, or install using:"));
    console.log(chalk.white("$(sudo) npm install -g titanium"));
}

// If a workspace already exists abort the action and inform the user
if(fs.pathExistsSync(wsfile)){
    log(chalk.yellow("[WARN] - Magnium workspace detected, please use a blank directory to set up a new workspace....."));
} else {

    // standard project defaults
    const defaults = {
        "publisher": "SpiralArm Consulting Ltd",
        "copyright": "2018 SpiralArm Consulting Ltd",
        "hyperloop": "",
        "analytics": false,
        "appId": "uk.spiralarm.",
        "loglevel": "info",
        "platforms": "ios,android",
        "sdk": "7.0.2.GA",
        "url": "http://www.spiralarm.uk"
    };

    // contents of resource 
    const resource = {
        "workspace" : process.cwd(),
        "projects": 'projects',
        "build": 'mag-build',
        "output": 'titanium',
        "defaults": 'tidefaults.json'
    };

    // write the default file and the erbium resource file
    fs.writeJsonSync(configfile, defaults);
    fs.writeJsonSync(wsfile, resource);
    log(chalk.green("[INFO] - Magnium Workspace set up complete......."));

}