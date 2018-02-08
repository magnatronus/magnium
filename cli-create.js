#!/usr/bin/env node
const   args = require("yargs").argv,
        chalk = require('chalk'),
        fs = require("fs-extra"),
        DOMParser = require('xmldom').DOMParser,
        XMLSerializer = require('xmldom').XMLSerializer,
        spawn = require( 'child_process' ).spawnSync,
        workspacedir = process.cwd(),
        wsfile = `.magniumrc`,
        log = console.log;

 
/**
 * cli-create.js
 * This is where a new Magnium project is created by creating and modifying a standard Titanium Project.
 * It takes a number of params to help it create a new Magnium source project:
 * 
 *  - templatedir (opt) - this is the fully qualified directory to a Magnium template, if none specified it uses the provided one
 *  - name (req)  - the name of the project that is being created (this is used in setting up the project ID as well)
 */

/**
 * Step 0. Read in Magnium workspace file
 */
let resource = {};
try{
    resource = fs.readJsonSync(`${workspacedir}/${wsfile}`);
} catch(ex) {
    log(chalk.red(`[ERROR] - Unable to find ${wsfile} in current directory. If this is a new workspace run magnium-init first.`));
    process.exit(1);
}

// assume everything is OK
let OK = true;

/**
 * Step 1. Gather the required info 
 */
log(chalk.green("[NFO] - Creating a new Magnium project......"));


// determine the template to use
const templatedir = (args.templatedir)?args.templatedir:`${__dirname}/templates/default`;

// check for a project name
if(!args.name){
    log(chalk.red("[ERROR] - no project name specified. Use the option --name"));
    OK = false;
}

//  try and read in our  project defaults
let defaults = {};
try {
  defaults = JSON.parse(fs.readFileSync(`${workspacedir}/${resource.defaults}`, 'utf8'));
} catch(ex) {
    log(chalk.red(`[ERROR] - no ${resource.defaults} file found. Please check or re-create.`));
    OK = false;
}

// if not OK get out
if(!OK){
    process.exit(1);
}

/**
 * Step 2. Generate the Project
 */

// assemble the Ti command line
const tiparams = [
    '-s',
    `${defaults.sdk}`,
    '--log-level',
    `${defaults.loglevel}`,
    '-n',
    `${args.name}`,
    '-p',
    `${defaults.platforms}`,
    '--id',
    `${defaults.appId}${args.name}`,
    '-u',
    `${defaults.url}`,
    "-d",
    `${workspacedir}/${resource.projects}`
];

// Generate the standard Ti Project
const params =  [
    "create",
    '-t',
    'app',
    ...tiparams
];
const cmd = spawn( 'ti', params );
console.log( `${cmd.stdout.toString()}` );

// Now update to an Magnium project
fs.removeSync(`${workspacedir}/${resource.projects}/${args.name}/Resources`);
fs.copySync(`${templatedir}`,`${workspacedir}/${resource.projects}/${args.name}`);
fs.writeJsonSync(`${workspacedir}/${resource.projects}/${args.name}/.magnium`, {date: Date()})

/** 
 * Step 3. Update the tiapp
 */

let tiapp = fs.readFileSync(`${workspacedir}/${resource.projects}/${args.name}/tiapp.xml`,'utf-8');
let customTiapp = new DOMParser().parseFromString(tiapp);

// set the analytics value
customTiapp.getElementsByTagName("analytics")[0].textContent = defaults.analytics;

// set the copyright and publisher
customTiapp.getElementsByTagName("publisher")[0].textContent = defaults.publisher;
customTiapp.getElementsByTagName("copyright")[0].textContent = defaults.copyright;


// update any hyperloop requirements
if(defaults.hyperloop){
    let modules = customTiapp.getElementsByTagName("modules")[0];
    const platforms = defaults.hyperloop.split(',');
    platforms.forEach((p) => {
        const moduleElement = customTiapp.createElement("module");
        moduleElement.textContent = "hyperloop";
        moduleElement.setAttribute("platform", p);
        modules.appendChild(moduleElement);
    });
}

// now serialise nd re-save
var xmlString = new XMLSerializer().serializeToString(customTiapp);
fs.writeFileSync(`${workspacedir}/${resource.projects}/${args.name}/tiapp.xml`, xmlString);

// and finish
log(chalk.green("[INFO] - Magnium Project creation complete......"));