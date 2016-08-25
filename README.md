# Installation
In order to run this, you will need to have mongodb and nodejs installed. Latest version can be found here respectively: https://www.mongodb.com/download-center, https://nodejs.org/en/download/. 

Once mongodb and nodejs are installed, download the project files and place them somewhere with easy access.

The next step is to open a command line program. Once running, navigate to root folder of the project files. Once there run the following command: `npm install`.

This will install all of the npm modules that are required to run the wep app. Once the installation is done, you are ready for the next step!


# Initializing the database

The next step is to start the database.

So open a command line program and navigate to the root folder of mongodb. Once here, type the following: `cd Server\3.2\bin\`.

Notice that the 3.2 in the command is the version number. If you have a different version of mongodb, use that version number instead. 

Once you are in the bin folder, it is time to start the database. To start the database, run the following command: `.\mongod.exe`. Once the database is

running, you will be unable to use the command prompt window. You can exit the database at anytime by `ctrl + c`.


# Initializing data to the database(Only do this the first time)

The next step is to fill the database with data. Word of cation, filling the database only once. Doing it multiple times will result in data being repeated.

Open a new command line program and navigate once again to the root folder of mongodb. Once here, type the following: `cd Server\3.2\bin\`.

Again, keep in mine that my version of mongodb is 3.2 and that yours might differ. Next, go ahead and run the following command: 

`.\mongoimport.exe --db features --collection featuresList --file 'C:\PATH_TO_PROJECT_ROOT\MongoDB\default_data.JSON' --jsonArray`

Notice that you must modify the command to direct to the root folder of the project. On success, the line ` imported 5 documents` should appear.


# Running the server

The last thing that you have to do before accessing the web app is running the express server. To do this, open a command line program and navigate to the 

root of the project. Once here run the following command: `npm start`. That's it! 


# Access the web app

To access the webapp, open your favorite web brower and go to http://127.0.0.1:3000. Enjoy the SuperCoolApp!