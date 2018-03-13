/**
 * support.js
 * 
 * test support library with functionality to allow a UI to be defined with markup via a directive
 * Copyright SpiralArm Consulting Ltd 2018: All Rights Reserved
 */
const fs = require("fs-extra");
const xmldoc = require('xmldoc');
const chalk = require('chalk');
const _ = require("lodash");
const log = console.log;

/**
 * Simple Component Generator
 */
createComponent =  (type, attr) => {
    const ticomp = type.split(":");
    return `${(ticomp.length===1)?"Ti.UI":ticomp[0]}.create${(ticomp.length===1)?ticomp[0]:ticomp[1]}(${JSON.stringify(attr)})`;
}


/**
 * Build the UI with the correct Titanium commands
 *  - why is recursion so painful and yet so satifying ?
 */
buildUI = (element, parent = false, level=0) => {

    // filter out any event handlers that the component may have from the attributes
    const events = _.pickBy(element.attr, (value, key) => {
        return key.startsWith("on");
    });
    const attributes = _.pickBy(element.attr, (value, key) => {
        return !key.startsWith("on");
    });

    // first generate the UI component parts
    const cvar = (element.attr.id)?`this.${element.attr.id}`:` _${Math.round(Math.random() * 100000000 + 1000000000).toString(36).toUpperCase()}`;
    const cvarname = `${(element.attr.id)?"":"const "}${cvar}`;
    const component = `${createComponent(element.name, attributes)}`;

    //now assemble
    let code = `${cvarname} = ${component};\n`;

    // check if there are any "on" events that need processing
    for( const key in events) {
        if(events[key].startsWith('this.')){
            code += `${cvar}.addEventListener('${key.substring(2).toLowerCase()}', ${events[key]});\n`;
        } else {
            code += `${cvar}.addEventListener('${key.substring(2).toLowerCase()}', (evt) => {${events[key]}});\n`;
        }
    };

    // if parent then add
    if(parent){
        code += `${parent}.add(${cvar});\n`;
    }

    // add on any child components
    element.eachChild( (child) => {
        code += buildUI(child, cvar, (level+1));
    });

    // return the result
    return (level===0)?`${code};\nreturn ${cvar};\n`:code;
},


/**
 * This converts the passed in Markup to XML so it can be processed and
 * turned into a Titanium component UI
 */
generateView = (mml) => {
    try{
        let xml = new xmldoc.XmlDocument(mml);
        const result =  buildUI(xml);
        return result;
    }
    catch(e){
        console.log(e);
    }
}


// Lets expose the external functionality
module.exports  = {

    /**
     * Check if file has a __MAGUI directive if so lets update it
     */
    processFile: (file) =>{
        if(fs.lstatSync(file).isFile()){

            // read in file content
            let text = fs.readFileSync(file, {encoding: 'utf8'});

 
            // look for the _MAGUI marker if found do a replace
            log((chalk.green(`[INFO] - Checking ${file}....`)));            
            let found = false;
            var exp = /<UI>(.|\n)*?<\/UI>/g;
            while (match = exp.exec(text)) {

                // match found so we will need to update the file being processed
                found = true;
                log((chalk.blue(`[INFO] - Processing ${file}....`)));

                // grab the code we want to swap
                const guitext  = text.substring(match.index + 4, exp.lastIndex - 5).trim();
                
                // we need UI code to convert it
                const ui = generateView(guitext);

                // replace with ou UI code
                text = text.substring(0,match.index) + ui + text.substring(exp.lastIndex);

            }
           
            // if modified write back
            if(found) {
                log((chalk.green(`[INFO] - Updating ${file}....`)));
                fs.writeFileSync(file, text, {encoding: 'utf8'});
            }

        }
    }

};

