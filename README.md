# Magnium CLI

Magnium is a 
[Command Line Tool](http://en.wikipedia.org/wiki/Command-line_interface)
and Framework for building Titanium based mobile applications using ES6.

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


## History

### 1.2.4
The build command has been updated so that it works standalone and the build does not need to be part of a Magnium Workspace. This was primarily done so that Magnium could be used with CI.
It allows the build/transpile to be done within a defined workspace.  This has been tested on Jenkins and works as follows:

- the usual build command:  **mag build {projectname}**
- for use with a CI system: **mag build {workspace} --ci**

An actual example that has been used with Jenkins is the *Execute Shell Build* command shown below.

```
echo "Starting Magnium Build...."
mag build "$WORKSPACE" --ci
```

Where the project source has already been cloned from an SCM system.

### 1.2.3
The default project template has been updated to show one possible way of re-skinning an app using the theme feature of the build command.

As before the standard build the command is  **mag build {projectname}**, but an alternate skin and app icon can be applied by using **mag build {projectname} --theme test**.
Just take a look an *index.js*  and the *theme/test* directory for more detail.

### 1.2.2
Bug fix- any aux files in the following dirs (i18n, platform, plugins, modules) were getting copied to the wrong destination

### 1.2.1
The theming in the build has been updated. Rather than just a theme.js file in the theme dir (or whatever name you have given the theme), the build now looks for a **theme directory**. If the specified directory exists it checks, as before for a theme.js file, but it now also re-checks for both theme based aux and misc files. This enables the beginning of a build based white labelling solution for theme related tiapp.xml, DefaultIcon.png and other asset files to be related to a specific theme build.

### 1.2
- The transpiler now uses **babel-core**. This  means there is no need to do the automated npm install each time the transpile is run which makes it faster and more informative in case or errors. If the transpile now stops because of an error the build will exit and the error will be displayed.
- **promises.core.min.js** is now deprecated and will probabbly be removed from the next version (if you use it anywhere just remove the import statement from your code), Promises will still work.
- If a directory called **support** exists at the root of a Magnium project (i.e. */projects/helloworld/support* ) then the files in this directory will be copied to the root of the Titanium dir when running the build command. This can be used to add project based files like keystores, images etc.


### 1.1
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




