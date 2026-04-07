const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const { isLogin, validateReview, isReviewOwner } = require("../middleware.js");

const User = require("../models/user.js");

// CREATE REVIEW
router.post("/", isLogin, validateReview, wrapAsync(async (req, res) => {
  let { id } = req.params;

  let item = await Listing.findById(id);
  if (!item) throw new ExpressError(404, "Listing not found");

  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  await newReview.save();

  item.review.push(newReview);
  await item.save();
  req.flash("done", "New Review Added");
  res.redirect(`/allList/${id}`);
}));



// DELETE REVIEW
router.delete("/:reviewId", isLogin, isReviewOwner, wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { review: reviewId }
  });

  await Review.findByIdAndDelete(reviewId);
  req.flash("error", "Review deleted");
  res.redirect(`/allList/${id}`);
}));



module.exports = router;