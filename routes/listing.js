const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLogin, isOwner, validateListing } = require("../middleware.js");
const controller = require("../controller/listing.js");


// INDEX (All Listings)
router.get("/", wrapAsync(controller.index));


// SEARCH
router.post("/searchbox", wrapAsync(controller.searchBar));


// NEW FORM
router.route("/new")
    .get(isLogin, controller.newForm)
    .post(validateListing, wrapAsync(controller.createListing));


// SHOW & DELETE
router.route("/:id")
    .get(wrapAsync(controller.showListing))
    .delete(isLogin, isOwner, wrapAsync(controller.deleteListing));


// EDIT FORM & UPDATE
router.route("/:id/edit")
    .get(isLogin, isOwner, wrapAsync(controller.editForm))
    .put(isLogin, isOwner, validateListing, wrapAsync(controller.updateListing));



module.exports = router;