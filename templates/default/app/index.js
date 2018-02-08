/**
 * index.js
 * This is the main class that is used to start your app
 * The class name can be anything you wish, in the example it is App
 */
import { Component } from '/system/magnium';

// Our simple App defined as a class
class App extends Component {

  // The UI must create and return a Ti.UI Component
  // Usually here a window as the framework will attempt to run open()
  generateView() {

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
