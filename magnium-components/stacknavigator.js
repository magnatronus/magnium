/**
 * StackNavigator.js
 * A Simple cross platform(iOS & Android) Stack based navigator
 * the iOS version uses the standard Navigation Window as the stack container
 *
 * 2 events are used:
 * - MAGNIUM_STACKNAV_OPEN - passing in a window to add to the stack
 * - MAGNIUM_STACKNAV_CLOSE - this will close the current stack window
 */
import Magnium, { Component } from '/system/magnium';
import { stackNavigatorStyle } from '/theme';


 class StackNavigator extends Component {

   beforeView() {

     // stack array used by android to track the windows opened
     this.stack = [];

     // lets register the events that our stack nav will listen for
     Magnium.Events.registerEvent('MAGNIUM_STACKNAV_OPEN');
     Magnium.Events.registerEvent('MAGNIUM_STACKNAV_CLOSE');

     // And monitor for them as well
     Magnium.Dispatcher.on(Magnium.Events.evt.MAGNIUM_STACKNAV_OPEN, this.openWin.bind(this));
     Magnium.Dispatcher.on(Magnium.Events.evt.MAGNIUM_STACKNAV_CLOSE, this.closeWin.bind(this));

   }


   // close the window that is currently on 'top'
   closeWin() {
     if(Erbium.isAndroid && this.stack.length > 1) {
       console.log("Android window close");
       const win = this.stack.pop();
       win.view.close();
     }
   }

   // open a new window in the navigator
   openWin(evt) {
    console.log('Navigator Open Win Fired');
    if(evt.window) {

       const props = evt.props||{};
       const win = new evt.window(props);

       if(Magnium.isIOS){
         this.navigator.openWindow(win.view);
       }

       if(Magnium.isAndroid){
         console.log("OPEN ANDROID WIN............");
         this.stack.push(win);
         win.view.open();
       }

       console.log("Window Stack Length: ", this.stack.length);

    } else {
      throw new Error('openWin properties does not define a window value. This is required by the StackNavigator.');
    }
   }

   generateView(props) {


     // if there is a theme style override
     if(stackNavigatorStyle){
       style = {...style, ...stackNavigatorStyle};
     }

     // if iOS use the iOS navigator
     if( Magnium.isIOS) {
       this.navigator = Ti.UI.iOS.createNavigationWindow({...style.navWindowStyle, window: new props.window().view});
       return this.navigator;
     }

     // If Android just return the first defined window
     if(Magnium.isAndroid){
       const win = new props.window();
       this.stack.push(win);
       return win.view;
     }

   }

 }

// the default theme unless overridden
let style = {

   navWindowStyle: {
     backgroundColor: '#FFFFFF'

   }

 };

 export default StackNavigator;
