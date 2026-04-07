const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


module.exports.isLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged-in");
        return res.redirect("/signup");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;

    let item = await Listing.findById(id);

    if (!item) {
        req.flash("error", "Listing not found");
        return res.redirect("/allList");
    }

    if (!item.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to Edit/Delete");
        return res.redirect(`/allList/${id}`);
    }

    next();
};


module.exports.isReviewOwner = async (req, res, next) => {
    let { id, reviewId } = req.params;

    let review = await Review.findById(reviewId);

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to Delete Reviews");
        return res.redirect(`/allList/${id}`);
    }
    next();
};


module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) throw new ExpressError(400, error.message);
    next();
};


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    next();
};