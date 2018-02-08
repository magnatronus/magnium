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

# Using Magnium
Magnium provides a simple framework that allows Titanium projects to be writtem using ES6. It does this by using it's own custom project structure that is transpiled into a standard Titanium classic project that can then be run on  simulator, device or compiled for distro using the Titanium CLI. Below is a quick overview of the steps to do this, all command should be run in a Terminal.

**NB: 08 Feb 2019: this has only been tested on a MAC currently and is just an overview of how to get a project up and running**

- 1. Open a Terminal and create a new directory (mkdir magnium)
- 2. *cd* to that directory and initialise the magnium workspace (magnium-init)
- 3. Create a blank magnium project (magnium-create --name helloworld)
- 4. Use magnium to generate a standard Ttanium project (magnium-build --name helloworld)

The result of this should be a subdirectory named *titanium* that will have a complete project in. To test it just run the following Ti CLI command.

```
ti build -p ios --log-level info -d titanium
```

This should build and run the project in an iOS simulator if all the other steps completed satisfactorily.



