/**
 * jenkins.js
 * CLI command to  build a magnim project n Jenkins
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
        path = require('path'),
        klawSync = require('klaw-sync'),
        spawn = require( 'child_process' ).spawnSync,
        workspacedir = process.cwd(),
        //wsfile = `.magniumrc`,
        magfiles = require('../lib/magfiles').magFiles,
        auxfiles = require('../lib/magfiles').auxFiles,
        miscfiles = require('../lib/magfiles').miscFiles,
        compiler = require('../lib/compiler'),        
        log = console.log;


exports.command = 'jenkins <name>  [theme]';
exports.describe = 'Run a jenkins based build and transpile of the <name> Magnium project using an optional <theme>.';
exports.builder = {
    theme: {
        default: 'default'
    }
};

exports.handler = function (argv) {

    // read in magnium resource info
    //let resource = {};
    //try{
    //    resource = fs.readJsonSync(`${workspacedir}/${wsfile}`);
    //} catch(ex) {
    //    log(chalk.red(`[ERROR] - Unable to find ${wsfile} in current directory. If this is a new workspace run magnium-init first.`));
    //    process.exit(1);
    //}

    // check for a project directory
    //const projectrootdir = `${workspacedir}/${resource.projects}/${argv.name}`;
    let tiappfile = `${argv.name}/tiapp.xml`;
    if(!fs.pathExistsSync(tiappfile)){
        log(chalk.red(`[ERROR] - project dir ${argv.name} does not exist or it is not an Magnium/Titanium project.`));
        process.exit(1);
    }

    // always start a build with a clean directory
    log((chalk.green("[INFO] - Magnium cleaning magnium build directory....")));
    fs.removeSync(`${argv.name}/magbuild`);

    // make sure the output dir exists
    fs.ensureDirSync(`${argv.name}/mag-build/Resources`);

    // 1. first transpile the standard magnium code into the output dir
    compiler.generate(`${__dirname}/../magnium`,  `${argv.name}/mag-build/Resources`, magfiles);

    // 2. copy any erbium components that are required
    log((chalk.green("[INFO] - Updating Magnium components......")));
    let components = {transpile: []};
    try {
        const config = JSON.parse(fs.readFileSync(`${argv.name}/config.json`, 'utf8'));
        if(config.components && config.components.length > 0){

            // generate our list of components to transpile
            config.components.forEach( function(comp){
                components.transpile.push(`${comp}.js`);
            });

            // and transpile them
            compiler.generate(`${__dirname}/../magnium-components`,  `${argv.name}/mag-build/Resources/components`, components);
                    
        }
    } catch(ex) {
        console.log(ex);
        log(chalk.yellow("[WARN] - no config.json file found in Magnium project, so no standard components copied."));
    }    


    // 3. Transpile the project app files
    const filterFn = item => path.extname(item.path) === '.js';
    const paths = klawSync(`${argv.name}/app`, { filter: filterFn });
    if(paths){
        log((chalk.green("[INFO] - Transpiling Magnium project files......")));    
        paths.forEach( file => {
            const destfile = file.path.substring(file.path.indexOf("/app/") + 5);
            compiler.transpileFile(file.path,`${argv.name}/mag-build/Resources/${destfile}`);
        });
    }
 

    // 4 copy over the aux files
    log((chalk.green("[INFO] - copying aux project files......")));    
    auxfiles.forEach( dir => {
        if( fs.existsSync(`${argv.name}/${dir.src}`)){
            fs.copySync(`${argv.name}/${dir.src}`, `${argv.name}/mag-build/${dir.dest}`);
        }        
    });

    // 5 the misc files
    miscfiles.forEach( file =>{
        if( fs.existsSync(`${argv.name}/${file.src}`)){
            fs.copySync(`${argv.name}/${file.src}`, `${argv.name}/mag-build/${file.dest}${file.src}`);
        }
    });

    // 6  check the support dir and copy any files from there
    if( fs.existsSync(`${argv.name}/support`)){
        fs.copySync(`${argv.name}/support`, `${argv.name}/mag-build/`);
    }

    // 7. Overwrite the theme related files if one specified
    // this is a theme file and theme related aux file and any theme related misc files
    if(fs.pathExistsSync(`${argv.name}/themes/${argv.theme}`)){
        log((chalk.green("[INFO] - Applying selected project theme......"))); 
        
        // first a theme file if one exists
        if( fs.existsSync(`${argv.name}/themes/${argv.theme}/theme.js`)){
            log((chalk.green("[INFO] - Copying theme file (theme.js)......"))); 
            compiler.transpileFile(`${argv.name}/themes/${argv.theme}/theme.js`,`${argv.name}/mag-build/Resources/theme.js`);
        }

        // Any theme related aux files
        log((chalk.green("[INFO] - Checking for theme related aux files......"))); 
        auxfiles.forEach( dir => {
            if( fs.existsSync(`${argv.name}/themes/${argv.theme}/${dir.src}`)){
                fs.copySync(`${argv.name}/themes/${argv.theme}/${dir.src}`, `${argv.name}/mag-build/${dir.dest}`);
            }        
        });
    
        // Any misc related files
        log((chalk.green("[INFO] - Checking for theme related misc files......"))); 
        miscfiles.forEach( file =>{
            if( fs.existsSync(`${argv.name}/themes/${argv.theme}/${file.src}`)){
                fs.copySync(`${argv.name}/themes/${argv.theme}/${file.src}`, `${argv.name}/mag-build/${file.dest}${file.src}`);
            }
        });
    

    } else {
        log(chalk.yellow(`[WARN] - Specified theme does not exist in project - ${argv.name}/themes/${argv.theme}, so ignoring.`));        
    }


    log((chalk.green("[INFO] - Magnium Build complete......")));    

}