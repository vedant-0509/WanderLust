const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLogin, validateReview, isReviewOwner } = require("../middleware.js");
const controller = require("../controller/review.js");


// CREATE REVIEW
router.post("/", isLogin, validateReview, wrapAsync(controller.createReview));

// DELETE REVIEW
router.delete("/:reviewId", isLogin, isReviewOwner, wrapAsync(controller.deleteReview));


module.exports = router;