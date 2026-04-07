const express = require("express");
const router = express.Router();


const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

const { isLogin, isOwner, validateListing } = require("../middleware.js");
const { path } = require("express/lib/application.js");
const { populate } = require("../models/review.js");


// INDEX (All Listings)
router.get("/", wrapAsync(async (req, res) => {
  let lists = await Listing.find({});
  res.render("listing/allList", { lists });
}));


// SEARCH
router.post("/searchbox", wrapAsync(async (req, res) => {
  let { search } = req.body;

  if (!search || search.trim() === "") {
    return res.redirect("/allList");
  }

  let key = search.trim();

  let result = await Listing.find({
    $or: [
      { title: { $regex: key, $options: "i" } },
      { location: { $regex: key, $options: "i" } },
      { country: { $regex: key, $options: "i" } }
    ]
  });

  if (result.length == 0) {
    req.flash("error", "No list found");
    return res.redirect("/allList");
  }

  res.render("listing/search", { result, search });
}));


// NEW FORM
router.get("/new", isLogin, (req, res) => {
  res.render("listing/new");
});



// CREATE
router.post("/new", validateListing, wrapAsync(async (req, res) => {
  let data = req.body.listing;

  if (!data.image || !data.image.url) {
    data.image = {
      url: "https://cdn.pixabay.com/photo/2021/12/12/20/00/play-6865967_1280.jpg"
    };
  }

  let list = new Listing(data);
  list.owner = req.user._id;
  await list.save();
  req.flash("done", "New list Added");
  res.redirect("/allList");
}));



// SHOW
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let item = await Listing.findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author"
      }
    })
    .populate("owner");
  if (!item) throw new ExpressError(404, "Listing not found");
  res.render("listing/item.ejs", { item });
}));



// EDIT FORM
router.get("/:id/edit", isLogin, isOwner, wrapAsync(async (req, res) => {
  let item = await Listing.findById(req.params.id);
  res.render("listing/edit", { item });
}));



// UPDATE
router.put("/:id/edit", isLogin, isOwner, validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let data = req.body.listing;

  let existing = await Listing.findById(id);
  if (!existing) throw new ExpressError(404, "Listing not found");

  if (!data.image || !data.image.url) {
    data.image = { url: existing.image.url };
  }

  await Listing.findByIdAndUpdate(id, data, { runValidators: true });
  req.flash("done", "List updated");
  res.redirect(`/allList/${id}`);
}));



// DELETE
router.delete("/:id", isLogin, isOwner, wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("error", "List deleted");
  res.redirect("/allList");
}));


module.exports = router;