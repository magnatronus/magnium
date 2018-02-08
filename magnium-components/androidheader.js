/**
 * androidheader.js
 * This component is a faux header to replicate the look of the iOS window title bar
 * This is done to give the app UI navigation a common look and feel.
 * Copyright 2017 SpiralArm Consulting Ltd.
 */
import { Component } from '/system/magnium';
import { androidHeaderStyle } from '/theme';


class AndroidHeader extends Component {

  generateView(props) {

    //if there is a theme style override
    if(androidHeaderStyle){
      style = {...style, ...androidHeaderStyle};
    }


    console.log(JSON.stringify(style));

    // Our Header title
    const title = Ti.UI.createLabel({...style.title, text:props.title});

    // separator line at base of header
    const line = Ti.UI.createView(style.separator);

    // the main view
    const headerView = Ti.UI.createView(style.mainView);
    headerView.add(title);
    headerView.add(line);
    return headerView;
  }
}

// our default local style
let style = {

  title:{
    font: {fontSize: 18},
    color: '#000000',
    width: Ti.UI.FILL,
    height: Ti.UI.SIZE,
    textAlign: 'center'
  },

  separator: {
    width: Ti.UI.FILL,
    height: 1,
    backgroundColor: '#B3B3B3',
    bottom: 0
  },


  mainView: {
    top: 0,
    width: Ti.UI.FILL,
    height: 50,
    backgroundColor: "#FFFFFF"
  }

};


export default AndroidHeader;
