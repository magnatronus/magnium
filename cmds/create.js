/**
 * create.js
 * CLI command to create a new Magnium prpject in an existing Magnium workspace
 * 
 * @module create
 * 
 * @license
 * MIT. Please see the LICENSE file included with this package
 *
 */
const   args = require("yargs").argv,
        chalk = require('chalk'),
        fs = require("fs-extra"),
        DOMParser = require('xmldom').DOMParser,
        XMLSerializer = require('xmldom').XMLSerializer,
        spawn = require( 'child_process' ).spawnSync,
        workspacedir = process.cwd(),
        wsfile = `.magniumrc`,
        log = console.log;



exports.command = 'create <name> [template]';
exports.describe = 'Create a new Magnium project called <name>.';
exports.builder = {
    template: {
        default: `${__dirname}/../templates/default`    
    }
};
exports.handler = function (argv) {


    // read in magnium resource info
    let resource = {};
    try{
        resource = fs.readJsonSync(`${workspacedir}/${wsfile}`);
    } catch(ex) {
        log(chalk.red(`[ERROR] - Unable to find ${wsfile} in current directory. If this is a new workspace run magnium-init first.`));
        process.exit(1);
    }


    // start the create process
    log(chalk.green("[NFO] - Creating new Magnium project (%s)......(%s)"), argv.name, argv.template);
    let defaults = {};
    try {
      defaults = JSON.parse(fs.readFileSync(`${workspacedir}/${resource.defaults}`, 'utf8'));
    } catch(ex) {
        log(chalk.red(`[ERROR] - no ${resource.defaults} file found. Please check or re-create.`));
        process.exit(1);
    }

    // assemble the Ti command line and create a new ti project
    const tiparams = [
        '-s',
        `${defaults.sdk}`,
        '--log-level',
        `${defaults.loglevel}`,
        '-n',
        `${argv.name}`,
        '-p',
        `${defaults.platforms}`,
        '--id',
        `${defaults.appId}${argv.name}`,
        '-u',
        `${defaults.url}`,
        "-d",
        `${workspacedir}/${resource.projects}`
    ];
    const params =  [
        "create",
        '-t',
        'app',
        ...tiparams
    ];
    const cmd = spawn( 'ti', params );
    console.log( `${cmd.stdout.toString()}` );

    // Now update to an Magnium project
    fs.removeSync(`${workspacedir}/${resource.projects}/${argv.name}/Resources`);
    fs.copySync(`${argv.template}`,`${workspacedir}/${resource.projects}/${argv.name}`);
    fs.writeJsonSync(`${workspacedir}/${resource.projects}/${argv.name}/.magnium`, {date: Date()});


    // now update the tiapp
    let tiapp = fs.readFileSync(`${workspacedir}/${resource.projects}/${argv.name}/tiapp.xml`,'utf-8');
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
    
    // now serialise and re-save
    var xmlString = new XMLSerializer().serializeToString(customTiapp);
    fs.writeFileSync(`${workspacedir}/${resource.projects}/${argv.name}/tiapp.xml`, xmlString);
    
    // now generate a min package.json so we can use npm modules
    fs.writeJSONSync(`${workspacedir}/${resource.projects}/${argv.name}/app/package.json`,{
        "name": `${argv.name}`,
        "version": "1.0.0",
        "description": "Magnium Project"
    });
    



    // and finish
    log(chalk.green("[INFO] - Magnium Project creation complete......"));
        

}