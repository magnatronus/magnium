/**
 * index.js
 * This is the main class that is used to start your app
 * The class name can be anything you wish, in the example it is App
 * 
 * Jul 2018 - updated to demo use of alternate theme
 * To build with the alternate theme use 
 *      mag build {projectname} --theme test
 */
import { Component } from '/system/magnium';

// import our theme styles
import { theme } from "theme";


// Our simple App defined as a class
class App extends Component {

  // The UI must create and return a Ti.UI Component
  // Usually here a window as the framework will attempt to run open()
  generateView() {

    // if we have an alternate theme modify the main window defaults here
    if(theme.mainWindowStyle){
      styles.mainWindowStyle = {...styles.mainWindowStyle, ...theme.mainWindowStyle};
    }

    // Our Click Me button
    const button = Ti.UI.createButton(styles.buttonStyle);
    button.addEventListener('click', () => alert('Welcome to Magnium'));

    // create our main window add the UI and return
    const mainWindow = Ti.UI.createWindow(styles.mainWindowStyle);
    mainWindow.add(button);
    return mainWindow;

  }

}

// our local styles
const styles = {

  buttonStyle: {
      title: 'Click Me!',
      height: 50,
      width: 150
  },

  mainWindowStyle: {
      backgroundColor: '#FFFFFF'
  }

};

export default App;
