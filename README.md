# Duke Gallery Development Process
A full-stack Node.js side project from my own interest with RESTful routing


## Initial Setup
* Add Landing Page
* Add Campgrounds Page that lists all campgrounds

Each Campground has:
   * Name
   * Image

## Layout and Basic Styling
* Create header and footer partials
* Add in Bootstrap

## Creating New Picture
* Setup new picture POST route
* Add in body-parser
* Setup route to show form
* Add basic unstyled form

## Style the Pictures page
* Add a better header/title
* Make pictures display in a grid

## Style the Navbar and Form
* Add a navbar to all templates
* Style the new picture form

## Add Mongoose
* Install and configure Mongoose
* Setup image model
* Use image model inside of routes

## Show Page
* Review the RESTful routes
* Add description to the image model
* Show db.collection.drop()
* Add a show route/template

## Refactor Mongoose Code
* Create a models directory
* Use module.exports
* Require everything correctly!

## Add Seeds File
* Add a seeds.js file
* Run the seeds file every time the server starts

## Add the Comment model!
* Make comment errors go away!
* Display comments on image show page

## Comment New/Create
* Discuss nested routes
* Add the comment new and create routes
* Add the new comment form

## Style Show Page
* Add sidebar to show page
* Display comments nicely

## Finish Styling Show Page
* Add public directory
* Add custom stylesheet

## Authentication Pt. 1 - Add User Model
* Install all packages needed for auth
* Define User model 

## Authentication Pt. 2 - Register
* Configure Passport
* Add register routes
* Add register template

## Authentication Pt. 3 - Login
* Add login routes
* Add login template

## Authentication Pt. 4 - Logout/Navbar
* Add logout route
* Prevent user from adding a comment if not signed in
* Add links to navbar

## Authentication Pt. 5 - Show/Hide Links
* Show/hide auth links in navbar 

## Refactor The Routes
* Use Express router to reoragnize all routes

## Users + Comments
* Associate users and comments
* Save author's name to a comment automatically

## Users + Pictures
* Prevent an unauthenticated user from creating a picture
* Save username+id to newly created picture

## Editing Pictures
* Add Method-Override
* Add Edit Route for Pictures
* Add Link to Edit Page
* Add Update Route

## Deleting Pictures
* Add Destroy Route
* Add Delete button

## Authorization Part 1: Pictures
* User can only edit his/her pictures
* User can only delete his/her pictures
* Hide/Show edit and delete buttons

## Editing Comments
* Add Edit route for comments
* Add Edit button
* Add Update route

Pictures Edit Route: /gallery/:id/edit
Comment Edit Route:  /gallery/:id/comments/:comment_id/edit

## Deleting Comments
* Add Destroy route
* Add Delete button

Pictures Destroy Route: /gallery/:id
Comment Destroy Route:    /gallery/:id/comments/:comment_id

## Authorization Part 2: Comments
* User can only edit his/her comments
* User can only delete his/her comments
* Hide/Show edit and delete buttons
* Refactor Middleware to a single file

## Adding in Flash!
* Demo working version
* Install and configure connect-flash
* Add bootstrap alerts to header

## Adding dynamic price tag
* Show user-defined price
* Edit new or old price
* Change model for picture