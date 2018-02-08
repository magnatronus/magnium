/**
 * loadingindicator.js
 * Provides a loading or action wait indicator as a full height and width screen with a translucent background
 *
 * see https://stackoverflow.com/questions/46325742/titanium-action-bar-does-not-hide-if-the-window-background-has-opacity
 */
import Erbium, { Component } from '/system/magnium';
import { loadingIndicatorStyle } from '/theme';

// The LoadingIndicator Class
class LoadingIndicator extends Component {

  generateView({text}){

    //if there is a theme style lets override
    if(loadingIndicatorStyle){
      style = {...style, ...loadingIndicatorStyle};
    }

    // always modify the android theme so we get a translucent window with no titlebar
    if(Erbium.isAndroid){
      style.windowStyle.theme = "Theme.AppCompat.Translucent.NoTitleBar"
    }

    // create container view
    const containerView = Ti.UI.createView(style.popupViewStyle);
    containerView.add(Ti.UI.createLabel({...style.labelStyle, text: text}));

    // our container window
    this.win = Ti.UI.createWindow(style.windowStyle);
    this.win.add(containerView);
    return this.win;

  }

}

// standard component styles
let style = {

  windowStyle: {
    backgroundColor: '#70000000',
    width: Ti.UI.FILL,
    height: Ti.UI.FILL
  },

  popupViewStyle: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    height: Ti.UI.SIZE,
    width: 280
  },

  labelStyle: {
    left:10,
    right: 10,
    top:20,
    bottom: 20,
    backgroundColor: "#FFF",
    color: "#4C4C4C",
    width: Ti.UI.FILL,
    height: Ti.UI.SIZE,
    textAlign: 'center',
    font: {fontSize: 18}
  }

};


export default LoadingIndicator
