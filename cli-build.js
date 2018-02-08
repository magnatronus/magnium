#!/usr/bin/env node
const   args = require("yargs").argv,
        chalk = require('chalk'),
        fs = require("fs-extra"),
        spawn = require( 'child_process' ).spawnSync,
        workspacedir = process.cwd(),
        wsfile = `.magniumrc`,        
        log = console.log;


/**
 * cli-build.js.
 * It takes the following params:
 *  - name(req) - this is the directory name of the source project
 *  - buildtype(opt) - this is the build type being carried out. There are 2 options (app or full) , the default is always a full build
 *  - theme(opt)  - this is the name of a project theme file
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


/**
 * Step 1. Check input params
*/

// the build type required - defaults to app build
const buildtype = (args.buildtype)?args.buildtype:"full";

// get any theme file or try  default 
const themefile = (args.theme)?args.theme:"default";

// check project dir
if(!args.name){
    log(chalk.red("[ERROR] - no project directory specified. Use the option --name"));
    process.exit(1);       
 }
 
// check for a project directory
const projectrootdir = `${workspacedir}/${resource.projects}/${args.name}`;
let tiappfile = `${projectrootdir}/tiapp.xml`;
if(!fs.pathExistsSync(tiappfile)){
   log(chalk.red(`[ERROR] - project dir ${projectrootdir} does not exist or it is not an Magnium project.`));
   process.exit(1);
}


/**
 * Step 2. Generate the Erbium build project from the Erbium Source for transpiling
 */

// need to do a full build so start with a clean dir
const projectbuilddir = `${workspacedir}/${resource.build}`;
if(buildtype === "full"){

    //  remove the final output dir
    fs.removeSync(`${workspacedir}/${resource.output}`);

    // clean the temp build dir  
    log((chalk.green("[INFO] - Magnium Full build requested. Cleaning build directory....")));
    fs.removeSync(projectbuilddir);
    fs.ensureDirSync(`${projectbuilddir}/code`);

    // copy the magnium stuff to the code directory
    fs.copySync(`${__dirname}/magnium`,`${projectbuilddir}/code`);

    // copy the project theme to the code directory if it exists
    if(fs.pathExistsSync(`${projectrootdir}/themes/${themefile}.js`)){
        fs.copySync(`${projectrootdir}/themes/${themefile}.js`,`${projectbuilddir}/code/theme.js`);
    }

    // copy the package json file
    fs.copySync(`${__dirname}/config/config.json`,`${projectbuilddir}/package.json`);

    // run npm install in the build dir
    const cmd = spawn( `npm`, ["install", "--prefix", `${projectbuilddir}`] );
    console.log( `${cmd.stdout.toString()}` );

    // now copy all other project files we need and tidy up into the aux folder
    fs.copySync(`${projectrootdir}`,`${projectbuilddir}/aux`);
    fs.removeSync(`${projectbuilddir}/aux/app`);
    fs.removeSync(`${projectbuilddir}/aux/themes`);
    fs.removeSync(`${projectbuilddir}/aux/config.json`);
      
}

// copy the source app dir to the code dir in prep for transpile
log((chalk.green("[INFO] - Updating Magnium app files......")));
fs.copySync(`${projectrootdir}/app`,`${projectbuilddir}/code`);

// now copy any erbium components that are required
log((chalk.green("[INFO] - Updating Magnium components......")));
let components = [];
try {
  const config = JSON.parse(fs.readFileSync(`${projectrootdir}/config.json`, 'utf8'));
  if(config.components && config.components.length > 0){

      // make sure the components dir exists
      fs.ensureDirSync(`${projectbuilddir}/code/components`);

      // now copy any defined components
      config.components.forEach( function(comp){
        fs.copySync(`${__dirname}/magnium-components/${comp}.js`,`${projectbuilddir}/code/components/${comp}.js`);
      });
      
  }
} catch(ex) {
    log(chalk.yellow("[WARN] - no config.json file found in Magnium project, so no standard components copied."));
}


/**
 * Step 3. Run the babeljs transpile and prep project code
 */


// make sure the final output dir exists
fs.ensureDirSync(`${workspacedir}/${resource.output}`);

// Generate the standard Ti Project Code
const params =  [
    `${projectbuilddir}/code`,
    "-d",
    `${workspacedir}/${resource.output}/Resources`,
    '--copy-files'
];
//console.log(params);

const cmd = spawn( `${__dirname}/node_modules/.bin/babel`, params );
console.log( `${cmd.stdout.toString()}` );


/**
 * Step 4. Copy and tidy all other project file to generate a complete Ti Project for compile - only if aux exists(only for a full build)
 */

if(fs.pathExistsSync(`${projectbuilddir}/aux`)){

    log((chalk.green("[INFO] - Finalising Magnium build......")));

    // copy the project assets to the Resources directory
    fs.copySync(`${projectbuilddir}/aux/assets`,`${workspacedir}/${resource.output}/Resources`);

    // remove assets from aux
    fs.removeSync(`${projectbuilddir}/aux/assets`);

    // copy everything else in aux to project root
    fs.copySync(`${projectbuilddir}/aux`,`${workspacedir}/${resource.output}`);

    // now remove aux (full build will recreate it)
    fs.removeSync(`${projectbuilddir}/aux`);
   
}
log((chalk.green("[INFO] - Magnium Build complete......")));

