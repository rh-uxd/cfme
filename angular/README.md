# CFME

CFME Angular Dashboard POC

### Details

This AngularJS application has a development dependence on NodeJS. Therefore, it is assumed that you have installed NodeJS prior to attempting the getting started steps.

_**Getting Started:**_ 

	Installation

	- npm install	
	- npm install -g bower	
	- bower install	
	- npm install -g grunt-cli
	
	Install Sass/Compass (may need to use sudo)
	- npm install -g compass
	- gem install sass
	- gem install compass

	Running

	- grunt serve		

	Unit Testing with Karma + Jasmine

	- grunt test		

	End To End Testing with Protractor + Jasmine

	- todo

	Build To Dist

	- grunt build

### Usage

	You can run this project several ways

	Grunt

	- grunt serve

	- http://localhost:8090/	

	Express - use if you want to do mocking

	- node expressServer.js

	- http://localhost:3000/	

	Apache - test dist code (grunt build)

	- Configure your apache install to point to your dist directory

	- http://localhost/

