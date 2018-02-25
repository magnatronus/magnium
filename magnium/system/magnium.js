/**
 * magnium.js
 * Some custom code and classes used in an evolving framework to help build Titamium apps for iOS and Android
 * using ES6, Babel, Promises and classes
 *
 * Copyright SpiralArm Consulting Ltd 2017-2018. All Rights Reserved
 *
 * All components used in building an app derive from the Magnium base Component class. This is a shifting target
 * that has new functionality added as apps are developed and useful/common code is added
 */
const _ = require('/system/static/underscore');
const Backbone = require('/system/static/backbone');

// Our blank Globals space
const _globals = {};

// The Magnium Event Handler
const _dispatcher = _.clone(Backbone.Events);

// Our Event Register
const _events = {
    evt: {},
    registerEvent: function(e) {
      if(!this.evt.hasOwnProperty(e)){
        this.evt[e] = Ti.Utils.sha1(e);
        //console.log('reg event:', e, this.evt[e]);
      }
    }
};

// Some useful constants
const MAG_OSNAME        = Ti.Platform.osname;
const MAG_AND_PHY_SIZE  = (MAG_OSNAME === 'android')?Titanium.Platform.Android.physicalSizeCategory:0;
const MAG_AND_LARGE     = (MAG_OSNAME === 'android')?Ti.Platform.Android.PHYSICAL_SIZE_CATEGORY_LARGE:-1;
const MAG_AND_XLARGE    = (MAG_OSNAME === 'android')?Ti.Platform.Android.PHYSICAL_SIZE_CATEGORY_XLARGE:-1;


/**
 * Our main export
 */
const Magnium = {

  // some helper functions
  isAndroid: (MAG_OSNAME == 'android'),
  isIOS: (MAG_OSNAME == 'iphone' || MAG_OSNAME == 'ipad'),
  isTablet: (MAG_OSNAME === 'ipad' || (MAG_OSNAME === 'android' && (MAG_AND_PHY_SIZE===MAG_AND_LARGE||MAG_AND_PHY_SIZE===MAG_AND_XLARGE))),


  // Allow printing of screen params
  screenCaps: () => {
    Ti.API.info('Ti.Platform.displayCaps.density: ' + Ti.Platform.displayCaps.density);
    Ti.API.info('Ti.Platform.displayCaps.dpi: ' + Ti.Platform.displayCaps.dpi);
    Ti.API.info('Ti.Platform.displayCaps.platformHeight: ' + Ti.Platform.displayCaps.platformHeight);
    Ti.API.info('Ti.Platform.displayCaps.platformWidth: ' + Ti.Platform.displayCaps.platformWidth);
    if((Ti.Platform.osname === 'iphone')||(Ti.Platform.osname === 'ipad')||(Ti.Platform.osname === 'android')){
      Ti.API.info('Ti.Platform.displayCaps.logicalDensityFactor: ' + Ti.Platform.displayCaps.logicalDensityFactor);
    }
    if(Ti.Platform.osname === 'android'){
      Ti.API.info('Ti.Platform.displayCaps.xdpi: ' + Ti.Platform.displayCaps.xdpi);
      Ti.API.info('Ti.Platform.displayCaps.ydpi: ' + Ti.Platform.displayCaps.ydpi);
    }
  },

  // function to get the screen size
  screenSize: () => {
    const LDF = (Ti.Platform.osname === 'android')?Ti.Platform.displayCaps.logicalDensityFactor:1;
    const statusBar = (Ti.Platform.osname === 'android')?-25:0;  // for android height adjustment (status bar)
    return {
      width: Ti.Platform.displayCaps.platformWidth/LDF,
      height: (Ti.Platform.displayCaps.platformHeight/LDF) + statusBar
    }
  },

  // Our main method to start running an app
  runApp: (application, props = {}) => {
    const app = new application(props);
    app.view.open();
  },

  // A generic globals object
  Globals: _globals,

  // Event Handler
  Dispatcher: _dispatcher,

  // Event Register
  Events: _events

};

/**
 * A crude base class to use in creating any component
 */
export class Component {

  constructor(props={}){

    // if we have a beforeView run it first
    (this.beforeView) && (this.beforeView(props));

    // if defining a UI View generate it here
    if(this.generateView){
      this._view = this.generateView(props);
    }

    // now run afterView last
    if(this.afterView) {
      setTimeout(() => { this.afterView(props)}, 0);
    };

  }

  // our destructor - kindof
  destroy() {
    console.log("destroy() called...................");
  }

  // Getter to return the generate UI View
  get view() {
    if(!this._view) {
      throw new Error('No view defined - either generateView is missing or it does not have the correct return value!');
    }
    return this._view;
  }

}



export default Magnium;