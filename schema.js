const Joi = require('joi');

// module.exports.listingSchema = Joi.object({
//   listing: Joi.object({
//     title: Joi.string().min(3).max(100).required(),
//     description: Joi.string().min(10).required(),
//     location: Joi.string().required(),
//     country: Joi.string().required(),
//     price: Joi.number().min(0).required(),
//     image: Joi.object({
//       url: Joi.string().uri().allow("", null)
//     }).default({ url: "" })
//   }).required()
// });

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
  }).required()
});


module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.object({
      url: Joi.string().uri().allow("", null),
      filename: Joi.string().allow("", null) // Added filename support
    }).default({ url: "" }),
    // ADD THIS: Allow geometry to pass through validation
    geometry: Joi.object({
      type: Joi.string().valid("Point"),
      coordinates: Joi.array().items(Joi.number())
    })
  }).required()
});