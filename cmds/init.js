/**
 * init.js
 * CLI command to initialise a Magnium Workspace
 * 
 * @module init
 * 
 * @license
 * MIT. Please see the LICENSE file included with this package
 *
 */

const   chalk = require('chalk'),
        fs = require("fs-extra"),
        spawn = require( 'child_process' ).spawnSync,
        log = console.log,
        wsfile = `${process.cwd()}/.magniumrc`,
        configfile = `${process.cwd()}/tidefaults.json`


exports.command = 'init';
exports.describe = 'Setup the current directory as a standard Magnium workspace.';
exports.handler = function (argv) {

    log(chalk.green("[INFO] - Creating a new Magnium Workspace......."));

    // lets test for the Ti command line - if not there warn the user
    try {
        const cmd = spawn( 'ti', ['-q']);
        console.log( `${cmd.stdout.toString()}` );
    }
    catch(ex){
        console.log(chalk.yellow("[WARN] - Unable to access Titanium CLI. Please check that the CLI is installed, or install using: ") + "$(sudo) npm install -g titanium");
        process.exit(1);
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


}