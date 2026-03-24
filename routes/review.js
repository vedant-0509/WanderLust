const express = require("express");
const router = express.Router({mergeParams: true});

const { reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");



// Validation
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) throw new ExpressError(400, error.message);
  next();
};



// CREATE REVIEW
router.post("/", validateReview, wrapAsync(async (req, res) => {
  let { id } = req.params;

  let item = await Listing.findById(id);
  if (!item) throw new ExpressError(404, "Listing not found");

  let newReview = new Review(req.body.review);
  await newReview.save();

  item.review.push(newReview);
  await item.save();
  req.flash("done", "New Review Added");
  res.redirect(`/allList/${id}`);
}));



// DELETE REVIEW
router.delete("/:reviewid", wrapAsync(async (req, res) => {
  let { id, reviewid } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { review: reviewid }
  });

  await Review.findByIdAndDelete(reviewid);
  req.flash("error", "Review deleted");
  res.redirect(`/allList/${id}`);
}));



module.exports = router;