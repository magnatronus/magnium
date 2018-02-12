#!/usr/bin/env node
const   args = require("yargs").argv,
        chalk = require('chalk'),
        fs = require("fs-extra"),
        spawn = require( 'child_process' ).spawnSync,
        log = console.log,
        wsfile = `${process.cwd()}/.magniumrc`,
        configfile = `${process.cwd()}/tidefaults.json`
/**
 * cli-assets
 * This module  can be used to generate a set of default Android Assets for the Magnium project
 * This will ONLY work if TiCons is install and set up correctly (http://http://ticons.fokkezb.nl/)
 */



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
