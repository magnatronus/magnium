/**
 * assets.js
 * CLI command to generate a standard set of assets from DefaultIcon.png
 * currently just for android
 * 
 * @module init
 * 
 * @license
 * MIT. Please see the LICENSE file included with this package
 *
 */
const   args = require("yargs").argv,
        chalk = require('chalk'),
        fs = require("fs-extra"),
        spawn = require( 'child_process' ).spawnSync,
        log = console.log,
        wsfile = `${process.cwd()}/.magniumrc`,
        configfile = `${process.cwd()}/tidefaults.json`;

exports.command = 'assets [p]';
exports.describe = 'Generates Android application icons and splash screens using TiCons.';
exports.builder = {
    p: {
        default: 'android'
    }
}
exports.handler = function (argv) {

    // At the moment we only do Android as iOS is build in
    if(argv.p === "ios" ) {
        log(chalk.yellow("[WARN] - android is currently the only available platform option ( -p android)."));
        process.exit(1);
    }

    // lets test for TiCons  if not there warn the user
    try {
        const cmd = spawn( 'ticons', ['-v']);
        console.log( `${cmd.stdout.toString()}` );
    }
    catch(ex){
        console.log(chalk.yellow("[ERROR] - There was a problem accessing TiCons (http://http://ticons.fokkezb.nl/). Please check it is installed and working."));
        process.exit(1);
    }

    // generate the app icons from DefaultIcon
    const ticonshell = require("shelljs");
    ticonshell.cd("titanium");
    ticonshell.exec("ticons -p android icons -r 10 DefaultIcon.png").stdout;

    // now the splash screens
    ticonshell.exec("ticons -p android splashes DefaultIcon.png").stdout;

}