const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        url: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2021/12/12/20/00/play-6865967_1280.jpg"
        }
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});


listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id: { $in: listing.review}});
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
