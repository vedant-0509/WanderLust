const express = require("express");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const axios = require("axios");


module.exports.index = async (req, res) => {
    let lists = await Listing.find({});
    res.render("listing/allList", { lists });
}




module.exports.searchBar = async (req, res) => {
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
}




module.exports.newForm = (req, res) => {
    res.render("listing/new");
};




module.exports.createListing = async (req, res) => {
    let data = req.body.listing;
    let list = new Listing(data);
    list.owner = req.user._id;

    // Image
    let url = req.file.path;
    let filename = req.file.filename;
    list.image = { url, filename };

    // ✅ Geocoding HERE
    const location = data.location;
    const geoResponse = await axios.get(`https://api.maptiler.com/geocoding/${location}.json?key=yMgpqYhUEzM34PVZvagy`);

    if (!geoResponse.data.features.length) {
        throw new ExpressError(400, "Invalid location");
    }

    const coordinates = geoResponse.data.features[0].geometry.coordinates;

    list.geometry = {
        type: "Point",
        coordinates: coordinates
    };

    await list.save();
    req.flash("done", "New list Added");
    res.redirect("/allList");
};




module.exports.showListing = async (req, res) => {
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
};



module.exports.editForm = async (req, res) => {
    let item = await Listing.findById(req.params.id);
    let url = item.image.url;
    res.render("listing/edit", { item, url });
}




module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let data = req.body.listing;

    let existing = await Listing.findById(id);
    if (!existing) throw new ExpressError(404, "Listing not found");

    // Handle image update
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        data.image = { url, filename };
    } else {
        // Preserve existing image
        data.image = existing.image;
    }

    if (data.location) {
        const geoResponse = await axios.get(
            `https://api.maptiler.com/geocoding/${data.location}.json?key=yMgpqYhUEzM34PVZvagy`
        );

        if (geoResponse.data.features.length) {
            data.geometry = {
                type: "Point",
                coordinates: geoResponse.data.features[0].geometry.coordinates
            };
        }
    }

    await Listing.findByIdAndUpdate(id, data, { runValidators: true });
    req.flash("done", "List updated");
    res.redirect(`/allList/${id}`);
}




module.exports.deleteListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("error", "List deleted");
    res.redirect("/allList");
}