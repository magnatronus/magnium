const   fs = require("fs-extra"),
        chalk = require('chalk'),
        path = require('path'),
        xmldoc = require('xmldoc'),
        _ = require("lodash"),
        log = console.log;


/**
 * Simple Component Generator
 */
const createComponent =  (type, attr) => {
    let attributes;
    const ticomp = type.split(":");
    if(attr['style']){
        const style = attr['style'];
        delete attr['style'];
        attributes= `...styles.${style},`;
    }
    for(key in attr){
        attributes += `${key}: "${attr[key]}",`
    }
    return `${(ticomp.length===1)?"Ti.UI":ticomp[0]}.create${(ticomp.length===1)?ticomp[0]:ticomp[1]}({${attributes}})`;
}


/**
 * Build the UI with the correct Titanium commands
 *  - why is recursion so painful and yet so satifying ?
 */
const buildUI = (element, parent = false, level=0) => {

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
}

module.exports = {

    processFile(file){

        // read in file content
        let text = fs.readFileSync(file, {encoding: 'utf8'});
        log((chalk.blue(`[INFO] - Processing ${file}....`)));

        // now generate the UI code file
        try{

            let xml = new xmldoc.XmlDocument(text);
            const result =  buildUI(xml);
            log(result);

            // now see if we have a js file of the same name and sub the decorator @generateview
            const name = `${path.parse(file).dir}/${path.parse(file).name}.js`;
            if(fs.pathExistsSync(name)) {
                let code = fs.readFileSync(name, {encoding: 'utf8'});
                code = code.replace("@generateview", `generateView(){${result}`);
                fs.writeFileSync(name, code, {encoding: 'utf8'});                
            }

        }
        catch(e){
            console.log(e);
        }




    }
};