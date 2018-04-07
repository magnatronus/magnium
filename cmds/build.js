/**
 * build.js
 * CLI command to initialise a Magnium Workspace
 * 
 * @module build
 * 
 * @license
 * MIT. Please see the LICENSE file included with this package
 *
 */
const   args = require("yargs").argv,
        chalk = require('chalk'),
        fs = require("fs-extra"),
        spawn = require( 'child_process' ).spawnSync,
        workspacedir = process.cwd(),
        wsfile = `.magniumrc`,   
        magpie = require('../lib/support'),     
        log = console.log;


exports.command = 'build <name> [type] [theme]';
exports.describe = 'Run a [type] build and transpile of the <name> Magnium project.';
exports.builder = {
    type: {
        default: "full"    
    },
    theme: {
        default: 'default'
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

    // check for a project directory
    const projectrootdir = `${workspacedir}/${resource.projects}/${argv.name}`;
    let tiappfile = `${projectrootdir}/tiapp.xml`;
    if(!fs.pathExistsSync(tiappfile)){
        log(chalk.red(`[ERROR] - project dir ${projectrootdir} does not exist or it is not an Magnium/Titanium project.`));
        process.exit(1);
    }

    // need to do a full build so start with a clean dir
    const projectbuilddir = `${workspacedir}/${resource.build}`;
    if(argv.type === "full"){

        //  remove the final output dir
        fs.removeSync(`${workspacedir}/${resource.output}`);

        // clean the temp build dir  
        log((chalk.green("[INFO] - Magnium Full build requested. Cleaning build directory....")));
        fs.removeSync(projectbuilddir);
        fs.ensureDirSync(`${projectbuilddir}/code`);

        // copy the magnium stuff to the code directory
        fs.copySync(`${__dirname}/../magnium`,`${projectbuilddir}/code`);

        // copy the project theme to the code directory if it exists
        if(fs.pathExistsSync(`${projectrootdir}/themes/${argv.theme}.js`)){
            fs.copySync(`${projectrootdir}/themes/${argv.theme}.js`,`${projectbuilddir}/code/theme.js`);
        }

        // copy the package json file
        fs.copySync(`${__dirname}/../config/config.json`,`${projectbuilddir}/package.json`);

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
            fs.copySync(`${__dirname}/../magnium-components/${comp}.js`,`${projectbuilddir}/code/components/${comp}.js`);
        });
        
    }
    } catch(ex) {
        log(chalk.yellow("[WARN] - no config.json file found in Magnium project, so no standard components copied."));
    }


    /** START Of UI generator testing ------------------------------------------------------------------------------- 
     */
    //let rootdir = `${projectbuilddir}/code`;
    //fs.readdirSync(rootdir).forEach(file => {
    //    magpie.processFile(`${rootdir}/${file}`);
    //});
    /** END OF UI generator------------------------------------------------------------------------------------ */


    // make sure the final output dir exists
    fs.ensureDirSync(`${workspacedir}/${resource.output}`);

    // run babel transpile
    const params =  [
        `${projectbuilddir}/code`,
        "-d",
        `${workspacedir}/${resource.output}/Resources`,
        '--copy-files'
    ];
    const cmd = spawn( `${__dirname}/../node_modules/.bin/babel`, params );
    console.log( `${cmd.stdout.toString()}` );


    // finish standard Ti project prep
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
  
}
