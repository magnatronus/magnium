/**
 * magnium.js
 * This is the main entry point for the Magnium CLI.
 * 
 * @module magnium
 * 
 * @copyright
 * Copyright 2018 by SpiralArm Consulting Ltd & Steve Rogers. All Rights Reserved
 *  
 * @license
 * MIT. Please see the LICENSE file included with this package
 * 
 */
const chalk = require('chalk'),
      fs = require('fs-extra'),
      pkg = require('../package.json'),
      log = console.log;


log(chalk.green("Magnium CLI") + `, version ${pkg.version}`);
log(pkg.author.copyright);
log("\nPlease report all bug and direct all enquiries to " + chalk.green(pkg.author.email) + "\n");


require('yargs')
    .commandDir('../cmds')
    .demandCommand()
    .help()
    .argv;

