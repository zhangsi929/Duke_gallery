var express = require("express");
var router  = express.Router({mergeParams: true});

router.get("/", function(req, res){
    res.render("landing");
});
var passport = require("passport");
var User = require("../models/user");


//  ===========
// AUTH ROUTES
//  ===========

// show register form
router.get("/register", function(req, res){
   //res.render("register"); 
   res.render("register", {page: 'register'}); 
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        // if(err){
        //     req.flash("error", err.message);
        //     return res.render("register");
        // }
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to DukeGallery " + user.username);
          res.redirect("/gallery"); 
        });
    });
});
// show login form
router.get("/login", function(req, res){
   //res.render("login"); 
   res.render("login", {page: 'login'}); 
});
// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/gallery",
        failureRedirect: "/login"
    }), function(req, res){
});
// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/gallery");
});


module.exports = router;