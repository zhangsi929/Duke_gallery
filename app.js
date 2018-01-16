//===========
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//model import 
var Image  = require("./models/image");
var Comment = require("./models/comment");
var passport    = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User        = require("./models/user");
var seedDB = require("./seeds"); 
var flash       = require("connect-flash");
//requring routes
var commentRoutes    = require("./routes/comments"),
    galleryRoutes = require("./routes/gallery"),
    indexRoutes      = require("./routes/index")
    
mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();
app.locals.moment = require('moment');
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/gallery", galleryRoutes);
app.use("/gallery/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});