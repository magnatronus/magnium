
export default generateView = () => {

    // Our Click Me button
    const button = Ti.UI.createButton(styles.buttonStyle);
    button.addEventListener('click', () => alert('Welcome to Magnium'));

    // create our main window add the UI and return
    const mainWindow = Ti.UI.createWindow(styles.mainWindowStyle);
    mainWindow.add(button);
    return mainWindow;

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
