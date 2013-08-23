*Tidepools Mobile: Open-source, Collaborative, Mobile Mapping & Social Hub
================

Open Technology Institute <br />
Contact: <tidepools@opentechinstitute.org> <br />
Lead Dev & Design: J.R. Baldwin [@jrbaldwin](https://github.com/jrbaldwin "@jrbaldwin") <br />
Project Manager: Georgia Bullen [@georgiamoon](https://github.com/georgiamoon "@georgiamoon") <br />

[TidePools](http://www.tidepools.co "Tidepools") is Reflecting Community Needs & Culture through Custom Apps, Time-based Maps, & Data Feeds

Runtime Dependencies
--------------------

* [AngularJS](http://angularjs.org/ "AngularJS"): Web App Development Framework (JS)
* [NodeJS](http://nodejs.org/ "NodeJS"): Evented IO for v8 JavaScript (JS)
* [Express](http://expressjs.com "ExpressJS"): Node.js MVC Framework(JS)
* [LeafletJS](http://leafletjs.com/ "LeafletJS"): Map Rendering Engine (JS)
* [MongoDB](http://www.mongodb.org/ "MongoDB"): noSQL Database (JSON)

Ubuntu Installation
-------------------
Assuming you are in Ubuntu terminal:

1. Install MongoDB. Reference: [How to install MongoDB on Ubuntu](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/)
   * Configure apt package tool: `sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10`
   * Create a /etc/apt/sources.list.d/10gen.list file using the following command: 
     `echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/10gen.list`
   * Now issue the following command to reload your repository:  
     `sudo apt-get update`
   * Issue the following command to install the latest stable version of MongoDB:  
   	 `sudo apt-get install mongodb-10gen`
   * Start Mongod DB service:  
     `sudo service mongodb start`
   * Test that Mongo is running:  
   	 `mongo` You should see something like: `MongoDB shell version: x.x.x. connecting to: test >`

2. Now that MongoDB is running, we need to install Node.js:  
   `sudo apt-get install python-software-properties`  
   `sudo add-apt-repository ppa:chris-lea/node.js`  
   `sudo apt-get update`  
   `sudo apt-get install nodejs`  

3. Navigate to your local Tidepools-Mobile directory (`cd /Tidepools-Mobile/` etc):
	* Start the Tidepools Mobile Node server:
	  `node tidepools_server.js`
	* IF there's an ERROR saying something like "Cannot find module 'example_module'", then you need to install additional modules using the Node NPM Package system:  
	  `npm install example_module` - Replace "example_module" with the module listed in the error.  
	  `node tidepools_server.js` - If more modules errors persist, install those as well.
	* IF the server is running, it should say: "Chillin' on 3002 ~ ~" -- "3002" being the port number Tidepools is running on.
	* Test it! Open a web browser and navigate to: `http://localhost:3002/`  
      Note: This localhost address might vary, depending on your Linux version.
    * If you want to Tidepools to run after you close terminal, use Forever:  
      `npm install forever`  
      Start: `forever start tidepools_server.js`  
      Check node servers running: `forever list`  
      Stop: `forever stop tidepools_server.js`  

4. Adding new Places and Events:
	* Navigate to "http://localhost:3002/new" (or wherever your localhost server is accessible)  
	  Input form data. The "hashtag" section will auto-pull Tweets into your place or event, if the Tidepools Twitter Stream Server is running.  
	* Edit places and events: "http://localhost:3002/#/landmark/UniqueID/edit" - "UniqueID" being the name of your place or event
	* You can automate the adding process, by plugging in JSON directly (See the 'Session_Event_API_loader' directory for more info).

5. Running Twitter Stream Server to integrate #hashtagged data into your Tidepools events and places:
	* Navigate to the "Streaming Tweet Loader" directory.
	* Get your Twitter access tokens: https://dev.twitter.com/docs/auth/obtaining-access-tokens
	* Edit the `credentials_example.js` file, adding in your unique Twitter tokens.
	* Change the filename to `credentials.js`
	* Edit app.js : Change the `track: ['#hashtag']` to your neighborhood or event's main Twitter hashtag (i.e. #Event2013)
	* Start streaming:  
	  `node apps.js`
	* Make it stream forever:  
	  `forever start app.js`


OSX Installation
-------------------
Assuming you are in OSX terminal:

1. Install MongoDB. Reference: [How to install MongoDB on OSX](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)
	* Install Homebrew if you haven't already (package manager): http://brew.sh/
	* Install Mongo via Homebrew:  
	  `brew update`  
	  `brew install mongodb`
	* Start the mongod process in a terminal:  
	  `mongod` to start MongoDB service  
	  `mongo` to test it works: You should see something like `MongoDB shell version: x.x.x. connecting to: test >`

2. Install Node.js
	* Assuming you have installed Homebrew from the previous step:  
	  `brew install node`

3. Navigate to your local Tidepools-Mobile directory (`cd /Tidepools-Mobile/` etc):
	* Start the Tidepools Mobile Node server:  
	  `node tidepools_server.js`
	* IF there's an ERROR saying something like "Cannot find module 'example_module'", then you need to install additional modules using the Node NPM Package system:  
	  `npm install example_module` - Replace "example_module" with the module listed in the error.
	  `node tidepools_server.js` - If more modules errors persist, install those as well.
	* IF the server is running, it should say: "Chillin' on 3002 ~ ~" -- "3002" being the port number Tidepools is running on.
	* Test it! Open a web browser and navigate to: `http://localhost:3002/`  
      Note: This localhost address might vary, depending on your Linux version.
    * If you want to Tidepools to run after you close terminal, use Forever:  
      `npm install forever`  
      Start: `forever start tidepools_server.js`  
      Check node servers running: `forever list`  
      Stop: `forever stop tidepools_server.js`  

4. Adding new Places and Events:
	* Navigate to "http://localhost:3002/new" (or wherever your localhost server is accessible)  
	  Input form data. The "hashtag" section will auto-pull Tweets into your place or event, if the Tidepools Twitter Stream Server is running.
	* Edit places and events: "http://localhost:3002/#/landmark/UniqueID/edit" - "UniqueID" being the name of your place or event
	* You can automate the adding process, by plugging in JSON directly (See the 'Session_Event_API_loader' directory for more info).

5. Running Twitter Stream Server to integrate #hashtagged data into your Tidepools events and places:
	* Navigate to the "Streaming Tweet Loader" directory.
	* Get your Twitter access tokens: https://dev.twitter.com/docs/auth/obtaining-access-tokens
	* Edit the `credentials_example.js` file, adding in your unique Twitter tokens.
	* Change the filename to `credentials.js`
	* Edit app.js : Change the `track: ['#hashtag']` to your neighborhood or event's main Twitter hashtag (i.e. #Event2013)
	* Start streaming:  
	  `node apps.js`
	* Make it stream forever:  
	  `forever start app.js`

License
--------------------

TidePools source files are made available under the terms of the
  GNU Affero General Public License (AGPL).  See individual files for
  details.

TidePools images, designs and logos are made available under Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0). Copyright (c) 2013 J.R. Baldwin, Open Technology Institute

Contributors
--------------------
* Lisa J. Lovchik [@g33kgrrl](https://github.com/g33kgrrl "g33kgrrl")
* Jenny Ryan [@jnny](https://github.com/jnny "@jnny")
* Nicholas Frota [@nonlinear](https://github.com/nonlinear "nonlinear")
