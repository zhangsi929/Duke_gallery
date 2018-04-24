var express = require("express");
var router  = express.Router();
var Image  = require("../models/image");
var middleware = require("../middleware");
var geocoder = require('geocoder');
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'zhangsi929', 
  api_key: '532569324951986', 
  api_secret: 'XV-oJd6agQFMKGRrsC5QMyuH1uA'
});

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// Gallery route
router.get("/", function(req, res){
    if (req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all campgrounds from DB
      Image.find({name: regex}, function(err, allImages){
         if(err){
            console.log(err);
         } else {
            res.render("images/index",{gallery:allImages, page: 'campgrounds', currentUser: req.user});
         }
      });
    } else {
        //debug
        // Get all from DB
        Image.find({}, function(err, allImages){
           if(err){
               console.log(err);
           } else {
              res.render("images/index",{gallery:allImages, page: 'campgrounds', currentUser: req.user});
           }
        });
    }
});

//router.post("/", middleware.isLoggedIn, function(req, res){
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image ? req.body.image : "/images/temp.png";
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
        if (err){
            req.flash('error', err.message);
            return res.redirect('back');
        }
        if (data.results[0] === undefined) {
            req.flash('error', "Location invalid");
            return res.redirect('back');
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        cloudinary.uploader.upload(req.file.path, function(result) {
            //image variable needs to be here so the image can be stored and uploaded to cloudinary
            image = result.secure_url;
            //Captures All Objects And Stores Them
            var newImage = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
            // Create a new campground and save to DB by using the create method
            Image.create(newImage, function(err, newlyCreated){
                if(err){
                    //Logs Error
                    req.flash('error', err.message);
                    return res.redirect('back');
                } else {
                    //redirect back to campgrounds page
                    req.flash("success", "Image Added To DukeGallery!!")
                    //Redirects Back To Featured Campgrounds Page
                    res.redirect("/gallery");
                }
            });
        });
    });
});

// CREATE - add new campground to DB
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("images/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Image.findById(req.params.id).populate("comments").exec(function(err, foundImage){
        if(err){
            console.log(err);
        } else {
            //render show template with that 
            res.render("images/show", {gallery: foundImage});
        }
    });
})

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Image.findById(req.params.id, function(err, foundImage){
        res.render("images/edit", {gallery: foundImage});
    });
});

// UPDATE CAMPGROUND ROUTE
// router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
//     // find and update the correct campground
//     Image.findByIdAndUpdate(req.params.id, req.body.gallery, function(err, updatedGallery){
//       if(err){
//           res.redirect("/gallery");
//       } else {
//           //redirect somewhere(show page)
//           res.redirect("/gallery/" + req.params.id);
//       }
//     });
// });
router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err){
        return res.redirect('back');
    }
    if (data.results[0] === undefined) {
        req.flash('error', "Location invalid");
        return res.redirect('back');
    }
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.gallery.name, image: req.body.gallery.image, description: req.body.gallery.description,  location: location, lat: lat, lng: lng};
    Image.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedGallery){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/gallery/" + updatedGallery._id);
        }
    });
  });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Image.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/gallery");
      } else {
          res.redirect("/gallery");
      }
   });
});

module.exports = router;