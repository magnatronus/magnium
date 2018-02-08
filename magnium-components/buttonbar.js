/**
 * buttonbar.js
 * This is a simple button bar that displays and spaces out buttons evenly with an image and
 * text.
 * 
 * To use this button bar either you need to use the FontAwesome TTF, or you need to swap for another
 * FontAwesome (4.7) is used to eliminate the need for a complete set of custom image icons for the buttons
 * 
 * The buttons are generated using the passed in array of objects, each Object defines a button. 
 * Up to 4 buttons should fit across the width and each button is defined:
 * 
 * {title, id, icon, color}
 */
 import Magnium, { Component } from '/system/magnium';
 import { buttonBarStyle } from '/theme';



 // Our Button Bar Class
 class ButtonBar extends Component {

   // how wide should each button be
   calculateButtonWidth(count, shim=0) {
       const screen = Magnium.screenSize();
       return ((screen.width - shim)/count);
   }

   // Generate our button for the button bar
   generateButton(width, title, bid, icon, color="#333333") {
     const button = Ti.UI.createView({...style.viewStyle, width: width});
     button.add(Ti.UI.createLabel({...style.labelStyle, text: title, color: color}));
     button.add(Ti.UI.createButton({...style.iconStyle, title: icon, bid: bid, color: color}));
     return button;
   }

   // Event Handler for the Buttons
    buttonListener(evt) {
      if(evt.source.bid){
        Magnium.Dispatcher.trigger(Magnium.Events.evt.MAGNIUM_BAR_BUTTON_CLICK, {button: evt.source.bid});
      }
    }

   generateView({buttons, backgroundColor="#E6E6E6", border=false}) {

     // if there is a theme style override
     if(buttonBarStyle){
       style = {...style, ...buttonBarStyle};
     }

     // how wide should each button be
     const btnWidth = this.calculateButtonWidth(buttons.length);

     // now add the button container, its event handler and the buttons
     const buttonContainer = Ti.UI.createView(style.containerStyle);
     buttonContainer.addEventListener('click', this.buttonListener.bind(this));
     buttons.forEach( (button) => {
       buttonContainer.add(this.generateButton(btnWidth,button.title ,button.id, button.icon, button.color));
     });

     // create & assemble the main button bar
     this.barHeight = style.barStyle.height;
     const buttonBar = Ti.UI.createView({...style.barStyle, backgroundColor: backgroundColor});
     buttonBar.add(buttonContainer);
     (border) && (buttonBar.add(Ti.UI.createView(style.borderStyle)));
     return buttonBar;

   }

 }

// local style
let style = {

  borderStyle: {
    height: 1,
    width: Ti.UI.FILL,
    top: 0,
    backgroundColor: "#666666"
  },

  barStyle: {
    width: Ti.UI.FILL,
    backgroundColor: "#E6E6E6",
    bottom: 0,
    height: 60
  },


  containerStyle: {
    height: Ti.UI.FILL,
    width: Ti.UI.FILL,
    layout: 'horizontal'
  },

  viewStyle: {
    height: Ti.UI.FILL,
    backgroundColor: 'transparent'
  },

  labelStyle: {
    touchEnabled: false,
    height: Ti.UI.SIZE,
    textAlign: 'center',
    font: {fontSize: 12},
    bottom:4,
    left: 1,
    right: 1,
    color: "#333333"
  },

  iconStyle: {
    top: 0,
    bottom: 20,
    width: Ti.UI.FILL,
    font: {fontFamily: 'FontAwesome', fontSize: 24},
    color: "#333333",
    backgroundColor: 'transparent'
  }


};

export default ButtonBar;
