// ====================
// COMMENTS ROUTES
// ====================
var express = require("express");
var router  = express.Router({mergeParams: true});
var Image  = require("../models/image");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Image.findById(req.params.id, function(err, allImages){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {image: allImages});
        }
    })
});
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Image.findById(req.params.id, function(err, image){
       if(err){
           console.log(err);
           res.redirect("/gallery");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               image.comments.push(comment._id);
               image.save();
               req.flash("success", "Successfully added comment");
               res.redirect('/gallery/' + image._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});
// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {gallery_id: req.params.id, comment: foundComment});
      }
   });
});
// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/gallery/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/gallery/" + req.params.id);
       }
    });
});

module.exports = router;