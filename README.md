# Social Media Project (School Project)

This project is created with Node.JS.

# How to Run
To use the project, download the zip file, extract it and open it with VS Code. Type in "npm i" in the terminal.
After you've done that, you can start the server by typing in the terminal "npm start"
If you've made changes using TailWindCSS, run also "npm run build:css" in the terminal
Visit "localhost:3000" in your browser to get access to the website.

NOTE! 
If you have downloaded from GitHub, you will also need to create a file in the root directory named ".env"
In there, add "SESSION_SECRET = YourRandomGeneratedCode "
Replace the text with a generated code.
You can also go to server.js and edit this line from: "secret: process.env.SESSION_SECRET" to: " secret: 'your secret code here' "


## Information
Things you can do:

* Create and view posts, both on the home page and your profile.
* Comment on posts.
* Delete your posts
* Follow other users.
* Change your password in settings.

Things you can do as an Admin:
* Delete any comment
* Ban and unban a user
* Delete users
* Access to userlist page.
* Change users password.

