# Magnium CLI

Magnium is a 
[Command Line Tool](http://en.wikipedia.org/wiki/Command-line_interface)
and Framework for building Titanium based mobile applications using ES6.

## MSX Branch updates

This is a test branch where I have added the ability to define the the APP UI using markup similar to JSX or the XML in an Alloy View. At the moment this is very 'alpha'  (thats short for simple) but it is working and may provide an alternative to the current **generateView** coding. Below is an example of the differences between the old and new **generateView** code.

Updated so that anuy GUI markup should now be wrapped in a <UI></UI> tag. 

```
generateView() {
    const  win = Ti.UI.createWindow({"backgroundColor":"#999999"});
    const  viewOne = Ti.UI.createView({"backgroundColor":"#E6E6E6","top":"50","left":"10","right":"10","height":"200"});
    win.add(viewOne);
    this.buttonOne = Ti.UI.createButton({"id":"buttonOne","backgroundColor":"blue","title":"BUTTON ONE","height":"40","width":"100"});
    viewOne.add(this.buttonOne);
    const viewTwo = Ti.UI.createView({"backgroundColor":"pink","top":"250","left":"10","right":"10","height":"200"});
    win.add(viewTwo);
    this.buttonTwo = Ti.UI.createButton({"id":"buttonTwo","backgroundColor":"yellow","title":"BUTTON TWO","height":"40","width":"100"});
    viewTwo.add(this.buttonTwo);
    return  win;
}
```

the new version (with sample for adding events in GUI code)

```
  generateView() {
    <UI>
      <Window backgroundColor="#999999">
        <View backgroundColor="#E6E6E6" top="50" left="10" right="10" height="200">
          <Button id="buttonOne" backgroundColor="blue" title="BUTTON ONE" height="40" width="100" onClick="alert('Button One Clicked')"/>
        </View>
        <View backgroundColor="pink" top="250" left="10" right="10" height="200">
          <Button  backgroundColor="yellow" title="BUTTON TWO" height="40" width="100" onClick="this.buttonTwoClick.bind(this)"/>
        </View>
      </Window>     
    </UI>
  }

```

There is a [sample Magnium project here](https://github.com/magnatronus/magui-demo)



## Prerequisites

The Magnium Framework and associated CLI depends on an installed and working version of Axway's Appcelerator Titanium.
You will need to ensure that the Titanium CLI is installed, visit [Appcelerator](https://www.appcelerator.com) for more information.

To test if the Titanium CLI is installed and working just type

```
ti --help
```

in a terminal.


## Installation

    [sudo] npm install -g magnium

## 1.1 Update
The CLI has now been updated to run as a single command with options. You can use either **ma** or **magnium** to run the CLI with the following options:
- init
- create
- build
- assets


# Using Magnium
Magnium provides a simple framework that allows Titanium projects to be written using ES6. It does this by using it's own custom project structure that is transpiled into a standard Titanium classic project that can then be run on  simulator, device or compiled for distro using the Titanium CLI. Below is a quick overview of the steps to do this, all commands should be run in a Terminal.

**NB:this has only been tested on a MAC currently and is just an overview of how to get a project up and running**

- Open a Terminal and create a new directory (*mkdir magnium*)
- **cd** to that directory and initialise the magnium workspace (*magnium init*)
- Create a new magnium project called **helloworld** (*magnium create helloworld*)
- Use magnium to generate a standard Titanium project (*magnium build helloworld*)
- Generate the project Android assets, optional and requires TiCons installed (*magnium assets*)

The result of this should be a subdirectory named *titanium* that will have a complete project in. To test it just run the following Ti CLI command.

for iOS

```
ti build -p ios --log-level info -d titanium
```

for Android

```
ti build -p android --log-level info -d titanium --device-id
```

*[adding --device-id allows you to select an emulator]*



This should build and run the project in a simulator/emulator if all the other steps completed satisfactorily.


## Assets CLI command
This command was added to provide a quick way to generate some assets for an Android project, similar to the way Titanum does for iOS.
It can be used to generate a default set of icons and splash screens for an Android app using the project's **DefaultIcon.png**.

```
magnium assets
```

If used it should be run after **magnium build** and before using the Ti CLI to build the Titanium project.

**Please note this will only work if you have correctly installed [TiCons](http://ticons.fokkezb.nl/) and any required depedencies (imagemagick).**


## More Detail
For more detailed information of Magnium and it's use see the [wiki here](https://github.com/magnatronus/magnium/wiki)




