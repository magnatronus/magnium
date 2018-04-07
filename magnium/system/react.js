// test factory generator
import _ from '/system/static/underscore';


createUI = (type) =>{
    return {
        ui: `Ti.UI.create${type}`
    }
}


export const Window = "Ti.UI.createWindow";
export const View = "Ti.UI.createView";
export const Button = "Ti.UI.createButton";
export const Label = "Ti.UI.createLabel"; 

/**
 * Component Generator
 */
createComponent =  (type, attr) => {
    //console.log("creating " + type + ' with attributes [ ' + JSON.stringify(attr) + "]");
    return `${type}(${JSON.stringify(attr)})`;
}


/**
 * Generate and process the props object
 */
filterProps = (props) => {
    return{
        events: _.pick(props, (value, key) => {return key.startsWith("on")}),
        properties: _.pick(props, (value, key) => {return !(key.startsWith("on") || key === "id")}),
        id: props.id || false
    }
}


/**
 * Our faux React Object to allow us to interpret the JSX code
 */
const React = {

    createElement: (element,props,...children) => {

        console.log("Typeof element : " + typeof element, element);

        if(typeof element === "function"){
            const fred = element();
            console.log(fred);
        }


        // split the props into something useful
        const attributes = filterProps(props);

        // create our component
        const comp = eval(createComponent(element, attributes.properties));

        // add any event listeners
        for( const key in attributes.events) {
            comp.addEventListener(key.substring(2).toLowerCase(), attributes.events[key]);
        };
                
        // now any children
        children.forEach((c) => {
            if( typeof c === "string"){
                console.log("string found");
            }
            (c) && (comp.add(c));
        });


        return comp;    

    }



};

export default  React;

//export const Window = createUI("Window");
//export const View = createUI("View");
//export const Button = createUI("Button");
//export const Label = createUI("Label");