/**
 * compiler.js
 * This module is used to do the Babel transform of a specified list of files (passed in as an array)
 * this way we can detect any error that occur and stop the transpile
 * 
 */
const   babel = require('babel-core'),
        chalk = require('chalk'),
        fs = require("fs-extra"),
        log = console.log;


const babelOptions = {
    "presets": [
        `${__dirname}/../node_modules/babel-preset-env`      
    ],
    "plugins": [
        `${__dirname}/../node_modules/babel-plugin-transform-object-rest-spread`
      ]    
};

// transpile a single file
const transpileFile = (src, dest) => {
    try {
        const result = babel.transformFileSync(src, babelOptions);
        fs.outputFile(dest, result.code);
    } catch (e) {
        log(chalk.red(`[ERROR] -  ${e.message}.`));
        log(e.codeFrame);
        process.exit(1);        
    }
}


// Allow a single file to be tranpiled
exports.transpileFile = transpileFile;


/**
 * Method to transform and copy the Magnium Source files
 */ 
exports.generate = (from, to , files) => {

    // first check for any files that need transpiling
    if(files.transpile){
        files.transpile.forEach( file => {
            transpileFile(`${from}/${file}`, `${to}/${file}`);
        });
    }

    // now do the file copy
    if(files.copy){
        files.copy.forEach( file => {
            try{
                fs.copy(`${from}/${file}`, `${to}/${file}`);
            } catch(e){
                log(chalk.red(`[ERROR] -  ${e.message}.`));
                process.exit(1);        
            }
        });
    }

}