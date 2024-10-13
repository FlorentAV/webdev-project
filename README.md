# Social Media Project (School Project)

This project is created with Node.JS.
I've also used TailwindCSS as CSS framework to speed up the process of making this website, as it is more focused on the backend rather than the frontend.


# How to Run
To use the project, download the zip file, extract it and open it with VS Code. Type in "npm i" in the terminal.
After you've done that, you can start the server by typing in the terminal "npm start"
If you've made changes using TailWindCSS, run also "npm run build:css" in the terminal
Visit "localhost:3000" in your browser to get access to the website.

There are some stock data that you will find in startingData.js
These are for testing, you can of course create your own if you want in the signup page.
The Admin login is in there for testing.

NOTE! 
If you have downloaded from GitHub, you will also need to create a file in the root directory named ".env"
In there, add "SESSION_SECRET = YourRandomGeneratedCode "
Replace the text with a generated code.
You can also go to server.js and edit this line from: "secret: process.env.SESSION_SECRET" to: " secret: 'your secret code here' "

Everytime you run the app, the tables gets removed and added again. If you want to prevent this, comment out all "DROP TABLE" queries in "database.js" file.
You can also comment out  "insertData()" in "dataInsert.js" file if you don't want to insert stock data. (You may need to first insert them and then comment out or you'll have to update the user role to admin if you want access to admin stuff)




## Information
Things you can do:

* Create and view posts, both on the home page and your profile.
* Comment on posts.
* Delete your posts
* Follow other users.
* Change your password in settings.

Things you can do as an Admin/Support:
* Delete any post
* Ban and unban a user
* Delete users (Admin only)
* Access to userlist page.
* Change users password.

Some stuff that are not available:
* Delete Comments
* Promoting someone to a support or any role.
* See who follows you
* Alot...


